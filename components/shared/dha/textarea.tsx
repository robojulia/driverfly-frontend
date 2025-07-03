import React, { useState, useEffect } from 'react';
import { FormLabel } from './form-label';

interface TextAreaProps {
  name: string;
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  helperText?: string;
  className?: string;
  rows?: number;
  cols?: number;
  maxLength?: number;
  minLength?: number;
  variant?: 'default' | 'outlined' | 'filled';
  size?: 'small' | 'medium' | 'large';
  resize?: 'none' | 'both' | 'horizontal' | 'vertical';
}

export const TextArea: React.FC<TextAreaProps> = ({
  name,
  label,
  placeholder,
  value = '',
  onChange,
  onBlur,
  required = false,
  disabled = false,
  error,
  helperText,
  className = '',
  rows = 3,
  cols,
  maxLength,
  minLength,
  variant = 'outlined',
  size = 'medium',
  resize = 'vertical',
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
          minHeight: '80px',
        };
      case 'large':
        return {
          padding: '1rem 1.25rem',
          fontSize: '1rem',
          minHeight: '120px',
        };
      default: // medium
        return {
          padding: '0.75rem 1rem',
          fontSize: '1rem',
          minHeight: '100px',
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
      resize: resize,
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

  const focusStyles = isFocused
    ? '0 0 0 3px rgba(95, 203, 196, 0.1)'
    : '0 2px 4px rgba(0, 0, 0, 0.05)';

  const textareaStyles: React.CSSProperties = {
    ...getVariantStyles(variant),
    boxShadow: error ? '0 0 0 3px rgba(231, 76, 60, 0.1)' : focusStyles,
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

  const handleFocus = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    setIsFocused(true);
  };

  const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    setIsFocused(false);
    setHasValue(Boolean(e.target.value));
    if (onBlur) onBlur(e);
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
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

      <textarea
        id={name}
        name={name}
        value={value}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        rows={rows}
        cols={cols}
        maxLength={maxLength}
        minLength={minLength}
        style={{
          ...textareaStyles,
          cursor: disabled ? 'not-allowed' : 'text',
          opacity: disabled ? 0.6 : 1,
        }}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${name}-error` : helperText ? `${name}-helper` : undefined}
      />

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
