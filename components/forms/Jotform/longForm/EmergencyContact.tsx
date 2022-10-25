import React, { useEffect } from "react";
import styles from "../../../../styles/JotForm.module.css";
import { Form, Button, Col, Row } from "react-bootstrap";
import { useTranslation } from "../../../../hooks/useTranslation";
import { useFormik } from "formik";
import BaseInput from "../../BaseInput";
import BaseInputPhone from "../../BaseInputPhone";

export interface EmergencyContactProps {
  onNextClick: (any) => void;
  onBackClick: () => void;
  applicant: any;
}

export function EmergencyContact(props: EmergencyContactProps) {
  useEffect(() => {
    if (props.applicant && !form.dirty) form.setValues(props.applicant);
  }, [props.applicant]);
  const { t } = useTranslation();
  const form = useFormik({
    initialValues: {
      EMERGENCY_CONTACT: null,
      phone: null,
      RELATIONSHIP: null,
    },
    onSubmit: (values) => {
      props.onNextClick(values);
    },
    onReset: (values) => {
      props.onBackClick();
    },
  });

  return (
    <>
      <Form onSubmit={form.handleSubmit} onReset={form.handleReset}>
        <h4 className={styles.carrierName__smaller}>
          Emergency Contact Details
        </h4>

        <Row>
          <BaseInput
            className="col-6 mt-3"
            name="EMERGENCY_CONTACT"
            placeholder="Emergency Contact"
            label="Emergency Contact Name"
            formik={form}
          />
        </Row>
        <Row>
          <Col>
            <BaseInputPhone
              className="col-10 mt-3"
              name="phone"
              placeholder="Phone Number"
              label="Phone Number"
              formik={form}
            />
          </Col>
          <Col>
            <BaseInput
              className="col-6 mt-3"
              name="RELATIONSHIP"
              placeholder="Relationship"
              label="Relationship"
              formik={form}
            />
          </Col>
        </Row>

        <Row className="mt-4">
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
