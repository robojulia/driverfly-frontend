import React from 'react'
import BaseControl, { BaseControlProps } from './base-control';

export interface BaseRangeProps extends BaseControlProps {
  valueSuffix?: string;

  handleBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  min?: string | number;
  max?: string | number;
  value?: any;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  readOnly?: boolean;
}

export default function BaseRange ( { valueSuffix, formik, prepend, append, required, className, label, handleBlur, min, max, value, onChange, readOnly, name, touched, error, }: BaseRangeProps ) {
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
      <input
        onBlur={handleBlur}
        type="range"
        min={min}
        max={max}
        value={value == null ? "" : value}
        onChange={onChange}
        readOnly={readOnly}
        name={name}
        className={`custom-range ${error ? "is-invalid" : ""}`}
      />
      <span className="text-info text-nowrap pl-2 small">{value} {valueSuffix}</span>
    </BaseControl>
  );
}
