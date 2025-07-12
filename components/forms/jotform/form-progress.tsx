import React, { useContext } from 'react';
import styles from '../../../styles/digitalhiringapp.module.css';
import JotformContext, { JotFormContextType } from '../../../context/jotform-context';
import { useTranslation } from '../../../hooks/use-translation';

interface FormProgressProps {
  currentStep: number;
  totalSteps: number;
  stepLabels?: string[];
}

const FormProgress: React.FC<FormProgressProps> = ({ currentStep, totalSteps }) => {
  const {
    state: { isEditingExistingApplicant },
  }: JotFormContextType = useContext(JotformContext);

  const { t } = useTranslation();
  const progress = Math.min(Math.round((currentStep / (totalSteps - 1)) * 100), 100);

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
            ? t('UPDATING_STEP_OF_TOTAL', { currentStep: currentStep + 1, totalSteps })
            : t('STEP_OF_TOTAL', { currentStep: currentStep + 1, totalSteps })}
        </span>
        {isEditingExistingApplicant && (
          <div className="mt-1">
            <small className="text-success">
              <i className="fa fa-edit me-1" />
              {t('UPDATE_MODE_INDICATOR')}
            </small>
          </div>
        )}
      </div>
    </div>
  );
};

export default FormProgress;
