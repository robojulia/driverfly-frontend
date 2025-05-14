import { useFormik } from "formik";
import { useContext, useEffect, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import JotformContext, {
  JotFormContextType,
} from "../../../../context/jotform-context";
import { useTranslation } from "../../../../hooks/use-translation";
import { BackgroundInfoDto } from "../../../../models/jot-form/long-form/background-info.dto";
import BaseInput from "../../base-input";
import StateSelect from "../../state-select";
import styles from "../../../../styles/digitalhiringapp.module.css";

export function BackgroundInfo() {
  const {
    state: { applicant },
    method: { setApplicant, stepNext, stepBack },
  }: JotFormContextType = useContext(JotformContext);

  const { t } = useTranslation();
  const [isFormValid, setIsFormValid] = useState(false);

  const form = useFormik({
    initialValues: new BackgroundInfoDto(),
    validationSchema: BackgroundInfoDto.yupSchema(),
    onSubmit: (values) => {
      try {
        const { birthdate, city, state, zip_code, address_1, address_2 } =
          values;
        setApplicant({
          ...applicant,
          birthdate,
          city,
          state,
          zip_code,
          address_1,
          address_2,
        });
      } catch (error) {
        console.log(error);
      }
      stepNext();
    },
    onReset: (values) => {
      stepBack();
    },
    validateOnMount: true,
    validateOnChange: true,
    validateOnBlur: true,
  });

  // Check if all required fields are filled in
  useEffect(() => {
    const requiredFields = [
      "birthdate",
      "city",
      "state",
      "zip_code",
      "address_1",
    ];
    const hasAllRequiredFields = requiredFields.every(
      (field) => !!form.values[field]
    );
    const hasNoErrors = Object.keys(form.errors).length === 0;
    setIsFormValid(hasAllRequiredFields && hasNoErrors && form.dirty);
  }, [form.values, form.errors, form.dirty]);

  useEffect(() => {
    const { birthdate, city, state, zip_code, address_1, address_2 } =
      applicant;
    form.setValues({
      ...form.values,
      address_1: address_1 || null,
      address_2: address_2 || null,
      birthdate: birthdate || null,
      city: city || null,
      state: state || null,
      zip_code: zip_code || null,
    });
  }, [applicant]);

  const today = new Date();
  const OldThan18Year = new Date(
    today.getFullYear() - 18,
    today.getMonth(),
    today.getDate()
  )
    .toISOString()
    .split("T")[0];

  return (
    <Form onSubmit={form.handleSubmit} onReset={form.handleReset}>
      <h1 className={`${styles.carrierName} ${styles.jot_form_headers_font}`}>
        {t("BACKGROUND_INFO")}
      </h1>
      <Row className={`${styles.align__text_left} ${styles.bold}`}>
        <BaseInput
          className="col mt-3 mb-3"
          required
          type="date"
          name="birthdate"
          placeholder="birthdate"
          label="birthdate"
          formik={form}
          max={OldThan18Year}
        />
      </Row>
      <p className={`${styles.heading__sty}`}>{t("FULL_ADDRESS_QUES")}</p>

      <>
        <Row>
          <div className="col-md-12 ">
            <Row className={`${styles.align__text_left} ${styles.bold}`}>
              <BaseInput
                className="col-md-6 my-3"
                required
                name={`address_1`}
                placeholder="ADDRESS_LINE_1"
                label="ADDRESS_LINE_1"
                formik={form}
              />
              <BaseInput
                className="col-md-6 my-3"
                name={`address_2`}
                placeholder="ADDRESS_LINE_2"
                label="ADDRESS_LINE_2"
                formik={form}
              />
            </Row>
          </div>
        </Row>
      </>

      <Row className={`${styles.align__text_left} ${styles.bold}`}>
        <BaseInput
          className="col-md-6 my-3"
          required
          name="city"
          type="text"
          placeholder="city"
          label="city"
          formik={form}
        />
        <StateSelect
          className="col-md-6 my-3"
          required
          name="state"
          label="state"
          placeholder="CHOOSE_STATE"
          formik={form}
        />
      </Row>
      <Row className={`${styles.align__text_left} ${styles.bold}`}>
        <BaseInput
          className="col my-3"
          required
          name="zip_code"
          type="number"
          placeholder="zip_code"
          label="zip_code"
          formik={form}
        />
      </Row>
      <Row className="my-3">
        <Col>
          <Button className="float-right" type="reset">
            {t("BACK")}
          </Button>
        </Col>

        <Col>
          <Button className="float-left" type="submit" disabled={!isFormValid}>
            {t("NEXT")}
          </Button>
        </Col>
      </Row>
    </Form>
  );
}
