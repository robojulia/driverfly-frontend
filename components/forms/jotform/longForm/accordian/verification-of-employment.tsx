import { useContext, useEffect, useRef, useState } from "react";
import { Col, Form, Row } from "react-bootstrap";
import BaseInput from "../../../base-input";
import SignatureCanvas from "react-signature-canvas";
import { useTranslation } from "../../../../../hooks/use-translation";
import styles from "../../../../../styles/digitalhiringapp.module.css";
import { AccordianProps } from "../../../../../types/jotform/accordian.type";
import JotformContext, {
    JotFormContextType,
} from "../../../../../context/jotform-context";
import { ApplicantExtras } from "../../../../../enums/applicants/applicant-extras.enum";
import { ApplicantExtrasEntity } from "../../../../../models/applicant";
import { CompanyPreferenceEnhancementLabel } from "../../../../../enums/company/company-preference-enhancement-label.enum";

function formatSSN(value: string) {
    if (!value) return value;
    const ssn = value.replace(/[^\d]/g, "");
    const ssnLength = ssn.length;
    if (ssnLength < 4) return ssn;
    if (ssnLength < 6) {
        return `${ssn.slice(0, 3)}-${ssn.slice(3)}`;
    }
    return `${ssn.slice(0, 3)}-${ssn.slice(3, 5)}-${ssn.slice(5, 9)}`;
}

