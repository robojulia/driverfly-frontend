import { ReactNode } from 'react';
import { InputGroup } from 'react-bootstrap';
import styles from '../../styles/digitalhiringapp.module.css';
import { useTranslation } from '../../hooks/use-translation';
import { FormikInterface } from '../../utils/formik';

export interface BaseControlProps {
  formik?: FormikInterface<any>;
  required?: boolean;
  className?: string;
  label?: string;
  // children?: JSX.Element | JSX.Element[];
  children?: ReactNode;
  touched?: boolean;
  error?: string;
  name?: string;
  append?: JSX.Element | JSX.Element[];
  prepend?: JSX.Element | JSX.Element[];
  after?: JSX.Element | JSX.Element[];
  helpText?: string;
}

function BaseControl({
  formik,
  required,
  className,
  label,
  children,
  touched,
  error,
  name,
  prepend,
  append,
  after,
  helpText,
}: BaseControlProps) {
  const { t } = useTranslation();

  if (formik) {
    /**
     * @type {import('formik').FieldMetaProps}
     */
    const meta = formik.getFieldMeta(name);

    if (meta) {
      touched = touched || meta.touched;
      error = meta.error;
    }
  }

  return (
    <div className={`${className || ''}`}>
      {label && (
        <>
          <label>
            {t(label)}
            {required ? <span className={styles.required}></span> : ''}:
          </label>
          <br />
        </>
      )}
      <InputGroup className="flex-nowrap">
        {prepend && <div className="input-group-prepend">{prepend}</div>}
        {children}
        {append && <div className="input-group-append">{append}</div>}
      </InputGroup>
      {helpText && (
        <div className={`${styles.successMessage} form-text text-muted small mt-1`}>{helpText}</div>
      )}
      {(touched || error) && typeof error == 'string' && (
        <span className={`${styles.errorMessage} text-danger small`}>{t(error)}</span>
      )}
      {after}
    </div>
  );
}

export default BaseControl;
