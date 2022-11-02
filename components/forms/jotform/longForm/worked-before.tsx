import { useFormik } from "formik";
import React, { useEffect } from "react";
import { Button, Col, Row, Form } from "react-bootstrap";
import { useTranslation } from "../../../../hooks/use-translation";
import * as yup from "yup";
import BaseCheck from "../../base-check";
import BaseInput from "../../base-input";
import { PageProps } from "../../../../types/jotform/page-props.type";

export interface WorkedBeforeProps extends PageProps {
  // onNextClick: (any) => void;
  // onBackClick: () => void;
  applicant: any;
}

export function WorkedBefore(props: WorkedBeforeProps) {
  useEffect(() => {
    if (props.applicant && !form.dirty) form.setValues(props.applicant);
  }, [props.applicant]);
  const { t } = useTranslation();
  const form = useFormik({
    initialValues: {
      applied_before: false,
      worked_before: false,
      from_date: null,
      to_date: null,
    },
    validationSchema: yup.object({
      worked_before: yup.boolean().when("applied_before", {
        is: (v) => !!v,
        then: yup.boolean().required().nullable(),
        otherwise: yup.boolean().optional().nullable(),
      }),
      from_date: yup.date().when("worked_before", {
        is: (v) => !!v,
        then: yup.date().required().nullable(),
        otherwise: yup.date().optional().nullable(),
      }),
      to_date: yup.date().when("worked_before", {
        is: (v) => !!v,
        then: yup.date().required().nullable(),
        otherwise: yup.date().optional().nullable(),
      }),
    }),

    onSubmit: (values) => {
      props.onNextClick(values);
    },
    onReset: (values) => {
      props.onBackClick();
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
