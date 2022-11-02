import React, { useContext, useEffect } from "react";
import styles from "../../../../styles/jotform.module.css";
import { Form, Button, Col, Row } from "react-bootstrap";
import { useTranslation } from "../../../../hooks/use-translation";
import { useFormik } from "formik";
import BaseInput from "../../base-input";
import BaseInputPhone from "../../base-input-phone";
import { EmergencyContactDto } from "../../../../models/jot-form/long-form/emergency-contact.dto";
import { PageProps } from "../../../../types/jotform/page-props.type";
import jotformContext from "../../../../context/jotform-context";

export interface EmergencyContactProps extends PageProps {}

export function EmergencyContact({onNextClick, onBackClick}: EmergencyContactProps) {
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
  const form = useFormik({
    initialValues: new EmergencyContactDto(),
    // validationSchema: EmergencyContactDto.yupSchema(),
    onSubmit: (values) => {
      onNextClick(values);
    },
    onReset: (values) => {
      onBackClick();
    },
  });

  return (
    <>
      <Form onSubmit={form.handleSubmit} onReset={form.handleReset}>
        <h4 className={styles.carrierName__smaller}>
          Emergency Contact Details
        </h4>

        <Row className={styles.align__text_left}>
          <BaseInput
            className='col-6 mt-3'
            name="EMERGENCY_CONTACT"
            placeholder="emergency_contact"
            label="EMERGENCY_CONTACT_NAME"
            formik={form}
          />
        </Row>
        <Row className={styles.align__text_left}>
          <Col>
            <BaseInputPhone
              className='col-10 mt-3'
              name="phone"
              placeholder="phone"
              label="phone"
              formik={form}
            />
          </Col>
          <Col>
            <BaseInput
              className='col-6 mt-3'
              name="RELATIONSHIP"
              placeholder="relationship"
              label="relationship"
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
