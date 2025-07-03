import React from 'react';
import styles from '../../../styles/digitalhiringapp.module.css';

interface FormProgressProps {
  currentStep: number;
  totalSteps: number;
  stepLabels?: string[];
}

const FormProgress: React.FC<FormProgressProps> = ({ currentStep, totalSteps }) => {
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
          Step {currentStep + 1} of {totalSteps}
        </span>
      </div>
    </div>
  );
};

export default FormProgress;
