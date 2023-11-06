import React from "react";
import { useTranslation } from "../../hooks/use-translation";
import { FormikInterface } from "../../utils/formik";
import ReCAPTCHA from "react-google-recaptcha";


export interface BaseReCapchaProps {
  formik?: FormikInterface<any>;
  className?: string;
  label?: string;
  error?: string;
  name?: string;
  captchaRef?: any;
  onChange?: (e: any) => void;
}

function BaseReCapcha({
  formik,
  className,
  label,
  error,
  name,
  captchaRef,
  onChange,
}: BaseReCapchaProps) {
  const { t } = useTranslation();
  const key = process.env.RECAPTCHA_SITE_KEY

  if (formik) {
    /**
     * @type {import('formik').FieldMetaProps}
     */
    const meta = formik.getFieldMeta(name);

    if (meta) {
      error = meta.error;
    }
  }

  return (
    <div className={`${className || ""}`}>
      {label && (
        <>
          <label>{t(label)}:</label>
          <br />
        </>
      )}
      <ReCAPTCHA
        className={`${error? "is-invalid" : ""}`}
        sitekey={key}
        onChange={onChange}
        ref={captchaRef}
      />
      {error && typeof error === "string" && (
        <span className="text-danger small">{t(error)}</span>
      )}
    </div>
  );
}

export default BaseReCapcha;
