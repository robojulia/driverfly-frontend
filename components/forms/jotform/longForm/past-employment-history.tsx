import React, { useEffect } from "react";
import styles from "../../../../styles/jotform.module.css";
import { Form, Button, Col, Row } from "react-bootstrap";
import { useTranslation } from "../../../../hooks/use-translation";
import { useFormik } from "formik";
import BaseInput from "../../base-input";
import BaseInputPhone from "../../base-input-phone";
import BaseSelect from "../../base-select";
import * as yup from "yup";
import BaseCheck from "../../base-check";
import { BooleanPreferenceType } from "../../../../enums/users/boolean-preferences.enum";
import { States } from "../../../../enums/users/us-states.enum";
import { PastEmploymentHistoryDto } from "../../../../models/jot-form/long-form/past-employment-history.dto";
import { PageProps } from "../../../../types/jotform/page-props.type";
export interface PastEmploymentHistoryProps extends PageProps {
    // onNextClick: (any) => void;
    // onBackClick: () => void;
    applicant: any;
}

export function PastEmploymentHistory(props: PastEmploymentHistoryProps) {
    const { t } = useTranslation();
    const form = useFormik({
        initialValues: new PastEmploymentHistoryDto(),
        validationSchema: PastEmploymentHistoryDto.yupSchema(),
        onSubmit: (values) => {
            props.onNextClick(values);
        },
        onReset: (values) => {
            props.onBackClick();
        }
    })

    useEffect(() => {
        if (props.applicant && !form.dirty) form.setValues(props.applicant);
    }, [props.applicant]);
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
                        formik={form}
                    />
                </Row>
                {!!form.values.employed_type && (
                    <>
                        
                        <Row className={`${styles.paragraph} ${styles.align__text_left}`}>
                            <BaseCheck
                                className="mt-3 col-6 float-left"
                                name="authorize"
                                label="Do you authorize us to contact this company?"
                                formik={form} />
                        </Row>
                        <Row className={styles.align__text_left}>
                            <BaseInput
                                className="col-4 mt-3"
                                name="previous_company_manager_name"
                                label="PREVIOUS_MANAGER_NAME"
                                formik={form} />
                        </Row>
                        <Row>
                            <Col className={styles.align__text_left}>
                                <BaseInputPhone
                                    className="col-10 mt-3 mb-2"
                                    name="previous_company_phone_number"
                                    // placeholder="Phone Number"
                                    label="PREVIOUS_COMPANY_PHONE_NUMBER"
                                    formik={form} />
                            </Col>
                            <Col className={styles.align__text_left}>
                                <BaseInput
                                    className="col-10 mt-3 mb-2"
                                    required
                                    name="previous_company_email"
                                    label="PREVIOUS_COMPANY_EMAIL"
                                    // placeholder='EMAIL'
                                    formik={form} />
                            </Col>
                        </Row>
                        <Row>
                            <h6
                                className={`${styles.align__text_left} ${styles.carrierName__smaller}`}
                            >
                                Address(Previous company)
                            </h6>
                        </Row>
                        <Row>
                            <Col className={styles.align__text_left}>
                                <BaseInput
                                    className="col-6 mt-3"
                                    required
                                    name="previous_company_street_address_line_1"
                                    placeholder="Address Line 1"
                                    label="Street Address Line 1 (Previous Company)"
                                    formik={form} />
                            </Col>
                        </Row>
                        <Row>
                            <Col className={styles.align__text_left}>
                                <BaseInput
                                    className="col-6 mt-3 mb-3"
                                    required
                                    name="previous_company_street_address_line_2"
                                    placeholder="Address Line 2"
                                    label="Street Address Line 2 (Previous Company)"
                                    formik={form} />
                            </Col>
                        </Row>
                        <Row>
                            <Col className={styles.align__text_left}>
                                <BaseInput
                                    className="col-12 mt-4"
                                    required
                                    name="previous_company_zipcode"
                                    // placeholder='Zip Code'
                                    label="Postal / Zip Code (Previous Company)"
                                    formik={form} />
                            </Col>

                            <Col className={styles.align__text_left}>
                                <BaseInput
                                    className="col-12 mt-4"
                                    required
                                    name="city"
                                    label="City"
                                    formik={form} />
                            </Col>

                            <Col className={styles.align__text_left}>
                                <BaseSelect
                                    className="col-12 mt-4"
                                    required
                                    enumType={States}
                                    name="state"
                                    placeholder="CHOOSE STATE"
                                    label="State"
                                    formik={form} />
                            </Col>
                        </Row>
                        <Row className={`${styles.align__text_left} ${styles.paragraph}`}>
                            <Col>
                                <BaseSelect
                                    className="col-6 mt-4"
                                    required
                                    enumType={BooleanPreferenceType}
                                    name="fmcsr"
                                    placeholder="Click to Choose"
                                    label="Were you subject to the FMCSRs while employed here? (Current Company)"
                                    formik={form} />
                            </Col>
                        </Row>
                        <Row className={`${styles.align__text_left} ${styles.paragraph}`}>
                            <Col>
                                <BaseSelect
                                    className="col-6 mt-4"
                                    required
                                    enumType={BooleanPreferenceType}
                                    name="fmcsr"
                                    placeholder="Click to Choose"
                                    label="Was your job designated as a safety-sensitive function in any DOT-regulated mode subject to the drug and alcohol testing requirements of 49 CFR Part 40? (Current Company)"
                                    formik={form} />
                            </Col>
                        </Row></>
                )}
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
        </>
    );
}
// export interface PastEmploymentHistoryProps {
//     onNextClick: (values?: any) => void;
//     onBackClick: () => void;
//   }
//   export function PastEmploymentHistory(props: PastEmploymentHistoryProps) {
//     const { t } = useTranslation();
//     const form = useFormik({
//       initialValues: {
//         employed_type: false,
//         previous_company_manager_name: null,
//         previous_company_phone_number: null,
//         previous_company_email: null,
//         previous_company_street_address_line_1: null,
//         previous_company_street_address_line_2: null,
//         previous_company_zipcode: null,
//       },
//       validationSchema: yup.object({
//         previous_company_manager_name: yup
//           .string()
//           .when("employed_type", {
//             is: (v) => !!v,
//             then: yup.string().required().nullable(),
//             otherwise: yup.string().optional().nullable(),
//           })
//           .nullable(),
  
