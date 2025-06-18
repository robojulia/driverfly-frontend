import Link from 'next/link';
import Image from 'next/image';
import { useContext, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import {
  CheckCircleFill,
  Star,
  TrophyFill,
  PeopleFill,
  GearFill,
  RocketFill,
} from 'react-bootstrap-icons';
import VoeFormContext from '../../../../context/voeform-context';
import { useTranslation } from '../../../../hooks/use-translation';
import { PrimaryButton, SecondaryButton } from '../../jotform/form-buttons';
import styles from '../../../../styles/digitalhiringapp.module.css';

export function VoeThankYouPage() {
  const {
    state: { applicant, employer },
  } = useContext(VoeFormContext);
  const { t } = useTranslation();

  useEffect(() => {
    toast.success(t('VOE_SUCCESSFULLY_SUBMITTED'));
  }, [t]);

  const benefits = [
    {
      icon: <RocketFill size={24} className="text-primary" />,
      title: t('POST_JOBS_INSTANTLY'),
      description: t('POST_JOBS_INSTANTLY_DESC'),
    },
    {
      icon: <PeopleFill size={24} className="text-success" />,
      title: t('ACCESS_VERIFIED_DRIVERS'),
      description: t('ACCESS_VERIFIED_DRIVERS_DESC'),
    },
    {
      icon: <GearFill size={24} className="text-info" />,
      title: t('STREAMLINE_HIRING'),
      description: t('STREAMLINE_HIRING_DESC'),
    },
    {
      icon: <TrophyFill size={24} className="text-warning" />,
      title: t('AUTOMATE_HIRING'),
      description: t('AUTOMATE_HIRING_DESC'),
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.main}>
        <div className={styles.main_form}>
          <ToastContainer />

          <div className={`${styles.formContainer} ${styles.fadeIn}`}>
            {/* Success Header */}
            <div className={styles.formCard}>
              <div className={styles.formCardBody} style={{ textAlign: 'center' }}>
                <div
                  style={{
                    width: '80px',
                    height: '80px',
                    background: 'linear-gradient(135deg, var(--success) 0%, var(--secondary) 100%)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.5rem auto',
                    boxShadow: '0 10px 20px rgba(135, 249, 52, 0.3)',
                  }}
                >
                  <CheckCircleFill size={40} color="white" />
                </div>

                <h1 className={styles.heading__sty}>{t('THANK_YOU')}</h1>

                <p
                  className={styles.paragraph}
                  style={{ fontSize: '1.2rem', marginBottom: '2rem' }}
                >
                  {t('VOE_THANK_YOU_MESSAGE', {
                    EMPLOYER_NAME: employer.name,
                    APPLICANT_NAME: `${applicant.first_name} ${applicant.last_name}`,
                  })}
                </p>

                <div className={styles.alertInfo}>
                  <div className={styles.alertInfoHeading}>
                    <CheckCircleFill size={20} />
                    Verification Completed
                  </div>
                  <p className={styles.alertInfoText}>
                    ✅ Verification of Employment completed successfully
                  </p>
                </div>
              </div>
            </div>

            {/* Marketing Section */}
            <div className={styles.formCard}>
              <div className={styles.formCardHeader}>
                <h2 className={styles.formCardTitle}>
                  {t('READY_TO_SIMPLIFY_YOUR_HIRING') || 'Ready to Simplify Your Hiring?'}
                </h2>
              </div>
              <div className={styles.formCardBody}>
                <p className={styles.paragraph}>
                  {t('JOIN_DRIVERFLY_EMPLOYER_PLATFORM') ||
                    'Join thousands of companies using Driverfly to streamline their hiring process'}
                </p>

                <div className={styles.formGrid}>
                  {benefits.map((benefit, index) => (
                    <div key={index} className={styles.formInfoBox}>
                      <div
                        className={styles.formInfoBoxTitle}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                      >
                        {benefit.icon}
                        {benefit.title}
                      </div>
                      <p style={{ margin: 0, fontSize: '0.9rem' }}>{benefit.description}</p>
                    </div>
                  ))}
                </div>

                <div className={styles.navigationButtons} style={{ marginTop: '2rem' }}>
                  <Link href="https://employers.driverfly.com/register" target="_blank">
                    <button className={styles.formButton}>
                      {t('JOIN_DRIVERFLY_EMPLOYERS') || 'Join Driverfly Employers'}
                    </button>
                  </Link>
                  <Link href="https://driverfly.com" target="_blank">
                    <button className={styles.secondaryButton}>
                      {t('LEARN_MORE') || 'Learn More'}
                    </button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div style={{ textAlign: 'center', marginTop: '2rem', padding: '1rem' }}>
              <p className={styles.paragraph} style={{ fontSize: '0.9rem', opacity: 0.7 }}>
                🚛 <strong>Driverfly</strong> - Connecting drivers with opportunities nationwide
              </p>
              <p
                className={styles.paragraph}
                style={{ fontSize: '0.85rem', opacity: 0.6, margin: 0 }}
              >
                © 2024 Driverfly. Driving careers forward, one connection at a time.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
