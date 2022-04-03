import React from 'react'

function BaseSelect ( { className, options, valueKey = "value", labelKey = "label", label, type, placeholder, value, onChange, readOnly, name, touched, error, } ) {
  return (
    <div className={className}>
      {label && <label>{label}:</label>}
      <br />
      <select
        type={type || 'text'}
        value={value}
        onChange={onChange}
        readOnly={readOnly}
        name={name}
        className="form-select">
        {placeholder && <option value="">{placeholder}</option>}
        {options && options.map((v, i) => (<option key={i} value={v[valueKey]}>{v[labelKey]}</option>))}

      </select>
      {touched && error && (typeof error === "string") ? <span className="text-danger small">{error}</span> : null}
    </div>
  )
}

export default BaseSelect

