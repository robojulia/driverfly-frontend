import React, { useContext, useEffect } from "react";
import { Button, Col, Row } from "react-bootstrap";
import BaseSelect from "../../base-select";
import { useFormik } from "formik";
import { useTranslation } from "../../../../hooks/use-translation";
import { HearAboutUsDto } from "../../../../models/jot-form/short-form/hear-about.dto";
import { PageProps } from "../../../../types/jotform/page-props.type";
import jotformContext from "../../../../context/jotform-context";
import { ApplicantExtras } from "../../../../enums/applicants/applicant-extras.enum";
import { ApplicantExtrasEntity } from "../../../../models/applicant/applicant-extras.entity";
import styles from "../../../../styles/jotform.module.css";
import { HearAboutUsType } from "../../../../enums/jotform/hear-about-type.enum";
import BaseInput from "../../base-input";

export interface HearAboutProps extends PageProps {}

export function HearAbout() {
  const {
    state: { applicantExtras },
    method: { updateApplicantExtras, stepNext, stepBack },
  } = useContext(jotformContext);

  const { t } = useTranslation();

  const form = useFormik({
    initialValues: new HearAboutUsDto(),
    validationSchema: HearAboutUsDto.yupSchema(),
    onSubmit: (values) => {
      const { HEAR_ABOUT_US } = values;
      updateApplicantExtras(HEAR_ABOUT_US);
      stepNext();
    },
    onReset: (values) => {
      stepBack();
    },
  });

  useEffect(() => {
    const apx = applicantExtras?.find(
      (v) => v.type === ApplicantExtras.HEAR_ABOUT_US
    );
    form.setValues({
      ...form.values,
      HEAR_ABOUT_US: !!apx?.type
        ? apx
        : new ApplicantExtrasEntity(ApplicantExtras.HEAR_ABOUT_US),
    });
  }, [applicantExtras]);

  return (
    <>
      <form onSubmit={form.handleSubmit} onReset={form.handleReset}>
        <Row className={styles.carrierName__smaller}>
          <BaseSelect
            className="mt-3 mb-3"
            enumType={HearAboutUsType}
            name="HEAR_ABOUT_US.value"
            placeholder="CHOOSE"
            label="HOW_DID_YOU_HEAR_ABOUT_US"
            formik={form}
          />
        </Row>
        {form.values?.HEAR_ABOUT_US?.value === HearAboutUsType.REFERRAL && (
          <Row>
            <BaseInput
              className="col-6 mb-4"
              name="REFERRAL_NUMBER"
              placeholder="REFERRAL_NUMBER"
              label="REFERRAL_NUMBER"
              formik={form}
            />
          </Row>
        )}
        <Row className="mt-3">
          <Col>
            <Button className="float-right" type="reset">
              {t("BACK")}
            </Button>
          </Col>

          <Col>
            <Button className="float-left" type="submit">
              {t("CONTINUE_APPLICATION")}
            </Button>
          </Col>
        </Row>
      </form>
    </>
  );
}
