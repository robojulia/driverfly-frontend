import { useContext, useEffect, useState } from 'react';
import { Col, Form, Row } from 'react-bootstrap';
import JotformContext, { JotFormContextType } from '../../../../context/jotform-context';
import { useTranslation } from '../../../../hooks/use-translation';
import { PrimaryButton } from '../form-buttons';
import styles from '../../../../styles/digitalhiringapp.module.css';
import { SplashPageJobView } from './splash-page-job-view';
import DocumentApi from '../../../../pages/api/document';

export function SplashPage() {
  const {
    state: { steps, applicant, company, companyJobs, directJob, isDirectJobApplication },
    method: { stepNext, setSteps },
  }: JotFormContextType = useContext(JotformContext);

  const { t } = useTranslation();
  const [companyLogoUrl, setCompanyLogoUrl] = useState<string>('');

  useEffect(() => {
    const fetchLogoUrl = async () => {
      const photo = applicant?.company?.photo || company?.photo;
      if (photo?.id) {
        try {
          const api = new DocumentApi();
          // Use getPhoto instead of getSignedUrl - it calls the public endpoint
          // that doesn't require authentication (for driver application pages)
          const document = await api.getPhoto(photo.id);
          setCompanyLogoUrl(document?.path || '');
        } catch (error) {
          console.error('Error fetching company logo:', error);
        }
      } else if (photo?.path) {
        setCompanyLogoUrl(photo.path);
      }
    };
    fetchLogoUrl();
  }, [applicant?.company?.photo, company?.photo]);

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
        {/* Company Logo at the top of first card */}
        {companyLogoUrl && (
          <div className={styles.companyLogo}>
            <img
              src={companyLogoUrl}
              alt={`${applicant?.company?.name || company?.name} logo`}
            />
          </div>
        )}

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
