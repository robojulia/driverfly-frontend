import { useFormik } from "formik";
import React, { useContext, useEffect } from "react";
import { Button, Col, Row, Form } from "react-bootstrap";
import { useTranslation } from "../../../../hooks/use-translation";
import * as yup from "yup";
import BaseTextArea from "../../base-text-area";
import BaseCheck from "../../base-check";
import styles from "../../../../styles/jotform.module.css";
import { PageProps } from "../../../../types/jotform/page-props.type";
import jotformContext from "../../../../context/jotform-context";
import { UnableForJobDto } from "../../../../models/jot-form/long-form/unable-for-job.dto";
import { ApplicantExtras } from "../../../../enums/applicants/applicant-extras.enum";
import { ApplicantExtrasEntity } from "../../../../models/applicant/applicant-extras.entity";

export interface UnableForJobProps extends PageProps {}

export function UnableForJob() {
  const {
    state: { applicant, applicantExtras, steps },
    method: {
      setApplicant,
      updateApplicantExtras,
      setSteps,
      stepNext,
      stepBack,
    },
  } = useContext(jotformContext);

  const { t } = useTranslation();
  const form = useFormik({
    initialValues: new UnableForJobDto(),
    validationSchema: UnableForJobDto.yupSchema(),
    onSubmit: (values) => {
      const { REASON_FOR_UNABLE_TO_PERFORM_JOB } = values;
      updateApplicantExtras(REASON_FOR_UNABLE_TO_PERFORM_JOB);
      stepNext();
    },
    onReset: (values) => {
      stepBack();
    },
  });
  useEffect(() => {
    const apx = applicantExtras?.find(
      (v) => v.type === ApplicantExtras.REASON_FOR_UNABLE_TO_PERFORM_JOB
    );
    form.setValues({
      ...form.values,
      REASON_FOR_UNABLE_TO_PERFORM_JOB: !!apx?.type
        ? apx
        : new ApplicantExtrasEntity(
            ApplicantExtras.REASON_FOR_UNABLE_TO_PERFORM_JOB
          ),
      is_unable_to_perform: !!apx?.value,
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
          name="is_unable_to_perform"
          label="REASON_UNABLE_TO_PERFORM"
          formik={form}
        />
      </Row>
      {form.values.is_unable_to_perform ? (
        <Row className={styles.align__text_left}>
          <BaseTextArea
            className="float-left mt-3"
            name="REASON_FOR_UNABLE_TO_PERFORM_JOB.value"
            label="EXPLAIN_SUSPENSION"
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
