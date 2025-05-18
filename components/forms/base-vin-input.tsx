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
    // Format as groups of 4 for better readability (optional)
    return vin.replace(/(.{4})/g, '$1 ').trim();
  };

  return (
    <BaseInput
      className={className}
      label={label || 'VIN'}
      name={name}
      required={required}
      placeholder={placeholder || 'Enter 17-character VIN'}
      maxLength={17}
      value={formik.values[name] || ''}
      onChange={handleVinChange}
      onBlur={formik.handleBlur}
      error={formik.touched[name] && formik.errors[name] ? String(formik.errors[name]) : undefined}
    />
  );
}
