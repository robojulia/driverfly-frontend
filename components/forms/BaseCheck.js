import React from 'react'

function BaseCheck ( { className, label, checked, onChange, readOnly, name, touched, error, } ) {
  return (
    <div className={className}>
      <div className='form-check form-switch'>
        {label && <label htmlFor={name} class="form-check-label">{label}</label>}
        <input
          id={name}
          type="checkbox"
          checked={checked}
          onChange={onChange}
          readOnly={readOnly}
          name={name}
          role="switch"
          className="form-check-input"
        />

      </div>
      {touched && error && (typeof error === "string") ? <span className="text-danger small">{error}</span> : null}
    </div>
  )
}

export default BaseCheck

