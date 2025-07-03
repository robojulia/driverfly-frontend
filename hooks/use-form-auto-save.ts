import { useContext, useEffect } from 'react';
import JotformContext, { JotFormContextType } from '../context/jotform-context';
import { useAsyncFormSave } from './use-async-form-save';

interface AutoSaveConfig {
  enabled?: boolean;
  debounceMs?: number;
  requiredFields?: string[];
}

/**
 * Custom hook that provides auto-save functionality for form components.
 * Automatically saves form data when values change, with debouncing.
 */
export function useFormAutoSave(formValues: any, config: AutoSaveConfig = {}) {
  const { enabled = true, debounceMs = 2000, requiredFields = [] } = config;

  const {
    state: { applicant, applicantExtras, steps },
  }: JotFormContextType = useContext(JotformContext);

  const {
    saveFormData,
    isSaving,
    saveError,
    cancel: cancelRequest,
  } = useAsyncFormSave(applicant?.id, steps);

  // Auto-save effect with debouncing
  useEffect(() => {
    if (!enabled || steps < 10) return;

    // Check if required fields are filled
    const hasRequiredFields =
      requiredFields.length === 0 || requiredFields.every((field) => formValues[field]);

    if (!hasRequiredFields) return;

    const timeoutId = setTimeout(() => {
      const formData = {
        applicant: {
          ...applicant,
          ...formValues,
        },
        applicantExtras,
      };

      saveFormData(formData);
    }, debounceMs);

    return () => {
      clearTimeout(timeoutId);
      if (isSaving) {
        cancelRequest();
      }
    };
  }, [
    ...Object.values(formValues), // Watch all form values
    steps,
    enabled,
    debounceMs,
    saveFormData,
    cancelRequest,
    isSaving,
  ]);

  return {
    saveFormData,
    isSaving,
    saveError,
    isAutoSaveEnabled: enabled && steps >= 10,
  };
}

export default useFormAutoSave;
