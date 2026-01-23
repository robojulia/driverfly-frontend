import { useState, useCallback, useRef } from 'react';
import ApplicantApi from '../pages/api/applicant';

interface AsyncFormSaveHook {
  saveFormData: (formData: any) => Promise<void>;
  isSaving: boolean;
  lastSaved: Date | null;
  saveError: string | null;
  cancel: () => void;
}

export const useAsyncFormSave = (
  applicantId: number | undefined,
  _stepNumber?: number, // Kept for backward compatibility but no longer used - step logic handled by withAsyncSave HOC
  _isHired?: boolean // Kept for backward compatibility but no longer used
): AsyncFormSaveHook => {
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const cancel = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  const saveFormData = useCallback(
    async (formData: any) => {
      // Require applicantId to save - the step check is now handled by the withAsyncSave HOC's shouldSave logic
      // which accounts for both full form (steps >= 10) and longform page (applicant.id exists)
      if (!applicantId) {
        return;
      }

      // Note: Removed is_hired check to allow hired applicants to update their own applications
      // The is_hired check in the company dashboard (for admins) is sufficient

      // If a save is already in progress, cancel it before starting a new one.
      if (isSaving) {
        cancel();
      }

      const controller = new AbortController();
      abortControllerRef.current = controller;

      setIsSaving(true);
      setSaveError(null);

      try {
        const applicantApi = new ApplicantApi();
        await applicantApi.jotform.update(applicantId, formData, {
          signal: controller.signal,
        });
        setLastSaved(new Date());
      } catch (error) {
        if (error.name === 'AbortError') {
          console.log('Save request was cancelled');
        } else {
          console.error('Auto-save failed:', error);
          setSaveError(error instanceof Error ? error.message : 'Save failed');
        }
      } finally {
        if (abortControllerRef.current === controller) {
          setIsSaving(false);
          abortControllerRef.current = null;
        }
      }
    },
    [applicantId, isSaving, cancel]
  );

  return {
    saveFormData,
    isSaving,
    lastSaved,
    saveError,
    cancel,
  };
};
