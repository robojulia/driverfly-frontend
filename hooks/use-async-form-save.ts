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
  stepNumber: number
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
      // Only save after the initial checkpoint (step 9)
      if (!applicantId || stepNumber <= 9) {
        return;
      }

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
        console.log(`Auto-saved step ${stepNumber} for applicant ${applicantId}`);
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
    [applicantId, stepNumber, isSaving, cancel]
  );

  return {
    saveFormData,
    isSaving,
    lastSaved,
    saveError,
    cancel,
  };
};
