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

    // Only enable async saving for steps after the initial checkpoint (step 9)
    const shouldSave = steps >= 10; // Long form starts after "hear-about-us" checkpoint

    const { saveFormData, isSaving, lastSaved, saveError } = useAsyncFormSave(
      applicant?.id, // Use applicant ID, not UUID token
      steps
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
