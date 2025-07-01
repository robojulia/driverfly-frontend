import React from 'react';
import { XLg } from 'react-bootstrap-icons';

interface BannerProps {
  message: string;
  variant?: 'info' | 'success' | 'warning' | 'error';
  onDismiss?: () => void;
  dismissible?: boolean;
}

export const Banner: React.FC<BannerProps> = ({
  message,
  variant = 'error',
  onDismiss,
  dismissible = true,
}) => {
  const getVariantStyles = (variant: string) => {
    switch (variant) {
      case 'success':
        return {
          backgroundColor: '#d1e7dd',
          borderColor: '#badbcc',
          color: '#0f5132',
          iconColor: '#0f5132',
        };
      case 'warning':
        return {
          backgroundColor: '#fff3cd',
          borderColor: '#ffecb5',
          color: '#664d03',
          iconColor: '#664d03',
        };
      case 'info':
        return {
          backgroundColor: '#d1ecf1',
          borderColor: '#bee5eb',
          color: '#055160',
          iconColor: '#055160',
        };
      default: // error
        return {
          backgroundColor: '#f8d7da',
          borderColor: '#f5c6cb',
          color: '#721c24',
          iconColor: '#721c24',
        };
    }
  };

  const styles = getVariantStyles(variant);

  const bannerStyle = {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    padding: '1rem 1.25rem',
    marginBottom: '1.5rem',
    backgroundColor: styles.backgroundColor,
    border: `1px solid ${styles.borderColor}`,
    borderRadius: '8px',
    color: styles.color,
    fontSize: '0.95rem',
    lineHeight: '1.5',
  };

  const iconStyle = {
    marginRight: '0.75rem',
    flexShrink: 0,
    marginTop: '0.125rem',
  };

  const contentStyle = {
    flex: 1,
    margin: 0,
  };

  const dismissButtonStyle = {
    background: 'none',
    border: 'none',
    color: styles.iconColor,
    cursor: 'pointer',
    padding: '0.25rem',
    marginLeft: '1rem',
    flexShrink: 0,
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background-color 0.15s ease-in-out',
  };

  const getIcon = (variant: string) => {
    switch (variant) {
      case 'success':
        return '✓';
      case 'warning':
        return '⚠';
      case 'info':
        return 'ℹ';
      default: // error
        return '✗';
    }
  };

  return (
    <div style={bannerStyle} role="alert" aria-live="polite">
      <div style={iconStyle}>
        <span style={{ fontSize: '1.1rem', color: styles.iconColor }}>{getIcon(variant)}</span>
      </div>
      <div style={contentStyle}>{message}</div>
      {dismissible && onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          style={dismissButtonStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
          aria-label="Dismiss"
        >
          <XLg size={16} />
        </button>
      )}
    </div>
  );
};
