import { useFormik } from "formik";
import { useContext, useEffect } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import jotformContext from "../../../../context/jotform-context";
import { useTranslation } from "../../../../hooks/use-translation";
import { WorkedBeforeDto } from "../../../../models/jot-form/long-form/worked-before.dto";
import styles from "../../../../styles/digitalhiringapp.module.css";
import BaseCheck from "../../base-check";
import BaseInput from "../../base-input";
import BaseRadio from "../../base-radio";
import { BooleanType } from "../../../../enums/jotform/boolean-type.enum";

export function WorkedBefore() {
  const {
    state: { applicant },
    method: { setApplicant, stepNext, stepBack },
  } = useContext(jotformContext);

  const { t } = useTranslation();
  const form = useFormik({
    initialValues: {
      ...new WorkedBeforeDto(),
      // Set default values to false (NO)
      already_applied_to_company: false,
      already_worked_to_company: false,
    },
    validationSchema: WorkedBeforeDto.yupSchema(),

    onSubmit: (values) => {
      setApplicant({ ...applicant, ...values });
      stepNext();
    },
    onReset: (values) => {
      stepBack();
    },
  });

  useEffect(() => {
    form.setValues({
      ...form.values,
      // Use the values from applicant if defined, or default to false
      already_applied_to_company:
        applicant.already_applied_to_company !== undefined
          ? applicant.already_applied_to_company
          : false,
      already_worked_to_company:
        applicant.already_worked_to_company !== undefined
          ? applicant.already_worked_to_company
          : false,
      already_worked_start_date: applicant.already_worked_start_date,
      already_worked_end_date: applicant.already_worked_end_date,
    });
  }, [applicant]);

  // useEffect(() => {
  // 	console.log("values", form.values);
  // 	console.log("error", form.errors);
  // }, [form.values, form.errors]);

  return (
    <>
      <h1 className={`${styles.carrierName} ${styles.jot_form_headers_font}`}>
        {t("WORKED_BEFORE")}
      </h1>

      <Form onSubmit={form.handleSubmit} onReset={form.handleReset}>
        <Row>
          <BaseRadio
            name={`already_applied_to_company`}
            className="float-left ml-2 my-2 w-40"
            label={`APPLIED_HERE_BEFORE`}
            labelPrefix="BooleanType"
            enumType={BooleanType}
            value={
              form.values.already_applied_to_company === true
                ? BooleanType.YES
                : BooleanType.NO
            }
            onChange={({ target: { value } }) => {
              form.setFieldValue(
                "already_applied_to_company",
                value === BooleanType.YES ? true : false
              );
              if (value === BooleanType.NO) {
                form.setFieldValue("already_worked_to_company", false);
              }
            }}
          />
        </Row>
        {form.values?.already_applied_to_company ? (
          <>
            <Row>
              <Col>
                <BaseRadio
                  name={`already_worked_to_company`}
                  className="float-left ml-2 my-2 w-40"
                  label={`WORKED_HERE_BEFORE`}
                  labelPrefix="BooleanType"
                  enumType={BooleanType}
                  value={
                    form.values.already_worked_to_company === true
                      ? BooleanType.YES
                      : BooleanType.NO
                  }
                  onChange={({ target: { value } }) => {
                    form.setFieldValue(
                      "already_worked_to_company",
                      value === BooleanType.YES ? true : false
                    );
                    if (value === BooleanType.NO) {
                      form.setFieldValue("already_worked_start_date", null);
                      form.setFieldValue("already_worked_end_date", null);
                    }
                  }}
                />
              </Col>
            </Row>
            {form.values.already_worked_to_company ? (
              <>
                <Row>
                  <BaseInput
                    className="col-md-6 my-3 font-weight-bold"
                    type="date"
                    name="already_worked_start_date"
                    placeholder="DATE"
                    label="FROM"
                    max={
                      new Date(
                        new Date().getFullYear(),
                        new Date().getMonth(),
                        new Date().getDate()
                      )
                        .toISOString()
                        .split("T")[0]
                    }
                    formik={form}
                  />
                  <BaseInput
                    className="col-md-6 my-3 font-weight-bold"
                    type="date"
                    name="already_worked_end_date"
                    placeholder="DATE"
                    required
                    label="TO"
                    max={
                      new Date(
                        new Date().getFullYear(),
                        new Date().getMonth(),
                        new Date().getDate()
                      )
                        .toISOString()
                        .split("T")[0]
                    }
                    formik={form}
                  />
                </Row>
              </>
            ) : null}
          </>
        ) : null}
        <Row className="mt-3">
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
