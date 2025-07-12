import React, { useState, useEffect, useContext } from 'react';
import styles from '../../../styles/digitalhiringapp.module.css';
import { useTranslation } from '../../../hooks/use-translation';
import JotformContext, { JotFormContextType } from '../../../context/jotform-context';

interface PrimaryButtonProps {
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const enhancedButtonStyles: React.CSSProperties = {
  background: 'linear-gradient(135deg, var(--primary-brand) 0%, var(--primary-dark) 100%)',
  border: 'none',
  borderRadius: '12px',
  padding: '1rem 1.5rem',
  fontWeight: '700',
  fontSize: '1rem',
  minHeight: '48px',
  boxShadow: '0 4px 12px rgba(95, 203, 196, 0.2)',
  color: 'var(--text-light)',
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
  background: 'var(--light)',
  color: 'var(--text-dark)',
  border: '2px solid var(--medium-gray)',
  borderRadius: '12px',
  padding: '1rem 1.5rem',
  fontWeight: '600',
  fontSize: '1rem',
  minHeight: '48px',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
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
  background: 'var(--medium-gray)',
  color: 'var(--text-secondary)',
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

  const combinedClassName = `${styles.formButton} ${className}`.trim();

  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled) {
      e.currentTarget.style.background =
        'linear-gradient(135deg, var(--primary-dark) 0%, var(--sidebar-submenu-bg) 100%)';
      e.currentTarget.style.boxShadow = '0 6px 20px rgba(95, 203, 196, 0.3)';
    }
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled) {
      e.currentTarget.style.background =
        'linear-gradient(135deg, var(--primary-brand) 0%, var(--primary-dark) 100%)';
      e.currentTarget.style.boxShadow = '0 4px 12px rgba(95, 203, 196, 0.2)';
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled) {
      e.currentTarget.style.boxShadow = '0 2px 8px rgba(95, 203, 196, 0.3)';
    }
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled) {
      e.currentTarget.style.boxShadow = '0 6px 20px rgba(95, 203, 196, 0.3)';
    }
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={combinedClassName}
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

  const combinedClassName = `${styles.secondaryButton} ${className}`.trim();

  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled) {
      e.currentTarget.style.background = 'var(--form-hover-bg)';
      e.currentTarget.style.borderColor = 'var(--text-secondary)';
      e.currentTarget.style.transform = 'translateY(-2px)';
      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.12)';
    }
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled) {
      e.currentTarget.style.background = 'var(--light)';
      e.currentTarget.style.borderColor = 'var(--medium-gray)';
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.08)';
    }
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={combinedClassName}
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
    borderTop: '1px solid var(--medium-gray)',
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
