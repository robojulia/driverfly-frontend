import Link from 'next/link';
import Image from 'next/image';
import { useContext, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import VoeFormContext from '../../../../context/voeform-context';
import { useTranslation } from '../../../../hooks/use-translation';
import styles from '../../../../styles/voe.module.css';

export function VoeThankYouPage() {
  const {
    state: { applicant, employer },
  } = useContext(VoeFormContext);
  const { t } = useTranslation();

  useEffect(() => {
    toast.success(t('VOE_SUCCESSFULLY_SUBMITTED'));
  }, [t]);

  return (
    <>
      <ToastContainer />
      <div className={styles.thank_you_container}>
        <h1 className={styles.carrierName}>{t('THANK_YOU')}</h1>

        <div className={styles.content_section}>
          <p className={styles.paragraph}>
            {t('VOE_THANK_YOU_MESSAGE', {
              EMPLOYER_NAME: employer.name,
              APPLICANT_NAME: `${applicant.first_name} ${applicant.last_name}`,
            })}
          </p>

          <div className={styles.marketing_section}>
            <h2 className={styles.marketing_title}>{t('DISCOVER_DRIVERFLY')}</h2>
            <div className={styles.benefits_list}>
              <div className={styles.benefit_item}>
                <h3>{t('POST_JOBS_INSTANTLY')}</h3>
                <p>{t('POST_JOBS_INSTANTLY_DESC')}</p>
              </div>
              <div className={styles.benefit_item}>
                <h3>{t('ACCESS_VERIFIED_DRIVERS')}</h3>
                <p>{t('ACCESS_VERIFIED_DRIVERS_DESC')}</p>
              </div>
              <div className={styles.benefit_item}>
                <h3>{t('STREAMLINE_HIRING')}</h3>
                <p>{t('STREAMLINE_HIRING_DESC')}</p>
              </div>
              <div className={styles.benefit_item}>
                <h3>{t('AUTOMATE_HIRING')}</h3>
                <p>{t('AUTOMATE_HIRING_DESC')}</p>
              </div>
            </div>
          </div>

          <div className={styles.cta_section}>
            <div className={styles.logo_container}>
              <Image
                src="/img/logo.png"
                alt="Driverfly Logo"
                className={styles.logo}
                width={1000}
                height={270}
                objectFit="contain"
              />
            </div>
            <p className={styles.cta_text}>{t('VOE_JOIN_DRIVERFLY_CTA')}</p>
            <Link href="/signup">
              <a className={`btn btn-primary ${styles.cta_button}`}>{t('GET_STARTED_FREE')}</a>
            </Link>
          </div>

          <div className={styles.contact_section}>
            <p>{t('VOE_CONTACT_SUPPORT')}</p>
            <p>
              <a href="mailto:support@driverfly.com">support@driverfly.com</a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
