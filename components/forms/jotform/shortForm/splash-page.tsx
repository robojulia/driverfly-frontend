import { useContext } from 'react';
import { Col, Form, Row } from 'react-bootstrap';
import JotformContext, { JotFormContextType } from '../../../../context/jotform-context';
import { useTranslation } from '../../../../hooks/use-translation';
import { PrimaryButton } from '../form-buttons';
import styles from '../../../../styles/digitalhiringapp.module.css';

export function SplashPage() {
  const {
    state: { steps, applicant, company, companyJobs },
    method: { stepNext, setSteps },
  }: JotFormContextType = useContext(JotformContext);

  const { t } = useTranslation();

  return (
    <>
      <Form onSubmit={() => (companyJobs.length > 0 ? stepNext() : setSteps(steps + 2))}>
        <h1 className={`${styles.carrierName} ${styles.jot_form_headers_font}`}>
          {t(
            '{name}_carrier',
            { name: applicant?.company?.name || company.name },
            { translateProps: true }
          )}
        </h1>
        <h4 className={styles.Application}>{t('DRIVER_APPLICATION')}</h4>
        <h6 className={styles.paragraph}>{t('JOTFORM_WELCOME')}</h6>

        <Row className="mt-5 text-center">
          <Col>
            <PrimaryButton
              type="submit"
              style={{
                width: '100%',
                maxWidth: '200px',
              }}
            >
              Start Application
            </PrimaryButton>
          </Col>
        </Row>
      </Form>
    </>
  );
}
