import { useFormik } from "formik";
import React, { useContext, useEffect } from "react";
import { Button, Col, Row, Form } from "react-bootstrap";
import { useTranslation } from "../../../../hooks/use-translation";
import BaseCheck from "../../base-check";
import BaseInput from "../../base-input";
import styles from "../../../../styles/jotform.module.css";
import { AccidentLastFiveYearsDto } from "../../../../models/jot-form/long-form/accident-last-5-years.dto";
import { PageProps } from "../../../../types/jotform/page-props.type";
import jotformContext from "../../../../context/jotform-context";
import { DashCircle, PlusCircle } from "react-bootstrap-icons";
import { AccidentHistoryEntity } from "../../../../models/jot-form/long-form/accident-last-5-years/index.dto";

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
      <h6>{t("MORE_ABOUT_ACCIDENTS")}</h6>
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
        <div className="mt-4 float-left d-flex justify-left pl-4">
          <Button
            size="sm"
            onClick={() =>
              form.setValues({
                ...form.values,
                accident_detail: [
                  ...(form.values.accident_detail || []),
                  new AccidentHistoryEntity(),
                ],
              })
            }
          >
            <PlusCircle /> {t("TITLE_ADD_ACCIDENT_DETAILS")}
          </Button>
        </div>
      </Row>

      {form.values.accident_detail?.length > 0 && (
        <>
          {form.values.accident_detail.map((entity, i) => (
            <Row key={i}>
              <div className="col-md-12 mt-2">
                <Row>
                  <Col>
                    <BaseInput
                      className="col-12 mt-3"
                      name={`accident_detail[${i}].date_of_accident`}
                      label="DATE"
                      type="date"
                      formik={form}
                    />
                  </Col>
                  <Col>
                    <BaseInput
                      className="col-12 mt-3"
                      name={`accident_detail[${i}].nature_of_accident`}
                      label="LABEL_ACCIDENT_NATURE"
                      formik={form}
                    />
                  </Col>
                  <Col>
                    <BaseInput
                      className="col-12 mt-3"
                      name={`accident_detail[${i}].location_of_accident`}
                      label="LABEL_ACCIDENT_LOCATION"
                      formik={form}
                    />
                  </Col>
                  <Col>
                    <BaseInput
                      className="col-12 mt-3"
                      name={`accident_detail[${i}].number_of_fatalaties`}
                      label="LABEL_ACCIDENT_FATALITIES"
                      formik={form}
                    />
                  </Col>
                  <Col>
                    <BaseInput
                      className="col-12 mt-3"
                      name={`accident_detail[${i}].number_of_accident`}
                      label="LABEL_ACCIDENT_INJURED"
                      formik={form}
                    />
                  </Col>
                  <Col className={styles.align__text_left}>
                    <BaseCheck
                      className="col-12 mt-3"
                      name={`accident_detail[${i}].dot_recordable`}
                      label="LABEL_ACCIDENT_DOT"
                      formik={form}
                    />

                    <BaseCheck
                      className="col-12 mt-3"
                      name={`accident_detail[${i}].at_fault`}
                      label="LABEL_ACCIDENT_FAULT"
                      formik={form}
                    />
                  </Col>
                  <Col>
                    <a
                      href="#"
                      onClick={() =>
                        form.setValues({
                          ...form.values,
                          accident_detail: form.values.accident_detail.filter(
                            (v, idx) => i != idx
                          ),
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
