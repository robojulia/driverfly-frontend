import { useFormik } from "formik";
import { useContext, useEffect, useState } from "react";
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
      already_applied_to_company: applicant.already_applied_to_company ?? null,
      already_worked_to_company: applicant.already_worked_to_company ?? null,
      already_worked_start_date: applicant.already_worked_start_date ?? null,
      already_worked_end_date: applicant.already_worked_end_date ?? null,
    },
    validationSchema: WorkedBeforeDto.yupSchema(),
    validateOnMount: true,
    validateOnChange: true,
    onSubmit: (values) => {
      setApplicant({ ...applicant, ...values });
      stepNext();
    },
    onReset: () => {
      stepBack();
    },
  });

  // Initialize with applicant values once on component mount
  useEffect(() => {
    if (applicant) {
      form.setValues({
        ...form.values,
        already_applied_to_company:
          applicant.already_applied_to_company !== undefined
            ? applicant.already_applied_to_company
            : null,
        already_worked_to_company:
          applicant.already_worked_to_company !== undefined
            ? applicant.already_worked_to_company
            : null,
        already_worked_start_date: applicant.already_worked_start_date ?? null,
        already_worked_end_date: applicant.already_worked_end_date ?? null,
      });

      // Validate form after setting values
      setTimeout(() => {
        form.validateForm();
      }, 0);
    }
  }, []);

  // Check if the form is valid for enabling the Next button
  const isFormValid = () => {
    // Basic validation - required first question always
    if (form.values.already_applied_to_company === null) return false;

    // If "No" was selected for first question, form is valid (no other fields required)
    if (form.values.already_applied_to_company === false) return true;

    // If applied before is true, then worked before is required
    if (
      form.values.already_applied_to_company === true &&
      form.values.already_worked_to_company === null
    )
      return false;

    // If worked before is true, dates are required
    if (
      form.values.already_worked_to_company === true &&
      (!form.values.already_worked_start_date ||
        !form.values.already_worked_end_date)
    )
      return false;

    // Check for validation errors
    return Object.keys(form.errors).length === 0;
  };

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
            required
            value={
              form.values.already_applied_to_company === true
                ? BooleanType.YES
                : form.values.already_applied_to_company === false
                ? BooleanType.NO
                : ""
            }
            onChange={({ target: { value } }) => {
              // Set the value for the first question
              form.setFieldValue(
                "already_applied_to_company",
                value === BooleanType.YES
                  ? true
                  : value === BooleanType.NO
                  ? false
                  : null
              );

              // If NO is selected, reset all dependent fields
              if (value === BooleanType.NO) {
                form.setFieldValue("already_worked_to_company", false);
                form.setFieldValue("already_worked_start_date", null);
                form.setFieldValue("already_worked_end_date", null);

                // Force validation after changing values
                setTimeout(() => {
                  form.validateForm();
                }, 0);
              }
            }}
          />
          {form.touched.already_applied_to_company &&
            form.errors.already_applied_to_company && (
              <div className="invalid-feedback d-block ml-3">
                {form.errors.already_applied_to_company}
              </div>
            )}
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
                  required
                  value={
                    form.values.already_worked_to_company === true
                      ? BooleanType.YES
                      : form.values.already_worked_to_company === false
                      ? BooleanType.NO
                      : ""
                  }
                  onChange={({ target: { value } }) => {
                    // Set the value for worked before
                    form.setFieldValue(
                      "already_worked_to_company",
                      value === BooleanType.YES
                        ? true
                        : value === BooleanType.NO
                        ? false
                        : null
                    );

                    // If NO is selected, clear the date fields
                    if (value === BooleanType.NO) {
                      form.setFieldValue("already_worked_start_date", null);
                      form.setFieldValue("already_worked_end_date", null);
                    }

                    // Force validation after changing values
                    setTimeout(() => {
                      form.validateForm();
                    }, 0);
                  }}
                />
                {form.touched.already_worked_to_company &&
                  form.errors.already_worked_to_company && (
                    <div className="invalid-feedback d-block ml-3">
                      {form.errors.already_worked_to_company}
                    </div>
                  )}
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
                    required
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
            <Button
              className="float-left"
              type="submit"
              disabled={!isFormValid()}
            >
              {t("NEXT")}
            </Button>
          </Col>
        </Row>
      </Form>
    </>
  );
}
