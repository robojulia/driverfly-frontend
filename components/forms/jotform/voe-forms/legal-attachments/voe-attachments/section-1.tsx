import { useContext, useRef } from "react";
import { Col, Row } from "react-bootstrap";
import Accordion from "react-bootstrap/Accordion";
import SignatureCanvas from "react-signature-canvas";
import JotformContext, { JotFormContextType } from "../../../../../../context/jotform-context";
import { ApplicantExtras } from "../../../../../../enums/applicants/applicant-extras.enum";
import { useTranslation } from "../../../../../../hooks/use-translation";
import styles from "../../../../../../styles/jotform.module.css";
import BaseInput from "../../../../base-input";

export function VerificationOfEmploymentSection1() {

    const {
        state: { applicant, applicantExtras },
        method: { setApplicant, updateApplicantExtras, stepNext, stepBack },
    }: JotFormContextType = useContext(JotformContext);
    const { t } = useTranslation();
    const current_employer = applicantExtras?.find(
        (v) => v.type == ApplicantExtras.CURRENT_EMPLOYER
    );
    return (
        <>
            <Row>
                {t("VERIFICATION_OF_EMPLOYMENT")}
            </Row>
            <Row>
                <h2>{t("VERIFICATION_OF_EMPLOYMENT")}</h2>
                <h6>{t("SAFETY_PERFORMANCE_HISTORY_RECORDS_REQUEST")}</h6>
            </Row>

            <Row className={styles.align__text_left}>
                <h3>{t("SECTION_I")}</h3>
            </Row>
            <Row className={styles.align__text_left}>
                <p className={`${styles.paragraph} ${styles.align__text_left}`}>
                    {t("TO_BE_COMPLETED_BY_THE_NEW_EMPLOYER")}
                </p>
            </Row>
            <Row className={styles.align__text_left}>
                <h6>
                    {t("EMPLOYEE_NAME_NAUTILUS_{employee_name}", { employee_name: `${applicant?.first_name} ${applicant?.last_name}` }, { translateProps: true })}
                </h6>

            </Row>
            <Row className={styles.align__text_left}>
                <BaseInput
                    className="col my-3"
                    name="EMPLOYEE_SS_OR_ID.value"
                    label="EMPLOYEE_SS_OR_BUSINESS"
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
            {/* <Row className={styles.align__text_left}>
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
                </Row> */}
            <Row className={styles.align__text_left}>
                <h4 className="mt-3">{t("I_A")}</h4>
                <p className={`${styles.paragraph} ${styles.align__text_left}`}>
                    {t("NEW_EMPLOYER_NAME_{company_name}", { company_name: applicant?.company?.name }, { translateProps: true })}
                </p>

                <p className={`${styles.paragraph} ${styles.align__text_left}`}>
                    {t("WEBSITE_{company_web}", { company_web: applicant?.company?.website }, { translateProps: true })}
                </p>
                {/* <p className={`${styles.paragraph} ${styles.align__text_left}`}>
                    {t("WEBSITE_{company_web}", {company_web: applicant?.company?.website}, { translateProps: true })}
                        {t("DESIGNATED_EMPLOYER")}
                    </p> */}
            </Row>
            <Row className={`${styles.align__text_left} ${styles.highlight}`}>
                <h6>{t("PLEASE_NOTE_THE_FOLLOWING_EMPLOYERS")} </h6>
            </Row>
            <Row className={styles.align__text_left}>
                <h4 className="mt-3">{t("I-B")}</h4>
                <p className={`${styles.paragraph} ${styles.align__text_left}`}>
                    {t("CURENNT_COMPANY_{name}", { name: current_employer?.value?.current_company_name }, { translateProps: true })}

                </p>
                <p className={`${styles.paragraph} ${styles.align__text_left}`}>
                    {t("CURENNT_COMPANY_{address}", { address: current_employer?.value?.current_company_street_address_line_1 }, { translateProps: true })}
                </p>
                <p className={`${styles.paragraph} ${styles.align__text_left}`}>
                    {t("CURENNT_COMPANY_{phone}", { phone: current_employer?.value?.current_company_phone_number }, { translateProps: true })}
                </p>
                <p className={`${styles.paragraph} ${styles.align__text_left}`}>
                    {t("DESIGNATED_EMPLOYER_REPRESENTATIVE_{current_manager_name}", { current_manager_name: current_employer?.value?.current_company_manager_name }, { translateProps: true })}
                </p>
            </Row>
            <Row className={`${styles.align__text_left} ${styles.highlight}`}>
                <h6>{t("PLEASE_NOTE_THE_FOLLOWING")} </h6>
            </Row>
            
        </>
    )
}