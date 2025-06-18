import React from 'react';
import { useTranslation } from '../../hooks/use-translation';

interface DataViewToggleProps {
  primaryLabel: string;
  secondaryLabel: string;
  activeView: string;
  onViewChange: (view: string) => void;
  primaryValue: string;
  secondaryValue: string;
  primaryIcon?: React.ReactNode;
  secondaryIcon?: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'pills' | 'tabs';
  showCounts?: boolean;
  primaryCount?: number;
  secondaryCount?: number;
}

export const DataViewToggle: React.FC<DataViewToggleProps> = ({
  primaryLabel,
  secondaryLabel,
  activeView,
  onViewChange,
  primaryValue,
  secondaryValue,
  primaryIcon,
  secondaryIcon,
  className = '',
  size = 'md',
  variant = 'pills',
  showCounts = false,
  primaryCount,
  secondaryCount,
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
            borderBottomColor: 'var(--primary-button)',
            color: 'var(--primary-button)',
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
            backgroundColor: 'var(--primary-button)',
            borderColor: 'var(--primary-button)',
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
            backgroundColor: 'var(--primary-button)',
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

  const countBadgeStyles: React.CSSProperties = {
    marginLeft: '0.375rem',
    backgroundColor:
      activeView === primaryValue ? 'rgba(255, 255, 255, 0.2)' : 'var(--primary-button)',
    color: activeView === primaryValue ? 'var(--text-light)' : 'var(--text-light)',
    borderRadius: '10px',
    padding: '0.125rem 0.375rem',
    fontSize: size === 'sm' ? '0.75rem' : '0.8125rem',
    fontWeight: '600',
    minWidth: '20px',
    textAlign: 'center',
    lineHeight: 1,
  };

  const handleViewChange = (view: string) => {
    if (view !== activeView) {
      onViewChange(view);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, view: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleViewChange(view);
    }
  };

  return (
    <div style={containerStyles} className={className} role="tablist">
      <button
        style={getButtonStyles(activeView === primaryValue)}
        onClick={() => handleViewChange(primaryValue)}
        onKeyDown={(e) => handleKeyDown(e, primaryValue)}
        onMouseEnter={(e) => {
          if (activeView !== primaryValue && variant !== 'tabs') {
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
          }
        }}
        onMouseLeave={(e) => {
          if (activeView !== primaryValue && variant !== 'tabs') {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }
        }}
        role="tab"
        aria-selected={activeView === primaryValue}
        aria-controls={`${primaryValue}-panel`}
        tabIndex={0}
      >
        {primaryIcon && <span>{primaryIcon}</span>}
        <span>{t(primaryLabel)}</span>
        {showCounts && primaryCount !== undefined && (
          <span
            style={{
              ...countBadgeStyles,
              backgroundColor:
                activeView === primaryValue ? 'rgba(255, 255, 255, 0.2)' : 'var(--primary-button)',
            }}
          >
            {primaryCount}
          </span>
        )}
      </button>

      <button
        style={getButtonStyles(activeView === secondaryValue)}
        onClick={() => handleViewChange(secondaryValue)}
        onKeyDown={(e) => handleKeyDown(e, secondaryValue)}
        onMouseEnter={(e) => {
          if (activeView !== secondaryValue && variant !== 'tabs') {
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
          }
        }}
        onMouseLeave={(e) => {
          if (activeView !== secondaryValue && variant !== 'tabs') {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }
        }}
        role="tab"
        aria-selected={activeView === secondaryValue}
        aria-controls={`${secondaryValue}-panel`}
        tabIndex={0}
      >
        {secondaryIcon && <span>{secondaryIcon}</span>}
        <span>{t(secondaryLabel)}</span>
        {showCounts && secondaryCount !== undefined && (
          <span
            style={{
              ...countBadgeStyles,
              backgroundColor:
                activeView === secondaryValue
                  ? 'rgba(255, 255, 255, 0.2)'
                  : 'var(--primary-button)',
            }}
          >
            {secondaryCount}
          </span>
        )}
      </button>
    </div>
  );
};

export default DataViewToggle;
