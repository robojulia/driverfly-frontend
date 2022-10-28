import React from "react";
import styles from "../../../../styles/Jotform.module.css";
import { Button, Col, Row } from "react-bootstrap";
import BaseInput from "../../base-input";
import { useFormik } from "formik";
import { useTranslation } from "../../../../hooks/use-translation";
import { NamesDto } from "../../../../models/jot-form/short-form/names";

export interface SecondPageProps {
  onNextClick: (values: any) => void;
  onBackClick: () => void;
}

export function SecondPage(props: SecondPageProps) {
  const { t } = useTranslation();
  const form = useFormik({
    initialValues: new NamesDto(),
    validationSchema: NamesDto.yupSchema(),
    onSubmit: (values) => {
      props.onNextClick(values);
    },
    onReset: (values) => {
      props.onBackClick();
    },
  });
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
