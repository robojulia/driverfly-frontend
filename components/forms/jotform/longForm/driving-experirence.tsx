import React, { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import styles from "../../../../styles/jotform.module.css";
import * as yup from "yup";
import { Button, Col, Row } from "react-bootstrap";
import BaseInput from "../../base-input";
import BaseInputPhone from "../../base-input-phone";
import BaseSelect from "../../base-select";
import { useFormik } from "formik";
import { useTranslation } from "../../../../hooks/use-translation";
import { Radio } from "@mui/material";
import BaseCheck from "../../base-check";
import moment from "moment";
import { States } from "../../../../enums/users/us-states.enum";
import { DrivingExperienceDto } from "../../../../models/jot-form/long-form/driving-experience.dto";
import { PageProps } from "../../../../types/jotform/page-props.type";

export interface DrivingExpProps extends PageProps {
  // onNextClick: (any) => void;
  // onBackClick: () => void;
  applicant: any;
}
export function DrivingExp(props: DrivingExpProps) {
  useEffect(() => {
    if (props.applicant && !form.dirty) form.setValues(props.applicant);
  }, [props.applicant]);
  const { t } = useTranslation();
  const form = useFormik({
    initialValues: new DrivingExperienceDto(),
    validationSchema: DrivingExperienceDto.yupSchema(),
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
            placeholder="CDL_LICENSE_PLACEHOLDER"
            label="CDL_NUMBER"
            formik={form}
          />
        </Col>
        <Col>
          <BaseSelect
            className="col-12 mt-3"
            required
            enumType={States}
            name="state"
            placeholder="state"
            label="CURRENT_STATE"
            formik={form}
          />
        </Col>
        <Col>
          <BaseInput
            className="col-12 mt-3"
            required
            type="date"
            name="expiration_date"
            placeholder="expiration_date"
            label="expiration_date"
            formik={form}
          />
        </Col>
      </Row>

      <Row>
        <Col>
          <BaseSelect
            className="col-4 mt-3"
            required
            label="state_issued"
            name="state_issued"
            placeholder="ISSUANCE_STATE"
            enumType={States}
            formik={form}
          />
        </Col>
      </Row>
      <Row>
        <Col>
          {/* <Button className="float-right" onClick={() => setCount(count + 1)}>
            {t("ADD")}
          </Button> */}
          {/* <ViewCard
            title="Please list any other states you've had a CDL in for the past 5 years:"
            actions={<Button size='sm' onClick={() => form.setValues({
              ...form.values,
              equipment_experience: []
            })}}
          >

          </ViewCard> */}
        </Col>
        <Col>
          {/* <Button className="float-right" onClick={() => setCount(count - 1)}>
            {t("DELETE")}
          </Button> */}
        </Col>
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
