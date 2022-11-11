import React, { useContext, useEffect } from "react";
import { Button, Col, Row } from "react-bootstrap";
import styles from "../../../../styles/jotform.module.css";
import Form from "react-bootstrap/Form";
import { RouteType } from "../../../../enums/vehicles/routes-type.enum";
import { useTranslation } from "../../../../hooks/use-translation";
import BaseCheckList from "../../base-check-list";
import { useFormik } from "formik";
import { OtherRequirementType } from "../../../../enums/users/other-requirements.enum";
import { BooleanPreferenceType } from "../../../../enums/users/boolean-preferences.enum";
import BaseInput from "../../base-input";
import BaseSelect from "../../base-select";
import { PageProps } from "../../../../types/jotform/page-props.type";
import * as yup from "yup";
import jotformContext from "../../../../context/jotform-context";
import { PreferencesDto } from "../../../../models/jot-form/long-form/preferences.dto";
import { ApplicantExtras } from "../../../../enums/applicants/applicant-extras.enum";
import { ApplicantExtrasEntity } from "../../../../models/applicant/applicant-extras.entity";
export interface PreferenceProps extends PageProps {}

export function Preferences() {
  const {
    state: { applicant, applicantExtras, steps },
    method: {
      setApplicant,
      updateApplicantExtras,
      setSteps,
      stepNext,
      stepBack,
    },
  } = useContext(jotformContext);

  const { t } = useTranslation();
  const form = useFormik({
    initialValues: new PreferencesDto(),
    validationSchema: PreferencesDto.yupSchema(),
    onSubmit: (values) => {
      console.log("values", values);
      const { ROUTES, REQUIRE_W2_EMPLOYMENT, OTHER_ABSOLUTELY_REQUIREMENTS } =
        values;
      updateApplicantExtras(ROUTES);
      updateApplicantExtras(REQUIRE_W2_EMPLOYMENT);
      updateApplicantExtras(OTHER_ABSOLUTELY_REQUIREMENTS);
      stepNext();
    },
    onReset: (values) => {
      stepBack();
    },
  });
  useEffect(() => {
    console.log("form values", form.values);
    console.log("form error", form.errors);
  }, [form.values, form.errors]);

  useEffect(() => {
    const apx_routes = applicantExtras?.find(
      (v) => v.type === ApplicantExtras.ROUTES
    );
    const apx_w2 = applicantExtras?.find(
      (v) => v.type === ApplicantExtras.REQUIRE_W2_EMPLOYMENT
    );
    const apx_other = applicantExtras?.find(
      (v) => v.type === ApplicantExtras.OTHER_ABSOLUTELY_REQUIREMENTS
    );
    form.setValues({
      ...form.values,
      ROUTES: !!apx_routes?.type
        ? apx_routes
        : new ApplicantExtrasEntity(ApplicantExtras.ROUTES),
      REQUIRE_W2_EMPLOYMENT: !!apx_w2?.type
        ? apx_w2
        : new ApplicantExtrasEntity(ApplicantExtras.REQUIRE_W2_EMPLOYMENT),
      OTHER_ABSOLUTELY_REQUIREMENTS: !!apx_other?.type
        ? apx_other
        : new ApplicantExtrasEntity(
            ApplicantExtras.OTHER_ABSOLUTELY_REQUIREMENTS
          ),
    });
  }, [applicant, applicantExtras]);
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
              name="ROUTES.value"
              labelPrefix="RouteType"
              enumType={RouteType}
              formik={form}
            />
          </Col>
        </Row>
        <Row className={styles.align__text_left}>
          <Col className={styles.paragraph}>
            <BaseSelect
              className="col-3 mb-3"
              label="Do you require W2 employment?"
              name="REQUIRE_W2_EMPLOYMENT.value"
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
              labelPrefix="OtherRequirementType"
              name="OTHER_ABSOLUTELY_REQUIREMENTS.value"
              enumType={OtherRequirementType}
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
