import { useFormik } from "formik";
import { useContext, useEffect } from "react";
import { Button, Col, Row } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import JotformContext, {
  JotFormContextType,
} from "../../../../context/jotform-context";
import { EducationLevel } from "../../../../enums/users/education-level.enum";
import { useTranslation } from "../../../../hooks/use-translation";
import { HighestLevelEducationDto } from "../../../../models/jot-form/long-form/highest-level-education.dto";
import BaseSelect from "../../base-select";
import styles from "../../../../styles/digitalhiringapp.module.css";

export function HighestLevelEducation() {
  const {
    state: { applicant },
    method: { setApplicant, stepNext, stepBack },
  }: JotFormContextType = useContext(JotformContext);

  const { t } = useTranslation();
  const form = useFormik({
    initialValues: new HighestLevelEducationDto(),
    validationSchema: HighestLevelEducationDto.yupSchema(),
    onSubmit: (values) => {
      const { highest_degree } = values;
      try {
        setApplicant({
          ...applicant,
          highest_degree,
        });
        stepNext();
      } catch (error) {
        console.log(error);
      }
    },
    onReset: (values) => {
      stepBack();
    },
  });

  useEffect(() => {
    const { highest_degree } = applicant;
    form.setValues({
      ...form.values,
      highest_degree: highest_degree || null,
    });
  }, [applicant]);

  return (
    <>
      <h1 className={`${styles.carrierName} ${styles.jot_form_headers_font}`}>
        {t("TELL_ABOUT_YOUR_EDUCATION")}
      </h1>

      <Form onSubmit={form.handleSubmit} onReset={form.handleReset}>
        <Row className={`${styles.align__text_left} ${styles.bold}`}>
          <BaseSelect
            className="col my-3"
            required
            enumType={EducationLevel}
            name="highest_degree"
            placeholder="CHOOSE"
            label="EDUCATION_HIGHEST_LEVEL"
            labelPrefix="EducationLevel"
            formik={form}
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
              disabled={!form.isValid}
            >
              {t("NEXT")}
            </Button>
          </Col>
        </Row>
      </Form>
    </>
  );
}
