import React, { useEffect } from "react";
import styles from "../../../../styles/JotForm.module.css";
import { Form, Button, Col, Row } from "react-bootstrap";
import { useTranslation } from "../../../../hooks/useTranslation";
import { useFormik } from "formik";
import BaseInput from "../../BaseInput";
import * as yup from "yup";
import BaseSelect from "../../BaseSelect";
import moment from "moment";
import { States } from "../../../../enums/users/us-states.enum";

export interface BackgroundInfoProps {
  onNextClick: (any) => void;
  onBackClick: () => void;
  applicant: any;
}

export function BackgroundInfo(props: BackgroundInfoProps) {
  useEffect(() => {
    if (props.applicant && !form.dirty) form.setValues(props.applicant);
  }, [props.applicant]);
  const { t } = useTranslation();
  const form = useFormik({
    initialValues: {
      birthdate: null,
      address_line_1: null,
      address_line_2: null,
      city: null,
      state: null,
      zip_code: null,
    },
    validationSchema: yup.object({
      birthdate: yup
        .date()
        .typeError("INVALID_DATE")
        .max(moment().endOf("day").subtract(18, "years"), "TOO YOUNG TO DRIVE"),
      address_line_1: yup.string().required().nullable(),
      city: yup.string().required().nullable(),
      state: yup.string().required().nullable(),
      zip_code: yup.number().required(),
    }),
    onSubmit: (values) => {
      props.onNextClick(values);
    },
    onReset: (values) => {
      props.onBackClick();
    },
  });

  return (
    <Form onSubmit={form.handleSubmit} onReset={form.handleReset}>
      <h4 className={styles.carrierName__smaller}>Background Information</h4>
      <Row className={styles.align__text_left}>
        <BaseInput
          className="col-3 mt-3 mb-3"
          required
          type="date"
          name="birthdate"
          placeholder="Date of Birth"
          label="birthdate"
          formik={form}
        />
      </Row>
      <p
        className={`${styles.carrierName__smaller} ${styles.align__text_left}
            ${styles.paragraph}`}
      >
        What is your full Address?
      </p>
      <Row className={styles.align__text_left}>
        <BaseInput
          className="col-6"
          required
          name="address_line_1"
          placeholder="STREET ADDRESS LINE 1"
          label="Address Line 1"
          formik={form}
        />
      </Row>
      <Row className={styles.align__text_left}>
        <BaseInput
          className="col-6 mt-3"
          required
          name="address_line_2"
          placeholder="STREET ADDRESS LINE 2"
          label="Address Line 2"
          formik={form}
        />
      </Row>

      <Row className={styles.align__text_left}>
        <Col>
          <BaseInput
            className="col-12 mt-2 float-left"
            required
            name="city"
            placeholder="CITY"
            label="City"
            formik={form}
          />
        </Col>
        <Col>
          <BaseSelect
            className="col-12 mt-2"
            required
            enumType={States}
            name="state"
            placeholder="CHOOSE STATE"
            label="State"
            formik={form}
          />
        </Col>
      </Row>
      <Row className={styles.align__text_left}>
        <BaseInput
          className="col-3 mt-2"
          required
          name="zip_code"
          placeholder="POSTAL/ZIP CODE"
          label="Zip Code"
          formik={form}
        />
      </Row>
      <Row className="mt-2">
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
  );
}
