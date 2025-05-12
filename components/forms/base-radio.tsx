import React from "react";

import { useTranslation } from "../../hooks/use-translation";
import { BaseControlProps } from "./base-control";

function InlineLayout(
  t,
  options,
  value,
  name,
  labelKey,
  valueKey,
  onChange,
  handleBlur,
  readOnly,
  error,
  labelPrefix,
  disabled
) {
  return (
    <>
      {options?.map((v, i) => (
        <div key={i} className={`form-check form-check-inline flex-row`}>
          <label className="form-check-label mr-2">
            {t((labelPrefix ? labelPrefix + "." : "") + v[labelKey])}
          </label>
          <input
            disabled={disabled}
            className={`radio-btns ${error ? "is-invalid" : ""}`}
            type="radio"
            readOnly={readOnly}
            value={v[valueKey]}
            name={name}
            onChange={onChange}
            onBlur={handleBlur}
            checked={value == v[valueKey]}
          />
        </div>
      ))}
    </>
  );
}

function ColLayout(
  t,
  options,
  cols,
  value,
  name,
  labelKey,
  valueKey,
  onChange,
  handleBlur,
  readOnly,
  error,
  labelPrefix,
  disabled
) {
  return (
    <div className="row mt-1">
      {options?.map((v, i) => (
        <div key={i} className={`col-md-${12 / cols}`}>
          <div className={`form-check form-check-inline flex-row-reverse`}>
            <label className="form-check-label">
              {t((labelPrefix ? labelPrefix + "." : "") + v[labelKey])}
            </label>
            <input
              disabled={disabled}
              className={`form-check-input ${error ? "is-invalid" : ""}`}
              readOnly={readOnly}
              type="radio"
              value={v[valueKey]}
              name={name}
              onChange={onChange}
              onBlur={handleBlur}
              checked={value == v[valueKey]}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export interface BaseRadioProps extends BaseControlProps {
  options?: object[];
  labelKey?: string;
  valueKey?: string;
  labelPrefix?: string;
  value?: string | number | boolean;
  cols?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  readOnly?: boolean;
  enumType?: object;
  disabled?: boolean;
}

function BaseRadio({
  formik,
  required,
  className,
  label,
  options,
  labelKey = "label",
  valueKey = "value",
  labelPrefix,
  value,
  cols,
  onChange,
  handleBlur,
  readOnly,
  name,
  touched,
  error,
  enumType,
  disabled,
}: BaseRadioProps) {
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
  if (typeof enumType == "object") {
    options = Object.entries(enumType)?.map(([key, value]) => ({
      [valueKey]: value,
      [labelKey]: value,
    }));
  }
  // if (!value) value = [];

  return (
    <div className={className}>
      {label && (
        <span style={{ marginRight: "20px", color: "black" }}>
          {t(label)}
          {required ? <span style={{ color: "red" }}>*</span> : ""}:
        </span>
      )}
      {cols
        ? ColLayout(
            t,
            options,
            +cols,
            value,
            name,
            labelKey,
            valueKey,
            onChange,
            handleBlur,
            readOnly,
            error,
            labelPrefix,
            disabled
          )
        : InlineLayout(
            t,
            options,
            value,
            name,
            labelKey,
            valueKey,
            onChange,
            handleBlur,
            readOnly,
            error,
            labelPrefix,
            disabled
          )}
      {touched && error && typeof error == "string" ? (
        <span className="text-danger small">{error}</span>
      ) : null}
    </div>
  );
}

export default BaseRadio;
