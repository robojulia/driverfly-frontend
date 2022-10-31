import React, { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import styles from "../../../../styles/Jotform.module.css";
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

export interface DrivingExpProps {
  onNextClick: (any) => void;
  onBackClick: () => void;
  applicant: any;
}
export function DrivingExp(props: DrivingExpProps) {
  const [count, setCount] = useState(0);

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
      <Row>
      {/* <Col>
        <BaseInput
          name="input"
          label="child_component"
          className="mb-3"
        />
      </Col>
        <Col>
          <Button className="float-right" onClick={() => setCount(count + 1)}>
            {t("ADD")}
          </Button>
        </Col>
        <Col>
          <Button className="float-right" onClick={() => setCount(count - 1)}>
            {t("DELETE")}
          </Button>
        </Col> */}
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
