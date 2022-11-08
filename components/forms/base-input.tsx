import React from 'react'
import { useTranslation } from '../../hooks/use-translation';
import BaseControl, { BaseControlProps } from './base-control';

export interface BaseInputProps extends BaseControlProps {
  accept?: string;
  handleBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  type?: string;
  min?: string | number;
  max?: string | number;
  step?: number;
  placeholder?: string | boolean;
  value?: any;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  readOnly?: boolean;
}

function BaseInput({ formik, accept, required, className, label, handleBlur, type, min, max, step, placeholder, value, onChange, onKeyDown, readOnly, name, touched, error, append, prepend }: BaseInputProps) {
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

  if (type === "date" && typeof(value) === "string" && value?.includes("T")) {
    value = value.split("T")[0];
  }

  if (type === "int" || type === "integer") {
    type = "number";
    step = 1;
    onKeyDown = onKeyDown ||
      /**
       * @param {React.KeyboardEvent<HTMLInputElement} e
       */
      function (e) {
        // prevent negative if the min value is set to 0
        if (min != null && +min >= 0 && e.key === "-") e.preventDefault();

        if (e.key === ".") {
          e.preventDefault();
        }
        // if (e.key !== "-" && e.key !== "." && isNaN(+e.key)) e.preventDefault();
        if (["e", "E", "+"].includes(e.key)) e.preventDefault();
      };
  }
  else if (type === "number") {
    onKeyDown = onKeyDown ||
      /**
       * @param {React.KeyboardEvent<HTMLInputElement} e
       */
      function (e) {
        // prevent negative if the min value is set to 0
        if (min != null && +min >= 0 && e.key === "-") e.preventDefault();
        // if (e.key !== "-" && e.key !== "." && isNaN(+e.key)) e.preventDefault();
        if (["e", "E", "+"].includes(e.key)) e.preventDefault();
      };
  }

  if (type === "number") {
    let currentOnChange = onChange;

    /**
     * @param {React.ChangeEvent<HTMLInputElement>} e
     */
    onChange = (e) => {
      const { value } = e.target;

      if (value && value.startsWith(".")) {
        e.target.value = `0${value}`;
      }

      if (currentOnChange) currentOnChange(e);
    }
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
        accept={type == "file" ? accept : null}
        onBlur={handleBlur}
        type={type || 'text'}
        min={min}
        max={max}
        step={step}
        placeholder={t(placeholder === true ? label || name : (placeholder || "").toString())}
        value={value == null ? "" : value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        readOnly={readOnly}
        name={name}
        className={`form-control ${error ? "is-invalid" : ""}`}
      />
    </BaseControl>
  )
}

export default BaseInput