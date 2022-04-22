import React from 'react'

function BaseInput({ accept, required, className, label, handleBlur, type, min, max, placeholder, value, onChange, onKeyDown, readOnly, name, touched, error, }) {
  return (
    <div className={className}>
      {label && <label>{label}{required ? "*" : ""}:</label>}
      <br />
      <input
        accept={type == "file" ? accept : null}
        onBlur={handleBlur}
        type={type || 'text'}
        min={min}
        max={max}
        placeholder={placeholder}
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