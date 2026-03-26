import React, { useContext, useEffect, ComponentType } from 'react';
import JotformContext, { JotFormContextType } from '../../../context/jotform-context';
import { useAsyncFormSave } from '../../../hooks/use-async-form-save';
import { useSaveAndContinueLater } from '../../../hooks/use-save-and-continue-later';
import { SaveAndContinueLaterButton } from './save-and-continue-later-button';
import { SaveSuccessModal } from './save-success-modal';

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
    // Step 25 (legal documents) is excluded — it has its own final submit that handles saving
    const shouldSave = (steps >= 10 || !!applicant?.id) && steps !== 25;

    const { saveFormData } = useAsyncFormSave(
      applicant?.id,
      steps
    );

    // Trigger save when applicant or extras data changes (and we're past checkpoint)
    useEffect(() => {
      if (shouldSave && applicant && applicantExtras) {
        // Strip nested relation entities that cause backend 500 errors.
        // The backend only needs scalar/array form fields, not full joined objects.
        const { company, user, jobs, documents, employee, ...applicantFields } = applicant as any;
        saveFormData({ applicant: applicantFields, applicantExtras });
      }
    }, [applicant, applicantExtras, shouldSave, saveFormData]);

    const { saveAndExit, isSaving: isSavingDraft, showSuccessModal, closeSuccessModal, resumeUrl } =
      useSaveAndContinueLater();

    return (
      <>
        <WrappedComponent {...props} />
        {shouldSave && (
          <>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
              <SaveAndContinueLaterButton onClick={saveAndExit} isSaving={isSavingDraft} />
            </div>
            <SaveSuccessModal
              isOpen={showSuccessModal}
              onClose={closeSuccessModal}
              resumeUrl={resumeUrl}
              email={applicant?.email}
            />
          </>
        )}
      </>
    );
  };

  WithAsyncSaveComponent.displayName = `withAsyncSave(${componentName})`;

  return WithAsyncSaveComponent;
}

export default withAsyncSave;
