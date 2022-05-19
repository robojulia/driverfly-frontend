import React from 'react'
import { useTranslation} from "../../hooks/useTranslation";

function BaseRange ( { required, className, label, handleBlur, min, max, placeholder, value, onChange, readOnly, name, touched, error, } ) {
  const { t } = useTranslation();
  return (
    <div className={className}>
      {label && <label>{t(label)}{required ? "*" : ""}:</label>}
      <br />
      <div className='d-flex flex-row'>
        <div className='p-2'>
          <input
            onBlur={handleBlur}
            type="range"
            min={min}
            max={max}
            placeholder={t(placeholder)}
            value={value}
            onChange={onChange}
            readOnly={readOnly}
            name={name}
            className="form-range" 
          />
        </div>
        <div className='p-2'>
          <span>{value}</span>
        </div>
      </div>
      {touched && error && (typeof error === "string") ? <span className="text-danger small">{error}</span> : null}
    </div>
  )
}

export default BaseRange