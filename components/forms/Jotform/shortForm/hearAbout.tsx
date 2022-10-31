import React from "react";
import { Button, Col, Row } from "react-bootstrap";
import BaseSelect from "../../base-select";
import { useFormik } from "formik";
import { useTranslation } from "../../../../hooks/use-translation";
import { HearAboutUsDto } from "../../../../models/jot-form/short-form/hear-about.dto";

export interface SixthPageProps {
  onNextClick: (any) => void;
  onBackClick: () => void;
}

export function SixthPage(props: SixthPageProps) {
  const { t } = useTranslation();
  const form = useFormik({
    initialValues: new HearAboutUsDto(),
    validationSchema: HearAboutUsDto.yupSchema(),
    onSubmit: (values) => {
      props.onNextClick(values);
    },
    onReset: (values) => {
      props.onBackClick();
    },
  });
  return (
    <>
      <form onSubmit={form.handleSubmit} onReset={form.handleReset}>
        <Row>
          <BaseSelect
            className="mt-3 mb-3"
            options={["Referral", "Friends", "Job Board", "Social Media"]}
            name="hear_about_us"
            placeholder="Click to choose"
            label="How did you hear about us"
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
