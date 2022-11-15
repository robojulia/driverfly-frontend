import { useFormik } from "formik";
import React, { useContext, useEffect } from "react";
import { Button, Col, Row, Form } from "react-bootstrap";
import { useTranslation } from "../../../../hooks/use-translation";
import BaseCheck from "../../base-check";
import BaseTextArea from "../../base-text-area";
import BaseInput from "../../base-input";
import { PageProps } from "../../../../types/jotform/page-props.type";
import jotformContext from "../../../../context/jotform-context";
import { DrugHistoryDto } from "../../../../models/jot-form/voe-form/drug-alcohol-history.dto";
import { ApplicantExtras } from "../../../../enums/applicants/applicant-extras.enum";
import { ApplicantExtrasEntity } from "../../../../models/applicant/applicant-extras.entity";
import styles from "../../../../styles/jotform.module.css";
import { BooleanPreferenceType } from "../../../../enums/users/boolean-preferences.enum";
import BaseSelect from "../../base-select";

export interface DrugHistoryProps extends PageProps {}

export function DrugHistory() {
    const{
        state: { applicant, applicantExtras, steps },
        method: { setApplicant, updateApplicantExtras, setSteps},
    } = useContext(jotformContext);

    const { t } = useTranslation();
    const form = useFormik({
        initialValues: new DrugHistoryDto(),
        validationSchema: DrugHistoryDto.yupSchema(),
        onSubmit: (values) => {

            setSteps(steps+1);
        },
        onReset: (values) => {
            setSteps(steps-1);
        },
        
    });

    useEffect(() => {
        const apx = applicantExtras?.find(
          (v) => v.type === ApplicantExtras.SUBJECT_TO_TESTS_DOT
        );
        form.setValues({
          ...form.values,
          SUBJECT_TO_TESTS_DOT: !!apx?.type
            ? apx
            : new ApplicantExtrasEntity(ApplicantExtras.SUBJECT_TO_TESTS_DOT),
          subject_to_tests_dot: !!apx?.value,
        });
      }, [applicantExtras]);
    
      useEffect(() => {
        console.log("values", form.values);
        console.log("error", form.errors);
      }, [form.values, form.errors]);

    return(
        <Form onSubmit={ form.handleSubmit } onReset={ form.handleReset }>
            <Row>
                <h4 className={ styles.carrierName__smaller}>
                    {t("DRUG_AND_ALCOHOL_HISTORY")}
                </h4>
            </Row>

            <Row>
                <BaseCheck
                    className="float-left col-6 mt-3"
                    name="subject_to_tests_dot"
                    label={t("SUBJECT_TO_TESTS_DOT")}
                    formik={ form }
                />    
            </Row>
            {form.values.subject_to_tests_dot? (
                <Row>
                    <Col>
                    <BaseCheck 
                        className="float-left col-6 mt-3"
                        name="result_greater_than"
                        label={t("RESULT_GREATER_THAN")}
                        formik={ form }
                    />
                    </Col>
                    <Col>
                    <BaseCheck 
                        className="float-left col-6 mt-3"
                        name="verified_positive_drug_test"
                        label={t("VERIFIED_POSITIVE_DRUG_TESTS")}
                        formik={ form }
                    />
                    </Col>
                    <Col>
                    <BaseCheck 
                        className="float-left col-6 mt-3"
                        name="refusal_to_tested"
                        label={t("REFUSAL_FOR_TEST")}
                        formik={ form }
                    />
                    </Col>
                    <Col>
                    <BaseCheck 
                        className="float-left col-6 mt-3"
                        name="other_dot_violations"
                        label={t("OTHER_DOT_VIOLATIONS")}
                        formik={ form }
                    />
                    </Col>
                </Row>
            ): null}

            <Row className={`${styles.paragraph} ${ styles.align__text_left }`}>
                    <BaseCheck
                    className="float-left col-6 mt-3"
                    name="previous_employer_report"
                    label={t("PREVIOUS_EMPLOYER_REPORT")}
                    formik={form}
                    />
                </Row>
                {form.values.previous_employer_report ? (
                    <Row className={ styles.align__text_left }>
                    <BaseTextArea
                        className="float-left mt-3"
                        name="PREVIOUS_EMPLOYER__REPORT.value"
                        label={t("PREVIOUS_EMPLOYER_REPORT_COMMENTS")}
                        formik={ form }
                    />
                    </Row>
                ) :null}

                <Row className={`${styles.paragraph} ${ styles.align__text_left }`}>
                    <BaseCheck
                    className="float-left col-6 mt-3"
                    name="return_to_duty_process"
                    label={t("RETURN_TO_DUTY_PROCESS")}
                    // enumType={ BooleanPreferenceType }
                    formik={form}
                    />
                </Row>
                {form.values.return_to_duty_process ? (
                    <Row className={ styles.align__text_left }>
                    <BaseInput
                        className="float-left mt-3"
                        type="file"
                        name="RETURN_TO_DUTY_PROCESS.value"
                        label={t("RETURN_TO_DUTY_DOC")}
                        formik={ form }
                    />
                    </Row>
                ) :null} 

                <Row className={ styles.align__text_left }>
                    <BaseTextArea 
                        className="float-left mt-3"
                        name="additional_comments"
                        label={t("ADDITIONAL_COMMENTS")}
                        formik= { form }
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
    )
    
}