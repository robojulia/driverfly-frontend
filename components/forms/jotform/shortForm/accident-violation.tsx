import * as yup from "yup";
import { useFormik } from "formik";
import { useTranslation } from "../../../../hooks/use-translation";
import React, { useContext } from "react";
import { Form, Button, Col, Row, Table } from "react-bootstrap";
import BaseInput from "../../base-input";
import BaseCheck from "../../base-check";
import { AcciedentViolationDto } from "../../../../models/jot-form/short-form/accident-violation.dto";
import { PageProps } from "../../../../types/jotform/page-props.type";
import jotformContext from "../../../../context/jotform-context";

export interface FifthPageProps extends PageProps {}

export function FifthPage({ onNextClick, onBackClick }: FifthPageProps) {
  const {
    state: { applicant },
  } = useContext(jotformContext);
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
  // useEffect(() => {
  //   const { email, phone, zip_code, options } = applicant;
  //   form.setValues({
  //     email: email || null,
  //     phone: phone || null,
  //     zip_code: zip_code || null,
  //     options: options || null,
  //   });
  // }, [applicant]);
  return (
    <>
      <Form onSubmit={form.handleSubmit} onReset={form.handleReset}>
        <Row>
          <BaseCheck
            className="col-6 mb-3"
            name="can_pass_drug_test"
            label="can_pass_drug_test"
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
            label="accidents_last_5_years"
            placeholder="PLACEHOLDER_FOR_DIGITS"
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
            label="voilations_in_last_3_years"
            placeholder="PLACEHOLDER_FOR_DIGITS"
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
