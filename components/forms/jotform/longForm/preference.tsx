import React, { useContext, useEffect } from "react";
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
import { PageProps } from "../../../../types/jotform/page-props.type";
import * as yup from "yup";
import jotformContext from "../../../../context/jotform-context";
export interface PreferenceProps extends PageProps {}

export function Preferences({ onNextClick, onBackClick }: PreferenceProps) {
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
    initialValues: {
      routes_open_to: null,
      other_requirements: null,
    },
    validationSchema: yup.object({
      routes_open_to: yup
        .array()
        .min(1)
        .typeError("Choose atleast one!")
        .required(),
    }),
    onSubmit: (values) => {
      onNextClick(values);
    },
    onReset: (values) => {
      onBackClick();
    },
  });
  return (
    <>
      {" "}
      <h1>{t("PREFERENCES")}</h1>
      <Form onSubmit={form.handleSubmit} onReset={form.handleReset}>
        <Row className={styles.align__text_left}>
          <p className={styles.paragraph}>{t("ROUTES_YOU_OPEN_FOR")}</p>
        </Row>
        <Row className={styles.align__text_left}>
          <Col>
            <BaseCheckList
              className="col-3 mb-3"
              labelKey="ROUTES_OPEN_TO"
              name="routes_open_to"
              enumType={VehicleRouteType}
              formik={form}
            />
          </Col>
        </Row>
        <Row className={styles.align__text_left}>
          <Col className={styles.paragraph}>
            <BaseSelect
              className="col-3 mb-3"
              label="Do you require W2 employment?"
              name="requirement_W2"
              placeholder="CHOOSE"
              enumType={BooleanPreferenceType}
              formik={form}
            />
          </Col>
        </Row>
        <Row className={styles.align__text_left}>
          <p className={styles.paragraph}>{t("NECESSARY_REQUIREMENTS")}</p>
        </Row>
        <Row className={styles.align__text_left}>
          <Col>
            <BaseCheckList
              className="col-3"
              labelKey="OTHER_REQUIREMENTS"
              name="other_requirements"
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
