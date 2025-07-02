import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, CardBody, Button, Alert } from 'reactstrap';
import { useRouter } from 'next/router';
import { BarChart } from 'react-bootstrap-icons';

import FullLayout from '../../../../components/dashboard/layouts/layout/full-layout';
import PageLayout from '../../../../components/layouts/page/page-layout';
import { CampaignCard } from '../../../../components/campaigns';
import { useFeatureFlags } from '../../../../context/feature-flag-context';
import { useTranslation } from '../../../../hooks/use-translation';
import { useCampaigns } from '../../../../hooks/campaigns/use-campaigns';
import { CampaignEntity } from '../../../../models/campaigns/campaign.entity';
import styles from '../../../../styles/campaigns.module.css';

const CampaignsPage = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { isFeatureEnabled, isLoading: flagsLoading } = useFeatureFlags();

  const [currentPage, setCurrentPage] = useState(1);

  // Feature flag check first
  const campaignsEnabled = !flagsLoading && isFeatureEnabled('CAMPAIGNS_ENABLED');

  const { campaigns, loading, error, total, loadCampaigns, cancelCampaign, regenerateTargets } =
    useCampaigns();

  useEffect(() => {
    if (campaignsEnabled && loadCampaigns) {
      loadCampaigns({
        page: currentPage,
        limit: 10,
        sortBy: 'createdAt',
        sortOrder: 'DESC',
      }).catch((err) => {
        console.error('Failed to load campaigns:', err);
        // Error is handled by the hook, just log here
      });
    }
  }, [currentPage, loadCampaigns, campaignsEnabled]);

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

  const handleCampaignAction = async (campaignId: number, action: 'cancel' | 'regenerate') => {
    try {
      if (action === 'cancel') {
        await cancelCampaign(campaignId);
      } else if (action === 'regenerate') {
        await regenerateTargets(campaignId);
      }
    } catch (err) {
      console.error(`Error performing ${action} on campaign:`, err);
      // Error handling is managed by the hook
    }
  };

  if (loading) {
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
      {error && (
        <Row className="mb-3">
          <Col>
            <Alert color="danger">{error}</Alert>
          </Col>
        </Row>
      )}

      <Row>
        {(!campaigns || campaigns.length === 0) && !loading ? (
          <Col>
            <Card>
              <CardBody className="text-center py-5">
                <div className="mb-3">
                  <BarChart size={48} className="text-muted" />
                </div>
                <h5>{t('NO_CAMPAIGNS_YET')}</h5>
                <p className="text-muted">{t('CREATE_YOUR_FIRST_CAMPAIGN')}</p>
              </CardBody>
            </Card>
          </Col>
        ) : (
          campaigns &&
          campaigns.length > 0 &&
          campaigns.map((campaign) => (
            <Col md={6} lg={4} key={campaign.id} className="mb-4">
              <CampaignCard campaign={campaign} onAction={handleCampaignAction} />
            </Col>
          ))
        )}
      </Row>

      {/* Pagination would go here if needed */}
      {total > 10 && (
        <Row>
          <Col className="text-center">
            <Button
              color="outline-primary"
              onClick={() => setCurrentPage((prev) => prev + 1)}
              disabled={!campaigns || campaigns.length < 10}
            >
              {t('LOAD_MORE')}
            </Button>
          </Col>
        </Row>
      )}
    </PageLayout>
  );
};

CampaignsPage.getLayout = function getLayout(page) {
  return <FullLayout>{page}</FullLayout>;
};

export default CampaignsPage;
