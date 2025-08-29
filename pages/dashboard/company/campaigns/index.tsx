import React from 'react';
import { Container, Alert } from 'reactstrap';

import FullLayout from '../../../../components/dashboard/layouts/layout/full-layout';
import PageLayout from '../../../../components/layouts/page/page-layout';
import { CampaignsTable } from '../../../../components/campaigns/CampaignsTable';
import { useFeatureFlags } from '../../../../context/feature-flag-context';
import { useTranslation } from '../../../../hooks/use-translation';

const CampaignsPage = () => {
  const { t } = useTranslation();
  const { isFeatureEnabled, isLoading: flagsLoading } = useFeatureFlags();

  // Feature flag check first
  const campaignsEnabled = !flagsLoading && isFeatureEnabled('CAMPAIGNS_ENABLED');

  // Show loading while feature flags are loading
  if (flagsLoading) {
    return (
      <Container>
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="sr-only">{t('LOADING')}</span>
          </div>
        </div>
      </Container>
    );
  }

  // Show warning if campaigns are not enabled
  if (!campaignsEnabled) {
    return (
      <PageLayout title="MARKETING_CAMPAIGNS">
        <Container>
          <Alert color="warning">{t('CAMPAIGNS_NOT_AVAILABLE')}</Alert>
        </Container>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title="MARKETING_CAMPAIGNS"
      actions={
        null /*
        
        <Button
          color="primary"
          onClick={() => router.push('/dashboard/company/campaigns/create')}
          disabled
        >
          {t('CREATE_CAMPAIGN')}
        </Button>
        */
      }
    >
      <CampaignsTable />
    </PageLayout>
  );
};

CampaignsPage.getLayout = function getLayout(page) {
  return <FullLayout>{page}</FullLayout>;
};

export default CampaignsPage;
