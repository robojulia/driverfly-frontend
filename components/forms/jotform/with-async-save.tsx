import React, { useContext, useEffect, ComponentType } from 'react';
import { toast } from 'react-toastify';
import JotformContext, { JotFormContextType } from '../../../context/jotform-context';
import { useAsyncFormSave } from '../../../hooks/use-async-form-save';

interface WithAsyncSaveProps {
  // Any additional props can be added here
}

/**
 * Higher-order component that adds async saving capability to form components.
 * This should wrap long-form components (step 10+) to enable background saving after each step.
 */
export function withAsyncSave<P extends object>(
  WrappedComponent: ComponentType<P>,
  componentName: string = 'FormComponent'
) {
  const WithAsyncSaveComponent = (props: P & WithAsyncSaveProps) => {
    const {
      state: { applicant, applicantExtras, steps },
    }: JotFormContextType = useContext(JotformContext);

    // Enable async saving when:
    // 1. For full form: steps >= 10 (after the "hear-about-us" checkpoint)
    // 2. For longform page: applicant already exists (has an ID), meaning they've passed the checkpoint
    // The presence of applicant.id indicates this is a returning applicant who has already completed the initial steps
    const shouldSave = steps >= 10 || !!applicant?.id;

    const { saveFormData, isSaving, lastSaved, saveError } = useAsyncFormSave(
      applicant?.id, // Use applicant ID, not UUID token
      steps
      // Note: Removed is_hired parameter - applicants can update their own applications even if hired
    );

    // Trigger save when applicant or extras data changes (and we're past checkpoint)
    useEffect(() => {
      if (shouldSave && applicant && applicantExtras) {
        const formData = {
          applicant,
          applicantExtras,
        };
        console.log(formData);
        saveFormData(formData);
      }
    }, [applicant, applicantExtras, shouldSave, saveFormData]);

    // Show save status in development or when there are errors
    useEffect(() => {
      if (saveError) {
        toast.error(`Auto-save failed: ${saveError}`, {
          position: 'top-right',
          autoClose: 5000,
        });
      }
    }, [saveError]);

    // Optional: Show saving indicator for user feedback
    useEffect(() => {
      if (process.env.NODE_ENV === 'development' && isSaving) {
        toast.info('Saving progress...', {
          position: 'top-right',
          autoClose: 1000,
        });
      }
    }, [isSaving]);

    return <WrappedComponent {...props} />;
  };

  WithAsyncSaveComponent.displayName = `withAsyncSave(${componentName})`;

  return WithAsyncSaveComponent;
}

export default withAsyncSave;
