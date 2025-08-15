import React from 'react';
import { useTranslation } from '../../hooks/use-translation';

import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import BaseControl, { BaseControlProps } from './base-control';
import { grey } from '@mui/material/colors';

export interface BaseInputPhoneProps
  extends BaseControlProps,
    React.InputHTMLAttributes<HTMLInputElement> {
  handleBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  placeholder?: string;
  displayPlaceholder?: string | boolean;
  value?: any;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  readOnly?: boolean;
}

function BaseInputPhone({
  formik,
  required,
  className,
  label,
  handleBlur,
  placeholder,
  displayPlaceholder,
  value,
  onChange,
  onKeyDown,
  readOnly,
  name,
  error,
  touched,
  append,
  prepend,
}: BaseInputPhoneProps) {
  const { t } = useTranslation();

  if (formik) {
    const meta = formik.getFieldMeta(name);

    if (meta) {
      value = meta.value;
      touched = meta.touched;
      error = meta.error;
    }
    onChange = onChange || formik.handleChange;
    handleBlur = handleBlur || formik.handleBlur;
  }

  function onChangeProxy(
    value: string,
    country: string,
    e: React.ChangeEvent<HTMLInputElement>,
    formattedValue: string
  ) {
    if (onChange)
      onChange({
        ...e,
        target: {
          ...e.target,
          name: name,
          value: formattedValue,
        },
      });
  }

  const PHONE_INPUT_COUNTRY_ALLOWED = process?.env?.NEXT_PUBLIC_PHONE_INPUT_COUNTRY_ALLOWED?.split(',');
  const onlyCountries = Array.isArray(PHONE_INPUT_COUNTRY_ALLOWED)
    ? PHONE_INPUT_COUNTRY_ALLOWED
    : ['us'];

  return (
    <BaseControl
      className={className}
      name={name}
      label={label}
      required={required}
      formik={formik}
      touched={touched}
      error={error}
      prepend={prepend}
      append={append}
    >
      <PhoneInput
        inputStyle={{
          backgroundColor: readOnly && '#e9ecef',
        }}
        autoFormat
        countryCodeEditable={false}
        onlyCountries={onlyCountries}
        isValid={!error}
        inputProps={{
          name: name,
          readOnly: readOnly,
          disabled: readOnly,
        }}
        defaultErrorMessage={error}
        country={'us'}
        placeholder={
          (displayPlaceholder || placeholder) &&
          t(
            (typeof displayPlaceholder == 'string' && displayPlaceholder) ||
              placeholder ||
              label ||
              name
          )
        }
        value={value || ''}
        disabled={readOnly}
        onChange={onChangeProxy}
        onKeyDown={onKeyDown}
        onBlur={handleBlur}
      />
    </BaseControl>
  );
}

export default BaseInputPhone;
