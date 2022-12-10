import { useFormik } from "formik";
import React, { useContext, useEffect } from "react";
import { Button, Col, Row, Form } from "react-bootstrap";
import { useTranslation } from "../../../../hooks/use-translation";
import BaseInput from "../../base-input";
import styles from "../../../../styles/jotform.module.css";
import Accordion from "react-bootstrap/Accordion";
import SignaturePad from "react-signature-canvas";
import SignatureCanvas from "react-signature-canvas";

import jotformContext from "../../../../context/jotform-context";
import ApplicantApi from "../../../../pages/api/applicant";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import { globalAjaxExceptionHandler } from "../../../../utils/ajax";
import { ApplicantExtras } from "../../../../enums/applicants/applicant-extras.enum";
import { ApplicantExtrasEntity } from "../../../../models/applicant/applicant-extras.entity";
import { AccordianDto } from "../../../../models/jot-form/long-form/accordian.dto";

export function AccordianPage() {
    const {
        state: { applicantExtras, applicant },
        method: { stepBack, updateApplicantExtras },
    } = useContext(jotformContext);

    const { t } = useTranslation();
    let padRef = React.useRef<SignatureCanvas[]>([null, null, null, null]);
    const clearSignaturePad = () => padRef?.current?.map((el) => el?.clear());

    const form = useFormik({
        initialValues: new AccordianDto(),
        validationSchema: AccordianDto.yupSchema(),
        onSubmit: async (values) => {
            const applicantApi = new ApplicantApi();

            try {
                const filtered_extras = applicantExtras?.filter((v) => !!v.value);
                const response = await applicantApi.jotform.update(applicant.id, {
                    applicant,
                    applicantExtras: filtered_extras,
                });
                toast.success(t("successfully_saved_information"));
            } catch (error) {
                console.log(error);
                globalAjaxExceptionHandler(error, { formik: form, toast: toast, t: t });
            }
        },
        onReset: (values) => {
            stepBack();
        },
    });
    const handleSignatureEnd = (index: number) => {
        const signatureValue = padRef?.current[index]?.toDataURL();
        padRef?.current.map((el, key) => {
            if (key != index) {
                el?.clear();
                el?.fromDataURL(signatureValue);
            }
        });
        form.setFieldValue("SIGNATURE.value", signatureValue?.toString());
    };
    useEffect(() => {
        updateApplicantExtras(form.values.EMPLOYEE_SS_OR_ID);
        updateApplicantExtras(form.values.DISCLOSURE_AND_AUTHORIZATION_DATE);
        updateApplicantExtras(form.values.IMPORTANT_DISCLOSURE_BACKGROUND_DATE);
        updateApplicantExtras(form.values.GENERAL_CONSENT);
        updateApplicantExtras(form.values.SIGNATURE);
    }, [form.values]);
    useEffect(() => {
        console.log("applicant extras", applicantExtras);
        console.log("applicant", applicant);

        const apx_ss_id = applicantExtras?.find(
            (v) => v.type === ApplicantExtras.EMPLOYEE_SS_OR_ID
        );
        const apx_disclosure_date = applicantExtras?.find(
            (v) => v.type === ApplicantExtras.DISCLOSURE_AND_AUTHORIZATION_DATE
        );
        const apx_background_date = applicantExtras?.find(
            (v) => v.type === ApplicantExtras.IMPORTANT_DISCLOSURE_BACKGROUND_DATE
        );
        const apx_general_consent = applicantExtras?.find(
            (v) => v.type === ApplicantExtras.GENERAL_CONSENT
        );
        const apx_sign = applicantExtras?.find(
            (v) => v.type === ApplicantExtras.SIGNATURE
        );
        if (apx_sign?.value)
            padRef?.current?.map((el, index) => el?.fromDataURL(apx_sign?.value));

        form.setValues({
            ...form.values,
            SIGNATURE: !!apx_sign?.type
                ? apx_sign
                : new ApplicantExtrasEntity(ApplicantExtras.SIGNATURE),
            EMPLOYEE_SS_OR_ID: !!apx_ss_id?.type
                ? apx_ss_id
                : new ApplicantExtrasEntity(ApplicantExtras.EMPLOYEE_SS_OR_ID),
            DISCLOSURE_AND_AUTHORIZATION_DATE: !!apx_disclosure_date?.type
                ? apx_disclosure_date
                : new ApplicantExtrasEntity(
                    ApplicantExtras.DISCLOSURE_AND_AUTHORIZATION_DATE
                ),
            IMPORTANT_DISCLOSURE_BACKGROUND_DATE: !!apx_background_date?.type
                ? apx_background_date
                : new ApplicantExtrasEntity(
                    ApplicantExtras.IMPORTANT_DISCLOSURE_BACKGROUND_DATE
                ),
            GENERAL_CONSENT: !!apx_general_consent?.type
                ? apx_general_consent
                : new ApplicantExtrasEntity(ApplicantExtras.GENERAL_CONSENT),
        });
    }, [applicant]);

    useEffect(() => {
        console.log("form values", form.values);
        console.log("form errors", form.errors);
    }, [form.values, form.errors]);
    return (
        <>
            <ToastContainer />
            <Form onSubmit={form.handleSubmit} onReset={form.handleReset}>
                <h1>{t("FORMS_TO_SIGNUP")}</h1>
                <h6>{t("PLEASE_CLICK_EACH_ARROW")}</h6>
                <Accordion className="col-12 p-0 jotform__accordion">
                    <Accordion.Item eventKey="0">
                        <Accordion.Header>
                            {t("VERIFICATION_OF_EMPLOYMENT")}
                        </Accordion.Header>
                        <Accordion.Body>
                            <h2>{t("VERIFICATION_OF_EMPLOYMENT")}</h2>
                            <h6>{t("SAFETY_PERFORMANCE_HISTORY_RECORDS_REQUEST")}</h6>
                            <Row className={styles.align__text_left}>
                                <h3>{t("SECTION_I")}</h3>
                            </Row>
                            <Row className={styles.align__text_left}>
                                <p className={`${styles.paragraph} ${styles.align__text_left}`}>
                                    {t("TO_BE_COMPLETED_BY_THE_NEW_EMPLOYER")}
                                </p>
                            </Row>
                            <Row className={styles.align__text_left}>
                                <h6>{t("EMPLOYEE_NAME_NAUTILUS")}</h6>
                            </Row>
                            <Row className={styles.align__text_left}>
                                <BaseInput
                                    className="col my-3"
                                    name="EMPLOYEE_SS_OR_ID.value"
                                    label="EMPLOYEE_SS_OR_BUSINESS"
                                    formik={form}
                                />
                            </Row>

                            <Row className={styles.align__text_left}>
                                <p className={`${styles.paragraph} ${styles.align__text_left}`}>
                                    {t("I_HEREBY_AUTHORIZE_RELEASE_OF_BUSINESS")}
                                </p>
                            </Row>
                            <Row className={styles.align__text_left}>
                                <p className={`${styles.paragraph} ${styles.align__text_left}`}>
                                    {" "}
                                    {t("ALCOHOL_TESTS_WITH_A_RESULT")}
                                </p>
                            </Row>
                            <Row className={styles.align__text_left}>
                                <p className={`${styles.paragraph} ${styles.align__text_left}`}>
                                    {" "}
                                    {t("VERIFY_POSITIVE_DRUG_TESTS")}
                                </p>
                            </Row>
                            <Row className={styles.align__text_left}>
                                <p className={`${styles.paragraph} ${styles.align__text_left}`}>
                                    {" "}
                                    {t("REFUSALS_TO_BE_TESTED")}
                                </p>
                            </Row>
                            <Row className={styles.align__text_left}>
                                <p className={`${styles.paragraph} ${styles.align__text_left}`}>
                                    {" "}
                                    {t("OTHER_VIOLATIONS_OF_DOT")}
                                </p>
                            </Row>
                            <Row className={styles.align__text_left}>
                                <p className={`${styles.paragraph} ${styles.align__text_left}`}>
                                    {" "}
                                    {t("INFORMATION_OBTAINED_FROM_PREVIOUS")}
                                </p>
                            </Row>
                            <Row className={styles.align__text_left}>
                                <p className={`${styles.paragraph} ${styles.align__text_left}`}>
                                    {" "}
                                    {t("DOCUMENTATION_IF_ANY_OF_COMPLETION")}
                                </p>
                            </Row>
                            <Row className={styles.align__text_left}>
                                <Col>
                                    <h6>{t("SIGNATURE")}</h6>
                                    <SignaturePad
                                        name="SIGNATURE.value"
                                        required
                                        onEnd={() => {
                                            handleSignatureEnd(0);
                                        }}
                                        ref={(el) => (padRef.current[0] = el)}
                                        canvasProps={{
                                            style: { border: "1px solid black" },
                                            className: "sigCanvas",
                                        }}
                                    />
                                </Col>
                            </Row>
                            <Row className={styles.align__text_left}>
                                <Col>
                                    <button
                                        className="theme-secondary-btn"
                                        type="button"
                                        onClick={clearSignaturePad}
                                    >
                                        {t("CLEAR")}
                                    </button>
                                </Col>
                            </Row>
                            <Row className={styles.align__text_left}>
                                <h4 className="mt-3">{t("I_A")}</h4>
                                <p className={`${styles.paragraph} ${styles.align__text_left}`}>
                                    {t("NEW_EMPLOYER_NAME_NAUTTLUS")}
                                </p>
                                <p className={`${styles.paragraph} ${styles.align__text_left}`}>
                                    {t("ADDRESS_MLK_BLVD")}
                                </p>
                                <p className={`${styles.paragraph} ${styles.align__text_left}`}>
                                    {t("PHONE_#_(551)_430-1998")}
                                </p>
                                <p className={`${styles.paragraph} ${styles.align__text_left}`}>
                                    {t("FAX_#_:")}
                                </p>
                                <p className={`${styles.paragraph} ${styles.align__text_left}`}>
                                    {t("DESIGNATED_EMPLOYER")}
                                </p>
                            </Row>
                            <Row className={`${styles.align__text_left} ${styles.highlight}`}>
                                <h6>{t("PLEASE_NOTE_THE_FOLLOWING_EMPLOYERS")} </h6>
                            </Row>
                            <Row className={styles.align__text_left}>
                                <h4 className="mt-3">{t("I-B")}</h4>
                                <p className={`${styles.paragraph} ${styles.align__text_left}`}>
                                    {t("CURRENT_COMPANY_NAME")}
                                </p>
                                <p className={`${styles.paragraph} ${styles.align__text_left}`}>
                                    {t("ADDRESS:")}
                                </p>
                                <p className={`${styles.paragraph} ${styles.align__text_left}`}>
                                    {t("PHONE_#_:")}
                                </p>
                                <p className={`${styles.paragraph} ${styles.align__text_left}`}>
                                    {t("FAX_#_:")}
                                </p>
                                <p className={`${styles.paragraph} ${styles.align__text_left}`}>
                                    {t("DESIGNATED_EMPLOYER_REPRESENTATIVE")}{" "}
                                </p>
                            </Row>
                            <Row className={`${styles.align__text_left} ${styles.highlight}`}>
                                <h6>{t("PLEASE_NOTE_THE_FOLLOWING")} </h6>
                            </Row>
                            <Row className={styles.blur}>
                                <Row className={styles.align__text_left}>
                                    <Col>
                                        <h3 className="mt-3">{t("SECTION_II")}</h3>
                                    </Col>
                                </Row>
                                <Row className={styles.align__text_left}>
                                    <p
                                        className={`${styles.paragraph} ${styles.align__text_left}`}
                                    >
                                        {t("TO_BE_COMPLETED")}
                                    </p>
                                </Row>
                                <Row className={styles.align__text_left}>
                                    <Col>
                                        <h4>{t("II_A_ACCIDENT_HISTORY")}</h4>
                                    </Col>
                                </Row>
                                <Row className={styles.align__text_left}>
                                    <p
                                        className={`${styles.paragraph} ${styles.align__text_left}`}
                                    >
                                        {t("THE_APPLICANT_NAMED_ABOVE")}
                                    </p>
                                </Row>
                                <Row className={styles.align__text_left}>
                                    <p
                                        className={`${styles.paragraph} ${styles.align__text_left}`}
                                    >
                                        {t("EMPLOYES_AS___________________________")}
                                    </p>
                                </Row>
                                <Row className={styles.align__text_left}>
                                    <p
                                        className={`${styles.paragraph} ${styles.align__text_left}`}
                                    >
                                        {t("DID_HE/SHE_DRIVE_MOTOR_VEHICLE")}
                                    </p>
                                </Row>
                                <Row className={styles.align__text_left}>
                                    <p
                                        className={`${styles.paragraph} ${styles.align__text_left}`}
                                    >
                                        {t("REASON_FOR_LEAVING_YOUR_EMPLOY")}
                                    </p>
                                </Row>
                                <Row className={styles.align__text_left}>
                                    <p
                                        className={`${styles.paragraph} ${styles.align__text_left}`}
                                    >
                                        {t("IF_THERE_IS_NO_SAFETY")}
                                    </p>
                                </Row>
                                <Row className={styles.align__text_left}>
                                    <p
                                        className={`${styles.paragraph} ${styles.align__text_left}`}
                                    >
                                        {t("THE_APPLICANT_NAMED_ABOVE_WAS")}
                                    </p>
                                </Row>
                                <Row className={styles.align__text_left}>
                                    <p
                                        className={`${styles.paragraph} ${styles.align__text_left}`}
                                    >
                                        {t("ACCIDENTAL_COMPLETE_THE_FOLLOWING")}
                                    </p>
                                </Row>
                                <Row className={styles.align__text_left}>
                                    <p
                                        className={`${styles.paragraph} ${styles.align__text_left}`}
                                    >
                                        {" "}
                                        {t("COLUMNS")}
                                    </p>
                                </Row>
                                <Row className={styles.align__text_left}>
                                    <p
                                        className={`${styles.paragraph} ${styles.align__text_left}`}
                                    >
                                        {t("1")}
                                    </p>
                                </Row>
                                <Row className={styles.align__text_left}>
                                    <p
                                        className={`${styles.paragraph} ${styles.align__text_left}`}
                                    >
                                        {t("2")}
                                    </p>
                                </Row>
                                <Row className={styles.align__text_left}>
                                    <p
                                        className={`${styles.paragraph} ${styles.align__text_left}`}
                                    >
                                        {t("3")}
                                    </p>
                                </Row>
                                <Row className={styles.align__text_left}>
                                    <p
                                        className={`${styles.paragraph} ${styles.align__text_left}`}
                                    >
                                        {t("INFORMATION_CONCERNING_OTHER_ACCIDENTS")}
                                    </p>
                                </Row>
                                <Row className={styles.align__text_left}>
                                    <p
                                        className={`${styles.paragraph} ${styles.align__text_left}`}
                                    >
                                        {t("BLANK_LINE")}
                                    </p>
                                </Row>
                                <Row className={styles.align__text_left}>
                                    <p
                                        className={`${styles.paragraph} ${styles.align__text_left}`}
                                    >
                                        {t("BLANK_LINE")}
                                    </p>
                                </Row>
                                <Row className={styles.align__text_left}>
                                    <p
                                        className={`${styles.paragraph} ${styles.align__text_left}`}
                                    >
                                        {t("BLANK_LINE")}
                                    </p>
                                </Row>
                                <Row className={styles.align__text_left}>
                                    <p
                                        className={`${styles.paragraph} ${styles.align__text_left}`}
                                    >
                                        {t("BLANK_LINE")}
                                    </p>
                                </Row>
                                <Row className={styles.align__text_left}>
                                    <p
                                        className={`${styles.paragraph} ${styles.align__text_left}`}
                                    >
                                        {t("ANY_OTHER_MARK")}
                                    </p>
                                </Row>
                                <Row className={styles.align__text_left}>
                                    <p
                                        className={`${styles.paragraph} ${styles.align__text_left}`}
                                    >
                                        {t("BLANK_LINE")}
                                    </p>
                                </Row>
                                <Row className={styles.align__text_left}>
                                    <p
                                        className={`${styles.paragraph} ${styles.align__text_left}`}
                                    >
                                        {t("BLANK_LINE")}
                                    </p>
                                </Row>
                                <Row className={styles.align__text_left}>
                                    <p
                                        className={`${styles.paragraph} ${styles.align__text_left}`}
                                    >
                                        {t("BLANK_LINE")}
                                    </p>
                                </Row>
                                <Row className={styles.align__text_left}>
                                    <p
                                        className={`${styles.paragraph} ${styles.align__text_left}`}
                                    >
                                        {t("BLANK_LINE")}
                                    </p>
                                </Row>
                                <Row className={styles.align__text_left}>
                                    <Col>
                                        <h4>{t("II_B")}</h4>
                                    </Col>
                                </Row>
                                <Row className={styles.align__text_left}>
                                    <p
                                        className={`${styles.paragraph} ${styles.align__text_left}`}
                                    >
                                        {t("DOT_REGULATED_TESTING")}
                                    </p>
                                </Row>
                                <Row className={styles.align__text_left}>
                                    <p
                                        className={`${styles.paragraph} ${styles.align__text_left}`}
                                    >
                                        {t("QUESTION_ALCOHOL_TEST")}
                                    </p>
                                </Row>
                                <Row className={styles.align__text_left}>
                                    <p
                                        className={`${styles.paragraph} ${styles.align__text_left}`}
                                    >
                                        {t("QUESTION_VERIFIED_DRUG_TEST")}
                                    </p>
                                </Row>
                                <Row className={styles.align__text_left}>
                                    <p
                                        className={`${styles.paragraph} ${styles.align__text_left}`}
                                    >
                                        {t("QUESTION_REFUSE_TESTED")}
                                    </p>
                                </Row>
                                <Row className={styles.align__text_left}>
                                    <p
                                        className={`${styles.paragraph} ${styles.align__text_left}`}
                                    >
                                        {t("QUESTION_OTHER_VIOLATIONS_DOT_AGENCY")}
                                    </p>
                                </Row>
                                <Row className={styles.align__text_left}>
                                    <p
                                        className={`${styles.paragraph} ${styles.align__text_left}`}
                                    >
                                        {t("QUESTION_PREVIOUS_OWNER_REPORT_VIOLATION")}
                                    </p>
                                </Row>
                                <Row className={styles.align__text_left}>
                                    <p
                                        className={`${styles.paragraph} ${styles.align__text_left}`}
                                    >
                                        {t("QUESTION_RETURN_TO_DUTY")}
                                    </p>
                                </Row>
                                <Row className={styles.align__text_left}>
                                    <p
                                        className={`${styles.paragraph} ${styles.align__text_left}`}
                                    >
                                        {t("NOTE_PREVIOUS_EMPLOYER_REPORT")}
                                    </p>
                                </Row>
                                <Row className={styles.align__text_left}>
                                    <Col>
                                        <h4>{t("II_C")}</h4>
                                    </Col>
                                </Row>
                                <Row className={styles.align__text_left}>
                                    <p
                                        className={`${styles.paragraph} ${styles.align__text_left}`}
                                    >
                                        {t("NAME_OF_PERSON_ABOVE")}
                                    </p>
                                </Row>
                                <Row className={styles.align__text_left}>
                                    <p
                                        className={`${styles.paragraph} ${styles.align__text_left}`}
                                    >
                                        {t("BLANK_LINE")}
                                    </p>
                                </Row>
                                <Row className={styles.align__text_left}>
                                    <p
                                        className={`${styles.paragraph} ${styles.align__text_left}`}
                                    >
                                        {t("BLANK_LINE_TITLE")}
                                    </p>
                                </Row>
                                <Row className={styles.align__text_left}>
                                    <p
                                        className={`${styles.paragraph} ${styles.align__text_left}`}
                                    >
                                        {t("BLANK_LINE_PHONE")}
                                    </p>
                                </Row>
                                <Row className={styles.align__text_left}>
                                    <p
                                        className={`${styles.paragraph} ${styles.align__text_left}`}
                                    >
                                        {t("BLANK_LINE_DATE")}
                                    </p>
                                </Row>
                            </Row>
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="1">
                        <Accordion.Header>{t("DISCLOSURE_AUTHORIZATION")}</Accordion.Header>
                        <Accordion.Body>
                            <Row className="mb-3">
                                <h1>
                                    {t(
                                        "{COMPANY_NAME}",
                                        { COMPANY_NAME: "talhatrucking" },
                                        { translateProps: true }
                                    )}
                                </h1>
                            </Row>
                            <Row>
                                <h3>{t("DISCLOSURE_AUTHORIZATION")}</h3>
                            </Row>
                            <Row className="my-3">
                                <h6>{t("DISCLOSURE")}</h6>
                            </Row>
                            <Row>
                                <p className={`${styles.paragraph} ${styles.align__text_left}`}>
                                    {t(
                                        "{COMPANY_NAME}_REQUEST_BACKGROUND_REPORTS",
                                        { COMPANY_NAME: "talhatrucking" },
                                        { translateProps: true }
                                    )}
                                </p>
                            </Row>
                            <Row>
                                <p className={`${styles.paragraph} ${styles.align__text_left}`}>
                                    {t("BACKGROUND_REPORTS_CONTAINS")}
                                </p>
                            </Row>
                            <Row>
                                <h6>{t("AUTHORIZATION")}</h6>
                            </Row>
                            <Row>
                                <p className={`${styles.paragraph} ${styles.align__text_left}`}>
                                    {t("AUTHORIZATION_NAUTILUS_TRUCKING")}
                                </p>
                            </Row>
                            <Row>
                                <p className={`${styles.paragraph} ${styles.align__text_left}`}>
                                    <span>
                                        {" "}
                                        {t("APPLICANT_NAME")}{" "}
                                        {t(
                                            "{APPLICANT_NAME}",
                                            { APPLICANT_NAME: "Talha Bhutta" },
                                            { translateProps: true }
                                        )}
                                    </span>
                                </p>
                            </Row>
                            <Row>
                                <Col>
                                    <h6>{t("SIGNATURE")}</h6>
                                    <SignaturePad
                                        name="SIGNATURE.value"
                                        required
                                        onEnd={() => {
                                            handleSignatureEnd(1);
                                        }}
                                        ref={(el) => (padRef.current[1] = el)}
                                        canvasProps={{
                                            style: { border: "1px solid black" },
                                            className: "sigCanvas",
                                        }}
                                    />
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <button
                                        className="theme-secondary-btn"
                                        type="button"
                                        onClick={clearSignaturePad}
                                    >
                                        {t("CLEAR")}
                                    </button>
                                </Col>
                            </Row>
                            <Row className={styles.align__text_left}>
                                <BaseInput
                                    className="col my-3"
                                    required
                                    type="date"
                                    name="DISCLOSURE_AND_AUTHORIZATION_DATE.value"
                                    placeholder="DATE"
                                    label="DATE"
                                    formik={form}
                                />
                            </Row>
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="2">
                        <Accordion.Header>
                            {t("IMPORTANT_DISCLOSURE_BACKGROUND_PSP")}
                        </Accordion.Header>
                        <Accordion.Body>
                            <Row>
                                <h1>
                                    {t(
                                        "{COMPANY_NAME}",
                                        { COMPANY_NAME: "talhatrucking" },
                                        { translateProps: true }
                                    )}
                                </h1>
                            </Row>
                            <Row>
                                <h3>{t("IMPORTANT_DISCLOSURE_BACKGROUND_PSP_OS")}</h3>
                            </Row>
                            {/* <Row>
								<h5>{t("WHEN_APPLICATION_SUBMITTED")}</h5>
							</Row> */}
                            <Row>
                                <p className={`${styles.paragraph} ${styles.align__text_left}`}>
                                    {t("WHEN_SUBMITTED_MAIL_PHONE_COMPUTER")}
                                </p>
                            </Row>
                            <Row>
                                <p className={`${styles.paragraph} ${styles.align__text_left}`}>
                                    {t("NEITHER_EMPLYER_NOR_PROSPECTIVE_SUPPLYING")}
                                </p>
                            </Row>
                            <Row>
                                <p className={`${styles.paragraph} ${styles.align__text_left}`}>
                                    {t("CRASH_OR_SUSPENSION_INVOLVED")}
                                </p>
                            </Row>
                            <Row>
                                <p className={`${styles.paragraph} ${styles.align__text_left}`}>
                                    {t("CANNOT_OBTAIN_BACKGRPUND")}
                                </p>
                            </Row>
                            <Row>
                                <h5
                                    className={`${styles.paragraph} ${styles.align__text_left}`}
                                >
                                    {t("AUTHORIZATION")}
                                </h5>
                            </Row>
                            <Row>
                                <p className={`${styles.paragraph} ${styles.align__text_left}`}>
                                    {t("AGREE_WITH_EMPLOYER")}
                                </p>
                            </Row>
                            <Row>
                                <p className={`${styles.paragraph} ${styles.align__text_left}`}>
                                    {t("AUTHORIZE_COMPANY_TO_ACCESS")}
                                </p>
                            </Row>
                            <Row>
                                <p className={`${styles.paragraph} ${styles.align__text_left}`}>
                                    {t("UNDERSTAND_FMCSA_SAFETY_DATA")}
                                </p>
                            </Row>
                            <Row>
                                <p className={`${styles.paragraph} ${styles.align__text_left}`}>
                                    {t("UNDERSTAND_PSP_VIOLATIONS")}
                                </p>
                            </Row>
                            <Row>
                                <p className={`${styles.paragraph} ${styles.align__text_left}`}>
                                    {t("DISCLOSURE_BACKGROUND")}
                                </p>
                            </Row>
                            <Row>
                                <p className={`${styles.paragraph} ${styles.align__text_left}`}>
                                    <span>
                                        {" "}
                                        {t("APPLICANT_NAME")}{" "}
                                        {t(
                                            "{APPLICANT_NAME}",
                                            { APPLICANT_NAME: "Talha Bhutta" },
                                            { translateProps: true }
                                        )}
                                    </span>
                                </p>
                            </Row>
                            <Row className={styles.align__text_left}>
                                <Col>
                                    <h6>{t("SIGNATURE")}</h6>
                                    <SignaturePad
                                        name="SIGNATURE.value"
                                        required
                                        onEnd={() => {
                                            handleSignatureEnd(2);
                                        }}
                                        ref={(el) => (padRef.current[2] = el)}
                                        canvasProps={{
                                            style: { border: "1px solid black" },
                                            className: "sigCanvas",
                                        }}
                                    />
                                </Col>
                            </Row>
                            <Row className={styles.align__text_left}>
                                <Col>
                                    <button
                                        className="theme-secondary-btn"
                                        type="button"
                                        onClick={clearSignaturePad}
                                    >
                                        {t("CLEAR")}
                                    </button>
                                </Col>
                            </Row>
                            <Row className={styles.align__text_left}>
                                <BaseInput
                                    className="col my-3"
                                    required
                                    type="date"
                                    name="IMPORTANT_DISCLOSURE_BACKGROUND_DATE.value"
                                    placeholder="DATE"
                                    label="Date"
                                    formik={form}
                                />
                            </Row>
                            <Row className="mt-4">
                                <p className={`${styles.paragraph} ${styles.align__text_left}`}>
                                    {t("NOTICE_DISCLOSURE")}
                                </p>
                            </Row>
                            <Row className="mt-4">
                                <p className={`${styles.paragraph} ${styles.align__text_left}`}>
                                    {t(
                                        "EMPLOYEE_DEF_NOTICE_{number}",
                                        { number: "49" },
                                        { translateProps: true }
                                    )}
                                </p>
                                <p className={`${styles.paragraph} ${styles.align__text_left}`}>
                                    {t(
                                        "{license}",
                                        { license: "C.F.R. 383.5." },
                                        { translateProps: true }
                                    )}
                                </p>
                                <p className={`${styles.paragraph} ${styles.align__text_left}`}>
                                    {t(
                                        "LAST_UPDATED_{date}",
                                        { date: "12/22/2015" },
                                        { translateProps: true }
                                    )}
                                </p>
                            </Row>
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="3">
                        <Accordion.Header>{t("GENERAL_CONSENT_QUERIES")}</Accordion.Header>
                        <Accordion.Body>
                            <Row>
                                <h1>
                                    {t(
                                        "{COMPANY_NAME}",
                                        { COMPANY_NAME: "talhatrucking" },
                                        { translateProps: true }
                                    )}
                                </h1>
                            </Row>
                            <Row>
                                <h3>{t("GENERAL_CONSENT_QUERIES")}</h3>
                            </Row>

                            <Row>
                                <p className={`${styles.paragraph} ${styles.align__text_left}`}>
                                    {t("INSTRUCTIONS_CFR")}
                                </p>
                            </Row>
                            <Row>
                                <BaseInput
                                    className="col my-3"
                                    name="GENERAL_CONSENT.value.name"
                                    placeholder="FULL_NAME"
                                    formik={form}
                                />
                            </Row>

                            <Row>
                                <BaseInput
                                    className="col my-3"
                                    name="GENERAL_CONSENT.value.employer_name"
                                    placeholder="EMPLOYER_NAME"
                                    formik={form}
                                />
                            </Row>
                            <Row>
                                <BaseInput
                                    className="col my-3"
                                    name="GENERAL_CONSENT.value.cdl_license_number"
                                    placeholder="CDL_LICENSE_PLACEHOLDER"
                                    formik={form}
                                />
                            </Row>
                            <Row>
                                <BaseInput
                                    className="col my-3"
                                    name="GENERAL_CONSENT.value.expiration_date"
                                    type="date"
                                    placeholder="expiration_date"
                                    formik={form}
                                />
                            </Row>
                            <Row className="mt-4">
                                <p className={`${styles.paragraph} ${styles.align__text_left}`}>
                                    {t("CONSENT_TO_CLEARINGHOUSE_1")}
                                </p>
                            </Row>
                            <Row className="mt-4">
                                <p className={`${styles.paragraph} ${styles.align__text_left}`}>
                                    {t("CONSENT_TO_CLEARINGHOUSE_2")}
                                </p>
                            </Row>
                            <Row className="mt-4">
                                <p className={`${styles.paragraph} ${styles.align__text_left}`}>
                                    {t("CONSENT_TO_CLEARINGHOUSE_3")}
                                </p>
                            </Row>
                            <Row className="mt-4">
                                <p className={`${styles.paragraph} ${styles.align__text_left}`}>
                                    {t("CONSENT_TO_CLEARINGHOUSE_4")}
                                </p>
                            </Row>
                            <Row className={styles.align__text_left}>
                                <Col>
                                    <h6>{t("SIGNATURE")}</h6>
                                    <SignaturePad
                                        name="SIGNATURE.value"
                                        required
                                        onEnd={() => {
                                            handleSignatureEnd(3);
                                        }}
                                        ref={(el) => (padRef.current[3] = el)}
                                        canvasProps={{
                                            style: { border: "1px solid black" },
                                            className: "sigCanvas",
                                        }}
                                    />
                                </Col>
                            </Row>
                            <Row className={styles.align__text_left}>
                                <Col>
                                    <button
                                        className="theme-secondary-btn"
                                        type="button"
                                        onClick={clearSignaturePad}
                                    >
                                        {t("CLEAR")}
                                    </button>
                                </Col>
                            </Row>
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
                <Row className="mt-2">
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
        </>
    );
}
