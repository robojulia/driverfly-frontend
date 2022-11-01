import React from "react";
import styles from "../../../../styles/Jotform.module.css";
import { Form, Button, Col, Row } from "react-bootstrap";
import { useTranslation } from "../../../../hooks/use-translation";
import { useFormik } from "formik";
import { PageProps } from "../../../../types/jotform/page-props.type";

export interface FirstPageProps extends PageProps {}

export function FirstPage({ onNextClick }: FirstPageProps) {
  const { t } = useTranslation();
  const form = useFormik({
    initialValues: {},
    onSubmit: (values) => {
      onNextClick();
    },
  });

  return (
    <>
      <Form onSubmit={form.handleSubmit}>
        <h1 className={styles.carrierName}>Suvineet Trucking</h1>
        <h4 className={styles.Application}>Driver Application</h4>
        <h6 className={styles.paragraph}>
          Welcome we have been waiting for you!
        </h6>
        <Row className="mt-5">
          <Col>
            <Button type="submit">{t("NEXT")}</Button>
          </Col>
        </Row>
      </Form>
    </>
  );
}
