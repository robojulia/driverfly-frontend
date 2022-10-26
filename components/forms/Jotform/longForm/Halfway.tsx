import { useFormik } from "formik";
import React from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { useTranslation } from "../../../../hooks/use-translation";

export interface HalfwayProps {
  onNextClick: (any) => void;
  onBackClick: () => void;
}
export function Halfway(props: HalfwayProps) {
  const { t } = useTranslation();
  const form = useFormik({
    initialValues: {},
    onSubmit: (values) => {
      props.onNextClick(values);
    },
    onReset: (values) => {
      props.onBackClick();
    },
  });
  return (
    <>
      <Form onSubmit={form.handleSubmit} onReset={form.handleReset}>
        <h1>Hard Questions</h1>
        <h3>Please answer the following questions honestly. </h3>
        <h4>
          Your answers will not automatically exclude you from consideration.
        </h4>
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
