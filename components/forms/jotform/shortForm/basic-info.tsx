import React, { useEffect, useContext, useState } from "react";
import { useFormik } from "formik";
import Form from "react-bootstrap/Form";
import { Button, Col, Row } from "react-bootstrap";
import InputMask from "react-input-mask";
import styles from "../../../../styles/digitalhiringapp.module.css";
import BaseInput from "../../base-input";
import BaseSelect from "../../base-select";
import { useTranslation } from "../../../../hooks/use-translation";
import { ContactDto } from "../../../../models/jot-form/short-form/contact.dto";
import JotformContext, {
  JotFormContextType,
} from "../../../../context/jotform-context";
import { ApplicantExtras } from "../../../../enums/applicants/applicant-extras.enum";
import { ApplicantExtrasEntity } from "../../../../models/applicant/applicant-extras.entity";
import { BooleanTypeExtra } from "../../../../enums/jotform/bool-and-not-sure.enum";
import ApplicantApi from "../../../../pages/api/applicant";
import { LoaderIcon } from "../../../loading/loader-icon";

export function BasicInfo() {
  const {
    state: { applicant, applicantExtras },
    method: {
      setApplicant,
      updateApplicantExtras,
      stepNext,
      stepBack,
      setApplicantExtras,
    },
  }: JotFormContextType = useContext(JotformContext);
  console.log("applicant", applicant);

  const { t } = useTranslation();

  const form = useFormik({
    initialValues: {
      ...new ContactDto(),
      authorize_to_communicate: BooleanTypeExtra.YES,
    },
    validationSchema: ContactDto.yupSchema(),
    onSubmit: async (values) => {
      console.log("values", values);
      try {
        const { email, zip_code, authorize_to_communicate } = values;

        setApplicant({
          ...applicant,
          email,
          zip_code,
          authorize_to_communicate,
        });

        stepNext();
      } catch (error) {
        console.log("error", error);
      }
    },
    onReset: (values) => {
      stepBack();
    },
  });

  useEffect(() => {
    form.setValues({
      ...form.values,
      email: applicant.email,
      authorize_to_communicate:
        applicant.authorize_to_communicate || BooleanTypeExtra.YES,
      zip_code: applicant.zip_code,
    });
  }, []);
  return (
    <>
      <h1 className={`${styles.carrierName} ${styles.jot_form_headers_font}`}>
        {t("basic_info")}
      </h1>

      <Form
        className={styles.align__text_left}
        onSubmit={form.handleSubmit}
        onReset={form.handleReset}
      >
        <Row className={styles.bold}>
          <BaseInput
            autoFocus
            className="col-md-6 my-3"
            required
            name="email"
            label="email"
            placeholder="email"
            formik={form}
          />
        </Row>
        <Row className={styles.bold}>
          <div className="col-12 my-3">
            <Form.Group>
              <Form.Label>{t("zip_code")}</Form.Label>
              <InputMask
                mask="99999"
                maskChar={null}
                value={form.values.zip_code}
                onChange={form.handleChange}
                onBlur={form.handleBlur}
                name="zip_code"
                className={`form-control ${
                  form.touched.zip_code && form.errors.zip_code
                    ? "is-invalid"
                    : ""
                }`}
                placeholder={t("zip_code")}
              />
              {form.touched.zip_code && form.errors.zip_code && (
                <Form.Control.Feedback type="invalid">
                  {form.errors.zip_code}
                </Form.Control.Feedback>
              )}
            </Form.Group>
          </div>
        </Row>
        <Row className={`${styles.align__text_left} ${styles.bold}`}>
          <BaseSelect
            className="col-12 my-3"
            required
            labelPrefix="BooleanPreferenceType"
            enumType={BooleanTypeExtra}
            name="authorize_to_communicate"
            placeholder="CHOOSE"
            label={t(
              "{company_name}_SMS_EMAIL_AUTHORIZATION_NAUTILIUS",
              { company_name: applicant?.company?.name },
              { translateProps: true }
            )}
            formik={form}
          />
        </Row>
        <Row className="mt-5">
          <Col>
            <Button className="float-right" type="reset">
              {t("BACK")}
            </Button>
          </Col>

          <Col>
            <Button
              disabled={form.isValidating || form.isSubmitting || !form.isValid}
              className="float-left theme-secondary-btn"
              type="submit"
            >
              {t("NEXT")} <LoaderIcon isLoading={!!form?.isSubmitting} />
            </Button>
          </Col>
        </Row>
      </Form>
    </>
  );
}
