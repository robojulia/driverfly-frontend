import React, { useContext, useEffect, useState } from "react";
import styles from "../../../../styles/jotform.module.css";
import { Form, Button, Col, Row } from "react-bootstrap";
import { useTranslation } from "../../../../hooks/use-translation";
import { useFormik } from "formik";
import BaseInput from "../../base-input";
import BaseInputPhone from "../../base-input-phone";
import BaseSelect from "../../base-select";
import * as yup from "yup";
import BaseCheck from "../../base-check";
import { States } from "../../../../enums/users/us-states.enum";
import { BooleanPreferenceType } from "../../../../enums/users/boolean-preferences.enum";
import { EmploymentHistoryDto } from "../../../../models/jot-form/long-form/employment-history.dto";
import { PageProps } from "../../../../types/jotform/page-props.type";
import jotformContext from "../../../../context/jotform-context";

export interface EmploymentHistoryProps extends PageProps {}

export function EmploymentHistory({
  onNextClick,
  onBackClick,
}: EmploymentHistoryProps) {
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
    initialValues: new EmploymentHistoryDto(),
    validationSchema: EmploymentHistoryDto.yupSchema(),
    onSubmit: (values) => {
      onNextClick(values);
    },
    onReset: (values) => {
      onBackClick();
    },
  });
  useEffect(() => {
    console.log("error", form.errors);
  }, [form.values, form.errors]);

  return (
    <>
      <Form onSubmit={form.handleSubmit} onReset={form.handleReset}>
        <h4
          className={`${styles.carrierName__smaller} ${styles.striped__border}`}
        >
          Employment History
        </h4>
        <p className={styles.paragraph__left}>
          Please be honest about your past employment as this helps speed up the
          hiring process.
        </p>
        <Row className={styles.align__text_left}>
          <BaseCheck
            className="mt-2 col-6 float-left"
            required
            name="employed_type"
            label="CURRENTLY_EMPLYED_QUESTION"
            formik={form}
          />
        </Row>
        {form.values.employed_type ? (
          <>
            <Row>
              <h6
                className={`${styles.carrierName__smaller} ${styles.align__text_left}`}
              >
                Current Employer
              </h6>
              <p className={`${styles.paragraph} ${styles.align__text_left}`}>
                Put NA for any fields unknown
              </p>
            </Row>
            <Row>
              <Col className={styles.align__text_left}>
                <BaseInput
                  className="col-12 mt-3"
                  name="current_company_name"
                  label="CURRENT_COMPANY_NAME"
                  formik={form}
                />
              </Col>
              <Col className={styles.align__text_left}>
                <BaseInput
                  className="col-12 mt-3"
                  name="current_company_position"
                  label="CURRENT_COMPANY_POSITION"
                  formik={form}
                />
              </Col>
            </Row>

            <Row>
              <Col className={styles.align__text_left}>
                <BaseInput
                  className="col-10 mt-3"
                  required
                  type="date"
                  name="start_date"
                  label="START_DATE"
                  formik={form}
                />
              </Col>

              <Col className={styles.paragraph}>
                <BaseCheck
                  className="mt-3 col-10 float-left"
                  required
                  name="authorize"
                  label="CONATACT_AUTHORITY"
                  formik={form}
                />
              </Col>
            </Row>

            <Row className={styles.align__text_left}>
              <BaseInput
                className="col-6 mt-3"
                name="current_company_manager_name"
                label="MANAGER_OR_REPRESENTATIVE"
                formik={form}
              />
            </Row>

            <Row>
              <Col>
                <BaseInputPhone
                  className="col-10 mt-3 mb-2"
                  name="current_company_phone_number"
                  placeholder="phone"
                  label="CURRENT_COMPANY_NUMBER"
                  formik={form}
                />
              </Col>
              <Col>
                <BaseInput
                  className="col-10 mt-3 mb-2"
                  required
                  name="current_company_email"
                  label="CURRENT_COMPANY_EMAIL"
                  placeholder="email"
                  formik={form}
                />
              </Col>
            </Row>
            <Row>
              <h6
                className={`${styles.align__text_left} ${styles.carrierName__smaller}`}
              >
                Address(current company)
              </h6>
            </Row>
            <Row>
              <Col>
                <BaseInput
                  className="col-6 mt-3"
                  required
                  name="current_company_street_address_line_1"
                  placeholder="ADDRESS_LINE_1"
                  label="ADDRESS_LINE_1"
                  formik={form}
                />
              </Col>
            </Row>
            <Row>
              <Col>
                <BaseInput
                  className="col-6 mt-3"
                  required
                  name="current_company_street_address_line_2"
                  placeholder="ADDRESS_LINE_2"
                  label="ADDRESS_LINE_2"
                  formik={form}
                />
              </Col>
            </Row>
            <Row>
              <Col className={styles.align__text_left}>
                <BaseInput
                  className="col-12 mt-2"
                  required
                  name="current_company_zipcode"
                  placeholder="zip_code"
                  label="zip_code"
                  formik={form}
                />
              </Col>

              <Col className={styles.align__text_left}>
                <BaseInput
                  className="col-12 mt-4"
                  required
                  name="city"
                  label="City"
                  formik={form}
                />
              </Col>

              <Col className={styles.align__text_left}>
                <BaseSelect
                  className="col-12 mt-4"
                  required
                  enumType={States}
                  name="STATE"
                  placeholder="CHOOSE_STATE"
                  label="STATE"
                  formik={form}
                />
              </Col>
            </Row>

            <Row className={`${styles.align__text_left} ${styles.paragraph}`}>
              <Col>
                <BaseSelect
                  className="col-6 mt-4"
                  required
                  enumType={BooleanPreferenceType}
                  name="fmcsr"
                  placeholder="CHOOSE"
                  label="FMCR_QUESTION"
                  formik={form}
                />
              </Col>
            </Row>

            <Row className={`${styles.align__text_left} ${styles.paragraph}`}>
              <Col>
                <BaseSelect
                  className="col-6 mt-4"
                  required
                  enumType={BooleanPreferenceType}
                  name="fmcsr"
                  placeholder="CHOOSE"
                  label="JOB_DESIGNATED_CURRENT_COMPANY"
                  formik={form}
                />
              </Col>
            </Row>
          </>
        ) : null}

        {/* )} */}
        <Row className="mt-5">
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
