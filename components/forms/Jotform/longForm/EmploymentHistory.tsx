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
import { States } from "../../../../enums/users/us-states.enum";
import { BooleanPreferenceType } from "../../../../enums/users/boolean-preferences.enum";
export interface EmploymentHistoryProps {
    onNextClick: (any) => void;
    onBackClick: () => void;
}
// New Jotformf
// New New JotForm
export function EmploymentHistory(props: EmploymentHistoryProps) {
    const { t } = useTranslation();
    const form = useFormik({
        initialValues: {
            employed_type: null,
            current_company_manager_name: null,
            current_company_phone_number: null,
            current_company_email: null,
            current_company_street_address_line_1: null,
            current_company_street_address_line_2: null,
            current_company_zipcode: null,
        },
         validationSchema: yup.object({
            // employed_type: yup.boolean().when({
            //     is: true,
            //     then: yup.string().oneOf({
            
            //     })
            // }).nullable(),
            current_company_manager_name: yup.string().required().nullable(),
            current_company_phone_number: yup.string().required().nullable(),
            current_company_email: yup.string().required().nullable(),
            current_company_street_address_line_1: yup.string().required().nullable(),
            current_company_street_address_line_2: yup.string().required().nullable(),
            current_company_zipcode: yup.string().required().nullable()
            // current_company_manager_name: yup.string().when({
            //     is:true,
            //     then:yup.string().required().nullable()
            // }),
            // current_company_phone_number: yup.string().when({
            //     is:true,
            //     then:yup.string().required().nullable()
            // }),
            // current_company_email: yup.string().when({
            //     is:true,
            //     then:yup.string().required().nullable()
            // }),
            // current_company_street_address_line_1: yup.string().when({
            //     is:true,
            //     then:yup.string().required().nullable()
            // }),
            // current_company_street_address_line_2: yup.string().when({
            //     is:true,
            //     then:yup.string().required().nullable()
            // }),
            // current_company_zipcode: yup.string().when({
            //     is:true,
            //     then:yup.string().required().nullable()
            // })
            
        }),
        onSubmit: (values) => {
            props.onNextClick(values);
        },
        onReset: (values) => {
            props.onBackClick();
        }
    })
    // function EmployedTypeChange(e: React.ChangeEvent<HTMLInputElement>) {
    //     const employedType = e.target.value;
    //     switch (employedType) {
    //         case CurrentlyEmployedType.YES:
    //             form.setValues({
    //                 ...form.values,
    //                 employed_type: employedType,
    //                 current_company_manager_name: null,
    //                 current_company_phone_number: null,
    //                 current_company_email: null,
    //                 current_company_street_address_line_1: null,
    //                 current_company_street_address_line_2: null,
    //                 current_company_zipcode: null,


    //             })
    //             break;
    //         default:
    //             form.setValues({
    //                 ...form.values,
    //                 employed_type: employedType
    //             })



    //     }
    // }

    return (
        <>
            <Form onSubmit={form.handleSubmit}
                onReset={form.handleReset}>
                <h4 className={`${styles.carrierName__smaller} ${styles.striped__border}`}>
                    Employment History
                </h4>
                <p className={styles.paragraph__left}>
                    Please be honest about your past employment as this helps speed up the hiring process.
                </p>
                {/* <Row>
                    <BaseCheck
                        className='mt-2 col-6 float-left'
                        required
                        name="employed_type"
                        label='Are you currently employed?'
                        formik={ form }
                    />
                </Row> */}
                {/* {!!form.values.employed_type && ( */}
                    <>

                        <Row>
                            <h6 className={ `${styles.carrierName__smaller} ${styles.align__text_left}`}>
                                Current Employer
                            </h6>
                            <p className={ `${styles.paragraph} ${styles.align__text_left}` }>
                                Put NA for any fields unknown
                            </p>
                        </Row>
                        <Row>
                            <Col className={styles.align__text_left}>
                            <BaseInput
                                className='col-12 mt-3'
                                name="current_company_name"
                                label="Current Company Name"
                                formik={form}
                            />
                            </Col>
                            <Col className={styles.align__text_left}>
                            <BaseInput
                                className='col-12 mt-3'
                                name="current_company_position"
                                label="Position(Current Company)"
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
                                label="Start Date"
                                formik={ form }
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
                                name="current_company_manager_name"
                                label="Manager or Representative (Current Company)"
                                formik={form}
                            />
                        </Row>

                        
                        <Row>
                            <Col>
                                <BaseInputPhone
                                    className='col-10 mt-3 mb-2'
                                    name="current_company_phone_number"
                                    // placeholder="Phone Number"
                                    label="Phone Number (Current Company)"
                                    formik={form}
                                />
                            </Col>
                            <Col>
                                <BaseInput
                                    className='col-10 mt-3 mb-2'
                                    required
                                    name='current_company_email'
                                    label='Email (Current Company)'
                                    // placeholder='EMAIL'
                                    formik={form}
                                />
                            </Col>
                        </Row>
                        <Row>
                            <h6 className={`${styles.align__text_left} ${styles.carrierName__smaller}`}>
                                Address(current company)
                            </h6>
                        </Row>
                        <Row>
                            <Col>
                                <BaseInput
                                    className='col-6 mt-3'
                                    required
                                    name="current_company_street_address_line_1"
                                    placeholder="Address Line 1"
                                    label="Street Address Line 1 (Current Company)"
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
                                        label="Street Address Line 2 (Current Company)"
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
                                label="Postal / Zip Code (Current Company)"
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
                                    enumType = {States}
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
                {/* )} */}
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