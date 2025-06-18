import React from 'react';
import { FormLabel } from './form-label';
import { useTranslation } from '../../../hooks/use-translation';

interface RadioOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
  description?: string;
  disabled?: boolean;
}

interface RadioGroupProps {
  name: string;
  label?: string;
  options?: RadioOption[];
  value?: string;
  onChange?: (value: string) => void;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  helperText?: string;
  className?: string;
  variant?: 'default' | 'card' | 'compact';
  columns?: 1 | 2 | 3 | 4;
  labelPrefix?: string;
  enumType?: object;
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
  name,
  label,
  options: propOptions,
  value,
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
}) => {
  const { t } = useTranslation();

  // Generate options from enum if provided
  const options = React.useMemo(() => {
    if (enumType && !propOptions) {
      return Object.values(enumType).map(
        (enumValue): RadioOption => ({
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

  // Helper function to get translated label
  const getTranslatedLabel = (option: RadioOption) => {
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
        borderColor: 'var(--primary)',
        backgroundColor: 'var(--primary-light)',
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

  const radioStyles: React.CSSProperties = {
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    border: '2px solid',
    borderColor: value === undefined ? 'var(--medium-gray)' : 'var(--primary)',
    backgroundColor: 'var(--light)',
    position: 'relative',
    flexShrink: 0,
  };

  const radioCheckedStyles: React.CSSProperties = {
    ...radioStyles,
    borderColor: 'var(--primary)',
  };

  const radioDotStyles: React.CSSProperties = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: 'var(--primary)',
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
    if (onChange) onChange(optionValue);
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

      <div
        style={gridStyles}
        role="radiogroup"
        aria-labelledby={label ? `${name}-label` : undefined}
      >
        {options.map((option) => {
          const isSelected = value === option.value;
          const isDisabled = disabled || option.disabled;
          const displayLabel = getTranslatedLabel(option);

          return (
            <div
              key={option.value}
              style={getOptionStyles(isSelected, isDisabled)}
              onClick={() => handleOptionClick(option.value)}
              onKeyDown={(e) => handleKeyDown(e, option.value)}
              tabIndex={isDisabled ? -1 : 0}
              role="radio"
              aria-checked={isSelected}
              aria-disabled={isDisabled}
              onMouseEnter={(e) => {
                if (!isDisabled && !isSelected) {
                  e.currentTarget.style.borderColor = 'var(--primary)';
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
              {/* Custom Radio Button */}
              <div style={isSelected ? radioCheckedStyles : radioStyles}>
                {isSelected && <div style={radioDotStyles} />}
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
