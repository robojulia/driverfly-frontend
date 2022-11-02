import { useFormik } from "formik";
import React, { useContext, useEffect } from "react";
import { Button, Col, Row, Form } from "react-bootstrap";
import { useTranslation } from "../../../../hooks/use-translation";
import * as yup from "yup";
import BaseTextArea from "../../base-text-area";
import BaseCheck from "../../base-check";
import styles from "../../../../styles/jotform.module.css";
import { DrugTestDto } from "../../../../models/jot-form/long-form/drug-test.dto";
import { PageProps } from "../../../../types/jotform/page-props.type";
import jotformContext from "../../../../context/jotform-context";

export interface DrugTestProps extends PageProps {}

export function DrugTest({ onNextClick, onBackClick }: DrugTestProps) {
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
    initialValues: new DrugTestDto(),
    validationSchema: DrugTestDto.yupSchema(),
    onSubmit: (values) => {
      onNextClick(values);
    },
    onReset: (values) => {
      onBackClick();
    },
  });

  return (
    <Form onSubmit={form.handleSubmit} onReset={form.handleReset}>
      <Row className={styles.paragraph__left}>
        <BaseCheck
          className="float-left col-6"
          name="dot_declaration"
          label="DRUG_TEST_TESTIMONY_QUESTION"
          formik={form}
        />
      </Row>
      {form.values.dot_declaration ? (
        <Row className={styles.align__text_left}>
          <BaseTextArea
            className="float-left mt-3"
            name="explanations"
            label="PLEASE_EXPLAIN"
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
