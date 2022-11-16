import { useFormik } from "formik";
import { useTranslation } from "../../../../hooks/use-translation";
import React, { useContext, useEffect } from "react";
import { Form, Button, Col, Row, Table } from "react-bootstrap";
import BaseInput from "../../base-input";
import BaseCheck from "../../base-check";
import { AccidentViolationDto } from "../../../../models/jot-form/short-form/accident-violation.dto";
import { PageProps } from "../../../../types/jotform/page-props.type";
import jotformContext from "../../../../context/jotform-context";
import BaseSelect from "../../base-select";
import { EligibleInUsa } from "../../../../enums/jotform/drug-test-eligible.enum";

export interface AccidentViolationProps extends PageProps {}

export function AccidentViolation() {
  const {
    state: { applicant, applicantExtras },
    method: { setApplicant, updateApplicantExtras, stepNext, stepBack },
  } = useContext(jotformContext);

  const { t } = useTranslation();

  const form = useFormik({
    initialValues: new AccidentViolationDto(),
    validationSchema: AccidentViolationDto.yupSchema(),
    onSubmit: (values) => {
      const { can_pass_drug_test, accident_count, moving_violations_count } =
        values;
      setApplicant({
        ...applicant,
        can_pass_drug_test,
        accident_count,
        moving_violations_count,
      });
      stepNext();
    },
    onReset: (values) => {
      stepBack();
    },
  });
  useEffect(() => {
    const { can_pass_drug_test, accident_count, moving_violations_count } =
      applicant;
    form.setValues({
      can_pass_drug_test: can_pass_drug_test || null,
      accident_count: accident_count || null,
      moving_violations_count: moving_violations_count || null,
    });
  }, []);
  return (
    <>
      <Form onSubmit={form.handleSubmit} onReset={form.handleReset}>
        <Row>
          <BaseCheck
            className="col-12 my-3"
            name="can_pass_drug_test"
            label="can_pass_drug_test"
            formik={form}
          />
        </Row>
        <Row>
          <BaseInput
            className="col-12 my-3 "
            name="accident_count"
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
            className="col-12 my-3"
            name="moving_violations_count"
            type="number"
            step={1}
            min={0}
            label="voilations_in_last_3_years"
            placeholder="PLACEHOLDER_FOR_DIGITS"
            formik={form}
          />
        </Row>
        <Row>
          <BaseSelect
            className="col-12 my-3"
            name="ELIGIBLE_TO_WORK_IN_US"
            label="ELIGIBLE_TO_WORK_IN_US"
            labelPrefix="EligibleInUsa"
            enumType={EligibleInUsa}
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
