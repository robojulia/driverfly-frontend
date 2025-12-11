import { useState, useCallback, useContext } from 'react';
import { toast } from 'react-toastify';
import JotformContext from '../context/jotform-context';
import ApplicantApi from '../pages/api/applicant';
import { ApplicantFormStatus } from '../enums/applicants/applicant-form-status.enum';

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

  const { applicant, applicantExtras, jobs, company, steps, utm } = state;
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

      // Save draft with current step
      const updated = await applicantApi.jotform.saveDraft(
        currentApplicant.id,
        {
          applicant: currentApplicant,
          applicantExtras: applicantExtras || [],
          jobs: jobs || [],
          utm,
        },
        steps || 0
      );

      // Update context with the updated applicant
      if (setApplicant) {
        setApplicant(updated);
      }

      // Generate resume URL
      const url = `${window.location.origin}/apply/longform/${updated.uuid_token}`;
      setResumeUrl(url);

      // Show success modal (email sent by backend)
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
  }, [applicant, applicantExtras, jobs, company, steps, utm, setApplicant]);

  return {
    saveAndExit,
    isSaving,
    saveError,
    resumeUrl,
    showSuccessModal,
    closeSuccessModal,
  };
}
