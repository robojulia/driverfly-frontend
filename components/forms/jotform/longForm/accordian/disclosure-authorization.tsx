import { useRef } from "react";
import { Col, Row } from "react-bootstrap";
import BaseInput from "../../../base-input";
import Accordion from "react-bootstrap/Accordion";
import SignatureCanvas from "react-signature-canvas";
import { useTranslation } from "../../../../../hooks/use-translation";
import styles from "../../../../../styles/jotform.module.css";
import { AccordianProps } from "../../../../../types/jotform/accordian.type";

export function DisclosureAuthorization({ eventKey, form }: AccordianProps) {
    const { t } = useTranslation();

    const canvasRef = useRef<SignatureCanvas>(null);
    const clearSignatureCanvas = () => canvasRef?.current?.clear();

    const handleSignatureEnd = () => {
        const signatureValue = canvasRef?.current?.toDataURL()?.toString();
        form.setFieldValue("SIGNATURE.value", signatureValue);
    };

    return (
        //eventKey="1"
        <Accordion.Item eventKey={eventKey}>
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
                <Row>
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
                        name="DISCLOSURE_AND_AUTHORIZATION_DATE.value"
                        placeholder="DATE"
                        label="DATE"
                        formik={form}
                    />
                </Row>
            </Accordion.Body>
        </Accordion.Item>
    )
}