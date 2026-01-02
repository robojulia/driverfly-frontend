import React from 'react';
import { useTranslation } from '../../hooks/use-translation';
import { BaseControlProps } from './base-control';
import styles from '../../styles/digitalhiringapp.module.css';

export interface BaseCheckProps extends BaseControlProps {
  checked?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  readOnly?: boolean;
  disabled?: boolean;
  helpText?: string;
}

export default function BaseCheck({
  formik,
  required,
  className,
  label,
  checked,
  onChange,
  handleBlur,
  readOnly,
  name,
  touched,
  error,
  disabled,
  helpText,
}: BaseCheckProps) {
  const { t } = useTranslation();
  checked = !!checked;

  if (formik) {
    const meta = formik.getFieldMeta(name);

    if (meta) {
      checked = meta.value == true;
      touched = meta.touched;
      error = meta.error;
    }
    onChange = onChange || formik.handleChange;
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
          value: checked,
        },
      });
    }
  };

  return (
    <div className={className}>
      <div className={`${styles.radio} form-switch`}>
        <input
          disabled={disabled}
          id={name}
          type="checkbox"
          checked={checked}
          onChange={onChangeProxy}
          readOnly={readOnly}
          name={name}
          role="switch"
          className={`${styles.radioInput} form-check-input ${error ? 'is-invalid' : ''}`}
          style={{
            width: '18px',
            height: '18px',
            minWidth: '18px',
            minHeight: '18px',
            opacity: 1,
            visibility: 'visible',
            cursor: disabled ? 'not-allowed' : 'pointer',
            border: '2px solid #0f5257',
            borderRadius: '4px',
            backgroundColor: checked ? '#0f5257' : 'white',
            appearance: 'auto',
            WebkitAppearance: 'checkbox',
            MozAppearance: 'checkbox'
          }}
        />
        {label && (
          <label
            htmlFor={name}
            style={{ marginLeft: '.5em' }}
            className={`${styles.titlechildren} form-check-label`}
          >
            {t(label)}
            {required ? <span className={`${styles.highlight}`}>*</span> : ''}
          </label>
        )}
      </div>
      {helpText && (
        <div className={`${styles.successMessage} form-text text-muted small mt-1`} style={{ marginLeft: '1.8em' }}>
          {t(helpText)}
        </div>
      )}
      {touched && error && typeof error == 'string' ? (
        <span className={`${styles.errorMessage} text-danger small`}>{t(error)}</span>
      ) : null}
    </div>
  );
}
