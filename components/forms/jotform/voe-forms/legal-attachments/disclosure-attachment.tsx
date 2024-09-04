import { useEffect } from 'react';
import { ApplicantExtras } from '../../../../../enums/applicants/applicant-extras.enum';
import { useTranslation } from '../../../../../hooks/use-translation';
import { ApplicantEntity } from '../../../../../models/applicant';
import { ShowUsFormattedDateTime } from '../../../../../utils/show-us-formatted-date-time';

export interface DisclosureAttachmentProps {
    applicant?: ApplicantEntity;
}

export default function DisclosureAttachment({ applicant }: DisclosureAttachmentProps) {
    useEffect(() => {
        console.log("everything working herer");

    }, [])
    const signature = applicant?.extras?.find(sign => sign?.type == ApplicantExtras.SIGNATURE_IMPORTANT_BACKGROUND)

    const { t } = useTranslation();
    const date = applicant?.extras?.find(d => d?.type == ApplicantExtras?.IMPORTANT_DISCLOSURE_BACKGROUND_DATE)

    return (
        <form>
            <div className="Row">
                <div className='Col'>
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
                <div className='Col'>
                    <h4 style={{ fontWeight: 'bold', textAlign: "center" }}>
                        {t("IMPORTANT_DISCLOSURE_BACKGROUND_PSP_OS")}
                    </h4>
                </div>
            </div>
            <div className="Row">
                <div className='Col'>
                    <h4 style={{ fontWeight: 'bold', textAlign: "center" }}>
                        {t("THE_BELOW_DISCLOSURE_AND_AUTHORIZATION_LANGUAGE")}
                    </h4>
                </div>
            </div>
            <div className='Row' style={{ textAlign: 'center', marginTop: '35px', marginBottom: '35px' }}>
                <p style={{ color: 'black', textAlign: 'left' }}>
                    {t(
                        "{company_name}_IN_CONNECTION_WITH_YOUR_APPLICANT",
                        { company_name: applicant?.company?.name },
                        { translateProps: true }
                    )}
                </p>
            </div>
            <div className='Row' style={{ textAlign: 'center', marginBottom: '35px' }}>
                <p style={{ color: 'black', textAlign: 'left' }}>
                    {t("WHEN_APPLICATION_SUBMITTED")}
                </p>
            </div>
            <div className='Row' style={{ textAlign: 'center', marginBottom: '35px' }}>
                <p style={{ color: 'black', textAlign: 'left' }}>
                    {t("WHEN_SUBMITTED_MAIL_PHONE_COMPUTER")}
                </p>
            </div>
            <div className='Row' style={{ textAlign: 'center', marginBottom: '35px' }}>
                <p style={{ color: 'black', textAlign: 'left' }}>
                    {t("NEITHER_EMPLYER_NOR_PROSPECTIVE_SUPPLYING")}
                </p>
            </div>
            <div className='Row' style={{ textAlign: 'center', marginBottom: '35px' }}>
                <p style={{ color: 'black', textAlign: 'left' }}>
                    {t("CRASH_OR_SUSPENSION_INVOLVED")}
                </p>
            </div>
            <div className='Row' style={{ textAlign: 'center', marginBottom: '35px' }}>
                <p style={{ color: 'black', textAlign: 'left' }}>
                    {t("CANNOT_OBTAIN_BACKGRPUND")}
                </p>
            </div>
            <div className="Row">
                <div className='Col'>
                    <h4 style={{ fontWeight: 'bold', textAlign: "center" }}>{t("AUTHORIZATION")}</h4>
                </div>
            </div>
            <div className='Row' style={{ textAlign: 'center', marginBottom: '35px' }}>
                <p style={{ color: 'black', textAlign: 'left' }}>
                    {t("AGREE_WITH_EMPLOYER")}
                </p>
            </div>
            <div className='Row' style={{ textAlign: 'center', marginBottom: '35px' }}>
                <p style={{ color: 'black', textAlign: 'left' }}>
                    {t(
                        "{company_name}_I_AUTHORIZES_PROSPECTIVE_EMPLOYER_TO_ACCESS",
                        { company_name: applicant?.company?.name },
                        { translateProps: true }
                    )}
                </p>
            </div>
            <div className='Row' style={{ textAlign: 'center', marginBottom: '35px' }}>
                <p style={{ color: 'black', textAlign: 'left' }}>
                    {t("I_FURTHER_UNDERSTAND_THAT_NEITHER_THE_PROSOECTIVE")}
                </p>
            </div>
            <div className='Row' style={{ textAlign: 'center', marginBottom: '35px' }}>
                <p style={{ color: 'black', textAlign: 'left' }}>
                    {t("I_UNDERSTAND_THAT_ANY_CRASH_OR_INSPECTION_PSP_REPORT")}
                </p>
            </div>

            <div className='Row' style={{ textAlign: 'center', marginBottom: '35px' }}>
                <p style={{ color: 'black', textAlign: 'left' }}>
                    {t("DISCLOSURE_BACKGROUND")}
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
                    <p style={{ color: 'black', fontWeight: 'bold', display: 'inline' }}>{t("SIGNATURE:")}</p>
                </div>
                <div className="Row" style={{ marginTop: '10px', marginBottom: '30px' }}>
                    <img src={signature?.value} style={{ width: '300px', height: '200px', border: '1px solid black' }} alt="image" />

                </div>
            </div>
            <div className='Row' style={{ textAlign: 'left', marginBottom: '20px' }}>
                <div className='Col'>
                    <p style={{ color: 'black', fontWeight: 'bold', display: 'inline' }}>{t("DATE:")}</p>
                    <p style={{ color: 'black', display: 'inline' }}>{date?.value ? ShowUsFormattedDateTime(date?.value, true) : ` ${t("NULL")}`}</p>
                </div>
            </div>


            <div className='Row' style={{ textAlign: 'center', marginBottom: '35px' }}>
                <p style={{ color: 'black', textAlign: 'left' }}>
                    {t("NOTICE_DISCLOSURE")}
                </p>
            </div>

            <div className='Row' style={{ textAlign: 'center' }}>
                <p style={{ color: 'black', textAlign: 'left' }}>
                    {t("NOTICE_THE_PROSPECTIVE_EMPLOYMENT_CONCEPT")}
                </p>
            </div>
            <div className='Row' style={{ textAlign: 'center' }}>
                <p style={{ color: 'black', textAlign: 'left' }}>
                    {t("C_F_R")}
                </p>
            </div>
            <div className='Row' style={{ textAlign: 'center' }}>
                <p style={{ color: 'black', textAlign: 'left' }}>
                    {t("LAST_UPDATED")}
                </p>
            </div>
        </form>

    )
}
