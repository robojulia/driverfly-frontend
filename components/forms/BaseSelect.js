import React from 'react'

import { useTranslation } from "react-i18next"

function BaseSelect ( { required, className, enumType, options, valueKey = "value", labelKey = "label", createLabel, label, type, placeholder, value, onChange, handleBlur, readOnly, name, touched, error, } ) {
  const { t } = useTranslation();
  if (typeof enumType === "object") {
    options = Object.keys(enumType).map(key => ({
      [valueKey]: key,
      [labelKey]: enumType[key].toLowerCase()
    }))
  }
  else if (options && options.length > 0 && typeof options[0] !== "object") {
    options = options.map(v => ({
      [valueKey]: v,
      [labelKey]: v
    }));
  }
  else if (createLabel) {
    options = options.map(v => ({
      [valueKey]: v[valueKey],
      [labelKey]: createLabel(v)
    }));
  }
return (
    <div className={className}>
      {label && <label>{label}{required ? "*" : ""}:</label>}
      <br />
      <select
        type={type || 'text'}
        value={value || ""}
        onChange={onChange}
        onBlur={handleBlur}
        readOnly={readOnly}
        name={name}
        className={`form-select ${error ? "is-invalid" : ""}`} 
        >
        {placeholder && <option value="">{placeholder}</option>}
        {options && options.map((v, i) => (<option key={i} value={v[valueKey]}>{t(v[labelKey])}</option>))}

      </select>
      {touched && error && (typeof error === "string") ? <span className="text-danger small">{error}</span> : null}
    </div>
  )
}

export default BaseSelect

