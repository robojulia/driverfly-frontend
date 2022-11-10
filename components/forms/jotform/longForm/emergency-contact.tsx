import React, { useContext, useEffect } from "react";
import styles from "../../../../styles/jotform.module.css";
import { Form, Button, Col, Row } from "react-bootstrap";
import { useTranslation } from "../../../../hooks/use-translation";
import { useFormik } from "formik";
import BaseInput from "../../base-input";
import BaseInputPhone from "../../base-input-phone";

import { PageProps } from "../../../../types/jotform/page-props.type";
import jotformContext from "../../../../context/jotform-context";
import { EmergenyContactDto } from "../../../../models/jot-form/long-form/emergency-contact.dto";

export interface EmergencyContactProps extends PageProps {}

export function EmergencyContact() {
  const {
    state: { steps, applicant },
    method: { setSteps, setApplicant },
  } = useContext(jotformContext);

  const { t } = useTranslation();
  const form = useFormik({
    initialValues: new EmergenyContactDto(),
    validationSchema: EmergenyContactDto.yupSchema(),

    onSubmit: (values) => {
      try {
        const {
          emergency_contact_name,
          emergency_contact_number,
          emergency_contact_relationship
        } = values;
        setApplicant({
          ...applicant,
          emergency_contact_name,
          emergency_contact_number,
          emergency_contact_relationship,
        });


        setSteps(steps + 1);
      } catch (error) {
        console.log(error);
      }
    },
    onReset: (values) => {
      setSteps(steps - 1);
    },
  });
  useEffect(() => {

    const {
      emergency_contact_name,
      emergency_contact_number,
      emergency_contact_relationship,
    } = applicant;
    form.setValues({
      ...form.values,
      emergency_contact_name: emergency_contact_name || null,
      emergency_contact_number: emergency_contact_number || null,
      emergency_contact_relationship: emergency_contact_relationship || null,
    });
  }, [applicant]);
  return (
    <>
      <Form onSubmit={form.handleSubmit} onReset={form.handleReset}>
        <h4 className={styles.carrierName__smaller}>
          Emergency Contact Details
        </h4>

        <Row className={styles.align__text_left}>
          <BaseInput
            className="col-6 mt-3"
            name="emergency_contact_name"
            placeholder="emergency_contact"
            label="EMERGENCY_CONTACT_NAME"
            formik={form}
          />
        </Row>
        <Row className={styles.align__text_left}>
          <Col>
            <BaseInputPhone
              className="col-10 mt-3"
              name="emergency_contact_number"
              placeholder="phone"
              label="phone"
              formik={form}
            />
          </Col>
          <Col>
            <BaseInput
              className="col-6 mt-3"
              name="emergency_contact_relationship"
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
