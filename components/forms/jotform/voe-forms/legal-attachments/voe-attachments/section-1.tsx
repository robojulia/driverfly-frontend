import { useEffect } from "react";
import { Col, Row } from "react-bootstrap";
import { ApplicantExtras } from "../../../../../../enums/applicants/applicant-extras.enum";
import { useTranslation } from "../../../../../../hooks/use-translation";
import { ApplicantEmployerEntity, ApplicantEntity } from "../../../../../../models/applicant";
import styles from "../../../../../../styles/digitalhiringapp.module.css";

export interface Section1Props {
    applicant: ApplicantEntity,
    employer: ApplicantEmployerEntity
}
export function VerificationOfEmploymentSection1({ applicant, employer }: Section1Props) {

    const { t } = useTranslation();
    const social_security_number = applicant?.extras?.find(v => v?.type == ApplicantExtras?.EMPLOYEE_SS_OR_ID)
    const signature = applicant?.extras?.find(sign => sign?.type == ApplicantExtras.SIGNATURE_VOE_AUTHORIZATION)
    const date_VOE = applicant?.extras?.find(sign => sign?.type == ApplicantExtras.APPLY_DATE)
    useEffect(() => {
        console.log("applicant", applicant);
        
        console.log("employer from comp ", employer)
        console.log("applicant from comp ", applicant?.company?.users[0])
    }, [])

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
                    {t("VERIFICATION_OF_EMPLOYMENT_FMCSR_AUTHORIZED")}
                </p>
            </Row>
            <Row className={styles.align__text_left}>
                <p className={`${styles.paragraph} ${styles.align__text_left}`}>
                    {t("UNDERSTAND_CONSENT_REQUESTED")}
                </p>
            </Row>
            <Row className={styles.align__text_left}>
                <p className={`${styles.paragraph} ${styles.align__text_left}`}>
                    {t("{name}_AUTHORIZE_COMPANY", { name: `${applicant?.first_name} ${applicant?.last_name}` }, { translateProps: true })}
                </p>
            </Row>
            {/* <Row className={styles.align__text_left}>
                <p className={`${styles.paragraph} ${styles.align__text_left}`}>
                    {t("I_HEREBY_AUTHORIZE_RELEASE_OF_BUSINESS")}
                </p>
            </Row> */}
            {/* <Row className={styles.align__text_left}>
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
            </Row> */}
            <Row>
                <Col>
                    <div>
                        <h5 className={`${styles.paragraph} ${styles.align__text_left}`}>
                            {t("SIGNATURE:")}
                        </h5>
                    </div>
                    <div className="Row" style={{ marginTop: '10px', marginBottom: '30px' }}>
                        <img src={signature?.value} style={{ width: '300px', height: '200px' }} alt="image" />

                    </div>
                </Col>
                <Col>
                    <div>
                        <h5 className={`${styles.paragraph} ${styles.align__text_left}`}>
                            {t("DATE:")}
                        </h5>
                        <p className={`${styles.paragraph} ${styles.align__text_left}`}>
                            {date_VOE?.value}
                        </p>
                    </div>
                </Col>
            </Row>

            <Row className={styles.align__text_left}>
                <h4 className="mt-3">{t("I_A")}</h4>
                <p className={`${styles.paragraph} ${styles.align__text_left}`}>
                    {t("NEW_EMPLOYER_NAME_{company_name}", { company_name: applicant?.company?.name }, { translateProps: true })}
                </p>
                <p className={`${styles.paragraph} ${styles.align__text_left}`}>
                    {t("CURENNT_COMPANY_{phone}", { phone: applicant?.company?.users[0]?.contact_number }, { translateProps: true })}
                </p>
            </Row>
            <Row className={`${styles.align__text_left} ${styles.highlight}`}>
                <h6>{t("PLEASE_NOTE_THE_FOLLOWING_EMPLOYERS")} </h6>
            </Row>
            <Row className={styles.align__text_left}>
                <h4 className="mt-3">{t("I-B")}</h4>
                <b>
                    <h4 className={`${styles.paragraph} ${styles.align__text_left}`}>
                        {!!employer?.is_current ? t("CURENNT_COMPANY_DATA") : t("PAST_COMPANY_DATA")}
                    </h4>
                </b>
                <p className={`${styles.paragraph} ${styles.align__text_left}`}>
                    {t("CURENNT_COMPANY_{name}", { name: employer?.name }, { translateProps: true })}

                </p>
                <p className={`${styles.paragraph} ${styles.align__text_left}`}>
                    {t("CURENNT_COMPANY_{address}", { address: employer?.address }, { translateProps: true })}
                </p>
                <p className={`${styles.paragraph} ${styles.align__text_left}`}>
                    {t("CURENNT_COMPANY_{phone}", { phone: employer?.phone }, { translateProps: true })}
                </p>
                <p className={`${styles.paragraph} ${styles.align__text_left}`}>
                    {t("DESIGNATED_EMPLOYER_REPRESENTATIVE_{current_manager_name}", { current_manager_name: employer?.manager_name }, { translateProps: true })}
                </p>
            </Row>
            <Row className={`${styles.align__text_left} ${styles.highlight}`}>
                <h6>{t("PLEASE_NOTE_THE_FOLLOWING")} </h6>
            </Row>
            <Row>
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
                {/* <Row className={styles.align__text_left}>
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
                </Row> */}
                <Row className={styles.align__text_left}>
                    <Col>
                        <h4>{t("II-B")}</h4>
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
        </>
    )
}