import React, { useContext } from "react";
import styles from "../../../../styles/jotform.module.css";
import { Button, Col, Row } from "react-bootstrap";
import BaseInput from "../../base-input";
import { useFormik } from "formik";
import { useTranslation } from "../../../../hooks/use-translation";
import { NamesDto } from "../../../../models/jot-form/short-form/names";
import { PageProps } from "../../../../types/jotform/page-props.type";
import jotformContext from "../../../../context/jotform-context";

export interface SecondPageProps extends PageProps {}

export function SecondPage({ onBackClick, onNextClick }: SecondPageProps) {
  const {
    state: { applicant },
  } = useContext(jotformContext);
  const { t } = useTranslation();
  const form = useFormik({
    initialValues: new NamesDto(),
    validationSchema: NamesDto.yupSchema(),
    onSubmit: (values) => {
      onNextClick(values);
    },
    onReset: (values) => {
      onBackClick();
    },
  });
  // useEffect(() => {
  //   const { email, phone, zip_code, options } = applicant;
  //   form.setValues({
  //     email: email || null,
  //     phone: phone || null,
  //     zip_code: zip_code || null,
  //     options: options || null,
  //   });
  // }, [applicant]);
  return (
    <>
      <h4 className={styles.align__text_left}>Name</h4>
      <form onSubmit={form.handleSubmit} onReset={form.handleReset}>
        <Row>
          <BaseInput
            className="col-6 mb-4"
            required
            name="first_name"
            placeholder="FIRST_NAME"
            formik={form}
          />
        </Row>
        <Row>
          <BaseInput
            className="col-6"
            required
            name="last_name"
            placeholder="LAST_NAME"
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
            <Button className="float-left" type="submit">
              {t("NEXT")}
            </Button>
          </Col>
        </Row>
      </form>
    </>
  );
}
