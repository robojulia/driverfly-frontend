import React, { useContext } from 'react';
import { Spinner } from 'react-bootstrap';
import { Check, ExclamationTriangle } from 'react-bootstrap-icons';
import JotformContext, { JotFormContextType } from '../../../context/jotform-context';
import styles from './progress-save-indicator.module.css';

interface ProgressSaveIndicatorProps {
  className?: string;
  showLastSaved?: boolean;
  isSaving?: boolean;
  lastSaved?: Date | null;
  saveError?: string | null;
}

/**
 * Component that shows the current save status of the form.
 * Displays saving spinner, success checkmark, or error state.
 * Can receive save status as props or use default context-based approach.
 */
export function ProgressSaveIndicator({
  className = '',
  showLastSaved = true,
  isSaving: propIsSaving,
  lastSaved: propLastSaved,
  saveError: propSaveError,
}: ProgressSaveIndicatorProps) {
  const {
    state: { steps },
  }: JotFormContextType = useContext(JotformContext);

  // Use props if provided, otherwise show nothing (assuming parent component manages save state)
  const isSaving = propIsSaving ?? false;
  const lastSaved = propLastSaved ?? null;
  const saveError = propSaveError ?? null;

  // Don't show indicator for steps before checkpoint or if no save data
  if (steps < 10 || (!isSaving && !lastSaved && !saveError)) {
    return null;
  }

  const formatLastSaved = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));

    if (diffMinutes < 1) {
      return 'just now';
    } else if (diffMinutes < 60) {
      return `${diffMinutes} min ago`;
    } else {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
  };

  return (
    <div className={`${styles.saveIndicator} ${className}`}>
      {isSaving && (
        <div className={styles.saving}>
          <Spinner animation="border" size="sm" className={styles.spinner} />
          <span>Saving...</span>
        </div>
      )}

      {!isSaving && saveError && (
        <div className={styles.error}>
          <ExclamationTriangle className={styles.errorIcon} />
          <span>Save failed</span>
        </div>
      )}

      {!isSaving && !saveError && lastSaved && showLastSaved && (
        <div className={styles.success}>
          <Check className={styles.successIcon} />
          <span>Saved {formatLastSaved(lastSaved)}</span>
        </div>
      )}
    </div>
  );
}

export default ProgressSaveIndicator;
