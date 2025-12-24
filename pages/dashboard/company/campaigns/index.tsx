import React, { useState } from 'react';
import { Container, Alert } from 'reactstrap';
import { Button } from 'react-bootstrap';

import FullLayout from '../../../../components/dashboard/layouts/layout/full-layout';
import PageLayout from '../../../../components/layouts/page/page-layout';
import { CampaignsView, ViewMode } from '../../../../components/campaigns/CampaignsView';
import RequestCampaignModal from '../../../../components/campaigns/RequestCampaignModal';
import { useFeatureFlags } from '../../../../context/feature-flag-context';
import { useTranslation } from '../../../../hooks/use-translation';

const CampaignsPage = () => {
  const { t } = useTranslation();
  const { isFeatureEnabled, isLoading: flagsLoading } = useFeatureFlags();
  const [pageTitle, setPageTitle] = useState<string>('MARKETING_CAMPAIGNS');
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('summary');

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
    <>
      <PageLayout
        title={pageTitle}
        actions={
          viewMode === 'summary' ? (
            <Button
              variant="primary"
              onClick={() => setShowRequestModal(true)}
            >
              {t('REQUEST_A_NEW_CAMPAIGN')}
            </Button>
          ) : null
        }
      >
        <CampaignsView
          onTitleChange={setPageTitle}
          onViewModeChange={setViewMode}
        />
      </PageLayout>

      <RequestCampaignModal
        show={showRequestModal}
        onHide={() => setShowRequestModal(false)}
      />
    </>
  );
};

CampaignsPage.getLayout = function getLayout(page) {
  return <FullLayout>{page}</FullLayout>;
};

export default CampaignsPage;
