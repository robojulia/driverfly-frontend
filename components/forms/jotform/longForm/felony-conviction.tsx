import { useFormik } from "formik";
import React, { useContext, useEffect } from "react";
import { Button, Col, Row, Form } from "react-bootstrap";
import { useTranslation } from "../../../../hooks/use-translation";
import * as yup from "yup";
import BaseTextArea from "../../base-text-area";
import BaseCheck from "../../base-check";
import styles from "../../../../styles/jotform.module.css";
import { FelonyConvictionDto } from "../../../../models/jot-form/long-form/felony-conviction.dto";
import { PageProps } from "../../../../types/jotform/page-props.type";
import jotformContext from "../../../../context/jotform-context";
import { ApplicantExtras } from "../../../../enums/applicants/applicant-extras.enum";
import { ApplicantExtrasEntity } from "../../../../models/applicant/applicant-extras.entity";

export interface FelonyConvictionProps extends PageProps {}

export function FelonyConviction() {
  const {
    state: { steps, applicant, applicantExtras },
    method: { setSteps, updateApplicantExtras },
  } = useContext(jotformContext);

  const { t } = useTranslation();
  const form = useFormik({
    initialValues: new FelonyConvictionDto(),
    validationSchema: FelonyConvictionDto.yupSchema(),
    onSubmit: (values) => {
      const { CONVICTED_OF_FELONY } = values;
      updateApplicantExtras(CONVICTED_OF_FELONY);
      setSteps(steps + 1);
    },
    onReset: (values) => {
      setSteps(steps - 1);
    },
  });
  useEffect(() => {
    const apx = applicantExtras?.find(
      (v) => v.type === ApplicantExtras.CONVICTED_OF_FELONY
    );
    form.setValues({
      ...form.values,
      CONVICTED_OF_FELONY: !!apx?.type
        ? apx
        : new ApplicantExtrasEntity(ApplicantExtras.CONVICTED_OF_FELONY),
      is_convicted_felony: !!apx?.value,
    });
  }, [applicantExtras]);

  useEffect(() => {
    console.log("values", form.values);
    console.log("error", form.errors);
  }, [form.values, form.errors]);
  return (
    <Form onSubmit={form.handleSubmit} onReset={form.handleReset}>
      <Row className={styles.paragraph__left}>
        <BaseCheck
          className="float-left col-6"
          name="is_convicted_felony"
          label="EVER_FELONY_QUESTION"
          formik={form}
        />
      </Row>
      {form.values.is_convicted_felony ? (
        <Row className={styles.align__text_left}>
          <BaseTextArea
            className="float-left mt-3"
            name="CONVICTED_OF_FELONY.value"
            label="PAST_CONVICTION"
            formik={form}
          />
        </Row>
      ) : null}

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
  );
}
