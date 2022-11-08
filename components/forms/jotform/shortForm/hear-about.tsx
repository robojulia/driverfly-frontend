import React, { useContext } from "react";
import { Button, Col, Row } from "react-bootstrap";
import BaseSelect from "../../base-select";
import { useFormik } from "formik";
import { useTranslation } from "../../../../hooks/use-translation";
import { HearAboutUsDto } from "../../../../models/jot-form/short-form/hear-about.dto";
import { PageProps } from "../../../../types/jotform/page-props.type";
import jotformContext from "../../../../context/jotform-context";

export interface SixthPageProps extends PageProps {}

export function SixthPage({ onNextClick, onBackClick }: SixthPageProps) {
  const {
    state: { applicant },
  } = useContext(jotformContext);
  const { t } = useTranslation();
  const form = useFormik({
    initialValues: new HearAboutUsDto(),
    validationSchema: HearAboutUsDto.yupSchema(),
    onSubmit: (values) => {
      onNextClick(values);
    },
    onReset: (values) => {
      onBackClick();
    },
  });
  // useEffect(() => {
  //   const { email, phone, zip_code, options } = applicant;
  //   form.setValues({
  //     email: email || null,
  //     phone: phone || null,
  //     zip_code: zip_code || null,
  //     options: options || null,
  //   });
  // }, [applicant]);
  return (
    <>
      <form onSubmit={form.handleSubmit} onReset={form.handleReset}>
        <Row>
          <BaseSelect
            className="mt-3 mb-3"
            options={["Referral", "Friends", "Job Board", "Social Media"]}
            name="hear_about_us"
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
