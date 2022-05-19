import React from 'react'
import { InputGroup } from 'react-bootstrap';

import { useTranslation } from "../../hooks/useTranslation"

function BaseControl ( { formik, required, className, label, children, touched, error, name } ) {
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
        {children}
      </InputGroup>
      {touched && error && (typeof error === "string") ? <span className="text-danger small">{t(error)}</span> : null}
    </div>
  )
}

export default BaseControl

