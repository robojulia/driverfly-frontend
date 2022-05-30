import React from 'react'

import { useTranslation } from "../../hooks/useTranslation"
import BaseControl from './BaseControl';

function BaseSelect ( { append, prepend, formik, required, className, enumType, options, valueKey = "value", labelKey = "label", labelPrefix, createLabel, label, placeholder, value, onChange, handleBlur, readOnly, name, touched, error, } ) {
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
    onChange = onChange || formik.handleChange
    handleBlur = handleBlur || formik.handleBlur;
  }

  if (typeof enumType === "object") {
    options = Object.keys(enumType).map(key => ({
      [valueKey]: key,
      [labelKey]: enumType[key]
    }))
  }
  else if (options && options.length > 0 && typeof options[0] !== "object") {
    options = options.map(v => ({
      [valueKey]: v,
      [labelKey]: v
    }));
  }
  else if (createLabel) {
    options = options.map(v => ({
      [valueKey]: v[valueKey],
      [labelKey]: createLabel(v)
    }));
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
      <select
        value={value || ""}
        onChange={onChange}
        onBlur={handleBlur}
        disabled={readOnly}
        name={name}
        className={`form-select ${error ? "is-invalid" : ""}`} 
        >
        {placeholder && <option value="">{t("SELECT_{name}", { name: placeholder }, { translateProps: true })}</option>}
        {options && options.map((v, i) => (<option key={i} value={v[valueKey]}>{t(labelPrefix ? `${labelPrefix}.${v[labelKey]}` : v[labelKey])}</option>))}
      </select>
    </BaseControl>
  )
}

export default BaseSelect

