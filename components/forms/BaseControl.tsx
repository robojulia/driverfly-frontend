import React from 'react'
import { InputGroup } from 'react-bootstrap';

import { useTranslation } from "../../hooks/useTranslation"

export interface BaseControlProps {
  formik?: any;
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
    <div className={className}>
      {label && <>
        <label>{t(label)}{required ? "*" : ""}:</label>
        <br />
      </>}
      <InputGroup className="flex-nowrap">
        {prepend}
        {children}
        {append}
      </InputGroup>
      {touched && error && (typeof error === "string") ? <span className="text-danger small">{t(error)}</span> : null}
      {after}
    </div>
  )
}

export default BaseControl

