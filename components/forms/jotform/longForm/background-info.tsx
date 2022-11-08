import React, { useContext, useEffect } from "react";
import styles from "../../../../styles/jotform.module.css";
import { Form, Button, Col, Row } from "react-bootstrap";
import { useTranslation } from "../../../../hooks/use-translation";
import { useFormik } from "formik";
import BaseInput from "../../base-input";
import * as yup from "yup";
import BaseSelect from "../../base-select";
import moment from "moment";
import { States } from "../../../../enums/users/us-states.enum";
import { BackgroundInfoDto } from "../../../../models/jot-form/long-form/background-info.dto";
import { PageProps } from "../../../../types/jotform/page-props.type";
import jotformContext from "../../../../context/jotform-context";

export interface BackgroundInfoProps extends PageProps {}

export function BackgroundInfo({
  onNextClick,
  onBackClick,
}: BackgroundInfoProps) {
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
    initialValues: new BackgroundInfoDto(),
    validationSchema: BackgroundInfoDto.yupSchema(),
    onSubmit: (values) => {
      onNextClick(values);
    },
    onReset: (values) => {
      onBackClick();
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
          placeholder="birthdate"
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
          placeholder="ADDRESS_LINE_1"
          label="ADDRESS_LINE_1"
          formik={form}
        />
      </Row>
      <Row className={styles.align__text_left}>
        <BaseInput
          className="col-6 mt-3"
          required
          name="address_line_2"
          placeholder="ADDRESS_LINE_2"
          label="ADDRESS_LINE_2"
          formik={form}
        />
      </Row>

      <Row className={styles.align__text_left}>
        <Col>
          <BaseInput
            className="col-12 mt-2 float-left"
            required
            name="city"
            placeholder="city"
            label="city"
            formik={form}
          />
        </Col>
        <Col>
          <BaseSelect
            className="col-12 mt-2"
            required
            enumType={States}
            name="state"
            placeholder="CHOOSE_STATE"
            label="state"
            formik={form}
          />
        </Col>
      </Row>
      <Row className={styles.align__text_left}>
        <BaseInput
          className="col-3 mt-2"
          required
          name="zip_code"
          placeholder="zip_code"
          label="zip_code"
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
