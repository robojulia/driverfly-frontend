import { useContext, useEffect, useRef } from "react";
import { Button, Col, Row, Form } from "react-bootstrap";
import BaseInput from "../../../base-input";
import Accordion from "react-bootstrap/Accordion";
import SignatureCanvas from "react-signature-canvas";
import { useTranslation } from "../../../../../hooks/use-translation";
import styles from "../../../../../styles/jotform.module.css";
import { AccordianProps } from "../../../../../types/jotform/accordian.type";

export function ImportantDisclosureBackgroundPsp({ eventKey, form }: AccordianProps) {
    const { t } = useTranslation();

    const canvasRef = useRef<SignatureCanvas>();
    const clearSignatureCanvas = () => canvasRef.current.clear();

    const handleSignatureEnd = () => {
        const signatureValue = canvasRef?.current?.toDataURL()?.toString();
        form.setFieldValue("SIGNATURE.value", signatureValue);
    };

    return (
        //eventKey="2"
        <Accordion.Item eventKey={eventKey}>
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
    )
}