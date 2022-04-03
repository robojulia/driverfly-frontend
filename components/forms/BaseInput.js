import React from 'react'

function BaseInput ( { className, label, handleBlur, type, min, placeholder, value, onChange, onKeyDown, readOnly, name, touched, error, } ) {
  return (
    <div className={className}>
      {label && <label>{label}:</label>}
      <br />
      <input
        onBlur={handleBlur}
        type={type || 'text'}
        min={min}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        readOnly={readOnly}
        name={name}
        className="form-control" 
      />
      {touched && error && (typeof error === "string") ? <span className="text-danger small">{error}</span> : null}
    </div>
  )
}

export default BaseInput