import React, { useEffect, useState, useContext } from "react";
import Form from "react-bootstrap/Form";
import styles from "../../../../styles/jotform.module.css";
import { Button, Col, Row } from "react-bootstrap";
import BaseInput from "../../base-input";
import BaseInputPhone from "../../base-input-phone";
import BaseSelect from "../../base-select";
import { useFormik } from "formik";
import { useTranslation } from "../../../../hooks/use-translation";
import { ContactDto } from "../../../../models/jot-form/short-form/contact.dto";
import ApplicantApi from "../../../../pages/api/applicant";
import { ApplicantEntity } from "../../../../models/applicant/applicant.entity";
import jotformContext from "../../../../context/jotform-context";

export interface ThirdPageProps {
  onNextClick: (values: any) => void;
  onBackClick: () => void;
}

export function ThirdPage(props: ThirdPageProps) {
  const {
    method: { setApplicant },
    state: { applicant },
  } = useContext(jotformContext);

  const { t } = useTranslation();
  const form = useFormik({
    initialValues: new ContactDto(),
    validationSchema: ContactDto.yupSchema(),
    onSubmit: (values) => {
      // setApplicant(values)
      props.onNextClick(values);
      
    },
    onReset: (values) => {
      props.onBackClick();
    },
  });
  // useEffect(() => {
  //   const { email, phone, zip_code, options } = applicant;
  //   form.setValues({ email, phone, zip_code, options });
  // }, []);
  const getInfoByPhone = ({ target: { name, value } }) => {
    const applicantApi = new ApplicantApi();
    const response = applicantApi.search({ [name]: value });
    form.setFieldValue(name, value);
    setApplicant(response[0]);
    console.log("response", response);
  };
  return (
    <>
      <Form
        className={styles.align__text_left}
        onSubmit={form.handleSubmit}
        onReset={form.handleReset}
      >
        <Row>
          <BaseInput
            className="col-6"
            required
            name="email"
            label="E-mail"
            placeholder="EMAIL"
            formik={form}
          />
        </Row>
        <Row className="mt-3">
          <BaseInputPhone
            className="col-6"
            required
            name="phone"
            label="Phone Number"
            placeholder="PHONE_NUMBER"
            onChange={getInfoByPhone}
            formik={form}
          />
        </Row>
        <Row className="mt-3">
          <BaseInput
            className="col-6"
            required
            name="zip_code"
            label="Zip Code"
            placeholder="ZIP_CODE"
            formik={form}
          />
        </Row>
        <Row>
          <BaseSelect
            className="mt-3"
            required
            options={["Yes", "No"]}
            name="options"
            placeholder="Click to choose"
            label="I authorize Nautilus Trucking and any applicable third parties associated with Nautilus Trucking the ability to send me SMS and email communications regarding job availabilities and other relevant resources."
            formik={form}
          />
        </Row>
        <Row className="mt-3">
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
