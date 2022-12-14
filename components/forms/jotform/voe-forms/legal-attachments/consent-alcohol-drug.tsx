import styles from "../../../../../styles/jotform.module.css";
import { Col, Row } from 'react-bootstrap';
import { useTranslation } from "../../../../../hooks/use-translation";
import { ApplicantExtras } from "../../../../../enums/applicants/applicant-extras.enum";
import JotformContext, { JotFormContextType } from "../../../../../context/jotform-context";
import { useContext } from "react";

export default function ConsentAlcoholDrug() {
    const {
        state: { applicantExtras, applicant }
    }: JotFormContextType = useContext(JotformContext);
    const signature = applicant?.extras?.find(sign => sign?.type === ApplicantExtras.SIGNATURE)
    const generalConsent = applicant?.extras?.find(consent => consent?.type === ApplicantExtras.GENERAL_CONSENT)
    const { t } = useTranslation();
    const date = applicantExtras?.find(d => d?.type === ApplicantExtras?.IMPORTANT_DISCLOSURE_BACKGROUND_DATE)

    return (
        <form>
            <div className="Row">
                <div className="Col">
                    <h1 style={{ fontWeight: 'bold', textAlign: "center" }}>
                        {t(
                            "{COMPANY_NAME}",
                            { COMPANY_NAME: applicant?.company?.name },
                            { translateProps: true }
                        )}
                    </h1>
                </div>
            </div>
            <div className="Row">
                <div className="Col">
                    <h4 style={{ fontWeight: 'bold', textAlign: "center" }}>
                        {t("GENERAL_CONSENT_QUERIES")}
                    </h4>
                </div>
            </div>
            <div className="Row" style={{ textAlign: 'left', marginBottom: '20px' }}>
                <div className="Col">
                    <p style={{ color: 'black', fontWeight: 'bold', display: 'inline' }}>{t("NAME:")}</p>
                    <p style={{ color: 'black', display: 'inline' }}>{` ${applicant?.first_name} ${applicant?.last_name}`}</p>
                </div>
            </div>
            <div className="Row" style={{ textAlign: 'left', marginBottom: '20px' }}>
                <div className="Col">
                    <p style={{ color: 'black', fontWeight: 'bold', display: 'inline' }}>{t("EMPLOYERS_NAME:")}</p>
                    <p style={{ color: 'black', display: 'inline' }}>{` ${generalConsent?.value?.employer_name}`}</p>
                </div>
            </div>
            <div className="Row" style={{ textAlign: 'left', marginBottom: '20px' }}>
                <div className="Col">
                    <p style={{ color: 'black', fontWeight: 'bold', display: 'inline' }}>{t("CDL_LICENSE_NUMBER:")}</p>
                    <p style={{ color: 'black', display: 'inline' }}>{` ${generalConsent?.value?.cdl_license_number}`}</p>
                </div>
            </div>
            <div className="Row" style={{ textAlign: 'left', marginBottom: '20px' }}>
                <div className="Col">
                    <p style={{ color: 'black', fontWeight: 'bold', display: 'inline' }}>{t("EXPIRATION_DATE:")}</p>
                    <p style={{ color: 'black', display: 'inline' }}>{` ${generalConsent?.value?.expiration_date}`}</p>
                </div>
            </div>
            <div className="Row">
                <p style={{ color: 'black', display: 'inline' }}>
                    {t(
                        "{company_name}_{applicant_name}_IN_CONNECTION_WITH_YOUR_APPLICANT",
                        { applicant_name: `${applicant?.first_name} ${applicant?.last_name}`, company_name: `${applicant?.company?.name}` },
                        { translateProps: true }
                    )}
                </p>
            </div>
            <div className="Row">
                <p style={{ color: 'black', display: 'inline' }}>
                    {t(
                        "{company_name}_I_UNDERSTAND_THAT_IF_THE_LIMITED_QUERY",
                        { company_name: applicant?.company?.name },
                        { translateProps: true }
                    )}
                </p>
            </div>
            <div className="Row">
                <p style={{ color: 'black', display: 'inline' }}>
                    {t(
                        "{company_name}_I_FURTHER_UNDERSTAND_THAT_IF_I_REFUSED_TO_PROVIDE_FOR",
                        { company_name: applicant?.company?.name },
                        { translateProps: true }
                    )}
                </p>
            </div>
            <div className="Row" style={{ marginTop: '30px' }}>
                <p style={{ color: 'black', fontWeight: 'bold', display: 'inline' }}>{t("EMPLOYEE_SIGNATURE")}</p>
            </div>
            <div className="Row" style={{ marginTop: '10px', marginBottom: '30px' }}>
                <img src={signature?.value} style={{ width: '300px', height: '200px', border: '1px solid black' }} alt="image" />

            </div>
            <div className="Row" style={{ textAlign: 'left', marginBottom: '20px' }}>
                <div className="Col">
                    <p style={{ color: 'black', fontWeight: 'bold', display: 'inline' }}>{t("DATE_OF_CONSENT:")}</p>
                    <p style={{ color: 'black', display: 'inline' }}>{date?.value ? date?.value : ` ${t("NULL")}`}</p>

                </div>
            </div>
            <div className="Row">
                <p style={{ color: 'black', display: 'inline' }}>
                    {t("INSSTRUCTIONS_SECTION")}
                </p>
            </div>

        </form>
    )
}
