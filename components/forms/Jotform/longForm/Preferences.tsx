import React, { useEffect } from "react";
import { Button, Col, Row } from "react-bootstrap";
import styles from "../../../../styles/jotform.module.css";
import Form from "react-bootstrap/Form";
import { VehicleRouteType } from "../../../../enums/vehicles/vehicle-routes.enum";
import { useTranslation } from "../../../../hooks/use-translation";
import BaseCheckList from "../../base-check-list";
import { useFormik } from "formik";
import { OtherRequirement } from "../../../../enums/users/other-requirements.enum";
import { BooleanPreferenceType } from "../../../../enums/users/boolean-preferences.enum";
import BaseInput from "../../base-input";
import BaseSelect from "../../base-select";
export interface PreferenceProps {
  onNextClick: (any) => void;
  onBackClick: () => void;
  applicant: any;
}

export function Preferences(props: PreferenceProps) {
  const { t } = useTranslation();
  const form = useFormik({
    initialValues: {
      routes_open_to: null,
      other_requirements: null,
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
      {" "}
      <h1>Preferences</h1>
      <Form onSubmit={form.handleSubmit} onReset={form.handleReset}>
        <Row className={styles.align__text_left}>
          <p className={styles.paragraph}>
            Routes you're open to (select ALL that best apply):{" "}
          </p>
        </Row>
        <Row className={styles.align__text_left}>
          <Col>
            <BaseCheckList
              className="col-3 mb-3"
              labelKey="ROUTES_OPEN_TO"
              name="routes_open_to"
              // labelPrefix="JobEquipmentType"
              enumType={VehicleRouteType}
              formik={form}
            />
          </Col>
        </Row>
        {/* <Row className={styles.align__text_left}>
                    <p className={styles.paragraph}>Do you require W2 employment? </p>
                </Row> */}
        <Row className={styles.align__text_left}>
          <Col className={styles.paragraph}>
            <BaseSelect
              className="col-3 mb-3"
              label="Do you require W2 employment?"
              name="requirement_W2"
              placeholder="Click to choose"
              // labelPrefix="JobEquipmentType"
              enumType={BooleanPreferenceType}
              formik={form}
            />
          </Col>
        </Row>
        <Row className={styles.align__text_left}>
          <p className={styles.paragraph}>
            Other absolutely 100% necessary requirements (select all that
            apply):{" "}
          </p>
        </Row>
        <Row className={styles.align__text_left}>
          <Col>
            <BaseCheckList
              className="col-3"
              labelKey="OTHER_REQUIREMENTS"
              name="other_requirements"
              // labelPrefix="OtherRequirementType"
              enumType={OtherRequirement}
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
    </>
  );
}
