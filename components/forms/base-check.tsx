import React from 'react'
import { useTranslation } from '../../hooks/use-translation';
import { BaseControlProps } from './base-control';

export interface BaseCheckProps extends BaseControlProps {
  checked?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  readOnly?: boolean;
  disabled?: boolean;

}

export default function BaseCheck({ formik, required, className, label, checked, onChange, handleBlur, readOnly, name, touched, error, disabled }: BaseCheckProps) {
  const { t } = useTranslation();
  checked = !!checked;

  if (formik) {
    const meta = formik.getFieldMeta(name);

    if (meta) {
      checked = meta.value == true;
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
  const onChangeProxy = (e) => {
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
          disabled={disabled}
          id={name}
          type="checkbox"
          checked={checked}
          onChange={onChangeProxy}
          readOnly={readOnly}
          name={name}
          role="switch"
          className={`form-check-input ${error ? "is-invalid" : ""}`}
        />
        {label && <label htmlFor={name} style={{ marginLeft: ".5em" }} className="form-check-label">{t(label)}{required ? <span className='text-danger'>*</span> : ""}</label>}

      </div>
      {touched && error && (typeof error == "string") ? <span className="text-danger small">{t(error)}</span> : null}
    </div>
  )
}

