import React from 'react'

function BaseInput ( props ) {
  const baseClass = `my-3 ${props.className}`
  return (
    <div className={baseClass}>
      {props.label && <label>{props.label}</label>}
      <br />
      <input
        onBlur={props.handleBlur}
        type={props.type || 'text'}
        placeholder={props.placeholder}
        value={props.value}
        onChange={props.onChange}
        name={props.name}
        className="form-control" 
      />
      {props.touched && props.error ? <span className="text-danger small">{props.error}</span> : null}
    </div>
  )
}

export default BaseInput