import React from 'react';
import { FormLabel } from './form-label';
import { useTranslation } from '../../../hooks/use-translation';

interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps {
  name: string;
  label?: string;
  options?: SelectOption[];
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLSelectElement>) => void;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  helperText?: string;
  placeholder?: string;
  className?: string;
  enumType?: object;
  labelPrefix?: string;
}

export const Select: React.FC<SelectProps> = ({
  name,
  label,
  options: propOptions,
  value,
  onChange,
  onBlur,
  required = false,
  disabled = false,
  error,
  helperText,
  placeholder,
  className = '',
  enumType,
  labelPrefix,
}) => {
  const { t } = useTranslation();

  // Generate options from enum if provided
  const options = React.useMemo(() => {
    if (enumType && !propOptions) {
      return Object.values(enumType).map(
        (enumValue): SelectOption => ({
          value: enumValue as string,
          label: enumValue as string,
          disabled: false,
        })
      );
    }
    return propOptions || [];
  }, [enumType, propOptions]);

  // Helper function to get translated label
  const getTranslatedLabel = (option: SelectOption) => {
    if (labelPrefix) {
      return t(`${labelPrefix}.${option.label}`);
    }
    return t(option.label);
  };

  const containerStyles: React.CSSProperties = {
    position: 'relative',
    width: '100%',
    marginBottom: '1rem',
  };

  const selectStyles: React.CSSProperties = {
    width: '100%',
    padding: '0.75rem 1rem',
    fontSize: '1rem',
    lineHeight: '1.5',
    color: 'var(--text-primary)',
    backgroundColor: 'var(--light)',
    border: `2px solid ${error ? 'var(--danger)' : 'var(--medium-gray)'}`,
    borderRadius: '8px',
    outline: 'none',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    appearance: 'none',
    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
    backgroundPosition: 'right 0.75rem center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: '1.5em 1.5em',
    paddingRight: '2.5rem',
  };

  const focusStyles: React.CSSProperties = {
    borderColor: 'var(--primary)',
    boxShadow: '0 0 0 3px rgba(95, 203, 196, 0.1)',
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

  return (
    <div style={containerStyles} className={className}>
      {label && (
        <FormLabel htmlFor={name} required={required}>
          {label}
        </FormLabel>
      )}

      <select
        id={name}
        name={name}
        value={value || ''}
        onChange={onChange}
        disabled={disabled}
        required={required}
        style={selectStyles}
        onFocus={(e) => {
          Object.assign(e.target.style, focusStyles);
        }}
        onBlur={(e) => {
          e.target.style.borderColor = error ? 'var(--danger)' : 'var(--medium-gray)';
          e.target.style.boxShadow = 'none';
          if (onBlur) onBlur(e);
        }}
      >
        {placeholder && (
          <option value="" disabled>
            {t(placeholder)}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value} disabled={option.disabled}>
            {getTranslatedLabel(option)}
          </option>
        ))}
      </select>

      {error && (
        <div style={errorStyles} role="alert">
          <span>⚠️</span>
          {error}
        </div>
      )}

      {helperText && !error && <div style={helperTextStyles}>{helperText}</div>}
    </div>
  );
};
