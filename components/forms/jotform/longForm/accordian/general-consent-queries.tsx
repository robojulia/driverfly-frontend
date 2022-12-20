import { useContext, useRef } from "react";
import { Col, Row } from "react-bootstrap";
import BaseInput from "../../../base-input";
import Accordion from "react-bootstrap/Accordion";
import SignatureCanvas from "react-signature-canvas";
import { useTranslation } from "../../../../../hooks/use-translation";
import styles from "../../../../../styles/jotform.module.css";
import { AccordianProps } from "../../../../../types/jotform/accordian.type";
import JotformContext, { JotFormContextType } from "../../../../../context/jotform-context";
import { ApplicantExtras } from "../../../../../enums/applicants/applicant-extras.enum";

export function GeneralConsentQueries({ eventKey, form }: AccordianProps) {
    const {
        state: { applicant, applicantExtras },
        method: { setApplicant, updateApplicantExtras, stepNext, stepBack },
    }: JotFormContextType = useContext(JotformContext);
    const { t } = useTranslation();

    // const canvasRef = useRef<SignatureCanvas>();
    // const clearSignatureCanvas = () => canvasRef?.current?.clear();

    // const handleSignatureEnd = () => {
    //     const signatureValue = canvasRef?.current?.toDataURL()?.toString();
    //     form.setFieldValue("SIGNATURE.value", signatureValue);
    // };
    const apply_date = applicant?.extras?.find(v => v.type === ApplicantExtras.APPLY_DATE)
    return (
        //  eventKey="3"
        <Accordion.Item eventKey={eventKey}>

            <Accordion.Header>{t("GENERAL_CONSENT_QUERIES")}</Accordion.Header>
            <Accordion.Body>
                <Row >
                    <h1>
                        {t(
                            "{COMPANY_NAME}",
                            { COMPANY_NAME: applicant?.company?.name },
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
                <Row className={styles.align__text_left}>
                    <h6>
                        {t(
                            "APPLICANT_FULL_NAME_{NAME}",
                            { NAME: `${applicant?.first_name} ${applicant?.last_name}` },
                            { translateProps: true }
                        )}
                    </h6>
                </Row>

                <Row className={styles.align__text_left}>
                    <h6>
                        {t(
                            "APPLICANT_{cdl_number}",
                            { cdl_number: applicant?.license_number },
                            { translateProps: true }
                        )}
                    </h6>
                </Row>
                <Row className={styles.align__text_left}>
                    <h6>
                        {t(
                            "APPLICANT_{COMPANY_NAME}",
                            { COMPANY_NAME: applicant?.company?.name },
                            { translateProps: true }
                        )}
                    </h6>
                </Row>
                <Row className={styles.align__text_left}>
                    <h6>
                        {t(
                            "APPLICANT_{APPLY_DATE}",
                            { APPLY_DATE: `${apply_date}` },
                            { translateProps: true }
                        )}
                    </h6>
                </Row>
                <Row className="mt-4">
                    <p className={`${styles.paragraph} ${styles.align__text_left}`}>
                        {t(
                            "{APPLICANT_NAME}_CONSENT_TO_CLEARINGHOUSE_1_{COMPANY_NAME}",
                            { COMPANY_NAME: applicant?.company?.name, APPLICANT_NAME: `${applicant?.first_name} ${applicant?.last_name}` },
                            { translateProps: true }
                        )}
                    </p>
                </Row>
                <Row className="mt-4">
                    <p className={`${styles.paragraph} ${styles.align__text_left}`}>
                        {t(
                            "CONSENT_TO_CLEARINGHOUSE_2_{COMPANY_NAME}",
                            { COMPANY_NAME: applicant?.company?.name },
                            { translateProps: true }
                        )}
                    </p>
                </Row>
                <Row className="mt-4">
                    <p className={`${styles.paragraph} ${styles.align__text_left}`}>
                        {t(
                            "CONSENT_TO_CLEARINGHOUSE_3_{COMPANY_NAME}",
                            { COMPANY_NAME: applicant?.company?.name },
                            { translateProps: true }
                        )}
                    </p>
                </Row>
                <Row className="mt-4">
                    <p className={`${styles.paragraph} ${styles.align__text_left}`}>
                        {t(
                            "CONSENT_TO_CLEARINGHOUSE_4_{COMPANY_NAME}",
                            { COMPANY_NAME: applicant?.company?.name },
                            { translateProps: true }
                        )}
                    </p>
                </Row>
                {/* <Row className={styles.align__text_left}>
                    <Col>
                        <h6>{t("SIGNATURE")}</h6>
                        <SignatureCanvas
                            name="SIGNATURE.value"
                            required
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
                </Row> */}
            </Accordion.Body>
        </Accordion.Item>
    )
}