//         previous_company_email: yup
//           .string()
//           .when("employed_type", {
//             is: (v) => !!v,
//             then: yup.string().required().nullable(),
//             otherwise: yup.string().optional().nullable(),
//           })
//           .nullable(),
  
//         previous_company_street_address_line_1: yup
//           .string()
//           .when("employed_type", {
//             is: (v) => !!v,
//             then: yup.string().required().nullable(),
//             otherwise: yup.string().optional().nullable(),
//           })
//           .nullable(),
  
//         previous_company_street_address_line_2: yup
//           .string()
//           .when("employed_type", {
//             is: (v) => !!v,
//             then: yup.string().required().nullable(),
//             otherwise: yup.string().optional().nullable(),
//           })
//           .nullable(),
  
//         previous_company_zipcode: yup
//           .string()
//           .when("employed_type", {
//             is: (v) => !!v,
//             then: yup.string().required().nullable(),
//             otherwise: yup.string().optional().nullable(),
//           })
//           .nullable(),
//       }),
//       onSubmit: (values) => {
//         props.onNextClick(values);
//       },
//       onReset: (values) => {
//         props.onBackClick();
//       },
//     });
//     useEffect(() => {
//       console.log("error", form.errors);
//     }, [form.values, form.errors]);
  
//     return (
//       <>
//         <Form onSubmit={form.handleSubmit} onReset={form.handleReset}>
//           <h4
//             className={`${styles.carrierName__smaller} ${styles.striped__border}`}
//           >
//             Employment History
//           </h4>
//           <p className={styles.paragraph__left}>
//             Please be honest about your past employment as this helps speed up the
//             hiring process.
//           </p>
//           <Row>
//             <BaseCheck
//               className="mt-2 col-6 float-left"
//               required
//               name="employed_type"
//               label="Were you previously employed?"
//               formik={form}
//             />
//           </Row>
//           {form.values.employed_type ? (
//             <>
//               <Row>
//                 <h6
//                   className={`${styles.carrierName__smaller} ${styles.align__text_left}`}
//                 >
//                   Previous Employer
//                 </h6>
//                 <p className={`${styles.paragraph} ${styles.align__text_left}`}>
//                   Put NA for any fields unknown
//                 </p>
//               </Row>
//               <Row>
//                 <Col className={styles.align__text_left}>
//                   <BaseInput
//                     className="col-12 mt-3"
//                     name="previous_company_name"
//                     label="Previous Company Name"
//                     formik={form}
//                   />
//                 </Col>
//                 <Col className={styles.align__text_left}>
//                   <BaseInput
//                     className="col-12 mt-3"
//                     name="previous_company_position"
//                     label="Position(Previous Company)"
//                     formik={form}
//                   />
//                 </Col>
//               </Row>
  
