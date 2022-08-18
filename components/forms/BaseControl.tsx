import React from 'react'
import { InputGroup } from 'react-bootstrap';

import { useTranslation } from "../../hooks/useTranslation"
import { FormikInterface } from '../../utils/formik';

export interface BaseControlProps {
  formik?: FormikInterface<any>;
  required?: boolean;
  className?: string;
  label?: string;
  children?: JSX.Element | JSX.Element[];
  touched?: boolean;
  error?: string;
  name?: string;
  append?: JSX.Element | JSX.Element[];
  prepend?: JSX.Element | JSX.Element[];
  after?: JSX.Element | JSX.Element[];
}

function BaseControl ( { formik, required, className, label, children, touched, error, name, prepend, append, after } : BaseControlProps ) {
  const { t } = useTranslation();

  if (formik) {
    /**
     * @type {import('formik').FieldMetaProps}
     */
    const meta = formik.getFieldMeta(name);

    if (meta) {
      touched = meta.touched;
      error = meta.error;
    }
  }

  return (
    <div className={`${className || ""}`}>
      {label && <>
        <label>{t(label)}{required ? "*" : ""}:</label>
        <br />
      </>}
      <InputGroup className="flex-nowrap">
        {prepend && <div className="input-group-prepend">{prepend}</div>}
        {children}
        {append && <div className="input-group-append">{append}</div>}
      </InputGroup>
      {touched && error && typeof error === "string" && <span className="text-danger small">{t(error)}</span>}
      {after}
    </div>
  )
}

export default BaseControl

