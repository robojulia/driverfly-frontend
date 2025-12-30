import React, { useState, useEffect } from 'react';
import { FormLabel } from './form-label';

interface InputProps {
  name: string;
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  type?: 'text' | 'email' | 'password' | 'tel' | 'number' | 'url' | 'date';
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  error?: string;
  helperText?: string;
  className?: string;
  autoComplete?: string;
  maxLength?: number;
  minLength?: number;
  pattern?: string;
  max?: string;
  min?: string | number;
  variant?: 'default' | 'outlined' | 'filled';
  size?: 'small' | 'medium' | 'large';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

export const Input: React.FC<InputProps> = ({
  name,
  label,
  placeholder,
  value = '',
  onChange,
  onBlur,
  type = 'text',
  required = false,
  disabled = false,
  readOnly = false,
  error,
  helperText,
  className = '',
  autoComplete,
  maxLength,
  minLength,
  pattern,
  max,
  min,
  variant = 'outlined',
  size = 'medium',
  icon,
  iconPosition = 'left',
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(Boolean(value));

  // Sync internal state with value prop changes
  useEffect(() => {
    setHasValue(Boolean(value));
  }, [value]);

  const getSizeStyles = (size: string) => {
    switch (size) {
      case 'small':
        return {
          padding: '0.5rem 0.75rem',
          fontSize: '0.875rem',
          minHeight: '40px',
        };
      case 'large':
        return {
          padding: '1rem 1.25rem',
          fontSize: '1rem',
          minHeight: '56px',
        };
      default: // medium
        return {
          padding: '0.75rem 1rem',
          fontSize: '1rem',
          minHeight: '48px',
        };
    }
  };

  const getVariantStyles = (variant: string) => {
    const baseStyles = {
      width: '100%',
      border: '2px solid',
      borderRadius: '8px',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      outline: 'none',
      fontFamily: 'inherit',
      fontWeight: '500',
      ...getSizeStyles(size),
    };

    switch (variant) {
      case 'filled':
        return {
          ...baseStyles,
          backgroundColor: 'var(--form-info-bg)',
          borderColor: 'transparent',
          color: 'var(--text-primary)',
        };
      case 'outlined':
      default:
        return {
          ...baseStyles,
          backgroundColor: 'var(--light)',
          borderColor: error
            ? 'var(--danger)'
            : isFocused
            ? 'var(--primary)'
            : 'var(--medium-gray)',
          color: 'var(--text-primary)',
        };
    }
  };

  const containerStyles: React.CSSProperties = {
    position: 'relative',
    width: '100%',
    marginBottom: '1rem',
  };

  const inputContainerStyles: React.CSSProperties = {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  };

  const focusStyles = isFocused
    ? '0 0 0 3px rgba(95, 203, 196, 0.1)'
    : '0 2px 4px rgba(0, 0, 0, 0.05)';

  const inputStyles: React.CSSProperties = {
    ...getVariantStyles(variant),
    paddingLeft:
      icon && iconPosition === 'left' ? '2.75rem' : getSizeStyles(size).padding.split(' ')[1],
    paddingRight:
      icon && iconPosition === 'right' ? '2.75rem' : getSizeStyles(size).padding.split(' ')[1],
    boxShadow: error ? '0 0 0 3px rgba(231, 76, 60, 0.1)' : focusStyles,
  };

  const iconStyles: React.CSSProperties = {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    [iconPosition === 'left' ? 'left' : 'right']: '0.75rem',
    color: error ? 'var(--danger)' : isFocused ? 'var(--primary)' : 'var(--text-secondary)',
    fontSize: '1.25rem',
    pointerEvents: 'none',
    zIndex: 1,
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

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    setHasValue(Boolean(e.target.value));
    if (onBlur) onBlur(e);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHasValue(Boolean(e.target.value));
    if (onChange) onChange(e);
  };

  return (
    <div style={containerStyles} className={className}>
      {label && (
        <FormLabel htmlFor={name} required={required}>
          {label}
        </FormLabel>
      )}

      <div style={inputContainerStyles}>
        {icon && <div style={iconStyles}>{icon}</div>}

        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          readOnly={readOnly}
          autoComplete={autoComplete}
          maxLength={maxLength}
          minLength={minLength}
          pattern={pattern}
          max={max}
          min={min}
          style={{
            ...inputStyles,
            cursor: disabled ? 'not-allowed' : readOnly ? 'default' : 'text',
            opacity: disabled ? 0.6 : 1,
            backgroundColor: readOnly ? 'var(--form-info-bg)' : inputStyles.backgroundColor,
          }}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${name}-error` : helperText ? `${name}-helper` : undefined}
        />
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