//               <Row>
//                 <Col className={styles.align__text_left}>
//                   <BaseInput
//                     className="col-10 mt-3"
//                     required
//                     type="date"
//                     name="start_date"
//                     label="Start Date"
//                     formik={form}
//                   />
//                 </Col>
  
//                 <Col className={styles.paragraph}>
//                   <BaseCheck
//                     className="mt-3 col-10 float-left"
//                     required
//                     name="authorize"
//                     label="Do you authorize us to contact this company?"
//                     formik={form}
//                   />
//                 </Col>
//               </Row>
  
//               <Row className={styles.align__text_left}>
//                 <BaseInput
//                   className="col-6 mt-3"
//                   name="previous_company_manager_name"
//                   label="Manager or Representative (Previous Company)"
//                   formik={form}
//                 />
//               </Row>
  
//               <Row>
//                 <Col>
//                   <BaseInputPhone
//                     className="col-10 mt-3 mb-2"
//                     name="previous_company_phone_number"
//                     // placeholder="Phone Number"
//                     label="Phone Number (Previous Company)"
//                     formik={form}
//                   />
//                 </Col>
//                 <Col>
//                   <BaseInput
//                     className="col-10 mt-3 mb-2"
//                     required
//                     name="previous_company_email"
//                     label="Email (Previous Company)"
//                     // placeholder='EMAIL'
//                     formik={form}
//                   />
//                 </Col>
//               </Row>
//               <Row>
//                 <h6
//                   className={`${styles.align__text_left} ${styles.carrierName__smaller}`}
//                 >
//                   Address(Previous company)
//                 </h6>
//               </Row>
//               <Row>
//                 <Col>
//                   <BaseInput
//                     className="col-6 mt-3"
//                     required
//                     name="previous_company_street_address_line_1"
//                     placeholder="Address Line 1"
//                     label="Street Address Line 1 (Previous Company)"
//                     formik={form}
//                   />
//                 </Col>
//               </Row>
//               <Row>
//                 <Col>
//                   <BaseInput
//                     className="col-6 mt-3"
//                     required
//                     name="previous_company_street_address_line_2"
//                     placeholder="Address Line 2"
//                     label="Street Address Line 2 (Previous Company)"
//                     formik={form}
//                   />
//                 </Col>
//               </Row>
//               <Row>
//                 <Col className={styles.align__text_left}>
//                   <BaseInput
//                     className="col-12 mt-2"
//                     required
//                     name="previous_company_zipcode"
//                     // placeholder='Zip Code'
//                     label="Postal / Zip Code (Previous Company)"
//                     formik={form}
//                   />
//                 </Col>
  
//                 <Col className={styles.align__text_left}>
//                   <BaseInput
//                     className="col-12 mt-4"
//                     required
//                     name="city"
//                     label="City"
//                     formik={form}
//                   />
//                 </Col>
  
//                 <Col className={styles.align__text_left}>
//                   <BaseSelect
//                     className="col-12 mt-4"
//                     required
//                     enumType={States}
//                     name="state"
//                     placeholder="CHOOSE STATE"
//                     label="State"
//                     formik={form}
//                   />
//                 </Col>
//               </Row>
  
//               <Row className={`${styles.align__text_left} ${styles.paragraph}`}>
//                 <Col>
//                   <BaseSelect
//                     className="col-6 mt-4"
//                     required
//                     enumType={BooleanPreferenceType}
//                     name="fmcsr"
//                     placeholder="Click to Choose"
//                     label="Were you subject to the FMCSRs while employed here? (Current Company)"
//                     formik={form}
//                   />
//                 </Col>
//               </Row>
  
//               <Row className={`${styles.align__text_left} ${styles.paragraph}`}>
//                 <Col>
//                   <BaseSelect
//                     className="col-6 mt-4"
//                     required
//                     enumType={BooleanPreferenceType}
//                     name="fmcsr"
//                     placeholder="Click to Choose"
//                     label="Was your job designated as a safety-sensitive function in any DOT-regulated mode subject to the drug and alcohol testing requirements of 49 CFR Part 40? (Current Company)"
//                     formik={form}
//                   />
//                 </Col>
//               </Row>
//             </>
//           ) : null}
  
//           <Row className="mt-5">
//             <Col>
//               <Button className="float-right" type="reset">
//                 {t("BACK")}
//               </Button>
//             </Col>
//             <Col>
//               <Button className="float-left" type="submit">
//                 {t("NEXT")}
//               </Button>
//             </Col>
//           </Row>
//         </Form>
//       </>
//     );
//   }