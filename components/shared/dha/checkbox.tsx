import React from 'react';
import { FormLabel } from './form-label';

interface CheckboxProps {
  name: string;
  label?: string;
  checked?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  helperText?: string;
  className?: string;
  variant?: 'default' | 'outlined' | 'filled';
  size?: 'small' | 'medium' | 'large';
}

export const Checkbox: React.FC<CheckboxProps> = ({
  name,
  label,
  checked = false,
  onChange,
  onBlur,
  required = false,
  disabled = false,
  error,
  helperText,
  className = '',
  variant = 'default',
  size = 'medium',
}) => {
  const getSizeStyles = (size: string) => {
    switch (size) {
      case 'small':
        return {
          width: '16px',
          height: '16px',
        };
      case 'large':
        return {
          width: '24px',
          height: '24px',
        };
      default: // medium
        return {
          width: '20px',
          height: '20px',
        };
    }
  };

  const containerStyles: React.CSSProperties = {
    position: 'relative',
    width: '100%',
    marginBottom: '1rem',
  };

  const checkboxContainerStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.75rem',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.6 : 1,
  };

  const checkboxStyles: React.CSSProperties = {
    ...getSizeStyles(size),
    appearance: 'none',
    backgroundColor: checked ? 'var(--primary)' : 'var(--light)',
    border: `2px solid ${
      error ? 'var(--danger)' : checked ? 'var(--primary)' : 'var(--medium-gray)'
    }`,
    borderRadius: '4px',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative',
    flexShrink: 0,
    marginTop: '0',
  };

  const labelContainerStyles: React.CSSProperties = {
    flex: 1,
    cursor: disabled ? 'not-allowed' : 'pointer',
  };

  const labelTextStyles: React.CSSProperties = {
    fontSize: '1rem',
    fontWeight: '500',
    color: disabled ? 'var(--text-muted)' : 'var(--text-primary)',
    lineHeight: '1.5',
    margin: 0,
  };

  const errorStyles: React.CSSProperties = {
    color: 'var(--danger)',
    fontSize: '0.875rem',
    marginTop: '0.25rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem',
  };

  const helperTextStyles: React.CSSProperties = {
    color: 'var(--text-secondary)',
    fontSize: '0.875rem',
    marginTop: '0.25rem',
  };

  const checkmarkStyles: React.CSSProperties = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    color: 'var(--text-light)',
    fontSize: size === 'small' ? '10px' : size === 'large' ? '16px' : '12px',
    fontWeight: 'bold',
    pointerEvents: 'none',
    marginTop: '-3px',
  };

  const handleContainerClick = () => {
    if (!disabled && onChange) {
      const syntheticEvent = {
        target: {
          name,
          checked: !checked,
        },
      } as React.ChangeEvent<HTMLInputElement>;
      onChange(syntheticEvent);
    }
  };

  return (
    <div style={containerStyles} className={className}>
      <div style={checkboxContainerStyles} onClick={handleContainerClick}>
        <div style={{ position: 'relative' }}>
          <input
            id={name}
            name={name}
            type="checkbox"
            checked={checked}
            onChange={onChange}
            onBlur={onBlur}
            required={required}
            disabled={disabled}
            style={checkboxStyles}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? `${name}-error` : helperText ? `${name}-helper` : undefined}
          />
          {checked && <div style={checkmarkStyles}>✓</div>}
        </div>

        {label && (
          <div style={labelContainerStyles}>
            <FormLabel htmlFor={name} required={required} style={labelTextStyles}>
              {label}
            </FormLabel>
          </div>
        )}
      </div>

      {error && (
        <div id={`${name}-error`} style={errorStyles} role="alert">
          <span>⚠️</span>
          {error}
        </div>
      )}

      {helperText && !error && (
        <div id={`${name}-helper`} style={helperTextStyles}>
          {helperText}
        </div>
      )}
    </div>
  );
};
