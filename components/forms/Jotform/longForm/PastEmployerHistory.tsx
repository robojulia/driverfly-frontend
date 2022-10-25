import React from "react";
import styles from "../../../../styles/JotForm.module.css";
import { Form, Button, Col, Row } from "react-bootstrap";
import { useTranslation } from "../../../../hooks/useTranslation";
import { useFormik } from "formik";
import BaseInput from "../../BaseInput";
import BaseInputPhone from "../../BaseInputPhone";
import BaseSelect from "../../BaseSelect";
import * as yup from "yup";
import BaseCheck from "../../BaseCheck";
import { BooleanPreferenceType } from "../../../../enums/users/boolean-preferences.enum";
import { States } from "../../../../enums/users/us-states.enum";
export interface PastEmploymentHistoryProps {
    onNextClick: (any) => void;
    onBackClick: () => void;
}

export function PastEmploymentHistory(props: PastEmploymentHistoryProps) {
    const { t } = useTranslation();
    const form = useFormik({
        initialValues: {
            employed_type: null,
            previous_company_manager_name: null,
            previous_company_phone_number: null,
            previous_company_email: null,
            previous_company_street_address_line_1: null,
            previous_company_street_address_line_2: null,
            previous_company_zipcode: null,
            start_date:null,
            end_date: null
        },
        validationSchema: yup.object({
            previous_company_manager_name: yup
              .string()
              .when("employed_type", {
                is: (v) => !!v,
                then: yup.string().required().nullable(),
                otherwise: yup.string().optional().nullable(),
              })
              .nullable(),
      
            previous_company_email: yup
              .string()
              .when("employed_type", {
                is: (v) => !!v,
                then: yup.string().required().nullable(),
                otherwise: yup.string().optional().nullable(),
              })
              .nullable(),
      
            previous_company_street_address_line_1: yup
              .string()
              .when("employed_type", {
                is: (v) => !!v,
                then: yup.string().required().nullable(),
                otherwise: yup.string().optional().nullable(),
              })
              .nullable(),
      
            previous_company_street_address_line_2: yup
              .string()
              .when("employed_type", {
                is: (v) => !!v,
                then: yup.string().required().nullable(),
                otherwise: yup.string().optional().nullable(),
              })
              .nullable(),
      
            previous_company_zipcode: yup
              .string()
              .when("employed_type", {
                is: (v) => !!v,
                then: yup.string().required().nullable(),
                otherwise: yup.string().optional().nullable(),
              })
              .nullable(),
          }),
        
        onSubmit: (values) => {
            props.onNextClick(values);
        },
        onReset: (values) => {
            props.onBackClick();
        }
    })
    

    return (
        <>
            <Form onSubmit={form.handleSubmit}
                onReset={form.handleReset}>
                <h4 className={`${styles.carrierName__smaller} ${styles.striped__border}`}>
                    Past Employment History
                </h4>
                <p className={styles.paragraph__left}>
                    Please be honest about your past employment as this helps speed up the hiring process.
                </p>
                <Row className={styles.align__text_left}>
                    <BaseCheck
                        className='mt-2 col-6 float-left'
                        required
                        name="employed_type"
                        label='Were you previously employed?'
                        formik={ form }
                    />
                </Row>
                {!!form.values.employed_type && (
                    <>

                        <Row>
                            <h6 className={ `${styles.carrierName__smaller} ${styles.align__text_left}`}>
                                Previous Employer
                            </h6>
                            <p className={ `${styles.paragraph} ${styles.align__text_left}` }>
                                Put NA for any fields unknown
                            </p>
                        </Row>
                        <Row>
                            <Col className={styles.align__text_left}>
                            <BaseInput
                                className='col-12 mt-3'
                                name="previous_company_name"
                                label="Previous Company Name"
                                formik={form}
                            />
                            </Col>
                            <Col className={styles.align__text_left}>
                            <BaseInput
                                className='col-12 mt-3'
                                name="previous_company_position"
                                label="Position(Previous Company)"
                                formik={form}
                            />
                            </Col>
                            
                            
                        </Row>
                        
                        <Row>
                        <Col className={styles.align__text_left}>
                            <BaseInput
                                className='col-10 mt-3'
                                required
                                type="date"
                                name='start_date'
                                label="START_DATE"
                                formik={form}
                            />
                        </Col>
                        <Col className={styles.align__text_left}>
                            <BaseInput
                                className='col-10 mt-3'
                                required
                                type="date"
                                name='end_date'
                                label="END_DATE"
                                formik={form}
                            />
                        </Col>

                        <Col className={styles.paragraph}>
                            <BaseCheck
                                className='mt-3 col-10 float-left'
                                required
                                name="authorize"
                                label='Do you authorize us to contact this company?'
                                formik={ form }
                        />
                        </Col>   
                        </Row>

                        <Row className={styles.align__text_left}>
                            <BaseInput
                                className='col-6 mt-3'
                                name="previous_company_manager_name"
                                label="PREVIOUS_MANAGER_NAME"
                                formik={form}
                            />
                        </Row>

                        
                        <Row>
                            <Col>
                                <BaseInputPhone
                                    className='col-10 mt-3 mb-2'
                                    name="previous_company_phone_number"
                                    // placeholder="Phone Number"
                                    label="PREVIOUS_COMPANY_PHONE_NUMBER"
                                    formik={form}
                                />
                            </Col>
                            <Col>
                                <BaseInput
                                    className='col-10 mt-3 mb-2'
                                    required
                                    name='previous_company_email'
                                    label='PREVIOUS_COMPANY_EMAIL'
                                    // placeholder='EMAIL'
                                    formik={form}
                                />
                            </Col>
                        </Row>
                        <Row>
                            <h6 className={`${styles.align__text_left} ${styles.carrierName__smaller}`}>
                                Address(Previous company)
                            </h6>
                        </Row>
                        <Row>
                            <Col>
                                <BaseInput
                                    className='col-6 mt-3'
                                    required
                                    name="current_company_street_address_line_1"
                                    placeholder="Address Line 1"
                                    label="Street Address Line 1 (Previous Company)"
                                    formik={form}
                                />
                            </Col>
                        </Row>
                        <Row>
                                <Col>
                                    <BaseInput
                                        className='col-6 mt-3'
                                        required
                                        name="current_company_street_address_line_2"
                                        placeholder="Address Line 2"
                                        label="Street Address Line 2 (Previous Company)"
                                        formik={form}
                                    />
                                </Col>
                            </Row>
                        <Row>
                            <Col className={ styles.align__text_left }>
                            <BaseInput
                                className='col-12 mt-2'
                                required
                                name='current_company_zipcode'
                                // placeholder='Zip Code'
                                label="Postal / Zip Code (Previous Company)"
                                formik={form}
                            />
                            </Col>

                            <Col className={ styles.align__text_left }>
                            <BaseInput
                                className='col-12 mt-4'
                                required
                                name='city'
                                label="City"
                                formik={form}
                            />
                            </Col>

                            <Col className={ styles.align__text_left }>
                                <BaseSelect
                                    className='col-12 mt-4'
                                    required
                                    enumType={States}
                                    name="state"
                                    placeholder="CHOOSE STATE"
                                    label="State"
                                    formik = { form }
                                 />
                            </Col>
                        </Row>

                        <Row className={ `${styles.align__text_left} ${styles.paragraph}` }>
                            <Col>
                                <BaseSelect
                                    className='col-6 mt-4'
                                    required
                                    enumType = {BooleanPreferenceType}
                                    name="fmcsr"
                                    placeholder="Click to Choose"
                                    label="Were you subject to the FMCSRs while employed here? (Current Company)"
                                    formik = { form }
                                />
                            </Col>
                        </Row>

                        <Row className={ `${styles.align__text_left} ${styles.paragraph}` }>
                            <Col>
                                <BaseSelect
                                    className='col-6 mt-4'
                                    required
                                    enumType = {BooleanPreferenceType}
                                    name="fmcsr"
                                    placeholder="Click to Choose"
                                    label="Was your job designated as a safety-sensitive function in any DOT-regulated mode subject to the drug and alcohol testing requirements of 49 CFR Part 40? (Current Company)"
                                    formik = { form }
                                />
                            </Col>
                        </Row>
                        
                    </>
                )}
                <Row className="mt-5">
                    <Col>
                        <Button
                            className="float-right"
                            type="reset">
                            {t("BACK")}
                        </Button>
                    </Col>
                    <Col>
                        <Button
                            className="float-left"
                            type="submit">
                            {t("NEXT")}
                        </Button>
                    </Col>
                </Row>

            </Form>
        </>
    )
}