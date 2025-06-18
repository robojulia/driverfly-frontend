import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  className?: string;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  className = '',
  fullWidth = false,
}) => {
  const getVariantStyles = (variant: string) => {
    const baseStyles = {
      border: '2px solid',
      borderRadius: '8px',
      fontWeight: '600',
      cursor: disabled || loading ? 'not-allowed' : 'pointer',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      outline: 'none',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem',
      textDecoration: 'none',
      opacity: disabled || loading ? 0.6 : 1,
    };

    switch (variant) {
      case 'secondary':
        return {
          ...baseStyles,
          backgroundColor: 'var(--text-secondary)',
          borderColor: 'var(--text-secondary)',
          color: 'var(--text-light)',
        };
      case 'outline':
        return {
          ...baseStyles,
          backgroundColor: 'transparent',
          borderColor: 'var(--primary)',
          color: 'var(--primary)',
        };
      case 'danger':
        return {
          ...baseStyles,
          backgroundColor: 'var(--danger)',
          borderColor: 'var(--danger)',
          color: 'var(--text-light)',
        };
      case 'success':
        return {
          ...baseStyles,
          backgroundColor: 'var(--success)',
          borderColor: 'var(--success)',
          color: 'var(--text-dark)',
        };
      default: // primary
        return {
          ...baseStyles,
          backgroundColor: 'var(--primary)',
          borderColor: 'var(--primary)',
          color: 'var(--text-light)',
        };
    }
  };

  const getSizeStyles = (size: string) => {
    switch (size) {
      case 'sm':
        return {
          padding: '0.5rem 1rem',
          fontSize: '0.875rem',
          minHeight: '36px',
        };
      case 'lg':
        return {
          padding: '1rem 1.5rem',
          fontSize: '1.125rem',
          minHeight: '52px',
        };
      default: // md
        return {
          padding: '0.75rem 1.25rem',
          fontSize: '1rem',
          minHeight: '44px',
        };
    }
  };

  const buttonStyles: React.CSSProperties = {
    ...getVariantStyles(variant),
    ...getSizeStyles(size),
    width: fullWidth ? '100%' : 'auto',
  };

  const getHoverStyles = (variant: string): React.CSSProperties => {
    if (disabled || loading) return {};

    switch (variant) {
      case 'secondary':
        return {
          transform: 'translateY(-1px)',
          boxShadow: '0 4px 12px rgba(102, 117, 125, 0.2)',
        };
      case 'outline':
        return {
          backgroundColor: 'var(--primary)',
          color: 'var(--text-light)',
          transform: 'translateY(-1px)',
          boxShadow: '0 4px 12px rgba(95, 203, 196, 0.2)',
        };
      case 'danger':
        return {
          transform: 'translateY(-1px)',
          boxShadow: '0 4px 12px rgba(231, 76, 60, 0.2)',
        };
      case 'success':
        return {
          transform: 'translateY(-1px)',
          boxShadow: '0 4px 12px rgba(135, 249, 52, 0.2)',
        };
      default: // primary
        return {
          transform: 'translateY(-1px)',
          boxShadow: '0 4px 12px rgba(95, 203, 196, 0.2)',
        };
    }
  };

  const activeStyles: React.CSSProperties = {
    transform: disabled || loading ? 'none' : 'translateY(0)',
    boxShadow: disabled || loading ? 'none' : '0 2px 4px rgba(95, 203, 196, 0.2)',
  };

  const loadingSpinnerStyles: React.CSSProperties = {
    width: '16px',
    height: '16px',
    border: '2px solid transparent',
    borderTop: '2px solid currentColor',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  };

  return (
    <>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
      <button
        type={type}
        onClick={onClick}
        disabled={disabled || loading}
        style={buttonStyles}
        className={className}
        onMouseEnter={(e) => {
          if (!disabled && !loading) {
            Object.assign(e.currentTarget.style, getHoverStyles(variant));
          }
        }}
        onMouseLeave={(e) => {
          if (!disabled && !loading) {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
            if (variant === 'outline') {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = 'var(--primary)';
            }
          }
        }}
        onMouseDown={(e) => {
          if (!disabled && !loading) {
            Object.assign(e.currentTarget.style, activeStyles);
          }
        }}
        onMouseUp={(e) => {
          if (!disabled && !loading) {
            Object.assign(e.currentTarget.style, getHoverStyles(variant));
          }
        }}
      >
        {loading && <div style={loadingSpinnerStyles} />}
        {!loading && icon && iconPosition === 'left' && icon}
        {children}
        {!loading && icon && iconPosition === 'right' && icon}
      </button>
    </>
  );
};
