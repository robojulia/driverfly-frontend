import ReCAPTCHA from "react-google-recaptcha";
import { useTranslation } from "../../hooks/use-translation";
import { FormikInterface } from "../../utils/formik";
import { useRef } from "react";

export interface BaseRecaptchaProps {
  formik?: FormikInterface<any>;
  className?: string;
  label?: string;
  error?: string;
  name?: string;
  onChange?: (e: any) => void;
}

export default function BaseRecaptcha({
  formik,
  className,
  label,
  error,
  name,
  onChange,
}: BaseRecaptchaProps) {
  const { t } = useTranslation();
  const captchaRef = useRef(null);
  console.log(process.env.RECAPTCHA_SITE_KEY);
  const key = process.env.RECAPTCHA_SITE_KEY;
  if (formik) {
    /**
     * @type {import('formik').FieldMetaProps}
     */
    const meta = formik.getFieldMeta(name);

    if (meta) {
      error = meta.error;
    }
    onChange = onChange || formik.handleChange;
  }

  return (
    <>
      <div className={`${className || ""} `}>
        {label && (
          <>
            <label>{t(label)}:</label>
            <br />
          </>
        )}
        <ReCAPTCHA
          className={`${error ? "is-invalid" : ""} `}
          sitekey={key}
          onChange={onChange}
          ref={captchaRef}
        />
        {error && typeof error == "string" && (
          <span className="text-danger small">{t(error)}</span>
        )}
      </div>
    </>
  );
}
