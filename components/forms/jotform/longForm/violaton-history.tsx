import { useFormik } from "formik";
import React, { useContext, useEffect } from "react";
import { Button, Col, Row, Form } from "react-bootstrap";
import { useTranslation } from "../../../../hooks/use-translation";
import BaseInput from "../../base-input";
import { PageProps } from "../../../../types/jotform/page-props.type";
import jotformContext from "../../../../context/jotform-context";
import { ViolationHistoryDto } from "../../../../models/jot-form/long-form/violation-history.dto";
import { DashCircle, PlusCircle } from "react-bootstrap-icons";
import { VioalationExtrasEntity } from "../../../../models/jot-form/long-form/violaton-history/index.dto";

import { ApplicantExtrasEntity } from "../../../../models/applicant/applicant-extras.entity";
import { ApplicantExtras } from "../../../../enums/applicants/applicant-extras.enum";
import styles from "../../../../styles/jotform.module.css";

export interface ViolationsLast3YearsProps extends PageProps {}

export function ViolationsLast3Years() {
  const {
    state: { applicant, applicantExtras, steps },
    method: { updateApplicantExtras, setSteps },
  } = useContext(jotformContext);

  const { t } = useTranslation();
  const form = useFormik({
    initialValues: new ViolationHistoryDto(),
    validationSchema: ViolationHistoryDto.yupSchema(),
    onSubmit: (values) => {
      const { VIOLATION_DETAILS, VIOLATION_COUNT } = values;
      try {
        updateApplicantExtras(VIOLATION_DETAILS);
        updateApplicantExtras(VIOLATION_COUNT);
      } catch (error) {
        console.log(error);
      }
      setSteps(steps + 1);
    },
    onReset: (values) => {
      setSteps(steps - 1);
    },
  });

  useEffect(() => {
    console.log("extrasss", applicantExtras);

    const apx_detail = applicantExtras?.find(
      (v) => v.type === ApplicantExtras.VIOLATION_DETAILS,

    );
    const apx_count = applicantExtras?.find(
      (v) => v.type === ApplicantExtras.VIOLATION_COUNT
    );
    form.setValues({
      ...form.values,
      VIOLATION_COUNT: !!apx_count?.type
        ? apx_count
        : new ApplicantExtrasEntity(ApplicantExtras.VIOLATION_COUNT),
      VIOLATION_DETAILS: !!apx_detail?.type
        ? apx_detail
        : new ApplicantExtrasEntity(ApplicantExtras.VIOLATION_DETAILS),
    });
  }, [applicant, applicantExtras]);

  useEffect(() => {
    console.log("form values", form.values);
    console.log("form error", form.errors);
  }, [form.values, form.errors]);
  return (
    <Form onSubmit={form.handleSubmit} onReset={form.handleReset}>
      <h6 className={ styles.carrierName__smaller }>{t("VIOLATIONS_LAST_3_YEARS")}</h6>
      <Row>
        <Col className={styles.align__items_left}>
          <BaseInput
            className="col-6 mt-3"
            name="VIOLATION_COUNT.value"
            label="HOW_MANY_VIOALTION_3_YEARS"
            formik={form}
          />
        </Col>
        <div className="mt-4 float-left d-flex justify-left pl-3">
          <Button
            size="sm"
            onClick={() =>
              form.setValues({
                ...form.values,
                VIOLATION_DETAILS: {
                  ...(form.values.VIOLATION_DETAILS || []),
                  value: [
                    ...(form.values.VIOLATION_DETAILS?.value || []),
                    new VioalationExtrasEntity(),
                  ],
                },
              })
            }
          >
            <PlusCircle /> {t("TITLE_ADD_VIOLATION_DETAILS")}
          </Button>
        </div>
      </Row>

      {form.values.VIOLATION_DETAILS?.value?.length > 0 && (
        <>
          {form.values.VIOLATION_DETAILS.value.map((entity, i) => (
            <Row key={i}>
              <div className="col-md-12 mt-2 pl-0">
                <Row>
                  <Col>
                    <BaseInput
                      className="col-12 mt-3"
                      name={`VIOLATION_DETAILS.value[${i}].date_of_violation`}
                      label="VIOLATION_DATE"
                      type="date"
                      formik={form}
                    />
                  </Col>
                  <Col>
                    <BaseInput
                      className="col-12 mt-3"
                      name={`VIOLATION_DETAILS.value[${i}].location`}
                      label="location"
                      formik={form}
                    />
                  </Col>
                  <Col>
                    <BaseInput
                      className="col-12 mt-3"
                      name={`VIOLATION_DETAILS.value[${i}].charge`}
                      label="CHARGE"
                      formik={form}
                    />
                  </Col>
                  <Col>
                    <BaseInput
                      className="col-12 mt-3"
                      name={`VIOLATION_DETAILS.value[${i}].penalty`}
                      label="PENALTY"
                      formik={form}
                    />
                  </Col>
                  <Col className="mt-5">
                    <a
                      href="#"
                      onClick={() =>
                        form.setValues({
                          ...form.values,
                          VIOLATION_DETAILS: {
                            ...(form.values.VIOLATION_DETAILS || []),
                            value: form.values.VIOLATION_DETAILS?.value?.filter(
                              (v, idx) => i != idx
                            ),
                          },
                        })
                      }
                    >
                      <DashCircle color="red" />
                    </a>
                  </Col>
                </Row>
              </div>
            </Row>
          ))}
        </>
      )}

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
