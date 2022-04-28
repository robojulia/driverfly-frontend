import React from 'react'

import { useTranslation } from "../../hooks/useTranslation"

function InlineLayout(options, value, name, labelKey, valueKey, onChange, handleBlur, readOnly, error, labelPrefix) {
  const { t } = useTranslation();
  return (
    <>
    {options.map((v, i) => (
      <div key={i} className={`form-check form-check-inline`}>
          <label className="form-check-label">{t((labelPrefix ? labelPrefix + "." : "") +  v[labelKey])}</label>
          <input className={`form-check-input ${error ? "is-invalid" : ""}`} type="checkbox" readOnly={readOnly} value={v[valueKey]} name={name} onChange={onChange} onBlur={handleBlur} checked={value.includes(v[valueKey])} />
      </div>
    ))}
    </>
  );
}

function ColLayout(options, cols, value, name, labelKey, valueKey, onChange, handleBlur, readOnly, error, labelPrefix) {
  const { t } = useTranslation();
  return (
    <div className='row mt-1'>
      {options.map((v, i) => (
        <div
          key={i}
          className={`col-md-${12 / cols}`}>
          <div className={`form-check form-check-inline`}>
              <label className="form-check-label">{t((labelPrefix ? labelPrefix + "." : "") +  v[labelKey])}</label>
              <input className={`form-check-input ${error ? "is-invalid" : ""}`} readOnly={readOnly} type="checkbox" value={v[valueKey]} name={name} onChange={onChange} onBlur={handleBlur} checked={value.includes(v[valueKey])} />
          </div>
        </div>
      ))}
    </div>
  );
}

function BaseCheckList ( {
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
  enumType
} ) {
  if (typeof enumType === "object") {
    options = Object.keys(enumType).map(key => ({
      [valueKey]: key,
      [labelKey]: enumType[key]
    }))
  }

  return (
    <div className={className}>
      {label && <span style={{ marginRight: "20px" }}>{label}{required ? "*" : ""}:</span>}
      {cols ?
        ColLayout(options, cols, value, name, labelKey, valueKey, onChange, handleBlur, readOnly, error, labelPrefix)
        : InlineLayout(options, value, name, labelKey, valueKey, onChange, handleBlur, readOnly, error, labelPrefix)}
      {touched && error && (typeof error === "string") ? <span className="text-danger small">{error}</span> : null}
    </div>
  )
}

export default BaseCheckList

