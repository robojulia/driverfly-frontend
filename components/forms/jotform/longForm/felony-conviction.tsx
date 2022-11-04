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

export interface FelonyConvictionProps extends PageProps {}

export function FelonyConviction() {
  const {
    state: { steps },
    method: { setSteps },
  } = useContext(jotformContext);

  const { t } = useTranslation();
  const form = useFormik({
    initialValues: new FelonyConvictionDto(),
    validationSchema: FelonyConvictionDto.yupSchema(),
    onSubmit: (values) => {
      setSteps(steps+1);
    },
    onReset: (values) => {
      setSteps(steps-1);
    },
  });

  return (
    <Form onSubmit={form.handleSubmit} onReset={form.handleReset}>
      <Row className={styles.paragraph__left}>
        <BaseCheck
          className="float-left col-6"
          name="felony_declaration"
          label="EVER_FELONY_QUESTION"
          formik={form}
        />
      </Row>
      {form.values.felony_declaration ? (
        <Row className={styles.align__text_left}>
          <BaseTextArea
            className="float-left mt-3"
            name="explanations"
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
