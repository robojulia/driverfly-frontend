import React, { useState, useEffect } from 'react';
import styles from '../../../styles/digitalhiringapp.module.css';
import { useTranslation } from '../../../hooks/use-translation';

interface PrimaryButtonProps {
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const enhancedButtonStyles: React.CSSProperties = {
  background: 'linear-gradient(135deg, #0073b1 0%, #005582 100%)',
  border: 'none',
  borderRadius: '12px',
  padding: '1rem 1.5rem',
  fontWeight: '700',
  fontSize: '1rem',
  minHeight: '48px',
  boxShadow: '0 4px 12px rgba(0, 115, 177, 0.2)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  color: 'white',
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center' as const,
  textDecoration: 'none',
  position: 'relative' as const,
  overflow: 'hidden',
  minWidth: '150px',
};

const secondaryButtonStyles: React.CSSProperties = {
  background: '#ffffff',
  color: '#333333',
  border: '2px solid #e0e5eb',
  borderRadius: '12px',
  padding: '1rem 1.5rem',
  fontWeight: '600',
  fontSize: '1rem',
  minHeight: '48px',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center' as const,
  textDecoration: 'none',
  minWidth: '150px',
};

const disabledButtonStyles: React.CSSProperties = {
  opacity: 0.6,
  cursor: 'not-allowed',
  background: '#e0e5eb',
  color: '#667788',
  transform: 'none',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
};

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  onClick,
  type = 'button',
  disabled = false,
  children,
  className = '',
  style = {},
}) => {
  const buttonStyle = {
    ...enhancedButtonStyles,
    ...(disabled ? disabledButtonStyles : {}),
    ...style,
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled) {
      e.currentTarget.style.background = 'linear-gradient(135deg, #005582 0%, #004466 100%)';
      e.currentTarget.style.transform = 'translateY(-2px)';
      e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 115, 177, 0.3)';
    }
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled) {
      e.currentTarget.style.background = 'linear-gradient(135deg, #0073b1 0%, #005582 100%)';
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 115, 177, 0.2)';
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled) {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 115, 177, 0.3)';
    }
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled) {
      e.currentTarget.style.transform = 'translateY(-2px)';
      e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 115, 177, 0.3)';
    }
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={className}
      style={buttonStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      {children}
    </button>
  );
};

export const SecondaryButton: React.FC<PrimaryButtonProps> = ({
  onClick,
  type = 'button',
  disabled = false,
  children,
  className = '',
  style = {},
}) => {
  const buttonStyle = {
    ...secondaryButtonStyles,
    ...(disabled ? disabledButtonStyles : {}),
    ...style,
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled) {
      e.currentTarget.style.background = '#f5f7fa';
      e.currentTarget.style.borderColor = '#667788';
      e.currentTarget.style.transform = 'translateY(-2px)';
      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.12)';
    }
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled) {
      e.currentTarget.style.background = '#ffffff';
      e.currentTarget.style.borderColor = '#e0e5eb';
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.08)';
    }
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={className}
      style={buttonStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </button>
  );
};

interface FormActionsProps {
  onNext?: () => void;
  onBack?: () => void;
  isSubmitting?: boolean;
  isValid?: boolean;
  showBackButton?: boolean;
  nextButtonText?: React.ReactNode;
  backButtonText?: React.ReactNode;
}

export const FormActions: React.FC<FormActionsProps> = ({
  onNext,
  onBack,
  isSubmitting = false,
  isValid = true,
  showBackButton = true,
  nextButtonText,
  backButtonText,
}) => {
  const { t } = useTranslation();
  const isMobile = useIsMobile();

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '1rem',
    marginTop: '2rem',
    paddingTop: '2rem',
    borderTop: '1px solid #e0e5eb',
  };

  const mobileContainerStyle: React.CSSProperties = {
    ...containerStyle,
    flexDirection: 'column-reverse',
    gap: '1rem',
  };

  return (
    <div style={isMobile ? mobileContainerStyle : containerStyle}>
      {showBackButton && (
        <SecondaryButton type="reset" onClick={onBack} style={isMobile ? { width: '100%' } : {}}>
          {backButtonText || t('BACK')}
        </SecondaryButton>
      )}
      <PrimaryButton
        type="submit"
        disabled={isSubmitting || !isValid}
        onClick={onNext}
        style={isMobile ? { width: '100%' } : {}}
      >
        {nextButtonText || t('NEXT')}
      </PrimaryButton>
    </div>
  );
};

// Simple hook for mobile detection
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);

    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  return isMobile;
};
