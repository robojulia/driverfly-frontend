import React, { useContext, useEffect, useState } from "react";
import styles from "../../../../styles/jotform.module.css";
import { Form, Button, Col, Row, Table } from "react-bootstrap";
import { useTranslation } from "../../../../hooks/use-translation";
import { useFormik } from "formik";
import BaseInput from "../../base-input";
import * as yup from "yup";
import SignaturePad from "react-signature-canvas";
import SignatureCanvas from "react-signature-canvas";
import { DriverApplicationDto } from "../../../../models/jot-form/long-form/driver-application.dto";
import { PageProps } from "../../../../types/jotform/page-props.type";
import { ApplicantEntity } from "../../../../models/applicant/applicant.entity";
import jotformContext from "../../../../context/jotform-context";

export interface DriverApplicationProps extends PageProps {}

export function DriverApplication({
  onNextClick,
  onBackClick,
}: DriverApplicationProps) {
  const {
    state: { applicant },
  } = useContext(jotformContext);

  // useEffect(() => {
  //   const { email, phone, zip_code, options } = applicant;
  //   form.setValues({
  //     email: email || null,
  //     phone: phone || null,
  //     zip_code: zip_code || null,
  //     options: options || null,
  //   });
  // }, [applicant]);

  const { t } = useTranslation();
  let padRef = React.useRef<SignatureCanvas>(null);
  console.log("signatires", padRef, SignatureCanvas);
  const clear = () => {
    padRef.current?.clear();
  };
  const form = useFormik({
    initialValues: new DriverApplicationDto(),
    validationSchema: DriverApplicationDto.yupSchema(),
    onSubmit: (values) => {
      onNextClick(values);
    },
  });
  return (
    <>
      <Form onSubmit={form.handleSubmit}>
        <h6 className={styles.carrierName}>Nautilus Trucking</h6>
        <h6 className={styles.carrierName__smaller}>
          {t("DRIVER_APPLICATION")}
        </h6>
        <p className={`${styles.paragraph} ${styles.align__text_left}`}>
          {t("MVR_AND_DMV_AUTHORIZATION_TO_NAUTILIUS")}
        </p>

        <Row className={styles.align__text_left}>
          <BaseInput
            className="col-6"
            required
            name="first_name"
            placeholder="FIRST_NAME"
            label="FIRST_NAME"
            formik={form}
          />
        </Row>
        <Row className={styles.align__text_left}>
          <BaseInput
            className="col-6"
            required
            name="last_name"
            placeholder="LAST_NAME"
            label="FIRST_NAME"
            formik={form}
          />
        </Row>
        <Row className={styles.align__text_left}>
          <BaseInput
            className="col-3 mt-3 mb-3"
            required
            type="date"
            name="date"
            placeholder="DATE"
            label="DATE"
            formik={form}
          />
        </Row>
        <Row className={styles.align__text_left}>
          <Col>
            <h6>{t("SIGNATURE")}</h6>
            <SignaturePad
              className
              ref={padRef}
              canvasProps={{
                width: 700,
                height: 200,
                style: { border: "1px solid black" },
                className: "sigCanvas",
              }}
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <button onClick={clear}>Clear</button>
          </Col>
        </Row>
        <Row className="mt-3">
          <Col>
            <Button className="float-right" type="reset">
              {t("BACK")}
            </Button>
          </Col>
          <Col>
            <Button className="float-left" type="submit">
              {t("NEXT")}
            </Button>
          </Col>
        </Row>
      </Form>
    </>
  );
}
