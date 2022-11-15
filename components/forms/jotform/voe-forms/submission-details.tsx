import { useFormik } from "formik";
import React, { useContext, useEffect } from "react";
import { Button, Col, Row, Form } from "react-bootstrap";
import { useTranslation } from "../../../../hooks/use-translation";
import * as yup from "yup";
import BaseCheck from "../../base-check";
import BaseInput from "../../base-input";
import { PageProps } from "../../../../types/jotform/page-props.type";
import jotformContext from "../../../../context/jotform-context";
import { ApplicantExtras } from "../../../../enums/applicants/applicant-extras.enum";
import { ApplicantExtrasEntity } from "../../../../models/applicant/applicant-extras.entity";
import styles from "../../../../styles/jotform.module.css";
import { ReasonsForLeavingEmployment } from "../../../../enums/users/reasons-for-leaving-employment";
import BaseSelect from "../../base-select";
import BaseTextArea from "../../base-text-area";
import SignaturePad from "react-signature-canvas";
import SignatureCanvas from "react-signature-canvas";
import { SubmissionDetailsDto } from "../../../../models/jot-form/voe-form/submission-details.dto";

export interface SubmissionDetailsProps extends PageProps {}

export function SubmissionDetails(){
    const {
        method: { stepNext, stepBack },
      } = useContext(jotformContext);
    
      const { t } = useTranslation();
      let padRef = React.useRef<SignatureCanvas>(null);
    
      const clear = () => {
        padRef.current?.clear();
      };
      const form = useFormik({
        initialValues: new SubmissionDetailsDto(),
        onSubmit: (values) => {
            stepNext();
        },
        onReset: (values) => {
            stepBack();
        },
});

const signatureEnd = () => {
    console.log(padRef.current.toDataURL().toString());
    const signatureValue = padRef.current.toDataURL().toString();
    form.setFieldValue("SIGNATURE.value", signatureValue)
    
  };

  return(
    <Form onSubmit={ form.handleSubmit } onReset={ form.handleReset }>
        <Row className={styles.align__text_left}>
          <Col>
            <h6>{t("SIGNATURE")}</h6>
            <SignaturePad
              ref={padRef}
              onEnd={signatureEnd}
              canvasProps={{
                width: 700,
                height: 200,
                style: { border: "1px solid black" },
                className: "sigCanvas",
              }}
            />
          </Col>
        </Row>
        <Row className={styles.align__text_left}>
            <Col>
            <BaseInput 
                className="mt-3 float-left col-6"
                label="FULL_NAME"
                name="name"
            />
            </Col>
            <Col>
            <BaseInput 
                className="mt-3 float-left col-6"
                label="TITLE"
                name="title"
            />
            </Col>
        </Row>

        <Row className={styles.align__text_left}>
            <Col>
            <BaseInput 
                className="mt-3 float-left col-6"
                label="PHONE"
                name="phone"
            />
            </Col>
            <Col>
            <BaseInput 
                className="mt-3 float-left col-6"
                label="EMAIL"
                name="email"
            />
            </Col>
        </Row>

        <Row className={ styles.align__text_left }>
        <BaseInput 
                className="mt-3 float-left col-6"
                label="DATE"
                name="date"
                type="date"
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
              {t("SUBMIT")}
            </Button>
          </Col>
        </Row>
    </Form>
  );
}