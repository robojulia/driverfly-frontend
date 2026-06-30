import { useState, useCallback, useContext, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import JotformContext from '../context/jotform-context';
import ApplicantApi from '../pages/api/applicant';
import { trackingContextToUtmReferral } from '../models/auth/utm-referral.interface';
import { stripApplicantRelations } from '../utils/strip-applicant-relations';

// The long-form section starts at step 10 on the full form; getLongFormPages is
// 0-indexed. Shared by the manual save and the on-exit flush so both persist the
// same long-form-relative step.
const LONG_FORM_OFFSET = 10;

interface UseSaveAndContinueLaterReturn {
  saveAndExit: () => Promise<void>;
  isSaving: boolean;
  saveError: string | null;
  resumeUrl: string | null;
  showSuccessModal: boolean;
  closeSuccessModal: () => void;
}

export function useSaveAndContinueLater(): UseSaveAndContinueLaterReturn {
  const { state, method } = useContext(JotformContext);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  // Ensures the draft is flushed to the recruiter at most once per session,
  // whether via the manual button or the on-exit beacon below.
  const hasFlushedRef = useRef(false);

  const { applicant, applicantExtras, jobs, company, steps, utm, isLongFormPage } = state;
  const { setApplicant } = method;

  const closeSuccessModal = useCallback(() => {
    setShowSuccessModal(false);
  }, []);

  const saveAndExit = useCallback(async () => {
    try {
      setIsSaving(true);
      setSaveError(null);

      const applicantApi = new ApplicantApi();

      // Create applicant if doesn't exist (for early steps before phone verification)
      let currentApplicant = applicant;

      if (!currentApplicant?.id) {
        // If there's no applicant ID, we can't save yet
        // This should rarely happen after phone verification (step 2)
        toast.warning('Please complete phone verification first');
        return;
      }

      // Resolve the step to persist as last_completed_step, in long-form-relative
      // terms (getLongFormPages starts at index 0).
      // - On the long-form page, context `steps` is ALREADY long-form-relative
      //   (0–16), so use it as-is.
      // - On the full form, the long-form section starts at step 10, so convert
      //   full-form step (10–25) to long-form-relative step (0–15).
      const currentStep = steps ?? 0;
      const longformStep = isLongFormPage
        ? currentStep
        : currentStep >= LONG_FORM_OFFSET
          ? currentStep - LONG_FORM_OFFSET
          : currentStep;

      // Strip nested relation entities that cause backend errors,
      // matching the same stripping done in withAsyncSave HOC.
      const applicantFields = stripApplicantRelations(currentApplicant);

      // Save draft with current step
      const updated = await applicantApi.jotform.saveDraft(
        currentApplicant.id,
        {
          applicant: applicantFields,
          applicantExtras: applicantExtras || [],
          jobs: jobs || [],
          utm: trackingContextToUtmReferral(utm),
        },
        longformStep
      );

      // Update context with the updated applicant
      if (setApplicant) {
        setApplicant(updated);
      }

      // Generate resume URL
      const url = `${window.location.origin}/apply/longform/${updated.uuid_token}`;
      setResumeUrl(url);

      // Send the "resume your application" email (fire-and-forget so a mail
      // failure never blocks the save). Replaces the generic backend
      // "Personal Application Link" email with intent-clear copy.
      const recipientEmail = updated.email || currentApplicant.email;
      if (recipientEmail) {
        fetch('/api/send-resume-application-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            applicantEmail: recipientEmail,
            applicantFirstName: updated.first_name || currentApplicant.first_name,
            companyName: company?.name,
            resumeUrl: url,
          }),
        }).catch(() => {});
      }

      // The driver explicitly saved — don't let the on-exit beacon fire a
      // redundant save-draft (and a second resume email) when they navigate away.
      hasFlushedRef.current = true;

      // Show success modal
      setShowSuccessModal(true);

      toast.success('Your progress has been saved!');

    } catch (error) {
      console.error('Save failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Save failed';
      setSaveError(errorMessage);
      toast.error('Failed to save progress. Please try again.');
    } finally {
      setIsSaving(false);
    }
  }, [applicant, applicantExtras, jobs, company, steps, utm, isLongFormPage, setApplicant]);

  // --- Capture drivers who leave WITHOUT clicking Save & Continue Later -------
  // Per-step auto-save (withAsyncSave) keeps the row fresh via the plain update
  // route, but that route doesn't flag the application IN_PROGRESS or notify the
  // recruiter. So when the driver actually leaves the page, fire a one-shot
  // `save-draft` so the backend (a) persists the latest step and (b) promptly
  // emails the recruiter the incomplete lead + the driver their resume link.
  // The backend sweep is the durable backstop if this beacon never lands.
  //
  // Latest state is read through a ref so the unload listener (registered once)
  // always flushes the current values, not a stale closure.
  const flushStateRef = useRef({
    applicant,
    applicantExtras,
    jobs,
    utm,
    steps,
    isLongFormPage,
  });
  flushStateRef.current = { applicant, applicantExtras, jobs, utm, steps, isLongFormPage };

  useEffect(() => {
    const flushDraftOnExit = () => {
      if (hasFlushedRef.current) return;
      const s = flushStateRef.current;
      const id = s.applicant?.id;
      // Nothing to capture until the applicant exists (post phone verification).
      if (!id) return;
      hasFlushedRef.current = true;

      const currentStep = s.steps ?? 0;
      const longformStep = s.isLongFormPage
        ? currentStep
        : currentStep >= LONG_FORM_OFFSET
          ? currentStep - LONG_FORM_OFFSET
          : currentStep;

      const base =
        process.env.NEXT_PUBLIC_BASE_URL_API || process.env.BASE_URL_API || '';
      if (!base) return;
      const url = `${base.replace(/\/$/, '')}/applicants/applicant-jotform/${id}/save-draft?step=${longformStep}`;

      const body = JSON.stringify({
        applicant: stripApplicantRelations(s.applicant),
        applicantExtras: s.applicantExtras || [],
        jobs: s.jobs || [],
        utm: trackingContextToUtmReferral(s.utm),
      });

      try {
        // keepalive lets the PUT outlive the unloading page (sendBeacon can't do
        // PUT/JSON reliably). Best-effort: failures are swallowed — the sweep
        // covers anything that doesn't make it.
        fetch(url, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body,
          keepalive: true,
          credentials: 'include',
        }).catch(() => {});
      } catch {
        /* best-effort */
      }
    };

    // Fire on `pagehide` only (navigation / tab-close / refresh). We deliberately
    // do NOT use visibilitychange: that fires on a brief tab-switch too, which
    // would prematurely email the driver a "resume your application" link while
    // they're still actively filling it out. Mobile/app-switch cases that never
    // emit pagehide are covered by the backend incomplete-application sweep.
    window.addEventListener('pagehide', flushDraftOnExit);
    return () => {
      window.removeEventListener('pagehide', flushDraftOnExit);
    };
  }, []);

  return {
    saveAndExit,
    isSaving,
    saveError,
    resumeUrl,
    showSuccessModal,
    closeSuccessModal,
  };
}
