import React from 'react'
import { useTranslation } from '../../hooks/useTranslation';

import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import BaseControl from './BaseControl';


function BaseInputPhone({ formik, required, className, label, handleBlur, placeholder, value, onChange, onKeyDown, name, error, touched, append, prepend }) {
  const { t } = useTranslation();

  if (formik) {
    /**
     * @type {import('formik').FieldMetaProps}
     */
    const meta = formik.getFieldMeta(name);

    if (meta) {
      value = meta.value;
      touched = meta.touched;
      error = meta.error;
    }
    onChange = onChange || function (value, country, e, formattedValue) { formik.setFieldValue(name, formattedValue) };
    handleBlur = handleBlur || function (e, data) { formik.setFieldValue(name, e.target.value) };
  }

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
        onlyCountries={process.env.PHONE_INPUT_COUNTRY_ALLOWED.split(',') || ['us']}
        isValid={!error}
        inputProps={{
          name: { name },
        }}
        defaultErrorMessage={error}
        country={'us'}
        placeholder={t(placeholder === true ? label || name : placeholder)}
        value={value || ""}
        onChange={onChange}
        onKeyDown={onKeyDown}
        onBlur={handleBlur}
      />
    </BaseControl>
  )
}

export default BaseInputPhone