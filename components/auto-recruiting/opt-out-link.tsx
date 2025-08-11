import React from 'react';

interface OptOutLinkProps {
  onOptOut: () => void;
  disabled?: boolean;
}

const OptOutLink: React.FC<OptOutLinkProps> = ({ onOptOut, disabled = false }) => {
  return (
    <div className="mt-5 pt-4 border-top">
      <button
        type="button"
        className="btn btn-link text-muted p-0"
        style={{ fontSize: '0.875rem', textDecoration: 'none' }}
        onClick={onOptOut}
        disabled={disabled}
      >
        Disable Auto Recruiting
      </button>
    </div>
  );
};

export default OptOutLink;
