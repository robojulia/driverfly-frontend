import React from 'react';
import { Container, Alert } from 'reactstrap';
import { PersonCheck } from 'react-bootstrap-icons';

import FullLayout from '../../../../components/dashboard/layouts/layout/full-layout';
import PageLayout from '../../../../components/layouts/page/page-layout';
import { useFeatureFlags } from '../../../../context/feature-flag-context';
import { useTranslation } from '../../../../hooks/use-translation';

const HandoffsPage = () => {
  const { t } = useTranslation();
  const { isFeatureEnabled, isLoading: flagsLoading } = useFeatureFlags();

  const campaignsEnabled = !flagsLoading && isFeatureEnabled('CAMPAIGNS_ENABLED');

  if (flagsLoading) {
    return (
      <Container>
        <div className="text-center py-5">
          <div className="spinner-border" role="status">
            <span className="sr-only">{t('LOADING')}</span>
          </div>
        </div>
      </Container>
    );
  }

  if (!campaignsEnabled) {
    return (
      <PageLayout title="HANDOFFS">
        <Container>
          <Alert color="warning">{t('CAMPAIGNS_NOT_AVAILABLE')}</Alert>
        </Container>
      </PageLayout>
    );
  }

  return (
    <PageLayout title="HANDOFFS">
      <Container fluid>
        <div className="text-center py-5">
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              backgroundColor: 'rgba(0, 96, 120, 0.1)',
              color: 'var(--primary-dark, #006078)',
              marginBottom: '1rem',
            }}
          >
            <PersonCheck size={32} />
          </div>

          <h4 style={{ fontWeight: 600 }}>Campaign Handoffs</h4>
          <p
            className="text-muted"
            style={{ maxWidth: '560px', margin: '0.5rem auto 0' }}
          >
            Soon your AI agents will be able to hand qualified drivers straight to
            your recruiters — with full context and a ready-to-action inbox.
          </p>

          <span
            className="badge"
            style={{
              display: 'inline-block',
              marginTop: '1.5rem',
              padding: '0.5rem 1.25rem',
              fontSize: '0.95rem',
              fontWeight: 600,
              borderRadius: '999px',
              backgroundColor: 'rgba(0, 96, 120, 0.1)',
              color: 'var(--primary-dark, #006078)',
            }}
          >
            Coming soon
          </span>
        </div>
      </Container>
    </PageLayout>
  );
};

HandoffsPage.getLayout = function getLayout(page) {
  return <FullLayout>{page}</FullLayout>;
};

export default HandoffsPage;
