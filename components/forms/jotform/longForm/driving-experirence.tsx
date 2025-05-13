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
  const [selectedIssuedState, setSelectedIssuedState] = useState<string>(
    applicant?.license_state || ""
  );

  const form = useFormik({
    initialValues: new DrivingExperienceDto(),
    validationSchema: DrivingExperienceDto.yupSchema(),
    onSubmit: (values) => {
      try {
        const { license_number, state, license_expiry, license_state } = values;
        setApplicant({
          ...applicant,
          license_number,
          state,
          license_expiry,
          license_state,
        });
      } catch (error) {
        console.log(error);
      }
      stepNext();
    },
    onReset: (values) => {
      stepBack();
    },
  });

  // Handle state changes to update CDL mask
  const handleIssuedStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newState = e.target.value;
    setSelectedIssuedState(newState);
    form.handleChange(e);
    // Clear CDL when issuing state changes to prevent invalid format
    form.setFieldValue("license_number", "");
  };

  // Handle license number input to convert to uppercase
  const handleLicenseNumberChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    // Convert input value to uppercase
    const uppercaseValue = e.target.value.toUpperCase();

    // Set the uppercase value in the form
    form.setFieldValue("license_number", uppercaseValue);
  };

  useEffect(() => {
    const { license_number, state, license_expiry, license_state } = applicant;
    setSelectedIssuedState(license_state || "");
    form.setValues({
      license_number: license_number || null,
      state: state || null,
      license_expiry: license_expiry || null,
      license_state: license_state || null,
    });
  }, []);

  const cdlFormat = getCDLFormat(selectedIssuedState);

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
                current_date.getMonth() + 6,
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
            <Button className="float-left" type="submit">
              {t("NEXT")}
            </Button>
          </Col>
        </Row>
      </Form>
    </>
  );
}
