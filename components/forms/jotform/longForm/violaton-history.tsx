import { useFormik } from "formik";
import React, { useContext, useEffect } from "react";
import { Button, Col, Row, Form } from "react-bootstrap";
import { useTranslation } from "../../../../hooks/use-translation";
import * as yup from "yup";
import BaseInput from "../../base-input";
import { PageProps } from "../../../../types/jotform/page-props.type";
import jotformContext from "../../../../context/jotform-context";
import { ViolationHistoryDto } from "../../../../models/jot-form/long-form/violation-history.dto";

export interface ViolationsLast3YearsProps extends PageProps {}

export function ViolationsLast3Years({
  onNextClick,
  onBackClick,
}: ViolationsLast3YearsProps) {
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
    initialValues: new ViolationHistoryDto(),
    validationSchema: ViolationHistoryDto.yupSchema(),
    onSubmit: (values) => {
      onNextClick(values);
    },
    onReset: (values) => {
      onBackClick();
    },
  });
  return (
    <Form onSubmit={form.handleSubmit} onReset={form.handleReset}>
      <h6>{t("VIOLATIONS_LAST_3_YEARS")}</h6>
      <Row>
        <Col>
          <BaseInput
            className="col-6 mt-3"
            name="violations_last_3_years"
            label="HOW_MANY_VIOALTION_3_YEARS"
            formik={form}
          />
        </Col>
      </Row>
      <Row>
        <Col>
          <BaseInput
            className="col-12 mt-3"
            name="date_of_violation_1"
            label="VIOLATION_DATE"
            type="date"
            formik={form}
          />
        </Col>
        <Col>
          <BaseInput
            className="col-12 mt-3"
            name="location_1"
            label="location"
            formik={form}
          />
        </Col>
        <Col>
          <BaseInput
            className="col-12 mt-3"
            name="charge_1"
            label="CHARGE"
            formik={form}
          />
        </Col>
        <Col>
          <BaseInput
            className="col-12 mt-3"
            name="penalty_1"
            label="PENALTY"
            formik={form}
          />
        </Col>
      </Row>
      <Row>
        <Col>
          <BaseInput
            className="col-12 mt-3"
            name="date_of_violation_2"
            label="VIOLATION_DATE"
            type="date"
            formik={form}
          />
        </Col>
        <Col>
          <BaseInput
            className="col-12 mt-3"
            name="location_2"
            label="location"
            formik={form}
          />
        </Col>
        <Col>
          <BaseInput
            className="col-12 mt-3"
            name="charge_2"
            label="CHARGE"
            formik={form}
          />
        </Col>
        <Col>
          <BaseInput
            className="col-12 mt-3"
            name="penalty_2"
            label="PENALTY"
            formik={form}
          />
        </Col>
      </Row>

      <Row>
        <Col>
          <BaseInput
            className="col-12 mt-3"
            name="date_of_violation_3"
            label="VIOLATION_DATE"
            type="date"
            formik={form}
          />
        </Col>
        <Col>
          <BaseInput
            className="col-12 mt-3"
            name="location_3"
            label="location"
            formik={form}
          />
        </Col>
        <Col>
          <BaseInput
            className="col-12 mt-3"
            name="charge_3"
            label="CHARGE"
            formik={form}
          />
        </Col>
        <Col>
          <BaseInput
            className="col-12 mt-3"
            name="penalty_3"
            label="PENALTY"
            formik={form}
          />
        </Col>
      </Row>

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
