import { useRef } from "react";
import { Col, Row } from "react-bootstrap";
import BaseInput from "../../../base-input";
import Accordion from "react-bootstrap/Accordion";
import SignatureCanvas from "react-signature-canvas";
import { useTranslation } from "../../../../../hooks/use-translation";
import styles from "../../../../../styles/jotform.module.css";
import { AccordianProps } from "../../../../../types/jotform/accordian.type";

export function VerificationOfEmployment({ eventKey, form }: AccordianProps) {
    const { t } = useTranslation();

    const canvasRef = useRef<SignatureCanvas>();
    const clearSignatureCanvas = () => canvasRef.current.clear();

    const handleSignatureEnd = () => {
        const signatureValue = canvasRef.current.toDataURL().toString();
        // console.log("signatureValue", signatureValue);
        form.setFieldValue("SIGNATURE.value", signatureValue);
    };

    return (
        <Accordion.Item eventKey={eventKey}>
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

                        {t("ALCOHOL_TESTS_WITH_A_RESULT")}
                    </p>
                </Row>
                <Row className={styles.align__text_left}>
                    <p className={`${styles.paragraph} ${styles.align__text_left}`}>
                        {t("VERIFY_POSITIVE_DRUG_TESTS")}
                    </p>
                </Row>
                <Row className={styles.align__text_left}>
                    <p className={`${styles.paragraph} ${styles.align__text_left}`}>
                        {t("REFUSALS_TO_BE_TESTED")}
                    </p>
                </Row>
                <Row className={styles.align__text_left}>
                    <p className={`${styles.paragraph} ${styles.align__text_left}`}>
                        {t("OTHER_VIOLATIONS_OF_DOT")}
                    </p>
                </Row>
                <Row className={styles.align__text_left}>
                    <p className={`${styles.paragraph} ${styles.align__text_left}`}>
                        {t("INFORMATION_OBTAINED_FROM_PREVIOUS")}
                    </p>
                </Row>
                <Row className={styles.align__text_left}>
                    <p className={`${styles.paragraph} ${styles.align__text_left}`}>
                        {t("DOCUMENTATION_IF_ANY_OF_COMPLETION")}
                    </p>
                </Row>
                <Row className={styles.align__text_left}>
                    <Col>
                        <h6>{t("SIGNATURE")}</h6>
                        <SignatureCanvas
                            onEnd={handleSignatureEnd}
                            ref={canvasRef}
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
                            onClick={clearSignatureCanvas}
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
                        Fax #:
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
                        {t("DESIGNATED_EMPLOYER_REPRESENTATIVE")}
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
    )
}