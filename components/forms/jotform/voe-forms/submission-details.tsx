import { useFormik } from "formik";
import React, { useContext, useEffect } from "react";
import { Button, Col, Row, Form } from "react-bootstrap";
import { useTranslation } from "../../../../hooks/use-translation";
import BaseInput from "../../base-input";
import { PageProps } from "../../../../types/jotform/page-props.type";
import jotformContext from "../../../../context/jotform-context";
import styles from "../../../../styles/jotform.module.css";
import SignaturePad from "react-signature-canvas";
import SignatureCanvas from "react-signature-canvas";
import { SubmissionDetailsDto } from "../../../../models/jot-form/voe-form/submission-details.dto";
import { ApplicantVoeFormEnum } from "../../../../enums/applicants/applicant-voe-form.enum";
import { ApplicantVoeFormEntity } from "../../../../models/applicant/applicant-voe-form.entity";
import BaseInputPhone from "../../base-input-phone";

export interface SubmissionDetailsProps extends PageProps {}

export function SubmissionDetails() {
  const {
    state: { applicantVoe },
    method: { updateApplicantVoe, stepBack, setSteps },
  } = useContext(jotformContext);

  const { t } = useTranslation();
  let padRef = React.useRef<SignatureCanvas>(null);
  const clearSignaturePad = () => padRef?.current?.clear();

  const form = useFormik({
    initialValues: new SubmissionDetailsDto(),
    validationSchema: SubmissionDetailsDto.yupSchema(),
    onSubmit: (values) => {
      const { SIGNATURE_VOE, SENDER_INFO } = values;
      updateApplicantVoe(SIGNATURE_VOE);
      updateApplicantVoe(SENDER_INFO);

      // setSteps(0);
    },
    onReset: (values) => {
      stepBack();
    },
  });

  const signatureEnd = () => {
    const signatureValue = padRef.current.toDataURL().toString();
    form.setFieldValue("SIGNATURE_VOE.value", signatureValue);
  };
  useEffect(() => {
    const apx_sign = applicantVoe?.find(
      (v) => v.type === ApplicantVoeFormEnum.SIGNATURE_VOE
    );
    const apx_sender_info = applicantVoe?.find(
      (v) => v.type === ApplicantVoeFormEnum.SENDER_INFO
    );

    form.setFieldValue(
      "SIGNATURE_VOE",
      padRef?.current?.fromDataURL(apx_sign?.value)
    );

    form.setValues({
      ...form.values,
      SIGNATURE_VOE: !!apx_sign?.type
        ? apx_sign
        : new ApplicantVoeFormEntity(ApplicantVoeFormEnum.SIGNATURE_VOE),

      SENDER_INFO: !!apx_sender_info?.type
        ? apx_sender_info
        : new ApplicantVoeFormEntity(ApplicantVoeFormEnum.SENDER_INFO),
    });
  }, [applicantVoe]);

  useEffect(() => {
    console.log("form values", form.values);
    console.log("form eror", form.errors);
  }, [form.values, form.errors]);

  return (
    <Form onSubmit={form.handleSubmit} onReset={form.handleReset}>
      <Row className={`${styles.align__text_left}`}>
        <Col>
          <h6 className={styles.bold}>{t("SIGNATURE")}</h6>
          <SignaturePad
            name="SIGNATURE_VOE.value"
            ref={padRef}
            onEnd={signatureEnd}
            canvasProps={{
              width: 720,
              height: 200,
              style: { border: "1px solid black" },
              className: "sigCanvas",
            }}
          />
        </Col>
      </Row>

      <Row>
        <Col className={styles.align__text_center}>
          <button onClick={clearSignaturePad}>{t("CLEAR")}</button>
        </Col>
      </Row>
      <Row className={`${styles.align__text_left} ${styles.bold}`}>
        <Col>
          <BaseInput
            className="mt-3 float-left col-9 pl-0"
            label="FULL_NAME"
            name="SENDER_INFO.value.name"
            formik={form}
          />
        </Col>
        <Col>
          <BaseInput
            className="mt-3 float-left col-9"
            label="TITLE"
            name="SENDER_INFO.value.title"
            formik={form}
          />
        </Col>
      </Row>

      <Row className={`${styles.align__text_left} ${styles.bold}`}>
        <Col>
          <BaseInputPhone
            className="mt-3 float-left col-9 pl-0"
            label="PHONE"
            name="SENDER_INFO.value.phone"
            formik={form}
          />
        </Col>
        <Col>
          <BaseInput
            className="mt-3 float-left col-9"
            label="EMAIL"
            name="SENDER_INFO.value.email"
            formik={form}
          />
        </Col>
      </Row>

      <Row className={`${styles.align__text_left} ${styles.bold}`}>
        <BaseInput
          className="mt-3 float-left col-4"
          label="DATE"
          name="SENDER_INFO.value.date"
          type="date"
          formik={form}
        />
      </Row>

      <Row className="mt-3">
        <Col>
          <Button className="float-right" type="reset">
            {t("BACK")}
          </Button>
        </Col>
        <Col>
          <Button className="float-left" type="submit">
            {t("SUBMIT")}
          </Button>
        </Col>
      </Row>
    </Form>
  );
}
