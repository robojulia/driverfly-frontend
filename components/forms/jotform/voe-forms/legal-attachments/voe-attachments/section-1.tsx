import { useContext } from "react";
import { Row } from "react-bootstrap";
import JotformContext, { JotFormContextType } from "../../../../../../context/jotform-context";
import { ApplicantExtras } from "../../../../../../enums/applicants/applicant-extras.enum";
import { useTranslation } from "../../../../../../hooks/use-translation";
import styles from "../../../../../../styles/jotform.module.css";
export function VerificationOfEmploymentSection1() {

    const {
        state: { applicant, applicantExtras },
        method: { setApplicant, updateApplicantExtras, stepNext, stepBack },
    }: JotFormContextType = useContext(JotformContext);
    const { t } = useTranslation();
    const current_employer = applicant?.extras?.find(
        (v) => v.type == ApplicantExtras.CURRENT_EMPLOYER
    );
    const social_security_number = applicantExtras?.find(d => d?.type === ApplicantExtras?.EMPLOYEE_SS_OR_ID)

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
                <div className='Col'>
                    <h6>
                        {t("EMPLOYEE_NAME_NAUTILUS_{employee_name}", { employee_name: `${applicant?.first_name} ${applicant?.last_name}` }, { translateProps: true })}
                    </h6>
                </div>
            </Row>

            <div className='Row' style={{ textAlign: 'left', marginBottom: '20px' }}>
                <div className='Col'>
                    <p style={{ color: 'black', fontWeight: '100', display: 'inline' }}>{t("EMPLOYEE_SS_OR_ID:")}</p>
                    <p style={{ color: 'black', display: 'inline' }}>{social_security_number?.value ? social_security_number?.value : ` ${t("NULL")}`}</p>
                </div>
            </div>
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
                <h4 className="mt-3">{t("I_A")}</h4>
                <p className={`${styles.paragraph} ${styles.align__text_left}`}>
                    {t("NEW_EMPLOYER_NAME_{company_name}", { company_name: applicant?.company?.name }, { translateProps: true })}
                </p>

                <p className={`${styles.paragraph} ${styles.align__text_left}`}>
                    {t("WEBSITE_{company_web}", { company_web: applicant?.company?.website }, { translateProps: true })}
                </p>
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