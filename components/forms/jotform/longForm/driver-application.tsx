import { useFormik } from "formik";
import { useContext, useEffect } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import JotformContext, {
  JotFormContextType,
} from "../../../../context/jotform-context";
import { ApplicantExtras } from "../../../../enums/applicants/applicant-extras.enum";
import { useTranslation } from "../../../../hooks/use-translation";
import { ApplicantExtrasEntity } from "../../../../models/applicant/applicant-extras.entity";
import { DriverApplicationDto } from "../../../../models/jot-form/long-form/driver-application.dto";
import styles from "../../../../styles/digitalhiringapp.module.css";
import BaseInput from "../../base-input";
import { SignatureComponent } from "../../signature";

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
    const { first_name, last_name, is_automated_recruiting_lead } = applicant;
    const apx = applicantExtras?.find(
      (v) => v.type == ApplicantExtras.APPLY_DATE
    );
    const apx_sign = applicantExtras?.find(
      (v) => v.type == ApplicantExtras.SIGNATURE
    );

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

  const handleSignatureChange = (signature: string | null) => {
    form.setFieldValue("SIGNATURE.value", signature);
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
        <Row className={`${styles.align__text_left} ${styles.txtcolor}`}>
          <Col md="10" className="my-3">
            <h6 className={styles.bold}>{t("SIGNATURE")}</h6>
            <SignatureComponent
              firstName={form.values.first_name}
              lastName={form.values.last_name}
              onSignatureChange={handleSignatureChange}
              initialSignature={form.values.SIGNATURE?.value}
              required
            />
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
