import React, { useEffect, useState } from 'react'
import { useTranslation } from '../../hooks/useTranslation';

function BaseTextArea({ formik, required, className, maxLength, label, rows, placeholder, value, onChange, handleBlur, readOnly, name, touched, error, }) {
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

  const [ remaining, setRemaining ] = useState(maxLength || -1);

  useEffect(() => {
    if (maxLength > 0) {
      setRemaining(maxLength - (value || "").length);
    }
  }, [ value ]);

  return (
    <div className={className}>
      {label && <><label>{t(label)}{required ? "*" : ""}:</label><br /></>}
      <textarea
        placeholder={t(placeholder)}
        value={value || ""}
        rows={rows}
        maxLength={maxLength}
        onChange={onChange}
        onBlur={handleBlur}
        readOnly={readOnly}
        name={name}
        className={`form-control ${error ? "is-invalid" : ""}`}
       />
      {maxLength > 0 && <span className="text-info float-right small">{t("{number}_CHARACTERS_REMAINING", { number: remaining })}</span>}
      {touched && error && (typeof error === "string") && <span className="text-danger small">{error}</span>}
    </div>
  )
}

export default BaseTextArea