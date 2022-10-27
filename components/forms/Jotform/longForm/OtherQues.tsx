import React, { useEffect } from "react";
import Form from "react-bootstrap/Form";
import styles from "../../../../styles/jotform.module.css";
import { Button, Col, Row } from "react-bootstrap";
import BaseInput from "../../base-input";
import BaseSelect from "../../base-select";
import { useFormik } from "formik";
import { useTranslation } from "../../../../hooks/use-translation";
import { DriverEndorsement } from "../../../../enums/users/driver-endorsement.enum";

export interface OtherQuesProps {
  onNextClick: (any) => void;
  onBackClick: () => void;
  applicant: any;
}

export function OtherQues(props: OtherQuesProps) {
  useEffect(() => {
    if (props.applicant && !form.dirty) form.setValues(props.applicant);
  }, [props.applicant]);
  const { t } = useTranslation();
  const form = useFormik({
    initialValues: {
      manual_qualification: null,
      endorsements_twic: null,
    },
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
        <Row>
          <BaseSelect
            className="col-6 mb-3"
            options={["Yes", "No"]}
            name="manual_qualification"
            placeholder="Click to choose"
            label="Are you qualified to drive a manual transmission per your CDL in case requires it?"
            formik={form}
          />
        </Row>

        <Row>
          <BaseSelect
            className="col-6 mb-3"
            label="DRIVER_ENDORSEMENT"
            placeholder="Click to choose"
            name="driver_endorsement"
            required
            labelPrefix="DriverEndorsement"
            enumType={DriverEndorsement}
            formik={form}
          />
        </Row>
        <Row>
          <p className={styles.paragraph__left}>
            Tell us upto 3 Equipment Experience(optional)
          </p>
        </Row>
        <Row>
          <p className={styles.paragraph__left}>
            Fill in as many of the following as relevant.
          </p>
        </Row>
        <Row>
          <Col>
            <BaseInput
              className="col-12 mt-3"
              name="cdl_number_1"
              placeholder="CDL NUMBER 1"
              label="CDL NUMBER"
              formik={form}
            />
          </Col>
          <Col>
            <BaseSelect
              className="col-12 mt-3"
              options={[
                "Alabama",
                "Alaska",
                "Nebraska",
                "California",
                "New Jersey",
              ]}
              name="state_1"
              placeholder="State of Issuance"
              label="Click to Choose"
              formik={form}
            />
          </Col>
          <Col>
            <BaseInput
              className="col-12 mt-3"
              type="date"
              name="date_1"
              placeholder="Expiration Date"
              label="DATE"
              formik={form}
            />
          </Col>
        </Row>

        <Row>
          <Col>
            <BaseInput
              className="col-12 mt-3"
              name="cdl_number_2"
              placeholder="CDL NUMBER 2"
              label="CDL NUMBER"
              formik={form}
            />
          </Col>
          <Col>
            <BaseSelect
              className="col-12 mt-3"
              options={[
                "Alabama",
                "Alaska",
                "Nebraska",
                "California",
                "New Jersey",
              ]}
              name="state_2"
              placeholder="State of Issuance"
              label="Click to Choose"
              formik={form}
            />
          </Col>
          <Col>
            <BaseInput
              className="col-12 mt-3"
              type="date"
              name="date_2"
              placeholder="Expiration Date"
              label="DATE"
              formik={form}
            />
          </Col>
        </Row>

        <Row>
          <Col>
            <BaseInput
              className="col-12 mt-3"
              name="cdl_number_3"
              placeholder="CDL NUMBER 3"
              label="CDL NUMBER"
              formik={form}
            />
          </Col>
          <Col>
            <BaseSelect
              className="col-12 mt-3"
              options={[
                "Alabama",
                "Alaska",
                "Nebraska",
                "California",
                "New Jersey",
              ]}
              name="state_3"
              placeholder="State of Issuance"
              label="Click to Choose"
              formik={form}
            />
          </Col>
          <Col>
            <BaseInput
              className="col-12 mt-3"
              type="date"
              name="date_3"
              placeholder="Expiration Date"
              label="DATE"
              formik={form}
            />
          </Col>
        </Row>

        <Row className="mt-5">
          <Col>
            <Button className="float-middle" type="submit">
              {t("CONTINUE APPLICATION")}
            </Button>
          </Col>
        </Row>
      </Form>
    </>
  );
}
