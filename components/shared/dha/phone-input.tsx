import React, { useState, useEffect } from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { FormLabel } from './form-label';

interface PhoneInputProps {
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
  variant?: 'default' | 'outlined' | 'filled';
  size?: 'small' | 'medium' | 'large';
  noMargin?: boolean; // New prop to override margin
}

export const DhaPhoneInput: React.FC<PhoneInputProps> = ({
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
  variant = 'outlined',
  size = 'medium',
  noMargin = false, // Default to false to maintain existing behavior
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [internalValue, setInternalValue] = useState(value || '1'); // Always maintain at least country code
  const [hasValue, setHasValue] = useState(Boolean(value && value.length > 1)); // Country code "1" doesn't count as having value

  // Sync internal state with value prop changes
  useEffect(() => {
    if (value) {
      // If we have an external value, use it
      setInternalValue(value);
      setHasValue(value.length > 1);
    } else {
      // If external value is empty, maintain country code internally
      setInternalValue('1');
      setHasValue(false);
    }
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
    marginBottom: noMargin ? '0' : '1rem', // Conditional margin based on noMargin prop
  };

  const focusStyles = isFocused
    ? '0 0 0 3px rgba(95, 203, 196, 0.1)'
    : '0 2px 4px rgba(0, 0, 0, 0.05)';

  const phoneInputStyles = getVariantStyles(variant);

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

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    if (onBlur) {
      // Create a synthetic event for consistency
      const phoneHasValue = internalValue && internalValue.length > 1;
      const syntheticEvent = {
        target: { name, value: phoneHasValue ? internalValue : '' },
        currentTarget: { name, value: phoneHasValue ? internalValue : '' },
      } as React.FocusEvent<HTMLInputElement>;
      onBlur(syntheticEvent);
    }
  };

  const handleChange = (phoneValue: string, country: any, e: any, formattedValue: string) => {
    // Always update internal value to maintain country code
    setInternalValue(phoneValue);

    // Consider phone empty if it's just the country code (US = "1")
    const phoneHasValue = phoneValue && phoneValue.length > 1;
    setHasValue(phoneHasValue);

    if (onChange) {
      // Create a synthetic event for Formik compatibility
      // Only send the formatted value externally if there's actual content beyond country code
      const syntheticEvent = {
        target: {
          name,
          value: phoneHasValue ? formattedValue : '', // Return empty string if just country code
        },
        currentTarget: {
          name,
          value: phoneHasValue ? formattedValue : '',
        },
      } as React.ChangeEvent<HTMLInputElement>;
      onChange(syntheticEvent);
    }
  };

  const PHONE_INPUT_COUNTRY_ALLOWED = process?.env?.NEXT_PUBLIC_PHONE_INPUT_COUNTRY_ALLOWED?.split(',');
  
  // Validate and filter country codes - ensure they're valid for react-phone-input-2
  let validCountries = ['us']; // Default fallback
  
  if (Array.isArray(PHONE_INPUT_COUNTRY_ALLOWED) && PHONE_INPUT_COUNTRY_ALLOWED.length > 0) {
    // Map common country codes to their correct format for react-phone-input-2
    const countryCodeMap = {
      'pk': 'pk', // Pakistan
      'us': 'us', // United States
      'ca': 'ca', // Canada
      'gb': 'gb', // United Kingdom
      'in': 'in', // India
    };
    
    validCountries = PHONE_INPUT_COUNTRY_ALLOWED
      .map(code => code.trim().toLowerCase())
      .map(code => countryCodeMap[code] || code)
      .filter(code => code); // Remove any empty codes
  }
  
  const onlyCountries = validCountries.length > 0 ? validCountries : ['us'];

  // Debug logging to help identify the issue
  console.log('NEXT_PUBLIC_PHONE_INPUT_COUNTRY_ALLOWED env var:', process?.env?.NEXT_PUBLIC_PHONE_INPUT_COUNTRY_ALLOWED);
  console.log('Final onlyCountries array:', onlyCountries);

  return (
    <div style={containerStyles} className={className}>
      {label && (
        <FormLabel htmlFor={name} required={required}>
          {label}
        </FormLabel>
      )}

      <div style={{ position: 'relative' }}>
        <PhoneInput
          country={'us'}
          onlyCountries={onlyCountries}
          value={internalValue} // Use internal value to maintain country code
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={disabled}
          placeholder={placeholder || 'Phone Number'}
          autoFormat
          countryCodeEditable={false}
          enableSearch={true}
          searchPlaceholder="Search countries..."
          inputProps={{
            name,
            autoComplete,
            disabled,
            'aria-invalid': Boolean(error),
            'aria-describedby': error ? `${name}-error` : helperText ? `${name}-helper` : undefined,
          }}
          inputStyle={{
            ...phoneInputStyles,
            boxShadow: error ? '0 0 0 3px rgba(231, 76, 60, 0.1)' : focusStyles,
            cursor: disabled ? 'not-allowed' : 'text',
            opacity: disabled ? 0.6 : 1,
            paddingLeft: '48px', // Account for country flag
          }}
          buttonStyle={{
            border: 'none',
            backgroundColor: 'transparent',
            borderRight: `1px solid ${
              error ? 'var(--danger)' : isFocused ? 'var(--primary)' : 'var(--medium-gray)'
            }`,
            borderRadius: '8px 0 0 8px',
          }}
          dropdownStyle={{
            borderRadius: '8px',
            border: '2px solid var(--medium-gray)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          }}
          containerStyle={{
            width: '100%',
          }}
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
