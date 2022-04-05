import React from 'react'

function InlineLayout(options, value, name, labelKey, valueKey, onChange, readOnly) {
  return (
    <>
    {options.map((v, i) => (
      <div key={i} className="form-check form-check-inline">
          <label className="form-check-label">{v[labelKey]}</label>
          <input className="form-check-input" type="checkbox" readOnly={readOnly} value={v[valueKey]} name={name} onChange={onChange} checked={value.includes(v[valueKey])} />
      </div>
    ))}
    </>
  );
}

function ColLayout(options, cols, value, name, labelKey, valueKey, onChange, readOnly) {
  return (
    <div className='row mt-1'>
      {options.map((v, i) => (
        <div
          key={i}
          className={`col-md-${12 / cols}`}>
          <div className="form-check form-check-inline">
              <label className="form-check-label">{v[labelKey]}</label>
              <input className="form-check-input" readOnly={readOnly} type="checkbox" value={v[valueKey]} name={name} onChange={onChange} checked={value.includes(v[valueKey])} />
          </div>
        </div>
      ))}
    </div>
  );
}

function BaseCheckList ( {
  className,
  label,
  options,
  labelKey = "label",
  valueKey = "value",
  value,
  cols,
  onChange,
  readOnly,
  name,
  touched,
  error,
} ) {
  return (
    <div className={className}>
      {label && <span style={{ marginRight: "20px" }}>{label}:</span>}
      {cols ?
        ColLayout(options, cols, value, name, labelKey, valueKey, onChange, readOnly)
        : InlineLayout(options, value, name, labelKey, valueKey, onChange, readOnly)}
      {touched && error && (typeof error === "string") ? <span className="text-danger small">{error}</span> : null}
    </div>
  )
}

export default BaseCheckList

