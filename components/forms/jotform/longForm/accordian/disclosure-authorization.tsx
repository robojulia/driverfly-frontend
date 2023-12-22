import { useContext, useEffect, useRef } from "react";
import { Col, Row } from "react-bootstrap";
import SignatureCanvas from "react-signature-canvas";
import BaseInput from "../../../base-input";
import { useTranslation } from "../../../../../hooks/use-translation";
import styles from "../../../../../styles/digitalhiringapp.module.css";
import { AccordianProps } from "../../../../../types/jotform/accordian.type";
import JotformContext, { JotFormContextType } from "../../../../../context/jotform-context";
import { ApplicantExtras } from "../../../../../enums/applicants/applicant-extras.enum";
import { ApplicantExtrasEntity } from "../../../../../models/applicant";

export function DisclosureAuthorization({ form }: AccordianProps) {
    const {
        state: { applicant, applicantExtras, company }
    }: JotFormContextType = useContext(JotformContext);
    const { t } = useTranslation();

    const canvasRef = useRef<SignatureCanvas>();
    const clearSignatureCanvas = () => canvasRef.current.clear();


    const handleSignatureEnd = () => {
        const signatureValue = canvasRef.current.toDataURL().toString();
        form.setFieldValue("SIGNATURE_DISCLOSURE_AUTHORIZATION.value", signatureValue);
    };

    useEffect(() => {
        const apx_disclosure_date = applicantExtras?.find(
            (v) => v.type === ApplicantExtras.DISCLOSURE_AND_AUTHORIZATION_DATE
        );

        const apx_sign_disclosure = applicantExtras?.find(
            (v) => v.type === ApplicantExtras.SIGNATURE_DISCLOSURE_AUTHORIZATION
        );

        if (apx_sign_disclosure) canvasRef?.current?.fromDataURL(apx_sign_disclosure?.value)

        form.setValues({
            ...form.values,
            SIGNATURE_DISCLOSURE_AUTHORIZATION: !!apx_sign_disclosure?.type
                ? apx_sign_disclosure
                : new ApplicantExtrasEntity(ApplicantExtras.SIGNATURE_DISCLOSURE_AUTHORIZATION),
            DISCLOSURE_AND_AUTHORIZATION_DATE: !!apx_disclosure_date?.type
                ? apx_disclosure_date
                : {
                    ...new ApplicantExtrasEntity(
                        ApplicantExtras.DISCLOSURE_AND_AUTHORIZATION_DATE
                    ),
                    value: new Date().toISOString()
                }

        });
    }, [applicant]);


    return (
        <>
            <Row className="mb-3">
                <h1 className={`${styles.paragraph} ${styles.align__text_left}`}>
                    {t(
                        "{COMPANY_NAME}",
                        { COMPANY_NAME: company?.name ?? applicant?.company?.name },
                        { translateProps: true }
                    )}
                </h1>
            </Row>
            <Row>
                <h3 className={`${styles.paragraph} ${styles.align__text_left}`}>{t("DISCLOSURE_AUTHORIZATION")}</h3>
            </Row>
            <Row className="my-3">
                <h6 className={`${styles.paragraph} ${styles.align__text_left}`}>{t("DISCLOSURE")}</h6>
            </Row>
            <Row>
                <p className={`${styles.paragraph} ${styles.align__text_left}`}>
                    {t(
                        "{COMPANY_NAME}_REQUEST_BACKGROUND_REPORTS",
                        { COMPANY_NAME: company?.name ?? applicant?.company?.name },
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
                <h6 className={`${styles.paragraph} ${styles.align__text_left}`}>{t("AUTHORIZATION")}</h6>
            </Row>
            <Row>
                <p className={`${styles.paragraph} ${styles.align__text_left}`}>
                    {t(
                        "{COMPANY_NAME}_AUTHORIZATION_NAUTILUS_TRUCKINGS",
                        { COMPANY_NAME: company?.name ?? applicant?.company?.name },
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
                    <h6 className={`${styles.txtcolor}`}>{t("SIGNATURE")}</h6>
                    <SignatureCanvas
                        name="SIGNATURE_DISCLOSURE_AUTHORIZATION.value"
                        required
                        onEnd={handleSignatureEnd}
                        ref={canvasRef}
                        canvasProps={{
                            style: { border: "1px solid black" },
                            className: "sigCanvas",
                        }}
                    />
                    {Boolean(form?.errors?.SIGNATURE_DISCLOSURE_AUTHORIZATION) && <p className={`h6 text-danger  ${styles.align__text_left}`}><em>{t('ERROR_SIGNS_REQUIRED')}</em></p>}

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
                    max={new Date().toISOString().split("T")[0]}

                />
            </Row>
        </>
    )
}