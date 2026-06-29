import { useState, useCallback, useContext } from 'react';
import { toast } from 'react-toastify';
import JotformContext from '../context/jotform-context';
import ApplicantApi from '../pages/api/applicant';
import { trackingContextToUtmReferral } from '../models/auth/utm-referral.interface';
import { stripApplicantRelations } from '../utils/strip-applicant-relations';

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
      const LONG_FORM_OFFSET = 10;
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

  return {
    saveAndExit,
    isSaving,
    saveError,
    resumeUrl,
    showSuccessModal,
    closeSuccessModal,
  };
}
