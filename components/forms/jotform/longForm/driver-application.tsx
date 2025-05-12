import { useFormik } from "formik";
import { useContext, useEffect, useRef, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import SignatureCanvas from "react-signature-canvas";
import JotformContext, {
  JotFormContextType,
} from "../../../../context/jotform-context";
import { ApplicantExtras } from "../../../../enums/applicants/applicant-extras.enum";
import { useTranslation } from "../../../../hooks/use-translation";
import { ApplicantExtrasEntity } from "../../../../models/applicant/applicant-extras.entity";
import { DriverApplicationDto } from "../../../../models/jot-form/long-form/driver-application.dto";
import styles from "../../../../styles/digitalhiringapp.module.css";
import BaseInput from "../../base-input";

export interface DriverApplicationProps {
  isAutoRecruitmentLead?: boolean | (() => boolean);
}
export function DriverApplication({
  isAutoRecruitmentLead,
}: DriverApplicationProps) {
  const {
    state: { applicant, applicantExtras, company },
    method: { setApplicant, updateApplicantExtras, stepNext },
  }: JotFormContextType = useContext(JotformContext);

  const { t } = useTranslation();
  let padRef = useRef<SignatureCanvas>(null);
  const [useTypedSignature, setUseTypedSignature] = useState(false);
  const [typedSignatureConsent, setTypedSignatureConsent] = useState(false);

  const clearSignatureCanvas = (): void => {
    padRef?.current?.clear();
    form.setFieldValue("SIGNATURE.value", null);
  };

  const generateTypedSignature = () => {
    if (!typedSignatureConsent) {
      alert(t("PLEASE_CONSENT_TO_TYPED_SIGNATURE"));
      return;
    }

    const { first_name, last_name } = form.values;
    if (!first_name || !last_name) {
      alert(t("NAME_REQUIRED_FOR_TYPED_SIGNATURE"));
      return;
    }

    const canvas = padRef?.current;
    if (!canvas) return;

    canvas.clear();
    const ctx = canvas.getCanvas().getContext("2d");
    if (!ctx) return;

    // Set up the canvas for signature
    ctx.font = "30px 'Dancing Script', cursive";
    ctx.fillStyle = "black";

    // Calculate position to center the signature
    const signatureText = `${first_name} ${last_name}`;
    const textMetrics = ctx.measureText(signatureText);
    const x = (canvas.getCanvas().width - textMetrics.width) / 2;
    const y = (canvas.getCanvas().height + 30) / 2;

    // Add signature text
    ctx.fillText(signatureText, x, y);

    // Add timestamp for legal compliance
    ctx.font = "12px Arial";
    const timestamp = new Date().toISOString();
    ctx.fillText(
      `Electronically signed on ${timestamp}`,
      10,
      canvas.getCanvas().height - 10
    );

    handleSignatureEnd();
  };

  const form = useFormik({
    initialValues: new DriverApplicationDto(),
    validationSchema: DriverApplicationDto.yupSchema(),
    onSubmit: (values) => {
      try {
        const {
          first_name,
          last_name,
          APPLY_DATE,
          SIGNATURE,
          is_automated_recruiting_lead,
        } = values;
        setApplicant({
          ...applicant,
          first_name,
          last_name,
          is_automated_recruiting_lead,
        });
        updateApplicantExtras(APPLY_DATE);
        updateApplicantExtras(SIGNATURE);
        stepNext();
      } catch (error) {
        console.log(error);
      }
    },
  });

  useEffect(() => {
    console.log("form.values", form.values);
  }, [form.values]);

  const handleSignatureEnd = () => {
    const signatureValue = padRef?.current?.toDataURL()?.toString();
    form.setFieldValue("SIGNATURE.value", signatureValue);
  };

  useEffect(() => {
    console.log("form.values", form.values);
    console.log("form.errors", form.errors);
  }, [form.values, form.errors]);

  useEffect(() => {
    const { first_name, last_name, is_automated_recruiting_lead } = applicant;
    const apx = applicantExtras?.find(
      (v) => v.type == ApplicantExtras.APPLY_DATE
    );
    const apx_sign = applicantExtras?.find(
      (v) => v.type == ApplicantExtras.SIGNATURE
    );

    if (apx_sign) padRef?.current?.fromDataURL(apx_sign?.value);

    form.setValues({
      ...form.values,
      APPLY_DATE: !!apx?.type
        ? apx
        : {
            ...new ApplicantExtrasEntity(ApplicantExtras.APPLY_DATE),
            value: new Date().toISOString(),
          },
      SIGNATURE: !!apx_sign?.type
        ? apx_sign
        : new ApplicantExtrasEntity(ApplicantExtras.SIGNATURE),
      first_name: first_name || null,
      last_name: last_name || null,
      is_automated_recruiting_lead:
        isAutoRecruitmentLead == null
          ? Boolean(is_automated_recruiting_lead)
          : Boolean(isAutoRecruitmentLead),
    });
  }, [applicant]);

  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const now = new Date().toLocaleString("en-US", { timeZone: userTimeZone });
  const currentDate = new Date(now).toISOString().split("T")[0];

  const handleConsentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTypedSignatureConsent(e.target.checked);
    if (!e.target.checked) {
      clearSignatureCanvas();
    }
  };

  return (
    <>
      <Form onSubmit={form.handleSubmit}>
        <div
          className={`${styles.carrierName} ${styles.jot_form_headers_font}`}
        >
          <h1>
            {t(
              "{COMPANY_NAME}",
              { COMPANY_NAME: company?.name ?? applicant?.company?.name },
              { translateProps: true }
            )}
          </h1>
        </div>
        <h1 className={styles.carrierName}>{t("DRIVER_APPLICATION")}</h1>

        <p className={`${styles.paragraph} ${styles.align__text_left}`}>
          {t(
            "{COMPANY_NAME}_MVR_AND_DMV_AUTHORIZATION",
            { COMPANY_NAME: company?.name ?? applicant?.company?.name },
            { translateProps: true }
          )}
        </p>

        <Row className={`${styles.align__text_left} ${styles.bold}`}>
          <BaseInput
            className="col-md-6 my-3"
            required
            name="first_name"
            placeholder="FIRST_NAME"
            label="FIRST_NAME"
            readOnly
            formik={form}
          />
          <BaseInput
            className="col-md-6 my-3"
            required
            name="last_name"
            placeholder="LAST_NAME"
            label="LAST_NAME"
            readOnly
            formik={form}
          />
          <BaseInput
            className="col-md-12 my-3"
            required
            type="date"
            name="APPLY_DATE.value"
            placeholder="DATE"
            max={`9999-12-31`}
            min={currentDate}
            label="DATE"
            formik={form}
          />
        </Row>
        <Row className={`${styles.align__text_left}  ${styles.txtcolor}`}>
          <Col md="10" className="my-3">
            <h6 className={styles.bold}>{t("SIGNATURE")}</h6>

            {/* Signature Instructions */}
            <div className="mb-4">
              <p className={styles.bold}>{t("SIGNATURE_INSTRUCTIONS")}</p>
              <ul>
                <li>{t("SIGNATURE_OPTION_1")}</li>
                <li>{t("SIGNATURE_OPTION_2")}</li>
              </ul>
              <p className="text-muted">
                <em>{t("SIGNATURE_ACCESSIBILITY_NOTE")}</em>
              </p>
            </div>

            {/* Signature Canvas */}
            <SignatureCanvas
              name="SIGNATURE.value"
              className="mb-3"
              required
              ref={padRef}
              onEnd={handleSignatureEnd}
              canvasProps={{
                style: { border: "1px solid black" },
                className: "sigCanvas",
              }}
            />

            {/* Canvas Controls */}
            <div className="mb-4">
              <button
                type="button"
                className="theme-secondary-btn me-2"
                onClick={clearSignatureCanvas}
              >
                {t("CLEAR")}
              </button>
            </div>

            {/* Typed Signature Option */}
            <div className="border-top pt-3 mb-3">
              <Form.Check
                type="checkbox"
                id="typed-signature-consent"
                label={t("I_CONSENT_TO_USE_TYPED_SIGNATURE")}
                checked={typedSignatureConsent}
                onChange={handleConsentChange}
                className={`${styles.bold} mb-2`}
              />
              {typedSignatureConsent && (
                <div className="mb-3">
                  <small className="text-muted d-block mb-2">
                    {t("TYPED_SIGNATURE_LEGAL_NOTICE")}
                  </small>
                  <button
                    type="button"
                    className="theme-secondary-btn"
                    onClick={generateTypedSignature}
                    disabled={!typedSignatureConsent}
                    aria-label={t("USE_TYPED_SIGNATURE")}
                  >
                    {t("USE_TYPED_SIGNATURE")}
                  </button>
                </div>
              )}
            </div>

            {Boolean(form?.errors?.SIGNATURE) && (
              <p className={`h6 text-danger ${styles.align__text_left}`}>
                <em>{t("ERROR_SIGNS_REQUIRED")}</em>
              </p>
            )}
          </Col>
        </Row>

        <Row className="mt-3">
          <Col className="text-center">
            <Button type="submit">{t("NEXT")}</Button>
          </Col>
        </Row>
      </Form>
    </>
  );
}
