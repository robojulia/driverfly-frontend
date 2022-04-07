import React from 'react'

function BaseTextArea ( { required, className, maxLength, label, rows, placeholder, value, onChange, readOnly, name, touched, error, } ) {
  return (
    <div className={className}>
      {label && <label>{label}{required ? "*" : ""}:</label>}
      <br />
      <textarea
        placeholder={placeholder}
        value={value}
        rows={rows}
        maxLength={maxLength}
        onChange={onChange}
        readOnly={readOnly}
        name={name}
        className={`form-control ${error ? "is-invalid" : ""}`} 
      />
      {touched && error && (typeof error === "string") ? <span className="text-danger small">{error}</span> : null}
    </div>
  )
}

export default BaseTextArea