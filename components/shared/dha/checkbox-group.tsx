import React, { useState, useEffect } from 'react';
import { FormLabel } from './form-label';
import { useTranslation } from '../../../hooks/use-translation';

interface CheckboxOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
  description?: string;
  disabled?: boolean;
}

interface CheckboxGroupProps {
  name: string;
  label?: string;
  options?: CheckboxOption[];
  value?: string[];
  onChange?: (value: string[]) => void;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  helperText?: string;
  className?: string;
  variant?: 'default' | 'card' | 'compact';
  columns?: 1 | 2 | 3 | 4;
  labelPrefix?: string;
  enumType?: object;
  allowOther?: boolean;
  otherLabel?: string;
  otherPlaceholder?: string;
  onOtherTextChange?: (text: string) => void;
  otherTextValue?: string;
}

export const CheckboxGroup: React.FC<CheckboxGroupProps> = ({
  name,
  label,
  options: propOptions,
  value = [],
  onChange,
  required = false,
  disabled = false,
  error,
  helperText,
  className = '',
  variant = 'card',
  columns = 2,
  labelPrefix,
  enumType,
  allowOther = false,
  otherLabel = 'Other',
  otherPlaceholder = 'Please specify...',
  onOtherTextChange,
  otherTextValue = '',
}) => {
  const { t } = useTranslation();
  const [showOtherInput, setShowOtherInput] = useState(false);

  // Generate options from enum if provided
  const options = React.useMemo(() => {
    if (enumType && !propOptions) {
      return Object.values(enumType).map(
        (enumValue): CheckboxOption => ({
          value: enumValue as string,
          label: enumValue as string,
          icon: undefined,
          description: undefined,
          disabled: false,
        })
      );
    }
    return propOptions || [];
  }, [enumType, propOptions]);

  // Check if "OTHERS" is selected and show/hide input accordingly
  useEffect(() => {
    const hasOthersSelected = value.some((v) =>
      v === 'OTHERS' || v.startsWith('OTHERS:')
    );
    setShowOtherInput(hasOthersSelected);
  }, [value]);

  // Helper function to get translated label
  const getTranslatedLabel = (option: CheckboxOption) => {
    if (labelPrefix) {
      return t(`${labelPrefix}.${option.label}`);
    }
    return t(option.label);
  };

  const getVariantStyles = (variant: string) => {
    switch (variant) {
      case 'compact':
        return {
          padding: '0.75rem 1rem',
          fontSize: '0.875rem',
          minHeight: '44px',
        };
      case 'default':
        return {
          padding: '1rem 1.25rem',
          fontSize: '1rem',
          minHeight: '56px',
        };
      default: // card
        return {
          padding: '1.25rem 1.5rem',
          fontSize: '1rem',
          minHeight: '64px',
        };
    }
  };

  const containerStyles: React.CSSProperties = {
    position: 'relative',
    width: '100%',
    marginBottom: '1rem',
  };

  const gridStyles: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: `repeat(${columns}, 1fr)`,
    gap: '0.75rem',
    marginTop: '0.5rem',
  };

  const getOptionStyles = (isSelected: boolean, isDisabled: boolean): React.CSSProperties => {
    const baseStyles = {
      ...getVariantStyles(variant),
      border: '2px solid',
      borderRadius: '8px',
      cursor: isDisabled ? 'not-allowed' : 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      backgroundColor: 'var(--light)',
      position: 'relative' as const,
      userSelect: 'none' as const,
      opacity: isDisabled ? 0.6 : 1,
    };

    if (error) {
      return {
        ...baseStyles,
        borderColor: 'var(--danger)',
        boxShadow: '0 0 0 3px rgba(231, 76, 60, 0.1)',
      };
    }

    if (isSelected) {
      return {
        ...baseStyles,
        borderColor: 'var(--primary-button)',
        backgroundColor: 'var(--primary-button-light)',
        boxShadow: '0 0 0 3px rgba(95, 203, 196, 0.1)',
        transform: 'translateY(-1px)',
      };
    }

    return {
      ...baseStyles,
      borderColor: 'var(--medium-gray)',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
    };
  };

  const checkboxStyles: React.CSSProperties = {
    width: '20px',
    height: '20px',
    borderRadius: '4px',
    border: '2px solid',
    borderColor: 'var(--medium-gray)',
    backgroundColor: 'var(--light)',
    position: 'relative',
    flexShrink: 0,
  };

  const checkboxCheckedStyles: React.CSSProperties = {
    ...checkboxStyles,
    borderColor: 'var(--primary-button)',
    backgroundColor: 'var(--primary-button)',
  };

  const checkmarkStyles: React.CSSProperties = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    color: 'var(--light)',
    fontSize: '10px',
    fontWeight: 'bold',
  };

  const contentStyles: React.CSSProperties = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
  };

  const labelStyles: React.CSSProperties = {
    fontWeight: '600',
    color: 'var(--text-primary)',
    margin: 0,
  };

  const descriptionStyles: React.CSSProperties = {
    fontSize: '0.875rem',
    color: 'var(--text-secondary)',
    margin: 0,
  };

  const iconStyles: React.CSSProperties = {
    fontSize: '1.5rem',
    flexShrink: 0,
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

  const handleOptionClick = (optionValue: string) => {
    if (disabled || options.find((opt) => opt.value === optionValue)?.disabled) return;

    const newValue = [...value];
    const index = newValue.indexOf(optionValue);

    if (index > -1) {
      // Remove if already selected
      newValue.splice(index, 1);
    } else {
      // Add if not selected
      newValue.push(optionValue);
    }

    if (onChange) onChange(newValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent, optionValue: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleOptionClick(optionValue);
    }
  };

  return (
    <div style={containerStyles} className={className}>
      {label && (
        <FormLabel htmlFor={name} required={required}>
          {label}
        </FormLabel>
      )}

      <div style={gridStyles} role="group" aria-labelledby={label ? `${name}-label` : undefined}>
        {options.map((option) => {
          const isSelected = value.includes(option.value);
          const isDisabled = disabled || option.disabled;
          const displayLabel = getTranslatedLabel(option);

          return (
            <div
              key={option.value}
              style={getOptionStyles(isSelected, isDisabled)}
              onClick={() => handleOptionClick(option.value)}
              onKeyDown={(e) => handleKeyDown(e, option.value)}
              tabIndex={isDisabled ? -1 : 0}
              role="checkbox"
              aria-checked={isSelected}
              aria-disabled={isDisabled}
              onMouseEnter={(e) => {
                if (!isDisabled && !isSelected) {
                  e.currentTarget.style.borderColor = 'var(--primary-button)';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isDisabled && !isSelected) {
                  e.currentTarget.style.borderColor = 'var(--medium-gray)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.05)';
                }
              }}
            >
              {/* Custom Checkbox */}
              <div style={isSelected ? checkboxCheckedStyles : checkboxStyles}>
                {isSelected && <div style={checkmarkStyles}>✓</div>}
              </div>

              {/* Icon */}
              {option.icon && <div style={iconStyles}>{option.icon}</div>}

              {/* Content */}
              <div style={contentStyles}>
                <div style={labelStyles}>{displayLabel}</div>
                {option.description && <div style={descriptionStyles}>{option.description}</div>}
              </div>
            </div>
          );
        })}
      </div>

      {/* Other text input - shown when OTHERS is selected */}
      {showOtherInput && allowOther && (
        <div style={{ marginTop: '1rem' }}>
          <input
            type="text"
            placeholder={otherPlaceholder}
            value={otherTextValue}
            onChange={(e) => {
              if (onOtherTextChange) {
                onOtherTextChange(e.target.value);
              }
            }}
            disabled={disabled}
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              border: '2px solid var(--medium-gray)',
              borderRadius: '8px',
              fontSize: '1rem',
              outline: 'none',
              transition: 'border-color 0.2s',
              backgroundColor: 'var(--light)',
              color: 'var(--text-primary)',
            }}
            onFocus={(e) => {
              e.target.style.borderColor = 'var(--primary-button)';
              e.target.style.boxShadow = '0 0 0 3px rgba(95, 203, 196, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'var(--medium-gray)';
              e.target.style.boxShadow = 'none';
            }}
          />
        </div>
      )}

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
