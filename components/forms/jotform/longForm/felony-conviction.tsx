import { useFormik } from "formik";
import { useContext, useEffect, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import JotformContext, {
  JotFormContextType,
} from "../../../../context/jotform-context";
import { BooleanType } from "../../../../enums/jotform/boolean-type.enum";
import { useTranslation } from "../../../../hooks/use-translation";
import { FelonyConvictionDto } from "../../../../models/jot-form/long-form/felony-conviction.dto";
import styles from "../../../../styles/digitalhiringapp.module.css";
import BaseRadio from "../../base-radio";
import BaseTextArea from "../../base-text-area";

export function FelonyConviction() {
  const {
    state: { applicant },
    method: { setApplicant, stepNext, stepBack },
  }: JotFormContextType = useContext(JotformContext);

  const { t } = useTranslation();

  const form = useFormik({
    initialValues: {
      ...new FelonyConvictionDto(),
      is_convicted_felony: null,
      criminal_history: applicant.criminal_history || "",
    },
    validationSchema: FelonyConvictionDto.yupSchema(),
    validateOnMount: true,
    validateOnChange: true,
    onSubmit: (values) => {
      const { is_convicted_felony, criminal_history } = values;
      setApplicant({
        ...applicant,
        criminal_history,
        is_convicted_felony,
      });
      stepNext();
    },
    onReset: () => {
      stepBack();
    },
  });

  // Initialize form with applicant data once on mount
  useEffect(() => {
    if (applicant) {
      form.setValues({
        ...form.values,
        is_convicted_felony: null,
        criminal_history: applicant.criminal_history || "",
      });

      // Validate form after setting values
      setTimeout(() => {
        form.validateForm();
      }, 0);
    }
  }, []);

  // Check if form is valid for Next button
  const isFormValid = () => {
    // First field is always required
    if (form.values.is_convicted_felony === null) return false;

    // If Yes is selected, criminal_history is required
    if (
      form.values.is_convicted_felony === true &&
      !form.values.criminal_history
    )
      return false;

    // Check for validation errors
    return Object.keys(form.errors).length === 0;
  };

  return (
    <>
      <h1 className={`${styles.carrierName} ${styles.jot_form_headers_font}`}>
        {t("FELONY_CONVICTION")}
      </h1>

      <Form onSubmit={form.handleSubmit} onReset={form.handleReset}>
        <Row className={styles.paragraph__left}>
          <BaseRadio
            name="is_convicted_felony"
            className="float-left ml-2 my-2 w-40"
            label="EVER_FELONY_QUESTION"
            labelPrefix="BooleanType"
            enumType={BooleanType}
            required
            value={
              form.values.is_convicted_felony === true
                ? BooleanType.YES
                : form.values.is_convicted_felony === false
                ? BooleanType.NO
                : ""
            }
            onChange={({ target: { value } }) => {
              form.setFieldValue(
                "is_convicted_felony",
                value === BooleanType.YES
                  ? true
                  : value === BooleanType.NO
                  ? false
                  : null
              );
              if (value !== BooleanType.YES) {
                form.setFieldValue("criminal_history", "");
              }

              // Force validation after value change
              setTimeout(() => {
                form.validateForm();
              }, 0);
            }}
          />
          {form.touched.is_convicted_felony &&
            form.errors.is_convicted_felony && (
              <div className="invalid-feedback d-block ml-3">
                {form.errors.is_convicted_felony}
              </div>
            )}
        </Row>

        {form.values.is_convicted_felony === true && (
          <>
            <BaseTextArea
              className="col-12 mt-2"
              label="PAST_CONVICTION"
              name="criminal_history"
              required
              formik={form}
            />
          </>
        )}

        <Row className="mt-5">
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
