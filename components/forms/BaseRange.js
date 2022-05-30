import React from 'react'
import BaseControl from './BaseControl';

function BaseRange ( { valueSuffix, formik, prepend, append, required, className, label, handleBlur, min, max, placeholder, value, onChange, readOnly, name, touched, error, } ) {
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

export default BaseRange