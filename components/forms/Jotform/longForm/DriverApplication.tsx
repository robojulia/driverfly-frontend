import React, { useEffect, useState } from "react";
import styles from "../../../../styles/JotForm.module.css";
import { Form, Button, Col, Row, Table } from "react-bootstrap";
import { useTranslation } from "../../../../hooks/use-translation";
import { useFormik } from "formik";
import BaseInput from "../../base-input";
import * as yup from "yup";
import SignaturePad from "react-signature-canvas";
import SignatureCanvas from "react-signature-canvas";
import { DriverApplicationDto } from "../../../../models/jot-form/long-form/driver-application.dto";

export interface DriverApplicationProps {
  onNextClick: (values: any) => void;
  applicant: any;
}

export function DriverApplication(props: DriverApplicationProps) {
  useEffect(() => {
    if (props.applicant && !form.dirty) form.setValues(props.applicant);
  }, [props.applicant]);

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
      props.onNextClick(values);
    },
  });
  console.log("formmmmmmmm", props.onNextClick);
  return (
    <>
      <Form onSubmit={form.handleSubmit}>
        <h6 className={styles.carrierName}>Nautilus Trucking</h6>
        <h6 className={styles.carrierName__smaller}>Driver Application</h6>
        <p className={styles.paragraph}>
          Submitting this application certifies that this form was completed by
          me and all entries and information on it are true and complete to the
          best of my knowledge. I authorize Nautilus Trucking to make
          investigations and inquires of my driving history and past employment
          records. I hereby authorize Nautilus Trucking to check my MVR from DMV
          and PSP record for review as part of the hiring process.
        </p>

        <Row>
          <BaseInput
            className="col-6"
            required
            name="first_name"
            placeholder="FIRST_NAME"
            label="First Name"
            formik={form}
          />
        </Row>
        <Row>
          <BaseInput
            className="col-6"
            required
            name="last_name"
            placeholder="LAST_NAME"
            label="Last Name"
            formik={form}
          />
        </Row>
        <Row>
          <BaseInput
            className="col-3 mt-3"
            required
            type="date"
            name="date"
            placeholder="DATE"
            label="Date"
            formik={form}
          />
        </Row>
        <Row>
          <Col>
            <h6>Signature</h6>
            <SignaturePad
              className
              ref={padRef}
              canvasProps={{
                width: 600,
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
        <Row>
          <Col className="mt-5">
            <Button
              type="submit"
              onClick={() => console.log("clicked the button")}
            >
              {t("NEXT")}
            </Button>
          </Col>
        </Row>
      </Form>
    </>
  );
}
