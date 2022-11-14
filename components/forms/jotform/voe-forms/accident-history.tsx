import { useFormik } from "formik";
import React, { useContext, useEffect } from "react";
import { Button, Col, Row, Form } from "react-bootstrap";
import { useTranslation } from "../../../../hooks/use-translation";
import * as yup from "yup";
import BaseCheck from "../../base-check";
import BaseInput from "../../base-input";
import { PageProps } from "../../../../types/jotform/page-props.type";
import jotformContext from "../../../../context/jotform-context";
import { WorkedBeforeDto } from "../../../../models/jot-form/long-form/worked-before.dto";
import { ApplicantExtras } from "../../../../enums/applicants/applicant-extras.enum";
import { ApplicantExtrasEntity } from "../../../../models/applicant/applicant-extras.entity";
import styles from "../../../../styles/jotform.module.css";
import { ReasonsForLeavingEmployment } from "../../../../enums/users/reasons-for-leaving-employment";
import BaseSelect from "../../base-select";

export interface AccidentHistoryProps extends PageProps {}

export function AccidentHistory() {
  const {
    state: { applicant, applicantExtras, steps },
    method: { setApplicant, updateApplicantExtras, setSteps },
  } = useContext(jotformContext);

  const { t } = useTranslation();
  const form = useFormik({
    initialValues: new WorkedBeforeDto(),
    validationSchema: WorkedBeforeDto.yupSchema(),
    onSubmit: (values) => {
      const{ALREADY_APPLIED_TO_COMPANY, ALREADY_WORKED_TO_COMPANY} = values
      updateApplicantExtras(ALREADY_APPLIED_TO_COMPANY)
      updateApplicantExtras(ALREADY_WORKED_TO_COMPANY)
      setSteps(steps + 1);
    },
    onReset: (values) => {
      setSteps(steps - 1);
    },
  });

  useEffect(() => {
    const apx = applicantExtras?.find(
      (v) => v.type === ApplicantExtras.ALREADY_APPLIED_TO_COMPANY
    );
    const apx_worked_before = applicantExtras?.find(
      (v) => v.type === ApplicantExtras.ALREADY_WORKED_TO_COMPANY
    );
    form.setValues({
      ...form.values,
      ALREADY_APPLIED_TO_COMPANY: !!apx?.type
        ? apx
        : new ApplicantExtrasEntity(ApplicantExtras.ALREADY_APPLIED_TO_COMPANY),
        ALREADY_WORKED_TO_COMPANY: !!apx_worked_before?.type
        ? apx_worked_before
        : new ApplicantExtrasEntity(ApplicantExtras.ALREADY_WORKED_TO_COMPANY),
        // apx_worked_before: !!apx_worked_before.value,
        is_worked_before: !!apx?.value,
    });
  }, [applicantExtras]);

  useEffect(() => {
    console.log("values", form.values);
    console.log("error", form.errors);
  }, [form.values, form.errors]);

  return (
    <Form onSubmit={form.handleSubmit} onReset={form.handleReset}>
        <Row>
            <h4 className={ styles.carrierName__smaller }>
                {t("ACCIDENT_HISTORY")}
            </h4>
        </Row>
        <Row>
            <Col>
            <BaseInput
                className="col-9 mt-3" 
                name="was_employed_as"
                label={t("was_employed_as")}
                placeholder= {t("POSITION")}/>
            </Col>
            <Col>
            <BaseInput
                className="col-6 mt-3" 
                name="start_date"
                label={t("START_DATE")}
                placeholder= {t("mm/yy")}/>
            </Col>
            <Col>
            <BaseInput
                className="col-6 mt-3" 
                name="end_date"
                label={t("END_DATE")}
                placeholder= {t("mm/yy")}/>
            </Col>
        </Row>

        <Row className={styles.paragraph__left}>
        <BaseCheck
          className="float-left col-6"
          name="type_of_vehicle"
          label={t("VOE_DRIVER_QUES")}
          formik={form}
        />
      </Row>

      {/* {form.values.type_of_vehicle ? (
        <Row className={styles.align__text_left}>
          <BaseTextArea
            className="float-left mt-3"
            name="PAST_LICENSE_SUSPENSION.value"
            label="EXPLAIN_SUSPENSION"
            formik={form}
          />
        </Row>
      ) : null}
      <Row>
        <Col>
          <BaseCheck
            className="float-left col-6"
            name="ALREADY_APPLIED_TO_COMPANY.value"
            label="APPLIED_HERE_BEFORE"
            formik={form}
          />
        </Col>
      </Row>
      {form.values?.ALREADY_APPLIED_TO_COMPANY?.value ? (
        <>
          <Row>
            <Col>
              <BaseCheck
                className="mt-3 col-6 float-left"
                name="is_worked_before"
                label="WORKED_HERE_BEFORE"
                formik={form}
              />
            </Col>
          </Row>
          {form.values.is_worked_before ? (
            <>
              <Row>
                <Col>
                  <BaseInput
                    className="col-6 mt-3"
                    type="date"
                    name="ALREADY_WORKED_TO_COMPANY.value.start_date"
                    placeholder="DATE"
                    label="FROM"
                    formik={form}
                  />
                </Col>
                <Col>
                  <BaseInput
                    className="col-6 mt-3"
                    type="date"
                    name="ALREADY_WORKED_TO_COMPANY.value.end_date"
                    placeholder="DATE"
                    label="TO"
                    formik={form}
                  />
                </Col>
              </Row>
            </>
          ) : null}
        </>
      ) : null} */}

      <Row className={styles.align__text_left}>
      <BaseSelect
            className="col-4 mt-3"
            required
            enumType={ReasonsForLeavingEmployment}
            name="state"
            placeholder="state"
            label="CURRENT_STATE"
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
    </Form>
  );
}
