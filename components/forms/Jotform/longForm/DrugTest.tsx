import { useFormik } from "formik";
import React, { useEffect } from "react";
import { Button, Col, Row, Form } from "react-bootstrap";
import { useTranslation } from "../../../../hooks/use-translation";
import * as yup from "yup";
import BaseTextArea from "../../base-text-area";
import BaseCheck from "../../base-check";
import styles from "../../../../styles/jotform.module.css";
import { DrugTestDto } from "../../../../models/jot-form/long-form/drug-test.dto";
import { PageProps } from "../../../../types/jotform/page-props.type";

export interface DrugTestProps extends PageProps {
  // onNextClick: (any) => void;
  // onBackClick: () => void;
  applicant: any;
}

export function DrugTest(props: DrugTestProps) {
  useEffect(() => {
    if (props.applicant && !form.dirty) form.setValues(props.applicant);
  }, [props.applicant]);
  const { t } = useTranslation();
  const form = useFormik({
    initialValues: new DrugTestDto(),
    validationSchema: DrugTestDto.yupSchema(),
    onSubmit: (values) => {
      props.onNextClick(values);
    },
    onReset: (values) => {
      props.onBackClick();
    },
  });

  return (
    <Form onSubmit={form.handleSubmit} onReset={form.handleReset}>
      <Row className={styles.paragraph__left}>
        <BaseCheck
          className="float-left col-6"
          name="dot_declaration"
          label="Have you tested positive, or refused to 
                        test, on a pre-employment drug or alcohol test
                         by an employer subject to DOT regulations?"
          formik={form}
        />
      </Row>
      {form.values.dot_declaration ? (
        <Row className={styles.align__text_left}>
          <BaseTextArea
            className="float-left mt-3"
            name="explanations"
            label="Please explain past suspensions/revocations/denials:"
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
