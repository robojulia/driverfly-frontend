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
import { ApplicantExtras } from "../../../../enums/applicants/applicant-extras.enum";
import { ApplicantExtrasEntity } from "../../../../models/applicant/applicant-extras.entity";

export interface BackgroundInfoProps extends PageProps {}

export function BackgroundInfo() {
  const {
    state: { steps, applicant, applicantExtras },
    method: { setSteps, setApplicant, updateApplicantExtras },
  } = useContext(jotformContext);

  const { t } = useTranslation();
  const form = useFormik({
    initialValues: new BackgroundInfoDto(),
    validationSchema: BackgroundInfoDto.yupSchema(),
    onSubmit: (values) => {
      try {
        const { birthdate, LINE_ADDRESS, city, state, zip_code } = values;

        setApplicant({ ...applicant, birthdate, city, state, zip_code });
        updateApplicantExtras(LINE_ADDRESS);
        setSteps(steps + 1);
      } catch (error) {
        console.log(error);
      }
      setSteps(steps + 1);
    },
    onReset: (values) => {
      setSteps(steps - 1);
    },
  });
  useEffect(() => {
    const { birthdate, city, state, zip_code } = applicant;
    const apx = applicantExtras?.find(
      (v) => v.type === ApplicantExtras.LINE_ADDRESS
    );
    form.setValues({
      ...form.values,
      LINE_ADDRESS: !!apx?.type
        ? apx
        : new ApplicantExtrasEntity(ApplicantExtras.LINE_ADDRESS),
      birthdate: birthdate || null,
      city: city || null,
      state: state || null,
      zip_code: zip_code || null,
    });
  }, [applicant]);
  useEffect(() => {
    console.log("form values", form.values);
    console.log("form eror", form.errors);
   
  }, [form.values, form.errors]);

  return (
    <Form onSubmit={form.handleSubmit} onReset={form.handleReset}>
      <h4 className={styles.carrierName__smaller}>{t("BACKGROUND_INFO")}</h4>
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
            ${styles.paragraph}`}>
        {t("FULL_ADDRESS_QUES")}
      </p>

      <>
        <Row>
          <div className="col-md-12 mt-2">
            <Row className={styles.align__text_left}>
              <BaseInput
                className="col-6"
                required
                name={`LINE_ADDRESS.value.address_1`}
                placeholder="ADDRESS_LINE_1"
                label="ADDRESS_LINE_1"
                formik={form}
              />
            </Row>
            <Row className={styles.align__text_left}>
              <BaseInput
                className="col-6"
                required
                name={`LINE_ADDRESS.value.address_2`}
                placeholder="ADDRESS_LINE_2"
                label="ADDRESS_LINE_2"
                formik={form}
              />
            </Row>
          </div>
        </Row>
      </>

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
