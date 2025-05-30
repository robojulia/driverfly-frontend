import React from 'react';
import OtpInputField from 'react-otp-input';

interface OTPInputProps {
  value: string;
  onChange: (otp: string) => void;
  numInputs?: number;
  shouldAutoFocus?: boolean;
  isDisabled?: boolean;
  hasErrored?: boolean;
  placeholder?: string;
  separator?: React.ReactNode;
}

export const OTPInput: React.FC<OTPInputProps> = ({
  value,
  onChange,
  numInputs = 6,
  shouldAutoFocus = true,
  isDisabled = false,
  hasErrored = false,
  placeholder = '',
  separator = <span style={{ margin: '0 4px', color: '#667788' }}>-</span>,
}) => {
  const inputStyle: React.CSSProperties = {
    width: '48px',
    height: '48px',
    margin: '0 4px',
    borderRadius: '8px',
    border: hasErrored ? '2px solid #e74c3c' : '2px solid #e0e5eb',
    fontSize: '20px',
    fontWeight: '600',
    textAlign: 'center' as const,
    color: '#1a2b3c',
    backgroundColor: isDisabled ? '#f8f9fa' : '#ffffff',
    transition: 'all 0.3s ease',
    outline: 'none',
    boxShadow: hasErrored ? '0 0 0 3px rgba(231, 76, 60, 0.1)' : '0 2px 4px rgba(0, 0, 0, 0.05)',
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '4px',
        margin: '1rem 0',
      }}
    >
      <style>
        {`
          .otp-input input:focus {
            border-color: #0073b1 !important;
            box-shadow: 0 0 0 3px rgba(0, 115, 177, 0.1) !important;
          }
        `}
      </style>
      <div className="otp-input">
        <OtpInputField
          inputStyle={inputStyle}
          renderInput={(props) => (
            <input {...props} placeholder={placeholder} disabled={isDisabled} />
          )}
          value={value}
          onChange={onChange}
          shouldAutoFocus={shouldAutoFocus}
          numInputs={numInputs}
          renderSeparator={() => separator}
          inputType="tel"
        />
      </div>
    </div>
  );
};
