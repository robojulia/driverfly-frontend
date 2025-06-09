import React from 'react';
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
}) => {
  const { t } = useTranslation();

  // Responsive hook to detect screen size
  const [screenWidth, setScreenWidth] = React.useState(
    typeof window !== 'undefined' ? window.innerWidth : 1024
  );

  React.useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Determine responsive values based on screen width
  const isMobile = screenWidth <= 576;
  const isSmallMobile = screenWidth <= 480;
  const responsiveColumns = isMobile ? 1 : columns;

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

  // Helper function to get translated label
  const getTranslatedLabel = (option: CheckboxOption) => {
    if (labelPrefix) {
      return t(`${labelPrefix}.${option.label}`);
    }
    return t(option.label);
  };

  const getVariantStyles = (variant: string) => {
    const baseStyles = (() => {
      switch (variant) {
        case 'compact':
          return {
            padding: '0.5rem 0.75rem',
            fontSize: '0.8rem',
            minHeight: '40px',
          };
        case 'default':
          return {
            padding: '0.75rem 1rem',
            fontSize: '0.875rem',
            minHeight: '48px',
          };
        default: // card
          return {
            padding: '0.875rem 1rem',
            fontSize: '0.875rem',
            minHeight: '52px',
          };
      }
    })();

    // Apply mobile overrides
    if (isSmallMobile) {
      return {
        ...baseStyles,
        padding: '0.425rem 0.625rem',
        fontSize: '0.75rem',
        minHeight: '36px',
      };
    } else if (isMobile) {
      return {
        ...baseStyles,
        padding: '0.5rem 0.75rem',
        fontSize: '0.8rem',
        minHeight: '40px',
      };
    }

    return baseStyles;
  };

  const containerStyles: React.CSSProperties = {
    position: 'relative',
    width: '100%',
    marginBottom: '1rem',
  };

  const gridStyles: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: `repeat(${responsiveColumns}, 1fr)`,
    gap: isSmallMobile ? '0.3rem' : isMobile ? '0.375rem' : '0.5rem',
    marginTop: '0.5rem',
  };

  const getOptionStyles = (isSelected: boolean, isDisabled: boolean): React.CSSProperties => {
    const baseStyles = {
      ...getVariantStyles(variant),
      border: '1.5px solid',
      borderRadius: '6px',
      cursor: isDisabled ? 'not-allowed' : 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: isSmallMobile ? '0.3rem' : isMobile ? '0.375rem' : '0.5rem',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      backgroundColor: '#ffffff',
      position: 'relative' as const,
      userSelect: 'none' as const,
      opacity: isDisabled ? 0.6 : 1,
    };

    if (error) {
      return {
        ...baseStyles,
        borderColor: '#e74c3c',
        boxShadow: '0 0 0 3px rgba(231, 76, 60, 0.1)',
      };
    }

    if (isSelected) {
      return {
        ...baseStyles,
        borderColor: '#0073b1',
        backgroundColor: '#f0f9ff',
        boxShadow: '0 0 0 3px rgba(0, 115, 177, 0.1)',
        transform: 'translateY(-1px)',
      };
    }

    return {
      ...baseStyles,
      borderColor: '#e0e5eb',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
    };
  };

  const checkboxStyles: React.CSSProperties = {
    width: isSmallMobile ? '14px' : isMobile ? '16px' : '18px',
    height: isSmallMobile ? '14px' : isMobile ? '16px' : '18px',
    borderRadius: '3px',
    border: '1.5px solid',
    borderColor: '#e0e5eb',
    backgroundColor: '#ffffff',
    position: 'relative',
    flexShrink: 0,
  };

  const checkboxCheckedStyles: React.CSSProperties = {
    ...checkboxStyles,
    borderColor: '#0073b1',
    backgroundColor: '#0073b1',
  };

  const checkmarkStyles: React.CSSProperties = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    color: '#ffffff',
    fontSize: isSmallMobile ? '8px' : isMobile ? '9px' : '10px',
    fontWeight: 'bold',
  };

  const contentStyles: React.CSSProperties = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '0.125rem',
    minWidth: 0, // Allow text to wrap properly
  };

  const labelStyles: React.CSSProperties = {
    fontWeight: '600',
    color: '#1a2b3c',
    margin: 0,
    lineHeight: '1.3',
    wordBreak: 'break-word',
  };

  const descriptionStyles: React.CSSProperties = {
    fontSize: '0.75rem',
    color: '#667788',
    margin: 0,
    lineHeight: '1.2',
    wordBreak: 'break-word',
  };

  const iconStyles: React.CSSProperties = {
    fontSize: '1.5rem',
    flexShrink: 0,
  };

  const errorStyles: React.CSSProperties = {
    color: '#e74c3c',
    fontSize: '0.875rem',
    marginTop: '0.25rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem',
  };

  const helperTextStyles: React.CSSProperties = {
    color: '#667788',
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
                  e.currentTarget.style.borderColor = '#0073b1';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isDisabled && !isSelected) {
                  e.currentTarget.style.borderColor = '#e0e5eb';
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
