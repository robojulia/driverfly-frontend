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

export interface SixthPageProps extends PageProps {}

export function SixthPage() {
  const {
    state: { applicantExtras, steps },
    method: { updateApplicantExtras, setSteps },
  } = useContext(jotformContext);
  const { t } = useTranslation();
  const form = useFormik({
    initialValues: new HearAboutUsDto(),
    validationSchema: HearAboutUsDto.yupSchema(),
    onSubmit: (values) => {
      const { HEAR_ABOUT_US } = values;
      updateApplicantExtras(HEAR_ABOUT_US);
      setSteps(steps + 1);
    },
    onReset: (values) => {
      setSteps(steps - 1);
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
        <Row>
          <BaseSelect
            className="mt-3 mb-3"
            options={["Referral", "Friends", "Job Board", "Social Media"]}
            name="HEAR_ABOUT_US.value"
            placeholder="CHOOSE"
            label="HOW_DID_YOU_HEAR_ABOUT_US"
            formik={form}
          />
        </Row>

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
