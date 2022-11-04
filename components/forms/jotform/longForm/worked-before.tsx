import { useFormik } from "formik";
import React, { useContext, useEffect } from "react";
import { Button, Col, Row, Form } from "react-bootstrap";
import { useTranslation } from "../../../../hooks/use-translation";
import * as yup from "yup";
import BaseCheck from "../../base-check";
import BaseInput from "../../base-input";
import { PageProps } from "../../../../types/jotform/page-props.type";
import jotformContext from "../../../../context/jotform-context";
import { WorkedBeforeDto } from "../../../../models/jot-form/long-form/worked-before.dto";

export interface WorkedBeforeProps extends PageProps {}

export function WorkedBefore() {
  const {
    state: { applicant, applicantExtras, steps },
    method: { setApplicant, updateApplicantExtras, setSteps },
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
    initialValues: new WorkedBeforeDto(),
    validationSchema: WorkedBeforeDto.yupSchema(),

    onSubmit: (values) => {
      setSteps(steps + 1);
    },
    onReset: (values) => {
      setSteps(steps + 1);
    },
  });
  return (
    <Form onSubmit={form.handleSubmit} onReset={form.handleReset}>
      <Row>
        <Col>
          <BaseCheck
            className="float-left col-6"
            name="applied_before"
            label="APPLIED_HERE_BEFORE"
            formik={form}
          />
        </Col>
      </Row>
      {form.values.applied_before ? (
        <>
          <Row>
            <Col>
              <BaseCheck
                className="mt-3 col-6 float-left"
                name="worked_before"
                label="WORKED_HERE_BEFORE"
                formik={form}
              />
            </Col>
          </Row>
          {form.values.worked_before ? (
            <>
              <Row>
                <Col>
                  <BaseInput
                    className="col-6 mt-3"
                    required
                    type="date"
                    name="from_date"
                    placeholder="DATE"
                    label="FROM"
                    formik={form}
                  />
                </Col>
                <Col>
                  <BaseInput
                    className="col-6 mt-3"
                    required
                    type="date"
                    name="to_date"
                    placeholder="DATE"
                    label="TO"
                    formik={form}
                  />
                </Col>
              </Row>
            </>
          ) : null}
        </>
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
