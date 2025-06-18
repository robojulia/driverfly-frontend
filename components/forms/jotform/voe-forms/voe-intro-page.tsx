import { useFormik } from 'formik';
import { useContext } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import VoeFormContext, { VoeFormContextType } from '../../../../context/voeform-context';
import { useTranslation } from '../../../../hooks/use-translation';
import styles from '../../../../styles/digitalhiringapp.module.css';

export function IntroPage() {
  const {
    state: { applicant, employer },
    method: { stepNext },
  }: VoeFormContextType = useContext(VoeFormContext);
  const { t } = useTranslation();

  const form = useFormik({
    initialValues: {},
    onSubmit: () => {
      stepNext();
    },
  });
  return (
    <Form onSubmit={form.handleSubmit} className={styles.fadeIn}>
      <div className={styles.formContainer}>
        <div className={styles.formCard}>
          <div className={styles.formCardHeader}>
            <h1 className={styles.heading__sty}>{t('VERIFICATION_OF_EMPLOYMENT')}</h1>
          </div>
          <div className={styles.formCardBody}>
            <h2 className={styles.carrierName}>{employer?.name}</h2>

            <div className={styles.formInfoBox}>
              <h3 className={styles.formInfoBoxTitle}>
                {t('VERIFYING_EMPLOYMENT_FOR', {
                  applicantName: `${applicant?.first_name} ${applicant?.last_name}`,
                })}
              </h3>

              <p className={styles.paragraph}>{t('VOE_INTRO_DRIVERFLY_DESCRIPTION')}</p>

              <p className={styles.paragraph}>
                {t('VOE_INTRO_PURPOSE', {
                  applicantName: `${applicant?.first_name} ${applicant?.last_name}`,
                  companyName: `${applicant?.company?.name}`,
                })}
              </p>

              <p className={styles.paragraph}>{t('VOE_INTRO_CONFIDENTIALITY')}</p>
            </div>

            <div className={styles.navigationButtons}>
              <Button type="submit" className={styles.formButton}>
                {t('BEGIN_VERIFICATION')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Form>
  );
}
