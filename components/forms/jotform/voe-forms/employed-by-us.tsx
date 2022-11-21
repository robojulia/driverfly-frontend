import { useFormik } from "formik";
import { useTranslation } from "../../../../hooks/use-translation";
import { Form, Button, Col, Row } from "react-bootstrap";
import { PageProps } from "../../../../types/jotform/page-props.type";
import voeFormContextType from "../../../../context/voeform-context";
import { useContext, useEffect } from "react";
import styles from "../../../../styles/jotform.module.css";
import BaseCheck from "../../base-check";
import { EmployedByUsDto } from "../../../../models/jot-form/voe-form/employed-by-us.dto";
import { ApplicantVoeFormEnum } from "../../../../enums/applicants/applicant-voe-form.enum";
import { ApplicantVoeFormEntity } from "../../../../models/applicant/applicant-voe-form.entity";

export interface EmployedByUsProps extends PageProps {}

export function EmployedByUs() {
  const {
    state: { applicantVoe },
    method: { stepNext, stepBack, updateApplicantVoe },
  } = useContext(voeFormContextType);

  const { t } = useTranslation();

  const form = useFormik({
    initialValues: new EmployedByUsDto(),
    validationSchema: EmployedByUsDto.yupSchema(),
    onSubmit: (values) => {
      const { EMPLOYED_BY_US } = values;
      updateApplicantVoe(EMPLOYED_BY_US);
      stepNext();
    },
    onReset: (values) => {
      stepBack();
    },
  });

  useEffect(() => {
    const apx = applicantVoe?.find(
      (v) => v.type === ApplicantVoeFormEnum.EMPLOYED_BY_US
    );
    form.setValues({
      ...form.values,
      EMPLOYED_BY_US: !!apx?.type
        ? apx
        : new ApplicantVoeFormEntity(ApplicantVoeFormEnum.EMPLOYED_BY_US),
    });
  }, [applicantVoe]);

  useEffect(() => {
    console.log("form values", form.values);
    console.log("form eror", form.errors);
  }, [form.values, form.errors]);

  return (
    <Form onSubmit={form.handleSubmit} onReset={form.handleReset}>
      <h4 className={`${styles.carrierName}`}>{t("EMPLOYMENT_VERIF")}</h4>
      <Row>
        <BaseCheck
          className="mt-3 mb-3"
          required
          name="EMPLOYED_BY_US.value"
          label="EMPLOYED_BY_US"
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
    </Form>
  );
}
