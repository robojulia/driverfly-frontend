import React from 'react';
import { SecondaryButton } from './form-buttons';

interface SaveAndContinueLaterButtonProps {
  onClick: () => void;
  isSaving: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const SaveAndContinueLaterButton: React.FC<SaveAndContinueLaterButtonProps> = ({
  onClick,
  isSaving,
  className = '',
  style = {},
}) => {
  return (
    <SecondaryButton
      type="button"
      onClick={onClick}
      disabled={isSaving}
      className={className}
      style={style}
    >
      {isSaving ? (
        <>
          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
          Saving...
        </>
      ) : (
        <>
          <i className="fa fa-bookmark me-2" />
          Save & Continue Later
        </>
      )}
    </SecondaryButton>
  );
};
