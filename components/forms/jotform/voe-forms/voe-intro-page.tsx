import { useFormik } from 'formik';
import { useContext } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import VoeFormContext, { VoeFormContextType } from '../../../../context/voeform-context';
import { useTranslation } from '../../../../hooks/use-translation';
import styles from '../../../../styles/voe.module.css';

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
    <Form onSubmit={form.handleSubmit}>
      <div className={styles.voe_intro}>
        <div className={styles.voe_header}>
          <h1 className={styles.voe_title}>{t('VERIFICATION_OF_EMPLOYMENT')}</h1>
          <h2 className={styles.company_name}>{employer?.name}</h2>
        </div>

        <div className={styles.info_section}>
          <div className={styles.applicant_info}>
            {t('VERIFYING_EMPLOYMENT_FOR', {
              applicantName: `${applicant?.first_name} ${applicant?.last_name}`,
            })}
          </div>

          <p className={styles.description_text}>{t('VOE_INTRO_DRIVERFLY_DESCRIPTION')}</p>

          <p className={styles.description_text}>
            {t('VOE_INTRO_PURPOSE', {
              applicantName: `${applicant?.first_name} ${applicant?.last_name}`,
              companyName: `${applicant?.company?.name}`,
            })}
          </p>

          <p className={styles.description_text}>{t('VOE_INTRO_CONFIDENTIALITY')}</p>
        </div>

        <div className={styles.action_container}>
          <Button type="submit" className={styles.action_button}>
            {t('BEGIN_VERIFICATION')}
          </Button>
        </div>
      </div>
    </Form>
  );
}
