import { useRef } from "react";
import { Col, Row } from "react-bootstrap";
import BaseInput from "../../../base-input";
import Accordion from "react-bootstrap/Accordion";
import SignatureCanvas from "react-signature-canvas";
import { useTranslation } from "../../../../../hooks/use-translation";
import styles from "../../../../../styles/jotform.module.css";
import { AccordianProps } from "../../../../../types/jotform/accordian.type";

export function GeneralConsentQueries({ eventKey, form }: AccordianProps) {
    const { t } = useTranslation();

    const canvasRef = useRef<SignatureCanvas>();
    const clearSignatureCanvas = () => canvasRef?.current?.clear();

    const handleSignatureEnd = () => {
        const signatureValue = canvasRef?.current?.toDataURL()?.toString();
        form.setFieldValue("SIGNATURE.value", signatureValue);
    };

    return (
        //  eventKey="3"
        <Accordion.Item eventKey={eventKey}>

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
            </Accordion.Body>
        </Accordion.Item>
    )
}