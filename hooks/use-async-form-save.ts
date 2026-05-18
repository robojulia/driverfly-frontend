import { useState, useCallback, useRef, useEffect } from 'react';
import ApplicantApi from '../pages/api/applicant';
import axios from 'axios';

interface AsyncFormSaveHook {
  saveFormData: (formData: any) => Promise<void>;
  isSaving: boolean;
  lastSaved: Date | null;
  saveError: string | null;
  cancel: () => void;
}

export const useAsyncFormSave = (
  applicantId: number | undefined,
  stepNumber?: number,
  _isHired?: boolean // Kept for backward compatibility but no longer used
): AsyncFormSaveHook => {
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const isMountedRef = useRef(true);
  // Ref-based tracking avoids isSaving being in the useCallback deps (which would cause an
  // infinite re-render loop: save starts → isSaving changes → saveFormData ref changes →
  // withAsyncSave useEffect re-fires → another save starts → repeat).
  const isSavingRef = useRef(false);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      abortControllerRef.current?.abort();
    };
  }, []);

  const cancel = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  const saveFormData = useCallback(
    async (formData: any) => {
      if (!applicantId) {
        return;
      }

      // If a save is already in progress, cancel it before starting a new one.
      if (isSavingRef.current) {
        cancel();
      }

      const controller = new AbortController();
      abortControllerRef.current = controller;

      isSavingRef.current = true;
      setIsSaving(true);
      setSaveError(null);

      try {
        const applicantApi = new ApplicantApi();
        await applicantApi.jotform.update(applicantId, formData, {
          signal: controller.signal,
        });
        if (isMountedRef.current) {
          setLastSaved(new Date());
        }
      } catch (error) {
        if (axios.isCancel(error) || error.name === 'AbortError' || error.name === 'CanceledError' || error.code === 'ERR_CANCELED') {
          // Request was intentionally canceled (e.g. user navigated to next step), not an error
        } else if (isMountedRef.current) {
          console.error('Auto-save failed:', error);
          if ((error as any).response?.data) {
            console.error('Auto-save backend error details:', (error as any).response.data);
          }
          setSaveError(error instanceof Error ? error.message : 'Save failed');
        }
      } finally {
        if (isMountedRef.current && abortControllerRef.current === controller) {
          isSavingRef.current = false;
          setIsSaving(false);
          abortControllerRef.current = null;
        }
      }
    },
    [applicantId, stepNumber, cancel] // isSaving intentionally omitted — use isSavingRef instead
  );

  return {
    saveFormData,
    isSaving,
    lastSaved,
    saveError,
    cancel,
  };
};
