import React, { useContext } from "react";
import styles from "../../../../styles/jotform.module.css";
import { useTranslation } from "../../../../hooks/use-translation";
import { useFormik } from "formik";
import { Button, Col, Row } from "react-bootstrap";
import { PageProps } from "../../../../types/jotform/page-props.type";
import jotformContext from "../../../../context/jotform-context";

export interface SeventhPageProps extends PageProps {}

export function SeventhPage({ onNextClick, onBackClick }: SeventhPageProps) {
  const {
    state: { applicant },
  } = useContext(jotformContext);
  const { t } = useTranslation();
  const form = useFormik({
    initialValues: null,
    onSubmit: (values) => {
      onNextClick(values);
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
      <form onSubmit={form.handleSubmit}>
        <Row>
          <h4 className={styles.carrierName__smaller}>
            Thanks for your submission to Nautilus Trucking.
          </h4>
        </Row>
        <Row>
          <h6 className={`${styles.paragraph} ${styles.margin__top}`}>
            Please note that Nautilus Trucking requires that you have your Class
            A CDL to be employed here.
          </h6>
        </Row>
        <Row className="mt-3">
          <Col>
            <Button className="float-middle" type="submit">
              {t("CONTINUE_APPLICATION")}
            </Button>
          </Col>
        </Row>
      </form>
    </>
  );
}
