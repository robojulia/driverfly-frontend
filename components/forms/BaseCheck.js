import React from 'react'
import { useTranslation } from '../../hooks/useTranslation';

function BaseCheck ( { prefixLabel, formik, required, className, label, checked, onChange, handleBlur, readOnly, name, touched, error, } ) {
  const { t } = useTranslation();

  if (formik) {
    /**
     * @type {import('formik').FieldMetaProps}
     */
    const meta = formik.getFieldMeta(name);

    if (meta) {
      checked = meta.value === true;
      touched = meta.touched;
      error = meta.error;
    }
    onChange = onChange || formik.handleChange
    handleBlur = handleBlur || formik.handleBlur;
  }

  /**
   * 
   * @param {React.ChangeEvent<HTMLInputElement>} e 
   */
  const onChangeWrapper = (e) => {
    const { checked } = e.target;

    if (onChange) {
      onChange({
        ...e,
        target: {
          ...e.target,
          name: name,
          value: checked
        }
      });
    }
    
  };

  return (
    <div className={className}>
      <div className='form-switch'>
        <input
          id={name}
          type="checkbox"
          checked={checked}
          onChange={onChangeWrapper}
          readOnly={readOnly}
          name={name}
          role="switch"
          className={`form-check-input ${error ? "is-invalid" : ""}`} 
        />
        {label && <label htmlFor={name} style={{ marginLeft: ".5em"}} className="form-check-label">{t(label)}{required ? "*" : ""}</label>}

      </div>
      {touched && error && (typeof error === "string") ? <span className="text-danger small">{error}</span> : null}
    </div>
  )
}

export default BaseCheck

