import { useFormik } from "formik";
import React, { useContext, useEffect } from "react";
import { Button, Col, Row, Form } from "react-bootstrap";
import { useTranslation } from "../../../../hooks/use-translation";
import * as yup from "yup";
import BaseCheck from "../../base-check";
import BaseInput from "../../base-input";
import styles from "../../../../styles/jotform.module.css";
import { AccidentLastFiveYearsDto } from "../../../../models/jot-form/long-form/accident-last-5-years.dto";
import { PageProps } from "../../../../types/jotform/page-props.type";
import jotformContext from "../../../../context/jotform-context";

export interface AccidentsLast5YearsProps extends PageProps {}

export function AccidentsLast5Years({
  onNextClick,
  onBackClick,
}: AccidentsLast5YearsProps) {
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
    initialValues: new AccidentLastFiveYearsDto(),
    validationSchema: AccidentLastFiveYearsDto.yupSchema(),
    onSubmit: (values) => {
      onNextClick(values);
    },
    onReset: (values) => {
      onBackClick();
    },
  });
  return (
    <Form onSubmit={form.handleSubmit} onReset={form.handleReset}>
      <h6>{t('MORE_ABOUT_ACCIDENTS')}</h6>
      <Row>
        <Col>
          <BaseInput
            className="col-6 mt-3"
            name="accidents_within_last_5_years"
            label="accidents_last_5_years"
            placeholder="PLACEHOLDER_FOR_DIGITS"
            formik={form}
          />
        </Col>
      </Row>
      <Row>
        <Col>
          <BaseInput
            className="col-12 mt-3"
            name="date_of_accident_1"
            label="DATE"
            type="date"
            formik={form}
          />
        </Col>
        <Col>
          <BaseInput
            className="col-12 mt-3"
            name="nature_of_accident_1"
            label="LABEL_ACCIDENT_NATURE"
            formik={form}
          />
        </Col>
        <Col>
          <BaseInput
            className="col-12 mt-3"
            name="location_of_accident_1"
            label="LABEL_ACCIDENT_LOCATION"
            formik={form}
          />
        </Col>
        <Col>
          <BaseInput
            className="col-12 mt-3"
            name="number_of_fatalities_1"
            label="LABEL_ACCIDENT_FATALITIES"
            formik={form}
          />
        </Col>
        <Col>
          <BaseInput
            className="col-12 mt-3"
            name="number_of_injured_1"
            label="LABEL_ACCIDENT_INJURED"
            formik={form}
          />
        </Col>
        <Col className={styles.align__text_left}>
          <BaseCheck
            className="col-12 mt-3"
            name="dot_recordable_1"
            label="LABEL_ACCIDENT_DOT"
            formik={form}
          />

          <BaseCheck
            className="col-12 mt-3"
            name="at_fault_1"
            label="LABEL_ACCIDENT_FAULT"
            formik={form}
          />
        </Col>
      </Row>
      <Row>
        <Col>
          <BaseInput
            className="col-12 mt-3"
            name="date_of_accident_2"
            label="LABEL_ACCIDENT_DATE"
            type="date"
            formik={form}
          />
        </Col>
        <Col>
          <BaseInput
            className="col-12 mt-3"
            name="nature_of_accident_2"
            label="LABEL_ACCIDENT_NATURE"
            formik={form}
          />
        </Col>
        <Col>
          <BaseInput
            className="col-12 mt-3"
            name="location_of_accident_2"
            label="LABEL_ACCIDENT_LOCATION"
            formik={form}
          />
        </Col>
        <Col>
          <BaseInput
            className="col-12 mt-3"
            name="number_of_fatalities_2"
            label="LABEL_ACCIDENT_FATALITIES"
            formik={form}
          />
        </Col>
        <Col>
          <BaseInput
            className="col-12 mt-3"
            name="number_of_injured_2"
            label="LABEL_ACCIDENT_INJURED"
            formik={form}
          />
        </Col>
        <Col className={styles.align__text_left}>
          <BaseCheck
            className="col-12 mt-3"
            name="dot_recordable_2"
            label="LABEL_ACCIDENT_DOT"
            formik={form}
          />

          <BaseCheck
            className="col-12 mt-3"
            name="at_fault_2"
            label="LABEL_ACCIDENT_FAULT"
            formik={form}
          />
        </Col>
      </Row>
      <Row>
        <Col>
          <BaseInput
            className="col-12 mt-3"
            name="date_of_accident_3"
            label="LABEL_ACCIDENT_DATE"
            type="date"
            formik={form}
          />
        </Col>
        <Col>
          <BaseInput
            className="col-12 mt-3"
            name="nature_of_accident_3"
            label="LABEL_ACCIDENT_NATURE"
            formik={form}
          />
        </Col>
        <Col>
          <BaseInput
            className="col-12 mt-3"
            name="location_of_accident_3"
            label="LABEL_ACCIDENT_LOCATION"
            formik={form}
          />
        </Col>
        <Col>
          <BaseInput
            className="col-12 mt-3"
            name="number_of_fatalities_3"
            label="LABEL_ACCIDENT_FATALITIES"
            formik={form}
          />
        </Col>
        <Col>
          <BaseInput
            className="col-12 mt-3"
            name="number_of_injured_3"
            label="LABEL_ACCIDENT_INJURED"
            formik={form}
          />
        </Col>
        <Col className={styles.align__text_left}>
          <BaseCheck
            className="col-12 mt-3"
            name="dot_recordable_3"
            label="LABEL_ACCIDENT_DOT"
            formik={form}
          />

          <BaseCheck
            className="col-12 mt-3"
            name="at_fault_3"
            label="LABEL_ACCIDENT_FAULT"
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
  );
}
