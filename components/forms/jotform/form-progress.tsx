import React, { useContext } from 'react';
import styles from '../../../styles/digitalhiringapp.module.css';
import JotformContext, { JotFormContextType } from '../../../context/jotform-context';

interface FormProgressProps {
  currentStep: number;
  totalSteps: number;
  stepLabels?: string[];
}

const FormProgress: React.FC<FormProgressProps> = ({ currentStep, totalSteps }) => {
  const {
    state: { isEditingExistingApplicant, isPrefilled },
    method: { setSteps },
  }: JotFormContextType = useContext(JotformContext);

  const progress = Math.min(Math.round((currentStep / (totalSteps - 1)) * 100), 100);

  const handleReturnToSummary = () => {
    setSteps(-1); // Navigate to ApplicationSummary
  };

  return (
    <div className={styles.progressContainer}>
      <div className={styles.progressBar}>
        <div
          className={styles.progressFill}
          style={{ width: `${progress}%` }}
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
          role="progressbar"
        />
      </div>

      <div className={styles.progressStep} />

      <div className={styles.align__text_center}>
        <span className={styles.txtcolor}>
          {isEditingExistingApplicant
            ? `Updating Step ${currentStep + 1} of ${totalSteps}`
            : `Step ${currentStep + 1} of ${totalSteps}`}
        </span>
        {isEditingExistingApplicant && (
          <div className="mt-1">
            <small className="text-success">
              <i className="fa fa-edit me-1" />
              Updating Application
            </small>
          </div>
        )}
        {isPrefilled && (
          <div className="mt-2">
            <button
              type="button"
              className="btn btn-outline-primary btn-sm"
              onClick={handleReturnToSummary}
            >
              <i className="fa fa-list me-1" />
              Return to Summary
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FormProgress;
