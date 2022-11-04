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

export interface ViolationsLast3YearsProps extends PageProps {}

export function ViolationsLast3Years() {
  const {
    state: { applicant, applicantExtras, steps },
    method: { setApplicant, updateApplicantExtras, setSteps },
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
    initialValues: new ViolationHistoryDto(),
    validationSchema: ViolationHistoryDto.yupSchema(),
    onSubmit: (values) => {
      setSteps(steps + 1);
    },
    onReset: (values) => {
      setSteps(steps - 1);
    },
  });


  useEffect(() => {
    const apx = applicantExtras?.find(
      (v) => v.type === ApplicantExtras.VIOLATION_DETAILS
    );
    form.setValues({
      ...form.values,
      VIOLATION_DETAILS: !!apx?.type
        ? apx
        : new ApplicantExtrasEntity(ApplicantExtras.VIOLATION_DETAILS),
    });
  }, [applicantExtras]);
  return (
    <Form onSubmit={form.handleSubmit} onReset={form.handleReset}>
      <h6>{t("VIOLATIONS_LAST_3_YEARS")}</h6>
      <Row>
        <Col>
          <BaseInput
            className="col-6 mt-3"
            name="violations_last_3_years"
            label="HOW_MANY_VIOALTION_3_YEARS"
            formik={form}
          />
        </Col>
        <div className="mt-4 float-left d-flex justify-left pl-4">
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
              <div className="col-md-12 mt-2">
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
                  <Col>
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
