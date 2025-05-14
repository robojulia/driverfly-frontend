import { useFormik } from "formik";
import { useContext, useEffect, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import JotformContext, {
  JotFormContextType,
} from "../../../../context/jotform-context";
import { ApplicantExtras } from "../../../../enums/applicants/applicant-extras.enum";
import { BooleanType } from "../../../../enums/jotform/boolean-type.enum";
import { useTranslation } from "../../../../hooks/use-translation";
import { ApplicantExtrasEntity } from "../../../../models/applicant/applicant-extras.entity";
import { UnableForJobDto } from "../../../../models/jot-form/long-form/unable-for-job.dto";
import styles from "../../../../styles/digitalhiringapp.module.css";
import BaseRadio from "../../base-radio";
import BaseTextArea from "../../base-text-area";

export function UnableForJob() {
  const {
    state: { applicantExtras },
    method: { updateApplicantExtras, stepNext, stepBack },
  }: JotFormContextType = useContext(JotformContext);

  const { t } = useTranslation();
  const [isFormValid, setIsFormValid] = useState(false);

  const form = useFormik({
    initialValues: new UnableForJobDto(),
    validationSchema: UnableForJobDto.yupSchema(),
    validateOnMount: true,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: (values) => {
      const { REASON_FOR_UNABLE_TO_PERFORM_JOB } = values;
      updateApplicantExtras(REASON_FOR_UNABLE_TO_PERFORM_JOB);
      stepNext();
    },
    onReset: (values) => {
      stepBack();
    },
  });

  // Check form validity whenever values change
  useEffect(() => {
    const { is_unable_to_perform, REASON_FOR_UNABLE_TO_PERFORM_JOB } =
      form.values;

    // If they are unable to perform job, explanation is required
    if (is_unable_to_perform === true) {
      setIsFormValid(
        !!REASON_FOR_UNABLE_TO_PERFORM_JOB?.value &&
          REASON_FOR_UNABLE_TO_PERFORM_JOB.value.trim().length > 0 &&
          Object.keys(form.errors).length === 0
      );
    } else {
      // If they can perform job, no explanation needed
      setIsFormValid(is_unable_to_perform === false);
    }
  }, [form.values, form.errors]);

  useEffect(() => {
    const apx = applicantExtras?.find(
      (v) => v.type == ApplicantExtras.REASON_FOR_UNABLE_TO_PERFORM_JOB
    );

    form.setValues({
      ...form.values,
      REASON_FOR_UNABLE_TO_PERFORM_JOB: !!apx?.type
        ? apx
        : new ApplicantExtrasEntity(
            ApplicantExtras.REASON_FOR_UNABLE_TO_PERFORM_JOB
          ),
      is_unable_to_perform: !!apx?.value && apx.value.trim() !== "",
    });
  }, [applicantExtras]);

  // Function to convert between UI representation and data storage format
  const canPerformJob = !form.values.is_unable_to_perform;

  return (
    <>
      <h1 className={`${styles.carrierName} ${styles.jot_form_headers_font}`}>
        {t("DISABLE_FOR_JOB")}
      </h1>

      <Form onSubmit={form.handleSubmit} onReset={form.handleReset}>
        <Row className={styles.paragraph__left}>
          <BaseRadio
            name="job_ability"
            className="float-left ml-2 my-2 w-40"
            label="CAN_PERFORM_JOB_FUNCTIONS"
            labelPrefix="BooleanType"
            enumType={BooleanType}
            required
            value={canPerformJob ? BooleanType.YES : BooleanType.NO}
            onChange={({ target: { value } }) => {
              // Convert the positive UI choice to the negative storage format
              const canPerform = value === BooleanType.YES;
              form.setFieldValue("is_unable_to_perform", !canPerform);

              // If they can perform the job, clear any explanation
              if (canPerform) {
                form.setFieldValue(
                  "REASON_FOR_UNABLE_TO_PERFORM_JOB.value",
                  ""
                );
              }
            }}
          />
        </Row>
        {form.values.is_unable_to_perform && (
          <Row className={`${styles.align__text_left} ${styles.bold}`}>
            <BaseTextArea
              className="mt-3"
              name="REASON_FOR_UNABLE_TO_PERFORM_JOB.value"
              label="EXPLAIN_LIMITATIONS"
              required
              formik={form}
            />
          </Row>
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
              disabled={!isFormValid}
            >
              {t("NEXT")}
            </Button>
          </Col>
        </Row>
      </Form>
    </>
  );
}
