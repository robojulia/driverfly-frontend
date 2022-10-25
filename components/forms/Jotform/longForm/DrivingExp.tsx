import React, { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import styles from "../../../../styles/Jotform.module.css";
import * as yup from "yup";
import { Button, Col, Row } from "react-bootstrap";
import BaseInput from "../../BaseInput";
import BaseInputPhone from "../../BaseInputPhone";
import BaseSelect from "../../BaseSelect";
import { useFormik } from "formik";
import { useTranslation } from "../../../../hooks/useTranslation";
import { Radio } from "@mui/material";
import BaseCheck from "../../BaseCheck";
import moment from "moment";
import { States } from "../../../../enums/users/us-states.enum";

export interface DrivingExpProps {
  onNextClick: (any) => void;
  onBackClick: () => void;
  applicant: any;
}
export function DrivingExp(props: DrivingExpProps) {
  useEffect(() => {
    if (props.applicant && !form.dirty) form.setValues(props.applicant);
  }, [props.applicant]);
  const { t } = useTranslation();
  const form = useFormik({
    initialValues: {
      cdl_number: null,
      state: null,
      expiration_date: null,
      state_issued: null,
    },
    validationSchema: yup.object({
      expiration_date: yup
        .date()
        .typeError("INVALID_DATE")
        .min(
          moment().endOf("day").add(0.5, "years"),
          "Your License should at least be valid for 6 more months"
        ),
      state: yup.string().required().nullable(),
      cdl_number: yup.string().required().nullable(),
      state_issued: yup.string().required().nullable(),
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
      <h4 className={styles.carrierName__smaller}>Driving Experience</h4>
      <Row>
        <Col>
          <BaseInput
            className="col-12 mt-3"
            required
            name="cdl_number"
            placeholder="CDL License Number"
            label="CDL NUMBER"
            formik={form}
          />
        </Col>
        <Col>
          <BaseSelect
            className="col-12 mt-3"
            required
            enumType={States}
            name="state"
            placeholder="State"
            label="Current State"
            formik={form}
          />
        </Col>
        <Col>
          <BaseInput
            className="col-12 mt-3"
            required
            type="date"
            name="expiration_date"
            placeholder="Expiration Date"
            label="Expiration Date"
            formik={form}
          />
        </Col>
      </Row>

      <Row>
        <Col>
          <BaseSelect
            className="col-4 mt-3"
            required
            label="State Issued"
            name="state_issued"
            placeholder="State of Issuance"
            enumType={States}
            formik={form}
          />
        </Col>
      </Row>

      <Row className="mt-2">
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
