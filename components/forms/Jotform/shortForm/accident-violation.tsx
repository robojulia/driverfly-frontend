import * as yup from "yup";
import { useFormik } from "formik";
import { useTranslation } from "../../../../hooks/use-translation";
import React from "react";
import { Form, Button, Col, Row, Table } from "react-bootstrap";
import BaseInput from "../../base-input";
import BaseCheck from "../../base-check";
import { AcciedentViolationDto } from "../../../../models/jot-form/short-form/accident-violation.dto";
import { PageProps } from "../../../../types/jotform/page-props.type";

export interface FifthPageProps extends PageProps {}

export function FifthPage({ onNextClick, onBackClick }: FifthPageProps) {
  const { t } = useTranslation();
  const form = useFormik({
    initialValues: new AcciedentViolationDto(),
    validationSchema: AcciedentViolationDto.yupSchema(),
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
        <Row>
          <BaseCheck
            className="col-6 mb-3"
            name="can_pass_drug_test"
            label="Can you pass a drug test?"
            formik={form}
          />
        </Row>
        <Row>
          <BaseInput
            className="col-6 mt-3 mb-3"
            name="accidents_last_5_years"
            type="number"
            step={1}
            min={0}
            label="Accidents within the last 5 years?"
            placeholder="ex:2"
            formik={form}
          />
        </Row>
        <Row>
          <BaseInput
            className="col-6 mt-4"
            name="voilations_in_last_3_years"
            type="number"
            step={1}
            min={0}
            label="Number of moving violations in the last 3 years?"
            placeholder="ex:2"
            formik={form}
          />
        </Row>
        <Row className={"mt-3"}>
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
