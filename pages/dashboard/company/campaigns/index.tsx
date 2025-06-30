import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, CardBody, CardHeader, Button, Badge, Alert } from 'reactstrap';
import { useRouter } from 'next/router';
import { Eye, Pause, Play, X, BarChart } from 'react-bootstrap-icons';

import FullLayout from '../../../../components/dashboard/layouts/layout/full-layout';
import PageLayout from '../../../../components/layouts/page/page-layout';
import { useFeatureFlags } from '../../../../context/feature-flag-context';
import { useTranslation } from '../../../../hooks/use-translation';
import { useCampaigns } from '../../../../hooks/campaigns/use-campaigns';
import { CampaignEntity } from '../../../../models/campaigns/campaign.entity';
import { CampaignStatus } from '../../../../enums/campaigns/campaign-status.enum';
import { CampaignType } from '../../../../enums/campaigns/campaign-type.enum';
import styles from '../../../../styles/campaigns.module.css';

const CampaignsPage = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { isFeatureEnabled } = useFeatureFlags();

  const [currentPage, setCurrentPage] = useState(1);

  // Feature flag check first
  const campaignsEnabled = isFeatureEnabled('CAMPAIGNS_ENABLED');

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

  const getStatusBadgeColor = (status: CampaignStatus) => {
    switch (status) {
      case CampaignStatus.DRAFT:
        return 'secondary';
      case CampaignStatus.SCHEDULED:
        return 'info';
      case CampaignStatus.RUNNING:
        return 'primary';
      case CampaignStatus.COMPLETED:
        return 'success';
      case CampaignStatus.CANCELLED:
        return 'danger';
      default:
        return 'secondary';
    }
  };

  const getCampaignTypeLabel = (type: CampaignType) => {
    switch (type) {
      case CampaignType.JOB_REACHOUT:
        return t('JOB_REACHOUT_CAMPAIGN');
      default:
        return type;
    }
  };

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString();
  };

  const calculateSuccessRate = (campaign: CampaignEntity) => {
    if (campaign.totalTargets === 0) return 0;
    return Math.round((campaign.deliveredCount / campaign.totalTargets) * 100);
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

  // Debug logging (can be removed in production)
  console.log('CampaignsPage render:', { campaigns, loading, error, campaignsEnabled });

  // Debug logging (can be removed in production)
  console.log('CampaignsPage render:', { campaigns, loading, error, campaignsEnabled });

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
              <Card className={`h-100 ${styles.campaignCard}`}>
                <CardHeader className="bg-white border-bottom">
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <h6 className="mb-1 font-weight-bold">{campaign.name}</h6>
                      <small className="text-muted">{getCampaignTypeLabel(campaign.type)}</small>
                    </div>
                    <Badge color={getStatusBadgeColor(campaign.status)}>
                      {campaign.status.toUpperCase()}
                    </Badge>
                  </div>
                </CardHeader>

                <CardBody>
                  {campaign.description && (
                    <p className="text-muted small mb-3">{campaign.description}</p>
                  )}

                  <div className={`${styles.campaignStats} mb-3`}>
                    <div className="row text-center">
                      <div className="col-4">
                        <div className="mb-1">
                          <strong className="d-block">{campaign.totalTargets}</strong>
                          <small className="text-muted">{t('TARGETS')}</small>
                        </div>
                      </div>
                      <div className="col-4">
                        <div className="mb-1">
                          <strong className="d-block">{campaign.deliveredCount}</strong>
                          <small className="text-muted">{t('DELIVERED')}</small>
                        </div>
                      </div>
                      <div className="col-4">
                        <div className="mb-1">
                          <strong className="d-block text-success">
                            {calculateSuccessRate(campaign)}%
                          </strong>
                          <small className="text-muted">{t('SUCCESS')}</small>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`${styles.campaignDates} mb-3`}>
                    <small className="text-muted d-block">
                      <strong>{t('CREATED')}:</strong> {formatDate(campaign.createdAt)}
                    </small>
                    {campaign.startedAt && (
                      <small className="text-muted d-block">
                        <strong>{t('STARTED')}:</strong> {formatDate(campaign.startedAt)}
                      </small>
                    )}
                    {campaign.completedAt && (
                      <small className="text-muted d-block">
                        <strong>{t('COMPLETED')}:</strong> {formatDate(campaign.completedAt)}
                      </small>
                    )}
                  </div>

                  <div className={styles.campaignActions}>
                    <div className="btn-group w-100" role="group">
                      <Button
                        color="outline-primary"
                        size="sm"
                        onClick={() => router.push(`/dashboard/company/campaigns/${campaign.id}`)}
                      >
                        <Eye size={14} className="me-1" />
                        {t('VIEW')}
                      </Button>

                      {campaign.status === CampaignStatus.RUNNING && (
                        <Button
                          color="outline-warning"
                          size="sm"
                          onClick={() => handleCampaignAction(campaign.id, 'cancel')}
                        >
                          <Pause size={14} className="me-1" />
                          {t('CANCEL')}
                        </Button>
                      )}

                      {(campaign.status === CampaignStatus.COMPLETED ||
                        campaign.status === CampaignStatus.CANCELLED) && (
                        <Button
                          color="outline-success"
                          size="sm"
                          onClick={() => handleCampaignAction(campaign.id, 'regenerate')}
                        >
                          <Play size={14} className="me-1" />
                          {t('RESTART')}
                        </Button>
                      )}
                    </div>
                  </div>
                </CardBody>
              </Card>
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
