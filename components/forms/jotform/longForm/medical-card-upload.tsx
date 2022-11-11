import React, { useContext, useEffect } from "react";
import Form from "react-bootstrap/Form";
import styles from "../../../../styles/jotform.module.css";
import BaseInput from "../../base-input";
import { Button, Col, Row } from "react-bootstrap";
import { useFormik } from "formik";
import { useTranslation } from "../../../../hooks/use-translation";
import { PageProps } from "../../../../types/jotform/page-props.type";
import jotformContext from "../../../../context/jotform-context";
import FileInput from "../../file-input";
import { DocumentsDto } from "../../../../models/jot-form/long-form/documents.dto";
import { ApplicantDocumentType } from "../../../../enums/applicants/applicant-document-type.enum";

export interface MedicalCardUploadprops extends PageProps {}

export function MedicalCardUpload() {
  const {
    state: { applicant, steps },
    method: { setApplicant, setSteps, stepNext, stepBack },
  } = useContext(jotformContext);

  const { t } = useTranslation();
  const form = useFormik({
    initialValues: new DocumentsDto(),
    validationSchema: DocumentsDto.yupSchema(),
    onSubmit: (values) => {
      const { document } = values;
      setApplicant((oldArray) => {
        return {
          ...oldArray,
          documents: [...oldArray.documents, { ...document }],
        };
      });
      stepNext();
    },
    onReset: (values) => {
      stepBack();
    },
  });
  useEffect(() => {
    // form.setFieldValue(
    //   "driver_license.type", ApplicantDocumentType.MEDICAL_CARD
    // )
    console.log("form doc", ApplicantDocumentType);

    form.setValues({
      document: {
        ...form.values.document,
        type: ApplicantDocumentType.MEDICAL_CARD,
        // value: applicant.documents.find(v => v.type === ApplicantDocumentType.MEDICAL_CARD)
      },
    });
  }, []);
  useEffect(() => {
    console.log("form errors", form.errors);
    console.log("form valuez", form.values);
    console.log("form applicant", applicant);
  }, [form.errors, form.values]);
  return (
    <>
      <Form onSubmit={form.handleSubmit} onReset={form.handleReset}>
        <Row>
          <h3 className="mb-4">{t("MEDICAL_CARD_UPLOAD_TITLE")}</h3>
        </Row>
        <Row className={styles.align__text_left}>
          <FileInput name="document" accept="application/pdf" formik={form} />
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
