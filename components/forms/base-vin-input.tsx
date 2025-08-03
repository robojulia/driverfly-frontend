import React from 'react';
import { FormikProps } from 'formik';
import BaseInput from './base-input';

interface BaseVinInputProps {
  className?: string;
  label?: string;
  name: string;
  placeholder?: string;
  required?: boolean;
  formik: FormikProps<any>;
}

export default function BaseVinInput({
  className,
  label,
  name,
  placeholder,
  required,
  formik,
}: BaseVinInputProps) {
  const handleVinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Remove any non-alphanumeric characters and convert to uppercase
    let value = e.target.value.replace(/[^A-Za-z0-9]/g, '').toUpperCase();

    // Replace commonly confused characters
    value = value.replace(/[IOQ]/g, (match) => {
      switch (match) {
        case 'I':
          return '1';
        case 'O':
          return '0';
        case 'Q':
          return '0';
        default:
          return match;
      }
    });

    // Limit to 17 characters
    value = value.slice(0, 17);

    formik.setFieldValue(name, value);
  };

  const formatVinDisplay = (vin: string) => {
    if (!vin) return '';
    // Format as groups of 4 for better readability (optional)
    return vin.replace(/(.{4})/g, '$1 ').trim();
  };

  const getVinValidationMessage = (vin: string) => {
    if (!vin) return '';
    if (vin.length < 17) {
      return 'VIN must be 17 characters long';
    }
    return '';
  };

  const currentValue = formik.values[name] || '';
  const validationMessage = getVinValidationMessage(currentValue);

  return (
    <BaseInput
      className={className}
      label={label || 'VIN'}
      name={name}
      required={required}
      placeholder={placeholder || 'Enter 17-character VIN'}
      maxLength={17}
      value={currentValue}
      onChange={handleVinChange}
      onBlur={formik.handleBlur}
      error={
        formik.touched[name] && (formik.errors[name] || validationMessage)
          ? String(formik.errors[name] || validationMessage)
          : undefined
      }
      helpText={currentValue.length > 0 && currentValue.length < 17 ? 
        `VIN should be 17 characters (currently ${currentValue.length})` : 
        undefined
      }
    />
  );
}
