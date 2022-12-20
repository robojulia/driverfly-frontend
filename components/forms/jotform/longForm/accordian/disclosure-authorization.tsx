import { useContext, useEffect, useRef } from "react";
import { Col, Row } from "react-bootstrap";
import BaseInput from "../../../base-input";
import Accordion from "react-bootstrap/Accordion";
// import SignatureCanvas from "react-signature-canvas";
import { useTranslation } from "../../../../../hooks/use-translation";
import styles from "../../../../../styles/jotform.module.css";
import { AccordianProps } from "../../../../../types/jotform/accordian.type";
import JotformContext, { JotFormContextType } from "../../../../../context/jotform-context";
import SignatureCanvas from "react-signature-canvas";
import { ApplicantExtras } from "../../../../../enums/applicants/applicant-extras.enum";
import { ApplicantExtrasEntity } from "../../../../../models/applicant";

export function DisclosureAuthorization({ eventKey, form }: AccordianProps) {
    const {
        state: { applicant, applicantExtras },
        method: { setApplicant, updateApplicantExtras, stepNext, stepBack },
    }: JotFormContextType = useContext(JotformContext);
    const { t } = useTranslation();

    const canvasRef = useRef<SignatureCanvas>();
    const clearSignatureCanvas = () => canvasRef.current.clear();


    const handleSignatureEnd = () => {
        const signatureValue = canvasRef.current.toDataURL().toString();
        form.setFieldValue("SIGNATURE.value", signatureValue);
    };
    const current_employer = applicantExtras?.find(
        (v) => v.type == ApplicantExtras.CURRENT_EMPLOYER
    );

    useEffect(() => {
        const apx_disclosure_date = applicantExtras?.find(
            (v) => v.type === ApplicantExtras.DISCLOSURE_AND_AUTHORIZATION_DATE
        );

        const apx_sign = applicantExtras?.find(
            (v) => v.type === ApplicantExtras.SIGNATURE
        );

        if (apx_sign) canvasRef?.current?.fromDataURL(apx_sign?.value)

        form.setValues({
            ...form.values,
            SIGNATURE: !!apx_sign?.type
                ? apx_sign
                : new ApplicantExtrasEntity(ApplicantExtras.SIGNATURE),
            DISCLOSURE_AND_AUTHORIZATION_DATE: !!apx_disclosure_date?.type
                ? apx_disclosure_date
                : new ApplicantExtrasEntity(
                    ApplicantExtras.DISCLOSURE_AND_AUTHORIZATION_DATE
                ),

        });
    }, [applicant]);


    return (
        <>
            <Row className="mb-3">
                <h1>
                    {t(
                        "{COMPANY_NAME}",
                        { COMPANY_NAME: applicant?.company?.name },
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
                        { COMPANY_NAME: applicant?.company?.name },
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
                    {t(
                        "{COMPANY_NAME}_AUTHORIZATION_NAUTILUS_TRUCKINGS",
                        { COMPANY_NAME: applicant?.company?.name },
                        { translateProps: true }
                    )}
                </p>
            </Row>
            <Row>
                <p className={`${styles.paragraph} ${styles.align__text_left}`}>
                    <span>
                        {" "}
                        {t("APPLICANT_NAME")}{" "}
                        {t(
                            "{APPLICANT_NAME}",
                            { APPLICANT_NAME: `${applicant?.first_name} ${applicant?.last_name}` },
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
        </>
    )
}