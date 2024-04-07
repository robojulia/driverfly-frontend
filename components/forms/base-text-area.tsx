import React, { useEffect, useState } from 'react'
import { useTranslation } from '../../hooks/use-translation';
import BaseControl, { BaseControlProps } from './base-control';

export interface BaseTextAreaProps extends BaseControlProps, React.InputHTMLAttributes<HTMLTextAreaElement> {
  maxLength?: number;
  rows?: number;
  placeholder?: string;
  displayPlaceholder?: string | boolean;
  value?: any;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleBlur?: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
  readOnly?: boolean;
}

function BaseTextArea({
  formik,
  required,
  className,
  maxLength,
  label,
  rows,
  placeholder,
  displayPlaceholder,
  value,
  onChange,
  handleBlur,
  readOnly,
  name,
  touched,
  error,
  append,
  prepend,
  ...rest
}: BaseTextAreaProps) {
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
    onChange = onChange || formik.handleChange;
    handleBlur = handleBlur || formik.handleBlur;
  }

  const [remaining, setRemaining] = useState(maxLength || -1);

  useEffect(() => {
    if (maxLength > 0) {
      setRemaining(maxLength - (value || "").length);
    }
  }, [value]);

  return (
    <>
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
        after={
          maxLength > 0 && (
            <span className="text-info float-right small">
              {t("{number}_CHARACTERS_REMAINING", {
                number: remaining.toString(),
              })}
            </span>
          )
        }
      >
        <textarea
          placeholder={
            (displayPlaceholder || placeholder) &&
            t(
              (typeof displayPlaceholder == "string" && displayPlaceholder) ||
              placeholder ||
              label ||
              name
            )
          }
          value={value || ""}
          rows={rows}
          maxLength={maxLength}
          onChange={onChange}
          onBlur={handleBlur}
          readOnly={readOnly}
          name={name}
          id={name}
          className={`form-control ${error ? "is-invalid" : ""}`}
          {...rest}
        />
      </BaseControl>
    </>
  );
}

export default BaseTextArea