export function VerificationOfEmployment({ form }: AccordianProps) {

    const {
        state: { applicant, applicantExtras, companyPreferences, company },
        // method: { setApplicant, updateApplicantExtras },
    }: JotFormContextType = useContext(JotformContext);

    const { t } = useTranslation();

    const canvasRef = useRef<SignatureCanvas>();
    const clearSignatureCanvas = () => canvasRef.current.clear();

    const handleSignatureEnd = () => {
        const signatureValue = canvasRef.current.toDataURL().toString();
        form.setFieldValue("SIGNATURE_VOE_AUTHORIZATION.value", signatureValue);
    };
    useEffect(() => {
        const apx_sign_voe_authorization = applicantExtras?.find(
            (v) => v.type == ApplicantExtras.SIGNATURE_VOE_AUTHORIZATION
        );

        if (apx_sign_voe_authorization)
            canvasRef?.current?.fromDataURL(apx_sign_voe_authorization?.value);

        form.setValues({
            ...form.values,
            SIGNATURE_VOE_AUTHORIZATION: !!apx_sign_voe_authorization?.type
                ? apx_sign_voe_authorization
                : new ApplicantExtrasEntity(
                    ApplicantExtras.SIGNATURE_VOE_AUTHORIZATION
                ),
            ssn: applicant.ssn,
        });
    }, [applicant]);

    const handleInput = (value: string) => {
        const formattedSSN = formatSSN(value);
        form.setFieldValue("ssn", formattedSSN);
        return formattedSSN;
    };
    const current_company = applicant?.employers?.find((v) => !!v?.is_current);
    // useEffect(() => {
    //     console.log("applicantttttt", applicant);
    // }, []);
    return (
        <>
            <Form onSubmit={form.handleSubmit} onReset={form.handleReset}>
                <h2 className={`${styles.paragraph} ${styles.align__text_left}`}>{t("VERIFICATION_OF_EMPLOYMENT")}</h2>
                <h6 className={`${styles.paragraph} ${styles.align__text_left}`}>{t("SAFETY_PERFORMANCE_HISTORY_RECORDS_REQUEST")}</h6>
                <Row className={styles.align__text_left}>
                    <h3 className={`${styles.paragraph} ${styles.align__text_left}`}>{t("SECTION_I")}</h3>
                </Row>
                <Row className={styles.align__text_left}>
                    <p className={`${styles.paragraph} ${styles.align__text_left}`}>
                        {t("TO_BE_COMPLETED_BY_THE_NEW_EMPLOYER")}
                    </p>
                </Row>
                <Row className={styles.align__text_left}>
                    <h6 className={`${styles.paragraph} ${styles.align__text_left}`}>
                        {t(
                            "EMPLOYEE_NAME_NAUTILUS_{employee_name}",
                            {
                                employee_name: `${applicant?.first_name} ${applicant?.last_name}`,
                            },
                            { translateProps: true }
                        )}
                    </h6>
                </Row>

                {Boolean(
                    companyPreferences?.find(
                        (v) => v.label == CompanyPreferenceEnhancementLabel.ADD_SSN_ON_DHA
                    )?.value
                ) && (
                        <Row className={styles.align__text_left}>
                            <BaseInput
                                className="col my-3"
                                name="ssn"
                                label="EMPLOYEE_SSN"
                                type="password"
                                onChange={({ target: { value } }) => handleInput(value)}
                                formik={form}
                                required
                            />
                        </Row>
                    )}

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
                        <h6 className={`${styles.txtcolor} ${styles.align__text_left}`}>{t("SIGNATURE")}</h6>
                        <SignatureCanvas
                            name="SIGNATURE_VOE_AUTHORIZATION.value"
                            onEnd={handleSignatureEnd}
                            ref={canvasRef}
                            canvasProps={{
                                style: { border: "1px solid black" },
                                className: "sigCanvas",
                            }}
                        />
                        {Boolean(form?.errors?.SIGNATURE_VOE_AUTHORIZATION) && (
                            <p className={`h6 text-danger  ${styles.align__text_left}`}>
                                <em>{t("ERROR_SIGNS_REQUIRED")}</em>
                            </p>
                        )}
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
                    <h4 className={`${styles.titlechildren} mt-3`} >{t("I_A")}</h4>
                    <p className={`${styles.paragraph} ${styles.align__text_left}`}>
                        {t(
                            "NEW_EMPLOYER_NAME_{company_name}",
                            { company_name: company?.name ?? applicant?.company?.name },
                            { translateProps: true }
                        )}
                    </p>
                </Row>
                <Row className={`${styles.align__text_left} ${styles.highlight}`}>
                    <h6>{t("PLEASE_NOTE_THE_FOLLOWING_EMPLOYERS")} </h6>
                </Row>
                <Row className={styles.align__text_left}>
                    <h4 className={`${styles.titlechildren} mt-3`}>{t("I-B")}</h4>
                    {!!current_company?.is_current && (
                        <>
                            <b>
                                <h5
                                    className={`${styles.paragraph} ${styles.align__text_left}`}
                                >
                                    {t("CURENNT_COMPANY_DATA")}
                                </h5>
                            </b>
                            {current_company?.name && (
                                <p className={`${styles.paragraph} ${styles.align__text_left}`}>
                                    {t(
                                        "CURENNT_COMPANY_{name}",
                                        { name: current_company?.name },
                                        { translateProps: true }
                                    )}
                                </p>
                            )}
                            {current_company?.address && (
                                <p className={`${styles.paragraph} ${styles.align__text_left}`}>
                                    {t(
                                        "CURENNT_COMPANY_{address}",
                                        { address: current_company?.address },
                                        { translateProps: true }
                                    )}
                                </p>
                            )}
                            {current_company?.phone && (
                                <p className={`${styles.paragraph} ${styles.align__text_left}`}>
                                    {t(
                                        "CURENNT_COMPANY_{phone}",
                                        { phone: current_company?.phone },
                                        { translateProps: true }
                                    )}
                                </p>
                            )}
                            {current_company?.manager_name && (
                                <p
                                    className={`${styles.paragraph} ${styles.align__text_left} bg-danger text-light w-75`}
                                >
                                    {t(
                                        "DESIGNATED_EMPLOYER_REPRESENTATIVE_{current_manager_name}",
                                        { current_manager_name: current_company?.manager_name },
                                        { translateProps: true }
                                    )}
                                </p>
                            )}

                            <p className={`${styles.paragraph} ${styles.align__text_left}`}>
                                {t("BLANK_LINE")}
                            </p>
                        </>
                    )}
                </Row>
                <Row className={styles.align__text_left}>
                    {applicant?.employers.filter(e => !!e.name)?.map(
                        (v) =>
                            !!!v.is_current && (
                                <>
                                    <b>
                                        <h5
                                            className={`${styles.paragraph} ${styles.align__text_left}`}
                                        >
                                            {t("PAST_COMPANY_DATA")}
                                        </h5>
                                    </b>
                                    <p
                                        className={`${styles.paragraph} ${styles.align__text_left}`}
                                    >
                                        {t(
                                            "CURENNT_COMPANY_{name}",
                                            { name: v?.name ? v.name : `${t("N/A")}` },
                                            { translateProps: true }
                                        )}
                                    </p>
                                    <p
                                        className={`${styles.paragraph} ${styles.align__text_left}`}
                                    >
                                        {t(
                                            "CURENNT_COMPANY_{address}",
                                            { address: v?.address ? v.address : `${t("N/A")}` },
                                            { translateProps: true }
                                        )}
                                    </p>
                                    <p
                                        className={`${styles.paragraph} ${styles.align__text_left}`}
                                    >
                                        {t(
                                            "CURENNT_COMPANY_{phone}",
                                            { phone: v?.phone ? v?.phone : `${t("N/A")}` },
                                            { translateProps: true }
                                        )}
                                    </p>
                                    <p
                                        className={`${styles.paragraph} ${styles.align__text_left} bg-danger text-light w-75`}
                                    >
                                        {t(
                                            "DESIGNATED_EMPLOYER_REPRESENTATIVE_{current_manager_name}",
                                            {
                                                current_manager_name: v?.manager_name
                                                    ? v?.manager_name
                                                    : `${t("N/A")}`,
                                            },
                                            { translateProps: true }
                                        )}
                                    </p>
                                    <p
                                        className={`${styles.paragraph} ${styles.align__text_left}`}
                                    >
                                        {t("BLANK_LINE")}
                                    </p>
                                </>
                            )
                    )}
                </Row>

                <Row className={`${styles.align__text_left} ${styles.highlight}`}>
                    <h6>{t("PLEASE_NOTE_THE_FOLLOWING")} </h6>
                </Row>
                <Row className={styles.blur}>
                    <Row className={styles.align__text_left}>
                        <Col>
                            <h3 className={`${styles.paragraph} ${styles.align__text_left}`}>{t("SECTION_II")}</h3>
                        </Col>
                    </Row>
                    <Row className={styles.align__text_left}>
                        <p className={`${styles.paragraph} ${styles.align__text_left}`}>
                            {t("TO_BE_COMPLETED")}
                        </p>
                    </Row>
                    <Row className={styles.align__text_left}>
                        <Col>
                            <h4 className={`${styles.paragraph} ${styles.align__text_left}`}>{t("II_A_ACCIDENT_HISTORY")}</h4>
                        </Col>
                    </Row>
                    <Row className={styles.align__text_left}>
                        <p className={`${styles.paragraph} ${styles.align__text_left}`}>
                            {t("THE_APPLICANT_NAMED_ABOVE")}
                        </p>
                    </Row>
                    <Row className={styles.align__text_left}>
                        <p className={`${styles.paragraph} ${styles.align__text_left}`}>
                            {t("EMPLOYES_AS___________________________")}
                        </p>
                    </Row>
                    <Row className={styles.align__text_left}>
                        <p className={`${styles.paragraph} ${styles.align__text_left}`}>
                            {t("DID_HE/SHE_DRIVE_MOTOR_VEHICLE")}
                        </p>
                    </Row>
                    <Row className={styles.align__text_left}>
                        <p className={`${styles.paragraph} ${styles.align__text_left}`}>
                            {t("REASON_FOR_LEAVING_YOUR_EMPLOY")}
                        </p>
                    </Row>
                    <Row className={styles.align__text_left}>
                        <p className={`${styles.paragraph} ${styles.align__text_left}`}>
                            {t("IF_THERE_IS_NO_SAFETY")}
                        </p>
                    </Row>
                    <Row className={styles.align__text_left}>
                        <p className={`${styles.paragraph} ${styles.align__text_left}`}>
                            {t("THE_APPLICANT_NAMED_ABOVE_WAS")}
                        </p>
                    </Row>
                    <Row className={styles.align__text_left}>
                        <p className={`${styles.paragraph} ${styles.align__text_left}`}>
                            {t("ACCIDENTAL_COMPLETE_THE_FOLLOWING")}
                        </p>
                    </Row>
                    <Row className={styles.align__text_left}>
                        <p className={`${styles.paragraph} ${styles.align__text_left}`}>
                            {t("COLUMNS")}
                        </p>
                    </Row>
                    <Row className={styles.align__text_left}>
                        <p className={`${styles.paragraph} ${styles.align__text_left}`}>
                            {t("1")}
                        </p>
                    </Row>
                    <Row className={styles.align__text_left}>
                        <p className={`${styles.paragraph} ${styles.align__text_left}`}>
                            {t("2")}
                        </p>
                    </Row>
                    <Row className={styles.align__text_left}>
                        <p className={`${styles.paragraph} ${styles.align__text_left}`}>
                            {t("3")}
                        </p>
                    </Row>
                    <Row className={styles.align__text_left}>
                        <p className={`${styles.paragraph} ${styles.align__text_left}`}>
                            {t("INFORMATION_CONCERNING_OTHER_ACCIDENTS")}
                        </p>
                    </Row>
                    <Row className={styles.align__text_left}>
                        <p className={`${styles.paragraph} ${styles.align__text_left}`}>
                            {t("BLANK_LINE")}
                        </p>
                    </Row>
                    <Row className={styles.align__text_left}>
                        <p className={`${styles.paragraph} ${styles.align__text_left}`}>
                            {t("BLANK_LINE")}
                        </p>
                    </Row>
                    <Row className={styles.align__text_left}>
                        <p className={`${styles.paragraph} ${styles.align__text_left}`}>
                            {t("BLANK_LINE")}
                        </p>
                    </Row>
                    <Row className={styles.align__text_left}>
                        <p className={`${styles.paragraph} ${styles.align__text_left}`}>
                            {t("BLANK_LINE")}
                        </p>
                    </Row>
                    <Row className={styles.align__text_left}>
                        <p className={`${styles.paragraph} ${styles.align__text_left}`}>
                            {t("ANY_OTHER_MARK")}
                        </p>
                    </Row>
                    <Row className={styles.align__text_left}>
                        <p className={`${styles.paragraph} ${styles.align__text_left}`}>
                            {t("BLANK_LINE")}
                        </p>
                    </Row>
                    <Row className={styles.align__text_left}>
                        <p className={`${styles.paragraph} ${styles.align__text_left}`}>
                            {t("BLANK_LINE")}
                        </p>
                    </Row>
                    <Row className={styles.align__text_left}>
                        <p className={`${styles.paragraph} ${styles.align__text_left}`}>
                            {t("BLANK_LINE")}
                        </p>
                    </Row>
                    <Row className={styles.align__text_left}>
                        <p className={`${styles.paragraph} ${styles.align__text_left}`}>
                            {t("BLANK_LINE")}
                        </p>
                    </Row>
                    <Row className={styles.align__text_left}>
                        <Col>
                            <h4 className={`${styles.paragraph} ${styles.align__text_left}`}>{t("II_B")}</h4>
                        </Col>
                    </Row>
                    <Row className={styles.align__text_left}>
                        <p className={`${styles.paragraph} ${styles.align__text_left}`}>
                            {t("DOT_REGULATED_TESTING")}
                        </p>
                    </Row>
                    <Row className={styles.align__text_left}>
                        <p className={`${styles.paragraph} ${styles.align__text_left}`}>
                            {t("QUESTION_ALCOHOL_TEST")}
                        </p>
                    </Row>
                    <Row className={styles.align__text_left}>
                        <p className={`${styles.paragraph} ${styles.align__text_left}`}>
                            {t("QUESTION_VERIFIED_DRUG_TEST")}
                        </p>
                    </Row>
                    <Row className={styles.align__text_left}>
                        <p className={`${styles.paragraph} ${styles.align__text_left}`}>
                            {t("QUESTION_REFUSE_TESTED")}
                        </p>
                    </Row>
                    <Row className={styles.align__text_left}>
                        <p className={`${styles.paragraph} ${styles.align__text_left}`}>
                            {t("QUESTION_OTHER_VIOLATIONS_DOT_AGENCY")}
                        </p>
                    </Row>
                    <Row className={styles.align__text_left}>
                        <p className={`${styles.paragraph} ${styles.align__text_left}`}>
                            {t("QUESTION_PREVIOUS_OWNER_REPORT_VIOLATION")}
                        </p>
                    </Row>
                    <Row className={styles.align__text_left}>
                        <p className={`${styles.paragraph} ${styles.align__text_left}`}>
                            {t("QUESTION_RETURN_TO_DUTY")}
                        </p>
                    </Row>
                    <Row className={styles.align__text_left}>
                        <p className={`${styles.paragraph} ${styles.align__text_left}`}>
                            {t("NOTE_PREVIOUS_EMPLOYER_REPORT")}
                        </p>
                    </Row>
                    <Row className={styles.align__text_left}>
                        <Col>
                            <h4 className={`${styles.paragraph} ${styles.align__text_left}`}>{t("II_C")}</h4>
                        </Col>
                    </Row>
                    <Row className={styles.align__text_left}>
                        <p className={`${styles.paragraph} ${styles.align__text_left}`}>
                            {t("NAME_OF_PERSON_ABOVE")}
                        </p>
                    </Row>
                    <Row className={styles.align__text_left}>
                        <p className={`${styles.paragraph} ${styles.align__text_left}`}>
                            {t("BLANK_LINE")}
                        </p>
                    </Row>
                    <Row className={styles.align__text_left}>
                        <p className={`${styles.paragraph} ${styles.align__text_left}`}>
                            {t("BLANK_LINE_TITLE")}
                        </p>
                    </Row>
                    <Row className={styles.align__text_left}>
                        <p className={`${styles.paragraph} ${styles.align__text_left}`}>
                            {t("BLANK_LINE_PHONE")}
                        </p>
                    </Row>
                    <Row className={styles.align__text_left}>
                        <p className={`${styles.paragraph} ${styles.align__text_left}`}>
                            {t("BLANK_LINE_DATE")}
                        </p>
                    </Row>
                </Row>
            </Form>
        </>
    );
}
