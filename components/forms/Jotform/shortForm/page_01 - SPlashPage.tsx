import React from 'react'
import styles from "../../../../styles/Jotform.module.css"
import { Form, Button, Col, Row, Table } from "react-bootstrap";
import { useTranslation } from "../../../../hooks/useTranslation";
import { useFormik } from 'formik';

export interface FirstPageProps {
  onNextClick: () => void;
}

export function FirstPage(props: FirstPageProps) {
  const { t } = useTranslation();
  const form = useFormik({
    initialValues: {},
    onSubmit: (values) => {
      props.onNextClick();
    }
  })



  return (
    <>
      <Form onSubmit={form.handleSubmit}>
        <h1 className={styles.carrierName}>Suvineet Trucking</h1>
        <h4 className={styles.Application}>Driver Application</h4>
        <h6 className={styles.paragraph}>Welcome we have been waiting for you!</h6>
        <Row className="mt-5">
          <Col>
            <Button
              type="submit"
              onClick={() => console.log("clicked the button")}>
              {t("NEXT")}
            </Button>
          </Col>
        </Row>

      </Form>
    </>
  )
}


