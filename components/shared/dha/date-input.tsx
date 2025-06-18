import React, { useState, useEffect } from 'react';
import { FormLabel } from './form-label';

interface DateInputProps {
  name: string;
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  helperText?: string;
  className?: string;
  autoComplete?: string;
  max?: string;
  min?: string;
  variant?: 'default' | 'outlined' | 'filled';
  size?: 'small' | 'medium' | 'large';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

export const DateInput: React.FC<DateInputProps> = ({
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
  autoComplete,
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

  // Format date value to ensure it's in YYYY-MM-DD format
  const formatDateValue = (dateValue: string): string => {
    if (!dateValue) return '';

    // If it's already in YYYY-MM-DD format, return as is
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateValue)) {
      return dateValue;
    }

    // Handle ISO string format (like 2024-01-15T10:30:00.000Z)
    if (dateValue.includes('T')) {
      try {
        return dateValue.split('T')[0];
      } catch (e) {
        console.warn('Error splitting ISO date:', dateValue);
      }
    }

    // Try to parse and format other date formats
    try {
      const date = new Date(dateValue);
      if (!isNaN(date.getTime())) {
        // Format to YYYY-MM-DD
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      }
    } catch (e) {
      console.warn('Invalid date format:', dateValue);
    }

    return dateValue;
  };

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
          fontSize: '1.125rem',
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

  // Format the value for display
  const displayValue = formatDateValue(value);

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
          type="date"
          value={displayValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          autoComplete={autoComplete}
          max={max}
          min={min}
          style={{
            ...inputStyles,
            cursor: disabled ? 'not-allowed' : 'text',
            opacity: disabled ? 0.6 : 1,
            // Date input specific styles
            colorScheme: 'light',
            // Ensure proper display of date value
            WebkitAppearance: 'none',
            MozAppearance: 'textfield',
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
