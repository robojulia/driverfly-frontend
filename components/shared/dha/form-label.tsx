import React from 'react';

interface FormLabelProps {
  children: React.ReactNode;
  required?: boolean;
  htmlFor?: string;
  className?: string;
  style?: React.CSSProperties;
  variant?: 'default' | 'bold' | 'subtitle';
}

export const FormLabel: React.FC<FormLabelProps> = ({
  children,
  required = false,
  htmlFor,
  className = '',
  style = {},
  variant = 'default',
}) => {
  const getVariantStyles = (variant: string): React.CSSProperties => {
    switch (variant) {
      case 'bold':
        return {
          fontWeight: '700',
          fontSize: '1rem',
          color: '#1a2b3c',
        };
      case 'subtitle':
        return {
          fontWeight: '500',
          fontSize: '0.875rem',
          color: '#667788',
        };
      default: // default
        return {
          fontWeight: '600',
          fontSize: '0.9375rem',
          color: '#1a2b3c',
        };
    }
  };

  const baseStyles: React.CSSProperties = {
    marginBottom: '0.5rem',
    display: 'block',
    ...getVariantStyles(variant),
  };

  const combinedStyles = {
    ...baseStyles,
    ...style,
  };

  const requiredStyles: React.CSSProperties = {
    color: '#e74c3c',
    marginLeft: '0.25rem',
  };

  return (
    <label htmlFor={htmlFor} className={className} style={combinedStyles}>
      {children}
      {required && <span style={requiredStyles}>*</span>}
    </label>
  );
};
