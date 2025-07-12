import { useContext } from 'react';
import { Col, Form, Row } from 'react-bootstrap';
import JotformContext, { JotFormContextType } from '../../../../context/jotform-context';
import { useTranslation } from '../../../../hooks/use-translation';
import { PrimaryButton } from '../form-buttons';
import styles from '../../../../styles/digitalhiringapp.module.css';
import { SplashPageJobView } from './splash-page-job-view';

export function SplashPage() {
  const {
    state: { steps, applicant, company, companyJobs, directJob, isDirectJobApplication },
    method: { stepNext, setSteps },
  }: JotFormContextType = useContext(JotformContext);

  const { t } = useTranslation();

  const handleNext = () => {
    if (isDirectJobApplication) {
      // Go directly to PhoneNumber page (step 2)
      setSteps(2);
    } else if (companyJobs.length > 0) {
      stepNext(); // Go to job selection page (step 1)
    } else {
      setSteps(steps + 2); // Skip job selection if no jobs available
    }
  };

  return (
    <>
      <Form
        onSubmit={(e) => {
          e.preventDefault();
          handleNext();
        }}
      >
        <h1 className={`${styles.carrierName} ${styles.jot_form_headers_font}`}>
          {t(
            '{name}_carrier',
            { name: applicant?.company?.name || company.name },
            { translateProps: true }
          )}
        </h1>

        {isDirectJobApplication && directJob ? (
          <SplashPageJobView job={directJob} />
        ) : (
          <>
            <h4 className={styles.Application}>{t('DRIVER_APPLICATION')}</h4>
            <h6 className={styles.paragraph}>{t('JOTFORM_WELCOME')}</h6>
          </>
        )}

        <Row className="mt-5 text-center">
          <Col>
            <PrimaryButton
              type="submit"
              style={{
                width: '100%',
                maxWidth: '200px',
              }}
            >
              {isDirectJobApplication ? 'Start Job Application' : 'Start Application'}
            </PrimaryButton>
          </Col>
        </Row>
      </Form>
    </>
  );
}
