import React, { useContext, useEffect } from "react";
import styles from "../../../../styles/jotform.module.css";
import { Form, Button, Col, Row } from "react-bootstrap";
import { useTranslation } from "../../../../hooks/use-translation";
import { useFormik } from "formik";
import BaseInput from "../../base-input";
import BaseInputPhone from "../../base-input-phone";
import BaseSelect from "../../base-select";
import * as yup from "yup";
import BaseCheck from "../../base-check";
import { BooleanPreferenceType } from "../../../../enums/users/boolean-preferences.enum";
import { States } from "../../../../enums/users/us-states.enum";
import { PastEmploymentHistoryDto } from "../../../../models/jot-form/long-form/past-employment-history.dto";
import { PageProps } from "../../../../types/jotform/page-props.type";
import jotformContext from "../../../../context/jotform-context";
import { ApplicantExtras } from "../../../../enums/applicants/applicant-extras.enum";
import { ApplicantExtrasEntity } from "../../../../models/applicant/applicant-extras.entity";
export interface PastEmploymentHistoryProps extends PageProps {}

export function PastEmploymentHistory() {
  const {
    state: { applicant, applicantExtras, steps },
    method: { setApplicant, updateApplicantExtras, setSteps },
  } = useContext(jotformContext);

  const { t } = useTranslation();
  const form = useFormik({
    initialValues: new PastEmploymentHistoryDto(),
    validationSchema: PastEmploymentHistoryDto.yupSchema(),
    onSubmit: (values) => {
      const { PAST_EMPLOYER } = values;
      updateApplicantExtras(PAST_EMPLOYER);
      setSteps(steps + 1);
    },
    onReset: (values) => {
      setSteps(steps - 1);
    },
  });

  useEffect(() => {
    const apx = applicantExtras?.find(
      (v) => v.type === ApplicantExtras.PAST_EMPLOYER
    );
    form.setValues({
      ...form.values,
      PAST_EMPLOYER: !!apx?.type
        ? apx
        : new ApplicantExtrasEntity(ApplicantExtras.PAST_EMPLOYER),
      is_previous_employed: !!apx?.value,
    });
  }, [applicantExtras]);

  useEffect(() => {
    console.log("values", form.values);
    console.log("error", form.errors);
  }, [form.values, form.errors]);

  return (
    <>
      <Form onSubmit={form.handleSubmit} onReset={form.handleReset}>
        <h4
          className={`${styles.carrierName__smaller} ${styles.striped__border}`}
        >
          {t("PAST_EMPLOYMENT_HISTORY")}
        </h4>
        <p className={styles.paragraph__left}>
          {t("HONEST_ABOUT_PAST_EMPLOYMENT")}
        </p>
        <Row className={styles.align__text_left}>
          <BaseCheck
            className="mt-2 col-6 float-left"
            name="is_previous_employed"
            label="PREVIOUSLY_EMPLOYED"
            formik={form}
          />
        </Row>
        {!!form.values.is_previous_employed && (
          <>
            <Row className={`${styles.paragraph} ${styles.align__text_left}`}>
              <BaseCheck
                className="mt-3 col-6 float-left"
                name="PAST_EMPLOYER.value.authorize"
                label="CONTACT_AUTHORIZATION"
                formik={form}
              />
            </Row>
            <Row className={styles.align__text_left}>
              <BaseInput
                className="col-4 mt-3"
                name="PAST_EMPLOYER.value.previous_company_manager_name"
                label="PREVIOUS_MANAGER_NAME"
                formik={form}
              />
            </Row>
            <Row>
              <Col className={styles.align__text_left}>
                <BaseInputPhone
                  className="col-10 mt-3 mb-2"
                  name="PAST_EMPLOYER.value.previous_company_phone_number"
                  placeholder="phone"
                  label="PREVIOUS_COMPANY_PHONE_NUMBER"
                  formik={form}
                />
              </Col>
              <Col className={styles.align__text_left}>
                <BaseInput
                  className="col-10 mt-3 mb-2"
                  required
                  name="PAST_EMPLOYER.value.previous_company_email"
                  label="PREVIOUS_COMPANY_EMAIL"
                  placeholder="email"
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
                  name="PAST_EMPLOYER.value.start_date"
                  label="START_DATE"
                  formik={form}
                />
              </Col>
              <Col className={styles.align__text_left}>
                <BaseInput
                  className="col-10 mt-3"
                  required
                  type="date"
                  name="PAST_EMPLOYER.value.end_date"
                  label="END_DATE"
                  formik={form}
                />
              </Col>
            </Row>
            <Row>
              <h6
                className={`${styles.align__text_left} ${styles.carrierName__smaller}`}
              >
                {t("ADDRESS_PAST_COMPANY")}
              </h6>
            </Row>
            <Row>
              <Col className={styles.align__text_left}>
                <BaseInput
                  className="col-6 mt-3"
                  required
                  name="PAST_EMPLOYER.value.previous_company_street_address_line_1"
                  placeholder="ADDRESS_LINE_1"
                  label="ADDRESS_LINE_1"
                  formik={form}
                />
              </Col>
            </Row>
            <Row>
              <Col className={styles.align__text_left}>
                <BaseInput
                  className="col-6 mt-3 mb-3"
                  required
                  name="PAST_EMPLOYER.value.previous_company_street_address_line_2"
                  placeholder="ADDRESS_LINE_2"
                  label="ADDRESS_LINE_2"
                  formik={form}
                />
              </Col>
            </Row>
            <Row>
              <Col className={styles.align__text_left}>
                <BaseInput
                  className="col-12 mt-4"
                  required
                  name="PAST_EMPLOYER.value.previous_company_zipcode"
                  placeholder="zip_code"
                  label="zip_code"
                  formik={form}
                />
              </Col>

              <Col className={styles.align__text_left}>
                <BaseInput
                  className="col-12 mt-4"
                  required
                  name="PAST_EMPLOYER.value.city"
                  label="City"
                  formik={form}
                />
              </Col>

              <Col className={styles.align__text_left}>
                <BaseSelect
                  className="col-12 mt-4"
                  required
                  enumType={States}
                  name="PAST_EMPLOYER.value.state"
                  placeholder="CHOOSE_STATE"
                  label="state"
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
                  name="PAST_EMPLOYER.value.fmcsr"
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
                  name="PAST_EMPLOYER.value.fcr"
                  placeholder="CHOOSE"
                  label="JOB_DESIGNATED_CURRENT_COMPANY"
                  formik={form}
                />
              </Col>
            </Row>
          </>
        )}
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
