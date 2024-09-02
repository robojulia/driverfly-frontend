import { ApplicantExtras } from "../../../../../enums/applicants/applicant-extras.enum";
import { useTranslation } from "../../../../../hooks/use-translation";
import { ApplicantEntity } from "../../../../../models/applicant";


export interface ConsentAlcoholDrugProps {
    applicant?: ApplicantEntity;
}
export default function ConsentAlcoholDrug({ applicant }: ConsentAlcoholDrugProps) {

    const { t } = useTranslation();

    const signature = applicant?.extras?.find(sign => sign?.type == ApplicantExtras.SIGNATURE_GENERAL_CONSENT)
    const generalConsent = applicant?.extras?.find(consent => consent?.type == ApplicantExtras.GENERAL_CONSENT)
    const date = applicant?.extras?.find(
        (v) => v.type == ApplicantExtras.IMPORTANT_DISCLOSURE_BACKGROUND_DATE
    );


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
                    <p style={{ color: 'black', display: 'inline' }}>{` ${applicant?.company?.name}`}</p>
                </div>
            </div>
            <div className="Row" style={{ textAlign: 'left', marginBottom: '20px' }}>
                <div className="Col">
                    <p style={{ color: 'black', fontWeight: 'bold', display: 'inline' }}>{t("CDL_LICENSE_NUMBER:")}</p>
                    <p style={{ color: 'black', display: 'inline' }}>{` ${applicant?.license_number}`}</p>
                </div>
            </div>
            <div className="Row" style={{ textAlign: 'left', marginBottom: '20px' }}>
                <div className="Col">
                    <p style={{ color: 'black', fontWeight: 'bold', display: 'inline' }}>{t("EXPIRATION_DATE:")}</p>
                    <p style={{ color: 'black', display: 'inline' }}>{` ${applicant?.license_expiry}`}</p>
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
