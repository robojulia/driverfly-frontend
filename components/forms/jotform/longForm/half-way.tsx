import { useFormik } from "formik";
import React, { useEffect } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { useTranslation } from "../../../../hooks/use-translation";
import { PageProps } from "../../../../types/jotform/page-props.type";

export interface HalfwayProps extends PageProps {}

export function Halfway({ onNextClick, onBackClick }: HalfwayProps) {
  const { t } = useTranslation();
  const form = useFormik({
    initialValues: {},
    onSubmit: (values) => {
      onNextClick(values);
    },
    onReset: (values) => {
      onBackClick();
    },
  });
  return (
    <>
      <Form onSubmit={form.handleSubmit} onReset={form.handleReset}>
        <h1>{t("HARD_QUESTIONS")}</h1>
        {/* <img src={giphy} alt="my-gif" /> */}
        <h3>{t("ANSWER_FOLLOWIN_QUESTIONS")}</h3>
        <h4>{t("EXCLUDE_CONSIDERATION")}</h4>
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
