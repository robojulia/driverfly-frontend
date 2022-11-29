import React, { useContext, useEffect } from "react";
import styles from "../../../../styles/jotform.module.css";
import { Button, Col, Row } from "react-bootstrap";
import BaseInput from "../../base-input";
import { useFormik } from "formik";
import { useTranslation } from "../../../../hooks/use-translation";
import { NamesDto } from "../../../../models/jot-form/short-form/names";
import { PageProps } from "../../../../types/jotform/page-props.type";
import jotformContext from "../../../../context/jotform-context";

export interface NamesProps extends PageProps { }

export function Names() {
  const {
    state: { applicant },
    method: { setApplicant, stepNext, stepBack },
  } = useContext(jotformContext);

  const { t } = useTranslation();

  const form = useFormik({
    initialValues: new NamesDto(),
    validationSchema: NamesDto.yupSchema(),
    onSubmit: (values) => {
      const { first_name, last_name } = values;
      setApplicant({
        ...applicant,
        first_name,
        last_name,
      });
      stepNext();
    },
    onReset: (values) => {
      stepBack();
    },
  });

  useEffect(() => {
    const { first_name, last_name } = applicant;
    form.setValues({
      first_name: first_name || null,
      last_name: last_name || null,
    });
  }, [applicant]);

  return (
    <>
      <h4 className={`${styles.align__text_left}`}>{t("name")}</h4>
      <form onSubmit={form.handleSubmit} onReset={form.handleReset}>
        <Row className={styles.bold}>
          <BaseInput
            className="col-12 my-3"
            label="FIRST_NAME"
            required
            name="first_name"
            placeholder="FIRST_NAME"
            formik={form}
          />
        </Row>
        <Row className={styles.bold}>
          <BaseInput
            className="col-12 my-3"
            required
            name="last_name"
            label="LAST_NAME"
            placeholder="LAST_NAME"
            formik={form}
          />
        </Row>
        <Row className="mt-5">
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
