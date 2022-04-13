import React from 'react'

function BaseCheck ( { required, className, label, checked, onChange, readOnly, name, touched, error, } ) {
  return (
    <div className={className}>
      <div className='form-switch'>
        <input
          id={name}
          type="checkbox"
          checked={checked}
          onChange={onChange}
          readOnly={readOnly}
          name={name}
          role="switch"
          className={`form-check-input ${error ? "is-invalid" : ""}`} 
        />
        {label && <label htmlFor={name} className="form-check-label">{label}{required ? "*" : ""}</label>}

      </div>
      {touched && error && (typeof error === "string") ? <span className="text-danger small">{error}</span> : null}
    </div>
  )
}

export default BaseCheck

