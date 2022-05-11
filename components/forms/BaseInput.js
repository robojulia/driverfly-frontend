import React from 'react'
import { useTranslation } from '../../hooks/useTranslation';

function BaseInput({ formik, accept, required, className, label, handleBlur, type, min, max, step, placeholder, value, onChange, onKeyDown, readOnly, name, touched, error, }) {
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

  if (type === "int" || type === "integer") {
    type = "number";
    step = 1;
    onKeyDown = onKeyDown ||
      /**
       * @param {React.KeyboardEvent<HTMLInputElement} e
       */
      function (e) {
        if (e.key === ".") e.preventDefault();
      };
  }
  return (
    <div className={className}>
      {label && <><label>{t(label)}{required ? "*" : ""}:</label><br /></>}
      <input
        accept={type == "file" ? accept : null}
        onBlur={handleBlur}
        type={type || 'text'}
        min={min}
        max={max}
        step={step}
        placeholder={t(placeholder)}
        value={value || ""}
        onChange={onChange}
        onKeyDown={onKeyDown}
        readOnly={readOnly}
        name={name}
        className={`form-control ${error ? "is-invalid" : ""}`}
      />
      {touched && error && (typeof error === "string") ? <span className="text-danger small">{error}</span> : null}
    </div>
  )
}

export default BaseInput