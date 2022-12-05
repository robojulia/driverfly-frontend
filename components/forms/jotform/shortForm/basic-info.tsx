import React, { useEffect, useContext } from "react";
import Form from "react-bootstrap/Form";
import styles from "../../../../styles/jotform.module.css";
import { Button, Col, Row } from "react-bootstrap";
import BaseInput from "../../base-input";
import BaseInputPhone from "../../base-input-phone";
import BaseSelect from "../../base-select";
import { useFormik } from "formik";
import { useTranslation } from "../../../../hooks/use-translation";
import { ContactDto } from "../../../../models/jot-form/short-form/contact.dto";
import jotformContext from "../../../../context/jotform-context";
import { PageProps } from "../../../../types/jotform/page-props.type";
import { ApplicantExtras } from "../../../../enums/applicants/applicant-extras.enum";
import { ApplicantExtrasEntity } from "../../../../models/applicant/applicant-extras.entity";
import { BooleanTypeExtra } from "../../../../enums/jotform/bool-and-not-sure.enum";

export interface BasicInfoProps extends PageProps {}

export function BasicInfo() {
  const {
    state: { applicant, applicantExtras },
    method: { setApplicant, updateApplicantExtras, stepNext, stepBack },
  } = useContext(jotformContext);

  const { t } = useTranslation();

  const form = useFormik({
    initialValues: new ContactDto(),
    validationSchema: ContactDto.yupSchema(),
    onSubmit: (values) => {
      try {
        console.log("values", values);
        const { email, phone, zip_code, AUTHORIZE_TO_COMMUNICATE } = values;

        setApplicant({
          ...applicant,
          email,
          phone,
          zip_code,
        });

        updateApplicantExtras(AUTHORIZE_TO_COMMUNICATE);

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
    const apx = applicantExtras?.find(
      (v) => v.type === ApplicantExtras.AUTHORIZE_TO_COMMUNICATE
    );
    form.setValues({
      ...form.values,
      AUTHORIZE_TO_COMMUNICATE: !!apx?.type
        ? apx
        : new ApplicantExtrasEntity(ApplicantExtras.AUTHORIZE_TO_COMMUNICATE),
      email: applicant.email,
      phone: applicant.phone,
      zip_code: applicant.zip_code,
    });
  }, []);

  return (
    <>
      <Form
        className={styles.align__text_left}
        onSubmit={form.handleSubmit}
        onReset={form.handleReset}
      >
        <Row>
          <BaseInput
						className="col-md-6 my-3"
            required
            name="email"
            label="email"
            placeholder="email"
            formik={form}
          />
          <BaseInputPhone
						className="col-md-6 my-3"
            required
            name="phone"
            label="phone"
            formik={form}
          />
        </Row>
        <Row>
          <BaseInput
            className="col-12 my-3"
            required
            name="zip_code"
            label="zip_code"
            placeholder="zip_code"
            formik={form}
          />
        </Row>
        <Row className={styles.align__text_left}>
          <BaseSelect
            className="col-12 my-3"
            required
            labelPrefix="BooleanPreferenceType"
            enumType={BooleanTypeExtra}
            name="AUTHORIZE_TO_COMMUNICATE.value"
            placeholder="CHOOSE"
            label="SMS_EMAIL_AUTHORIZATION_NAUTILIUS"
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
            <Button className="float-left theme-secondary-btn" type="submit">
              {t("NEXT")}
            </Button>
          </Col>
        </Row>
      </Form>
    </>
  );
}
