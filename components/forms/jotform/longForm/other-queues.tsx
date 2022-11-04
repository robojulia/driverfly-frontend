import React, { useContext, useEffect } from "react";
import Form from "react-bootstrap/Form";
import styles from "../../../../styles/jotform.module.css";
import { Button, Col, Row } from "react-bootstrap";
import BaseInput from "../../base-input";
import BaseSelect from "../../base-select";
import { useFormik } from "formik";
import { useTranslation } from "../../../../hooks/use-translation";
import { DriverEndorsement } from "../../../../enums/users/driver-endorsement.enum";
import { States } from "../../../../enums/users/us-states.enum";
import { PageProps } from "../../../../types/jotform/page-props.type";
import jotformContext from "../../../../context/jotform-context";
import { OtherQueuesDto } from "../../../../models/jot-form/long-form/other-queues.dto";

export interface OtherQuesProps extends PageProps {}

export function OtherQues() {
  const {
    state: { steps },
    method: { setSteps },
  } = useContext(jotformContext);

  const { t } = useTranslation();
  const form = useFormik({
    initialValues: new OtherQueuesDto(),
    validationSchema: OtherQueuesDto.yupSchema(),
    onSubmit: (values) => {
      setSteps(steps+1);
    },
    onReset: (values) => {
      setSteps(steps-1);
    },
  });
  return (
    <Form onSubmit={form.handleSubmit} onReset={form.handleReset}>
      <Row>
        <BaseSelect
          className="col-6 mb-3"
          options={["Yes", "No"]}
          name="manual_qualification"
          placeholder="CHOOSE"
          label="QUALIFIED_TO_MANUAL_DRIVING"
          formik={form}
        />
      </Row>

      <Row>
        <BaseSelect
          className="col-6 mb-3"
          label="ENDORSEMENT"
          placeholder="CHOOSE"
          name="driver_endorsement"
          labelPrefix="DriverEndorsement"
          enumType={DriverEndorsement}
          formik={form}
        />
      </Row>
      <Row>
        <p className={styles.paragraph__left}>
          {t("THREE_EQUIPMENT_EXPERIMENT")}
        </p>
      </Row>
      <Row>
        <p className={styles.paragraph__left}>{t("FILL_FOLLOWING_RELEVENT")}</p>
      </Row>
      <Row>
        <Col>
          <BaseInput
            className="col-12 mt-3"
            name="cdl_number_1"
            placeholder="CDL_NUMBER_1"
            label="CDL_NUMBER"
            formik={form}
          />
        </Col>
        <Col>
          <BaseSelect
            className="col-12 mt-3"
            enumType={States}
            name="state_1"
            placeholder="ISSUANCE_STATE"
            label="CHOOSE"
            formik={form}
          />
        </Col>
        <Col>
          <BaseInput
            className="col-12 mt-3"
            type="date"
            name="date_1"
            placeholder="expiration_date"
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
            placeholder="CDL_NUMBER_2"
            label="CDL_NUMBER"
            formik={form}
          />
        </Col>
        <Col>
          <BaseSelect
            className="col-12 mt-3"
            enumType={States}
            name="state_2"
            placeholder="ISSUANCE_STATE"
            label="CHOOSE"
            formik={form}
          />
        </Col>
        <Col>
          <BaseInput
            className="col-12 mt-3"
            type="date"
            name="date_2"
            placeholder="expiration_date"
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
            placeholder="CDL_NUMBER_3"
            label="CDL_NUMBER"
            formik={form}
          />
        </Col>
        <Col>
          <BaseSelect
            className="col-12 mt-3"
            enumType={States}
            name="state_3"
            placeholder="ISSUANCE_STATE"
            label="CHOOSE"
            formik={form}
          />
        </Col>
        <Col>
          <BaseInput
            className="col-12 mt-3"
            type="date"
            name="date_3"
            placeholder="expiration_date"
            label="DATE"
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
