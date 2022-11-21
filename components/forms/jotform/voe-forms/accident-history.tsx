import { useFormik } from "formik";
import React, { useContext, useEffect } from "react";
import { Button, Col, Row, Form } from "react-bootstrap";
import { useTranslation } from "../../../../hooks/use-translation";
import * as yup from "yup";
import BaseCheck from "../../base-check";
import BaseInput from "../../base-input";
import { PageProps } from "../../../../types/jotform/page-props.type";
import jotformContext from "../../../../context/jotform-context";
import { AccidentHistoryDto } from "../../../../models/jot-form/voe-form/accident-history.dto";

import { ApplicantExtras } from "../../../../enums/applicants/applicant-extras.enum";
import { ApplicantExtrasEntity } from "../../../../models/applicant/applicant-extras.entity";
import styles from "../../../../styles/jotform.module.css";
import { ReasonsForLeavingEmployment } from "../../../../enums/users/reasons-for-leaving-employment";
import BaseSelect from "../../base-select";
import BaseTextArea from "../../base-text-area";

export interface AccidentHistoryProps extends PageProps {}

export function AccidentHistory() {
  const {
    state: { applicantVoe },
    method: { stepNext, stepBack, updateApplicantVoe },
  } = useContext(jotformContext);

  const { t } = useTranslation();
  const form = useFormik({
    initialValues: new AccidentHistoryDto(),
    // validationSchema: AccidentHistoryDto.yupSchema(),
    onSubmit: (values) => {
      stepNext();
    },
    onReset: (values) => {
      stepBack();
    },
  });
  // useEffect(() => {
  //   const apx = applicantVoe?.find(
  //     (v) => v.type === ApplicantVoeFormEnum.EMPLOYED_BY_US
  //   );
  //   form.setValues({
  //     ...form.values,
  //     EMPLOYED_BY_US: !!apx?.type
  //       ? apx
  //       : new ApplicantVoeFormEntity(ApplicantVoeFormEnum.EMPLOYED_BY_US),
  //   });
  // }, [applicantVoe]);
  useEffect(() => {
    console.log("applicant voe", applicantVoe);
  }, [applicantVoe]);
  useEffect(() => {
    console.log("form values", form.values);
    console.log("form eror", form.errors);
  }, [form.values, form.errors]);

  return (
    <Form onSubmit={form.handleSubmit} onReset={form.handleReset}>
      <Row>
        <h4 className={styles.carrierName}>{t("ACCIDENT_HISTORY")}</h4>
      </Row>
      <Row>
        <Col className={`${styles.align__text_left} ${styles.bold}`}>
          <BaseInput
            className="col-9 mt-3 pl-0"
            name="was_employed_as"
            label="was_employed_as"
            placeholder="POSITION"
            formik={form}
          />
        </Col>
        <Col className={`${styles.align__text_left} ${styles.bold}`}>
          <BaseInput
            className="col-9 mt-3"
            name="start_date"
            label="START_DATE"
            type="date"
            formik={form}
            placeholder="mm/yy"
          />
        </Col>
        <Col className={`${styles.align__text_left} ${styles.bold}`}>
          <BaseInput
            className="col-9 mt-3"
            name="end_date"
            type="date"
            label="END_DATE"
            formik={form}
            placeholder="mm/yy"
          />
        </Col>
      </Row>

      <Row className={`${styles.align__text_left} ${styles.bold}`}>
        <BaseCheck
          className="float-left col-6 mt-3"
          name="TYPE_OF_VEHICLE"
          label="VOE_DRIVER_QUES"
          formik={form}
        />
      </Row>
      {form.values.TYPE_OF_VEHICLE ? (
        <Row
          className={`${styles.align__text_left} ${styles.bold} ${styles.paragraph}`}
        >
          <BaseTextArea
            className="float-left mt-3 col-6"
            name="TYPE_OF_VEHICLE.value"
            label="TYPE_OF_VEHICLE"
            formik={form}
          />
        </Row>
      ) : null}

      <Row className={`${styles.align__text_left} ${styles.bold}`}>
        <BaseCheck
          className="float-left col-6 mt-3"
          name="safety_performance_history.value"
          label="SAFETY_PERFORMANCE_REPORT"
          formik={form}
        />
      </Row>
      {form.values?.safety_performance_history?.valueOf ? (
        <>
          <Row className={`${styles.align__text_left} ${styles.bold}`}>
            <BaseCheck
              className="float-left col-6 mt-3"
              name="accident_register_data"
              label="ACCIDENT_REGISTER_DATA"
              formik={form}
            />
          </Row>
          {form.values.accident_register_data ? (
            <>
              <Row className="mt-3">
                <p className={`${styles.paragraph} ${styles.align__text_left}`}>
                  {t("VOE_ACCIDENT_NOTE")}
                </p>
              </Row>
              <Row className={`${styles.align__text_left} ${styles.bold}`}>
                <Col>
                  <BaseInput
                    className="col-9 mt-3"
                    name="first_date"
                    type="date"
                    label="DATE"
                    formik={form}
                  />
                </Col>
                <Col>
                  <BaseInput
                    className="col-9 mt-3"
                    name="first_location"
                    label="LOCATION"
                    formik={form}
                  />
                </Col>
                <Col>
                  <BaseInput
                    className="col-9 mt-3"
                    name="first_injuries"
                    label="#INJURIES"
                    formik={form}
                  />
                </Col>
                <Col>
                  <BaseInput
                    className="col-9 mt-3"
                    name="first_fatalities"
                    label="#FATALITIES"
                    formik={form}
                  />
                </Col>
                <Col>
                  <BaseInput
                    className="col-9 mt-3"
                    name="first_spill"
                    label="#HAZMAT_SPILLS"
                    formik={form}
                  />
                </Col>
              </Row>

              <Row className={`${styles.align__text_left} ${styles.bold}`}>
                <Col>
                  <BaseInput
                    className="col-9 mt-3"
                    name="second_date"
                    type="date"
                    label="DATE"
                    formik={form}
                  />
                </Col>
                <Col>
                  <BaseInput
                    className="col-9 mt-3"
                    name="second_location"
                    label="LOCATION"
                    formik={form}
                  />
                </Col>
                <Col>
                  <BaseInput
                    className="col-9 mt-3"
                    name="second_injuries"
                    label="#INJURIES"
                    formik={form}
                  />
                </Col>
                <Col>
                  <BaseInput
                    className="col-9 mt-3"
                    name="second_fatalities"
                    label="#FATALITIES"
                    formik={form}
                  />
                </Col>
                <Col>
                  <BaseInput
                    className="col-9 mt-3"
                    name="second_spill"
                    label="#HAZMAT_SPILLS"
                    formik={form}
                  />
                </Col>
              </Row>

              <Row className={`${styles.align__text_left} ${styles.bold}`}>
                <Col>
                  <BaseInput
                    className="col-9 mt-3"
                    name="third_date"
                    type="date"
                    label="DATE"
                    formik={form}
                  />
                </Col>
                <Col>
                  <BaseInput
                    className="col-9 mt-3"
                    name="third_location"
                    label="LOCATION"
                    formik={form}
                  />
                </Col>
                <Col>
                  <BaseInput
                    className="col-9 mt-3"
                    name="third_injuries"
                    label="#INJURIES"
                    formik={form}
                  />
                </Col>
                <Col>
                  <BaseInput
                    className="col-9 mt-3"
                    name="third_fatalities"
                    label="#FATALITIES"
                    formik={form}
                  />
                </Col>
                <Col>
                  <BaseInput
                    className="col-9 mt-3"
                    name="third_spill"
                    label="#HAZMAT_SPILLS"
                    formik={form}
                  />
                </Col>
              </Row>

              <Row
                className={`${styles.align__text_left} ${styles.bold} ${styles.paragraph}`}
              >
                <BaseTextArea
                  className="float-left col-6 mt-3"
                  name="other_reported_accidents"
                  label="OTHER_GOV_REPORTED_ACCIDENTS"
                  formik={form}
                />
              </Row>
            </>
          ) : null}
        </>
      ) : null}

      <Row className={`${styles.align__text_left} ${styles.bold}`}>
        <BaseSelect
          className="col-4 mt-3"
          required
          enumType={ReasonsForLeavingEmployment}
          name="reasons_for_leaving_employment"
          placeholder="CHOOSE"
          label="REASONS_FOR_LEAVING_EMPLOYMENT"
          formik={form}
        />
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
