import { useContext } from 'react';
import { Alert, Container, Row, Col } from 'react-bootstrap';
import { useTranslation } from '../../../../hooks/use-translation';
import styles from '../../../../styles/digitalhiringapp.module.css';
import JotformContext, { JotFormContextType } from '../../../../context/jotform-context';

export function AlreadyAppliedPage() {
  const { t } = useTranslation();
  const {
    state: { company, directJob },
  }: JotFormContextType = useContext(JotformContext);

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <div className="text-center">
            <h1 className={`${styles.carrierName} ${styles.jot_form_headers_font} mb-4`}>
              {t('APPLICATION_STATUS_UPDATE')}
            </h1>

            <Alert variant="success" className="mb-4">
              <div className="text-center">
                <i
                  className="fa fa-check-circle mb-3"
                  style={{ fontSize: '48px', color: '#28a745' }}
                />
                <h4 className="mb-3">{t('APPLICATION_SUCCESSFULLY_UPDATED')}</h4>
                <p className="mb-2">
                  {directJob?.title && company?.name
                    ? t('APPLICATION_UPDATED_FOR_POSITION', {
                        jobTitle: directJob.title,
                        companyName: company.name,
                      })
                    : t('APPLICATION_UPDATED_GENERIC')}
                </p>
                <p className="mb-0">{t('HIRING_TEAM_REVIEW')}</p>
              </div>
            </Alert>

            <div className="text-muted">
              <p className="mb-1">
                <i className="fa fa-info-circle me-2" />
                {t('APPLICATION_STATUS_UPDATES')}
              </p>
              <p className="mb-0">
                <i className="fa fa-envelope me-2" />
                {t('THANK_YOU_CURRENT_APPLICATION')}
              </p>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
}
