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
          backgroundColor: '#6c757d',
          borderColor: '#6c757d',
          color: '#ffffff',
        };
      case 'outline':
        return {
          ...baseStyles,
          backgroundColor: 'transparent',
          borderColor: '#0073b1',
          color: '#0073b1',
        };
      case 'danger':
        return {
          ...baseStyles,
          backgroundColor: '#e74c3c',
          borderColor: '#e74c3c',
          color: '#ffffff',
        };
      case 'success':
        return {
          ...baseStyles,
          backgroundColor: '#28a745',
          borderColor: '#28a745',
          color: '#ffffff',
        };
      default: // primary
        return {
          ...baseStyles,
          backgroundColor: '#0073b1',
          borderColor: '#0073b1',
          color: '#ffffff',
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

  const hoverStyles: React.CSSProperties = {
    transform: disabled || loading ? 'none' : 'translateY(-1px)',
    boxShadow: disabled || loading ? 'none' : '0 4px 12px rgba(0, 115, 177, 0.2)',
  };

  const activeStyles: React.CSSProperties = {
    transform: disabled || loading ? 'none' : 'translateY(0)',
    boxShadow: disabled || loading ? 'none' : '0 2px 4px rgba(0, 115, 177, 0.2)',
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
            Object.assign(e.currentTarget.style, hoverStyles);
          }
        }}
        onMouseLeave={(e) => {
          if (!disabled && !loading) {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }
        }}
        onMouseDown={(e) => {
          if (!disabled && !loading) {
            Object.assign(e.currentTarget.style, activeStyles);
          }
        }}
        onMouseUp={(e) => {
          if (!disabled && !loading) {
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 115, 177, 0.2)';
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
