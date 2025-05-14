import { useFormik } from "formik";
import { useContext, useEffect, useState } from "react";
import { Button, Col, Row } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import InputMask from "react-input-mask";
import JotformContext, {
  JotFormContextType,
} from "../../../../context/jotform-context";
import { useTranslation } from "../../../../hooks/use-translation";
import { DrivingExperienceDto } from "../../../../models/jot-form/long-form/driving-experience.dto";
import styles from "../../../../styles/digitalhiringapp.module.css";
import { getCDLFormat } from "../../../../utils/cdl-formats";
import BaseInput from "../../base-input";
import StateSelect from "../../state-select";

export function DrivingExperience() {
  const {
    state: { applicant },
    method: { setApplicant, stepNext, stepBack },
  }: JotFormContextType = useContext(JotformContext);

  const { t } = useTranslation();
  const current_date = new Date();

  // Track the license issuing state to manage the CDL input mask
  const [selectedIssuedState, setSelectedIssuedState] = useState<string>(
    applicant?.license_state || ""
  );

  // Get the CDL format based on the selected state
  const cdlFormat = getCDLFormat(selectedIssuedState);

  // Initialize the form
  const form = useFormik({
    initialValues: {
      license_number: applicant?.license_number || "",
      state: applicant?.state || "",
      license_expiry: applicant?.license_expiry || "",
      license_state: applicant?.license_state || "",
    },
    validationSchema: DrivingExperienceDto.yupSchema(),
    validateOnMount: false, // We'll validate manually after initial setup
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: (values) => {
      try {
        // Save form values to applicant context
        setApplicant({
          ...applicant,
          license_number: values.license_number,
          state: values.state,
          license_expiry: values.license_expiry,
          license_state: values.license_state,
        });
        stepNext();
      } catch (error) {
        console.error("Error submitting driving experience form:", error);
      }
    },
    onReset: () => {
      stepBack();
    },
  });

  // Handle issuing state change
  const handleIssuedStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newState = e.target.value;

    // If the state has changed, update and clear CDL number
    if (newState !== selectedIssuedState) {
      // Update the state in our local state
      setSelectedIssuedState(newState);

      // Update form values
      form.setFieldValue("license_state", newState);
      form.setFieldValue("license_number", "");
    } else {
      // Just update the form value
      form.setFieldValue("license_state", newState);
    }
  };

  // Handle license number input - convert to uppercase
  const handleLicenseNumberChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const uppercaseValue = e.target.value.toUpperCase();
    form.setFieldValue("license_number", uppercaseValue);
  };

  // Initialize form with applicant data when component mounts
  useEffect(() => {
    if (applicant) {
      // Set issuing state first for proper CDL format
      if (applicant.license_state) {
        setSelectedIssuedState(applicant.license_state);
      }

      // Set form values
      form.setValues({
        license_number: applicant.license_number || "",
        state: applicant.state || "",
        license_expiry: applicant.license_expiry || "",
        license_state: applicant.license_state || "",
      });

      // Validate the form after setting values
      setTimeout(() => {
        form.validateForm();
      }, 0);
    }
  }, []);

  // Check if the form is valid and all required fields are filled
  const isFormComplete = () => {
    const { license_number, state, license_expiry, license_state } =
      form.values;
    return (
      !!license_number &&
      !!state &&
      !!license_expiry &&
      !!license_state &&
      Object.keys(form.errors).length === 0
    );
  };

  return (
    <>
      <h1 className={`${styles.carrierName} ${styles.jot_form_headers_font}`}>
        {t("DRVING_EXPERIENCE")}
      </h1>

      <Form onSubmit={form.handleSubmit} onReset={form.handleReset}>
        <Row className={styles.bold}>
          <StateSelect
            className="col-md-6 my-3"
            required
            label="state_issued"
            name="license_state"
            placeholder="ISSUANCE_STATE"
            formik={form}
            onChange={handleIssuedStateChange}
            value={form.values.license_state || ""}
          />
          <div className="col-md-6 my-3">
            <Form.Group>
              <Form.Label>
                {t("CDL_NUMBER")} <span className="text-danger">*</span>
              </Form.Label>
              <InputMask
                mask={cdlFormat.mask}
                value={form.values.license_number || ""}
                onChange={handleLicenseNumberChange}
                onBlur={form.handleBlur}
                name="license_number"
                className={`form-control ${
                  form.touched.license_number && form.errors.license_number
                    ? "is-invalid"
                    : ""
                }`}
                placeholder={cdlFormat.placeholder}
                disabled={!selectedIssuedState} // Disable until state is selected
              />
              <small className="text-muted">{t(cdlFormat.description)}</small>
              {form.touched.license_number && form.errors.license_number && (
                <Form.Control.Feedback type="invalid">
                  {form.errors.license_number}
                </Form.Control.Feedback>
              )}
            </Form.Group>
          </div>
          <StateSelect
            className="col-md-6 my-3"
            required
            label="CURRENT_STATE"
            name="state"
            placeholder="STATE"
            formik={form}
          />
          <BaseInput
            className="col-md-6 my-3"
            required
            type="date"
            name="license_expiry"
            placeholder="expiration_date"
            label="expiration_date"
            formik={form}
            min={
              new Date(
                current_date.getFullYear(),
                current_date.getMonth(),
                current_date.getDate()
              )
                .toISOString()
                .split("T")[0]
            }
          />
        </Row>
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
              disabled={!isFormComplete()}
            >
              {t("NEXT")}
            </Button>
          </Col>
        </Row>
      </Form>
    </>
  );
}
