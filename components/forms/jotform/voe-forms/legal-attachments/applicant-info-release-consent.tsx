import { ApplicantExtras } from '../../../../../enums/applicants/applicant-extras.enum';
import { useTranslation } from '../../../../../hooks/use-translation';
import { ApplicantEntity } from '../../../../../models/applicant';
import { ShowUsFormattedDateTime } from '../../../../../utils/show-us-formatted-date-time';
export interface ApplicantInfoReleaseConsentProps {
  applicant?: ApplicantEntity;
}
export default function ApplicantInfoReleaseConsent({
  applicant,
}: ApplicantInfoReleaseConsentProps) {
  const signature = applicant?.extras?.find(
    (sign) => sign?.type == ApplicantExtras.SIGNATURE_DISCLOSURE_AUTHORIZATION
  );

  const { t } = useTranslation();
  const date = applicant?.extras?.find(
    (v) => v.type == ApplicantExtras.DISCLOSURE_AND_AUTHORIZATION_DATE
  );

  return (
    <form>
      <div className="Row">
        <div className="Col">
          <h1 style={{ fontWeight: 'bold', textAlign: 'center' }}>
            {t('APPLICANT_INFORMATION_RELEASE_CONSENT_FORM')}
          </h1>
        </div>
      </div>
      <div className="Row">
        <p style={{ color: 'black', display: 'inline' }}>{t('I_HEREBT_AUTHORIZE_ANY_PERSONAL')}</p>
      </div>
      <div className="Row" style={{ marginTop: '30px' }}>
        <p style={{ color: 'black', fontWeight: 'bold', margin: '0px' }}>
          {t('TO_BE_READ_AND_SIGNED_BY_APPLICANT')}
        </p>
        <p style={{ color: 'black', display: 'inline' }}>{t('IT_IS_AGREE_AND_UNDERSTOOD')}</p>
      </div>
      <div className="Row" style={{ marginTop: '30px', marginBottom: '20px' }}>
        <p style={{ color: 'black', display: 'inline' }}>
          {t(
            '{company_name}_I_HEREBY_AUTHORIZE_AND_REQUEST_FOLLOWING',
            { company_name: applicant?.company?.name },
            { translateProps: true }
          )}
        </p>
      </div>
      <div className="Row" style={{ textAlign: 'left', marginBottom: '20px' }}>
        <div className="Col">
          <p style={{ color: 'black', fontWeight: 'bold', display: 'inline' }}>{t('NAME:')}</p>
          <p
            style={{ color: 'black', display: 'inline' }}
          >{` ${applicant?.first_name} ${applicant?.last_name}`}</p>
        </div>
      </div>
      <div className="Row" style={{ textAlign: 'left', marginBottom: '20px' }}>
        <div className="Col">
          <p style={{ color: 'black', fontWeight: 'bold', display: 'inline' }}>{t('DATE:')}</p>
          <p style={{ color: 'black', display: 'inline' }}>
            {date?.value ? ShowUsFormattedDateTime(date?.value, true) : ` ${t('NULL')}`}
          </p>
        </div>
      </div>
      <div className="Row" style={{ textAlign: 'left', marginBottom: '20px' }}>
        <div className="Col">
          <p style={{ color: 'black', fontWeight: 'bold', display: 'inline' }}>{t('SIGNATURE:')}</p>
        </div>
        <div className="Row" style={{ marginTop: '10px', marginBottom: '30px' }}>
          <img
            src={signature?.value}
            style={{ width: '300px', height: '200px', border: '1px solid black' }}
            alt="image"
          />
        </div>
      </div>
    </form>
  );
}
