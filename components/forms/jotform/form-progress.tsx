import React from 'react';
import styles from '../../../styles/digitalhiringapp.module.css';

interface FormProgressProps {
  currentStep: number;
  totalSteps: number;
  stepLabels?: string[];
}

const FormProgress: React.FC<FormProgressProps> = ({
  currentStep,
  totalSteps,
  stepLabels = [],
}) => {
  const progress = Math.min(Math.round((currentStep / (totalSteps - 1)) * 100), 100);

  // Generate step labels if not provided
  const labels = stepLabels.length
    ? stepLabels
    : Array.from({ length: totalSteps }, (_, i) => `Step ${i + 1}`);

  // Show at most 5 labels to avoid clutter
  const visibleLabels =
    labels.length > 5
      ? [labels[0], '', labels[Math.floor(labels.length / 2)], '', labels[labels.length - 1]]
      : labels;

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
