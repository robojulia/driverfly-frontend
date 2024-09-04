import { ApplicantExtras } from "../../../../../enums/applicants/applicant-extras.enum";
import { useTranslation } from "../../../../../hooks/use-translation";
import { ApplicantEntity } from "../../../../../models/applicant";
import { ShowUsFormattedDateTime } from "../../../../../utils/show-us-formatted-date-time";

export interface AuthBackgroundProps {
    applicant?: ApplicantEntity;
}
export default function AuthBackgroundInvestigation({ applicant }: AuthBackgroundProps) {

    const signature = applicant?.extras?.find(sign => sign?.type == ApplicantExtras.SIGNATURE_DISCLOSURE_AUTHORIZATION)
    const { t } = useTranslation();
    const date = applicant?.extras?.find(d => d?.type == ApplicantExtras?.DISCLOSURE_AND_AUTHORIZATION_DATE)

    return (
        <form>
            <div className='Row'>
                <div>
                    <h1 style={{ fontWeight: 'bold', textAlign: "center" }}>
                        {t(
                            "{COMPANY_NAME}",
                            { COMPANY_NAME: applicant?.company?.name },
                            { translateProps: true }
                        )}
                    </h1>
                </div>
            </div>
            <div className='Row'>
                <div>
                    <h4 style={{ fontWeight: 'bold', textAlign: "center" }}>
                        {t("DISCLOSURE_AUTHORIZATION")}
                    </h4>
                </div>
            </div>
            <div className='Row'>
                <h4 style={{ fontWeight: 'bold', textAlign: "center" }}>
                    {t("DISCLOSURE")}
                </h4>
            </div>
            <div className='Row' style={{ textAlign: 'left', marginBottom: '20px' }}>
                <p style={{ color: 'black', display: 'inline' }}>
                    {t(
                        "{COMPANY_NAME}_REQUEST_BACKGROUND_REPORTS",
                        { COMPANY_NAME: applicant?.company?.name },
                        { translateProps: true }
                    )}
                </p>
            </div>
            <div className='Row' style={{ textAlign: 'left', marginBottom: '20px' }}>
                <p style={{ color: 'black', display: 'inline' }}>
                    {t("BACKGROUND_REPORTS_CONTAINS")}
                </p>
            </div>
            <div className='Row' style={{ textAlign: 'center', marginBottom: '20px' }}>
                <h4 style={{ color: 'black', fontWeight: 'bold' }}>
                    {t("AUTHORIZATION")}
                </h4>
            </div>
            <div className='Row' style={{ textAlign: 'left', marginBottom: '20px' }}>
                <p style={{ color: 'black', display: 'inline' }}>
                    {t(
                        "{COMPANY_NAME}_AUTHORIZATION_NAUTILUS_TRUCKINGS",
                        { COMPANY_NAME: applicant?.company?.name },
                        { translateProps: true }
                    )}
                </p>
            </div>
            <div className='Row' style={{ textAlign: 'left', marginBottom: '20px' }}>
                <div className='Col'>
                    <p style={{ color: 'black', fontWeight: 'bold', display: 'inline' }}>{t("NAME:")}</p>
                    <p style={{ color: 'black', display: 'inline' }}>{` ${applicant?.first_name} ${applicant?.last_name}`}</p>
                </div>
            </div>
            <div className='Row' style={{ textAlign: 'left', marginBottom: '20px' }}>
                <div className='Col'>
                    <p style={{ color: 'black', fontWeight: 'bold', display: 'inline' }}>{t("SIGNATURE")}</p>
                </div>
                <div className="Row" style={{ marginTop: '10px', marginBottom: '30px' }}>
                    <img src={signature?.value} style={{ width: '300px', height: '200px', border: '1px solid black' }} alt="image" />

                </div>
            </div>
            <div className='Row' style={{ textAlign: 'left', marginBottom: '20px' }}>
                <div className='Col'>
                    <p style={{ color: 'black', fontWeight: 'bold', display: 'inline' }}>{"DATE:"}</p>
                    <p style={{ color: 'black', display: 'inline' }}>{date?.value ? ShowUsFormattedDateTime(date?.value, true) : ` ${t("NULL")}`}</p>
                </div>
            </div>

        </form>
    )
}
