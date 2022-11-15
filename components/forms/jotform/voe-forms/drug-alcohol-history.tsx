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
        method: { stepNext, stepBack },
    } = useContext(jotformContext);

    const { t } = useTranslation();
    const form = useFormik({
        initialValues: new DrugHistoryDto(),
        // validationSchema: DrugHistoryDto.yupSchema(),
        onSubmit: (values) => {
            stepNext();
        },
        onReset: (values) => {
            stepBack();
        },
        
    });

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
                    label="SUBJECT_TO_TESTS_DOT"
                    formik={ form }
                />    
            </Row>
            {form.values.subject_to_tests_dot? (
                <>
                <Row>
                    <Col>
                    <BaseCheck 
                        className="float-left col-12 mt-3"
                        name="result_greater_than"
                        label="RESULT_GREATER_THAN"
                        formik={ form }
                    />
                    </Col>
                    <Col>
                    <BaseCheck 
                        className="float-left col-12 mt-3"
                        name="verified_positive_drug_test"
                        label="VERIFIED_POSITIVE_DRUG_TESTS"
                        formik={ form }
                    />
                    </Col>
                    <Col>
                    <BaseCheck 
                        className="float-left col-12 mt-3"
                        name="refusal_to_tested"
                        label="REFUSAL_FOR_TEST"
                        formik={ form }
                    />
                    </Col>
                    <Col>
                    <BaseCheck 
                        className="float-left col-12 mt-3"
                        name="other_dot_violations"
                        label="OTHER_DOT_VIOLATIONS"
                        formik={ form }
                    />
                    </Col>
                </Row>
                <Row className={`${styles.paragraph} ${ styles.align__text_left }`}>
                    <BaseCheck
                    className="float-left col-6 mt-3"
                    name="previous_employer_report"
                    label="PREVIOUS_EMPLOYER_REPORT"
                    formik={form}
                    />
                </Row>
                {form.values.previous_employer_report ? (
                    <Row className={ styles.align__text_left }>
                    <BaseTextArea
                        className="float-left mt-3"
                        name="PREVIOUS_EMPLOYER__REPORT.value"
                        label="PREVIOUS_EMPLOYER_REPORT_COMMENTS"
                        formik={ form }
                    />
                    </Row>
                ) :null}

                 
                </>
            ): null}

                <Row className={`${styles.paragraph} ${ styles.align__text_left }`}>
                    <BaseCheck
                    className="float-left col-6 mt-3"
                    name="return_to_duty_process"
                    label="RETURN_TO_DUTY_PROCESS"
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
                        label="RETURN_TO_DUTY_DOC"
                        formik={ form }
                    />
                    </Row>
                ) :null} 

                <Row className={ styles.align__text_left }>
                    <BaseTextArea 
                        className="float-left mt-3"
                        name="additional_comments"
                        label="ADDITIONAL_COMMENTS"
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