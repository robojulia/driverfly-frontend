import React, { useState } from 'react';
import { Container, Alert } from 'reactstrap';
import { Button } from 'react-bootstrap';

import FullLayout from '../../../../components/dashboard/layouts/layout/full-layout';
import PageLayout from '../../../../components/layouts/page/page-layout';
import { CampaignsView, ViewMode } from '../../../../components/campaigns/CampaignsView';
import RequestCampaignModal from '../../../../components/campaigns/RequestCampaignModal';
import RequestInboundModal from '../../../../components/campaigns/RequestInboundModal';
import { useFeatureFlags } from '../../../../context/feature-flag-context';
import { useTranslation } from '../../../../hooks/use-translation';
import { CampaignCommunicationType } from '../../../../enums/campaigns/campaign-communication-type.enum';

type TabType = CampaignCommunicationType | 'INBOUND_CALLS';

const CampaignsPage = () => {
  const { t } = useTranslation();
  const { isFeatureEnabled, isLoading: flagsLoading } = useFeatureFlags();
  const [pageTitle, setPageTitle] = useState<string>('MARKETING_CAMPAIGNS');
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showInboundModal, setShowInboundModal] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('summary');
  const [activeTab, setActiveTab] = useState<TabType>(CampaignCommunicationType.VOICE);

  const campaignsEnabled = !flagsLoading && isFeatureEnabled('CAMPAIGNS_ENABLED');

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

  if (!campaignsEnabled) {
    return (
      <PageLayout title="MARKETING_CAMPAIGNS">
        <Container>
          <Alert color="warning">{t('CAMPAIGNS_NOT_AVAILABLE')}</Alert>
        </Container>
      </PageLayout>
    );
  }

  const renderHeaderAction = () => {
    if (viewMode !== 'summary') return null;

    if (activeTab === 'INBOUND_CALLS') {
      return (
        <Button variant="primary" onClick={() => setShowInboundModal(true)}>
          Request Inbound AI Setup
        </Button>
      );
    }

    return (
      <Button variant="primary" onClick={() => setShowRequestModal(true)}>
        {t('REQUEST_A_NEW_CAMPAIGN')}
      </Button>
    );
  };

  return (
    <>
      <PageLayout title={pageTitle} actions={renderHeaderAction()}>
        <CampaignsView
          onTitleChange={setPageTitle}
          onViewModeChange={setViewMode}
          onTabChange={setActiveTab}
        />
      </PageLayout>

      <RequestCampaignModal
        show={showRequestModal}
        onHide={() => setShowRequestModal(false)}
      />

      <RequestInboundModal
        show={showInboundModal}
        onHide={() => setShowInboundModal(false)}
      />
    </>
  );
};

CampaignsPage.getLayout = function getLayout(page) {
  return <FullLayout>{page}</FullLayout>;
};

export default CampaignsPage;
