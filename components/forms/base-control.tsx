import { ReactNode } from 'react';
import { InputGroup } from 'react-bootstrap';

import { useTranslation } from "../../hooks/use-translation";
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
}

function BaseControl({ formik, required, className, label, children, touched, error, name, prepend, append, after }: BaseControlProps) {
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
    <div className={`${className || ""}`}>
      {label && <>
        <label>{t(label)}{required ? <span className='text-danger'>*</span> : ""}:</label>
        <br />
      </>}
      <InputGroup className="flex-nowrap">
        {prepend && <div className="input-group-prepend">{prepend}</div>}
        {children}
        {append && <div className="input-group-append">{append}</div>}
      </InputGroup>
      {touched && error && typeof error == "string" && <span className="text-danger small">{t(error)}</span>}
      {after}
    </div>
  )
}

export default BaseControl

