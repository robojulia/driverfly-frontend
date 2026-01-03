import React from 'react';
import { useTranslation } from '../../hooks/use-translation';

export interface ToggleOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
  count?: number;
}

interface MultiOptionToggleProps {
  options: ToggleOption[];
  activeOption: string;
  onOptionChange: (value: string) => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'pills' | 'tabs';
  showCounts?: boolean;
}

export const MultiOptionToggle: React.FC<MultiOptionToggleProps> = ({
  options,
  activeOption,
  onOptionChange,
  className = '',
  size = 'md',
  variant = 'pills',
  showCounts = false,
}) => {
  const { t } = useTranslation();

  const getSizeStyles = (size: string) => {
    switch (size) {
      case 'sm':
        return {
          padding: '0.5rem 1rem',
          fontSize: '0.875rem',
          gap: '0.25rem',
        };
      case 'lg':
        return {
          padding: '0.875rem 1.5rem',
          fontSize: '1.125rem',
          gap: '0.5rem',
        };
      default: // md
        return {
          padding: '0.75rem 1.25rem',
          fontSize: '1rem',
          gap: '0.375rem',
        };
    }
  };

  const getVariantStyles = (variant: string) => {
    const sizeStyles = getSizeStyles(size);

    switch (variant) {
      case 'tabs':
        return {
          container: {
            display: 'flex',
            borderBottom: '2px solid var(--medium-gray)',
            marginBottom: '1rem',
          },
          button: {
            ...sizeStyles,
            backgroundColor: 'transparent',
            border: 'none',
            borderBottom: '3px solid transparent',
            borderRadius: '0',
            cursor: 'pointer',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            fontWeight: '500',
            display: 'flex',
            alignItems: 'center',
            gap: sizeStyles.gap,
            marginRight: '0.5rem',
          },
          active: {
            borderBottomColor: 'var(--primary-dark)',
            color: 'var(--primary-dark)',
            fontWeight: '600',
          },
          inactive: {
            color: 'var(--text-secondary)',
          },
        };
      case 'default':
        return {
          container: {
            display: 'flex',
            gap: '0.5rem',
            alignItems: 'center',
          },
          button: {
            ...sizeStyles,
            backgroundColor: 'transparent',
            border: '2px solid var(--medium-gray)',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            fontWeight: '500',
            display: 'flex',
            alignItems: 'center',
            gap: sizeStyles.gap,
          },
          active: {
            backgroundColor: 'var(--primary-dark)',
            borderColor: 'var(--primary-dark)',
            color: 'var(--text-light)',
            transform: 'translateY(-1px)',
            boxShadow: '0 4px 8px rgba(95, 203, 196, 0.2)',
          },
          inactive: {
            backgroundColor: 'var(--light)',
            borderColor: 'var(--medium-gray)',
            color: 'var(--text-secondary)',
          },
        };
      default: // pills
        return {
          container: {
            display: 'inline-flex',
            padding: '4px',
            backgroundColor: 'var(--form-info-bg)',
            borderRadius: '12px',
            border: '1px solid var(--medium-gray)',
          },
          button: {
            ...sizeStyles,
            backgroundColor: 'transparent',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            fontWeight: '500',
            display: 'flex',
            alignItems: 'center',
            gap: sizeStyles.gap,
            minWidth: size === 'sm' ? '80px' : size === 'lg' ? '120px' : '100px',
            justifyContent: 'center',
          },
          active: {
            backgroundColor: 'var(--primary-dark)',
            color: 'var(--text-light)',
            boxShadow: '0 2px 4px rgba(95, 203, 196, 0.3)',
            transform: 'translateY(-1px)',
          },
          inactive: {
            color: 'var(--text-secondary)',
          },
        };
    }
  };

  const styles = getVariantStyles(variant);

  const containerStyles: React.CSSProperties = {
    ...styles.container,
    userSelect: 'none',
  };

  const getButtonStyles = (isActive: boolean): React.CSSProperties => ({
    ...styles.button,
    ...(isActive ? styles.active : styles.inactive),
  });

  const getCountBadgeStyles = (isActive: boolean): React.CSSProperties => ({
    marginLeft: '0.375rem',
    backgroundColor: isActive ? 'rgba(255, 255, 255, 0.2)' : 'var(--primary-button)',
    color: 'var(--text-light)',
    borderRadius: '10px',
    padding: '0.125rem 0.375rem',
    fontSize: size === 'sm' ? '0.75rem' : '0.8125rem',
    fontWeight: '600',
    minWidth: '20px',
    textAlign: 'center',
    lineHeight: 1,
  });

  const handleOptionChange = (value: string) => {
    if (value !== activeOption) {
      onOptionChange(value);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, value: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleOptionChange(value);
    }
  };

  return (
    <div style={containerStyles} className={className} role="tablist">
      {options.map((option) => {
        const isActive = activeOption === option.value;

        return (
          <button
            key={option.value}
            style={getButtonStyles(isActive)}
            onClick={() => handleOptionChange(option.value)}
            onKeyDown={(e) => handleKeyDown(e, option.value)}
            onMouseEnter={(e) => {
              if (!isActive && variant !== 'tabs') {
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive && variant !== 'tabs') {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }
            }}
            role="tab"
            aria-selected={isActive}
            aria-controls={`${option.value}-panel`}
            tabIndex={0}
          >
            {option.icon && <span>{option.icon}</span>}
            <span>{t(option.label)}</span>
            {showCounts && option.count !== undefined && (
              <span style={getCountBadgeStyles(isActive)}>{option.count}</span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default MultiOptionToggle;
