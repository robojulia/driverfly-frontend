import React, { useContext, useEffect } from "react";
import Form from "react-bootstrap/Form";
import styles from "../../../../styles/jotform.module.css";
import { Button, Col, Row } from "react-bootstrap";
import { useFormik } from "formik";
import { useTranslation } from "../../../../hooks/use-translation";
import FileInput from "../../file-input";
import { PageProps } from "../../../../types/jotform/page-props.type";
import jotformContext from "../../../../context/jotform-context";

export interface PhotoUploadprops extends PageProps {}

export function PhotoUpload() {
  const {
    state: { steps },
    method: { setSteps },
  } = useContext(jotformContext);

  const { t } = useTranslation();
  const form = useFormik({
    initialValues: {
      photo: null,
    },
    onSubmit: (values) => {
      setSteps(steps+1);
    },
    onReset: (values) => {
      setSteps(steps-1);
    },
  });

  return (
    <>
      <Form onSubmit={form.handleSubmit} onReset={form.handleReset}>
        <Row>
          <h3>{t("DRIVER_LICENSE_PHOTO")}</h3>
        </Row>
        <Row className={styles.align__text_left}>
          <FileInput
            className="col-5"
            label={`photo`}
            name={`photo`}
            accept="image/*"
            documentType={"PHOTO"}
            formik={form}
          />
        </Row>

        <Row className="mt-4">
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
