import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardHeader,
  Button,
  Badge,
  Alert,
  Table,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
} from 'reactstrap';
import { ArrowLeft, BarChart, People, Gear, Pause, Play, X } from 'react-bootstrap-icons';

import FullLayout from '../../../../components/dashboard/layouts/layout/full-layout';
import PageLayout from '../../../../components/layouts/page/page-layout';
import { useFeatureFlags } from '../../../../context/feature-flag-context';
import { useTranslation } from '../../../../hooks/use-translation';
import { useCampaign } from '../../../../hooks/campaigns/use-campaigns';
import { CampaignEntity } from '../../../../models/campaigns/campaign.entity';
import { CampaignTargetEntity } from '../../../../models/campaigns/campaign-target.entity';
import { CampaignStatus } from '../../../../enums/campaigns/campaign-status.enum';
import { CampaignType } from '../../../../enums/campaigns/campaign-type.enum';
import { CampaignConfigDisplay } from '../../../../components/campaigns';

const CampaignDetailPage = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { id } = router.query;
  const { isFeatureEnabled } = useFeatureFlags();

  const campaignId = id ? parseInt(id as string) : 0;
  const { campaign, targets, stats, loading, error, cancelCampaign, regenerateTargets } =
    useCampaign(campaignId);

  const [activeTab, setActiveTab] = useState('overview');

  // Feature flag check
  if (!isFeatureEnabled('CAMPAIGNS_ENABLED')) {
    router.push('/dashboard/company');
    return null;
  }

  const handleCampaignAction = async (action: 'cancel' | 'regenerate') => {
    try {
      if (action === 'cancel') {
        await cancelCampaign();
      } else if (action === 'regenerate') {
        await regenerateTargets();
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

  const calculateSuccessRate = () => {
    if (!stats || stats.totalTargets === 0) return 0;
    return Math.round((stats.deliveredCount / stats.totalTargets) * 100);
  };

  if (loading) {
    return (
      <PageLayout title={t('CAMPAIGN_DETAILS')}>
        <Container>
          <div className="text-center">
            <div className="spinner-border" role="status">
              <span className="sr-only">{t('LOADING')}</span>
            </div>
          </div>
        </Container>
      </PageLayout>
    );
  }

  if (!campaign) {
    return (
      <PageLayout title={t('CAMPAIGN_DETAILS')}>
        <Container>
          <Alert color="danger">{t('CAMPAIGN_NOT_FOUND')}</Alert>
        </Container>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title={campaign?.name || t('CAMPAIGN_DETAILS')}
      actions={
        <>
          <Button
            color="secondary"
            size="sm"
            onClick={() => router.push('/dashboard/company/campaigns')}
            className="me-2"
          >
            <ArrowLeft /> {t('BACK_TO_CAMPAIGNS')}
          </Button>
          {campaign?.status === CampaignStatus.RUNNING && (
            <Button color="warning" size="sm" onClick={() => handleCampaignAction('cancel')}>
              <Pause /> {t('PAUSE')}
            </Button>
          )}
          {campaign?.status === CampaignStatus.DRAFT && (
            <Button color="primary" size="sm" onClick={() => handleCampaignAction('regenerate')}>
              <Play /> {t('START')}
            </Button>
          )}
        </>
      }
    >
      <Container fluid>
        {/* Header */}
        <Row className="mb-4">
          <Col>
            <div className="d-flex align-items-center mb-3">
              <Button
                color="link"
                className="p-0 me-3"
                onClick={() => router.push('/dashboard/company/campaigns')}
              >
                <ArrowLeft size={20} />
              </Button>
              <div className="flex-grow-1">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <h1 className="h3 mb-0">{campaign.name}</h1>
                    <div className="d-flex align-items-center gap-2 mt-1">
                      <Badge color={getStatusBadgeColor(campaign.status)}>
                        {campaign.status.toUpperCase()}
                      </Badge>
                      <span className="text-muted">•</span>
                      <span className="text-muted">{getCampaignTypeLabel(campaign.type)}</span>
                    </div>
                  </div>
                  <div className="d-flex gap-2">
                    {campaign.status === CampaignStatus.RUNNING && (
                      <Button
                        color="warning"
                        size="sm"
                        onClick={() => handleCampaignAction('cancel')}
                      >
                        <Pause size={14} className="me-1" />
                        {t('CANCEL_CAMPAIGN')}
                      </Button>
                    )}
                    {(campaign.status === CampaignStatus.COMPLETED ||
                      campaign.status === CampaignStatus.CANCELLED) && (
                      <Button
                        color="success"
                        size="sm"
                        onClick={() => handleCampaignAction('regenerate')}
                      >
                        <Play size={14} className="me-1" />
                        {t('RESTART_CAMPAIGN')}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Col>
        </Row>

        {error && (
          <Row className="mb-3">
            <Col>
              <Alert color="danger">{error}</Alert>
            </Col>
          </Row>
        )}

        {/* Stats Cards */}
        {stats && (
          <Row className="mb-4">
            <Col md={3}>
              <Card>
                <CardBody className="text-center">
                  <h3 className="mb-0">{stats.totalTargets}</h3>
                  <small className="text-muted">{t('TOTAL_TARGETS')}</small>
                </CardBody>
              </Card>
            </Col>
            <Col md={3}>
              <Card>
                <CardBody className="text-center">
                  <h3 className="mb-0 text-primary">{stats.sentCount}</h3>
                  <small className="text-muted">{t('SENT')}</small>
                </CardBody>
              </Card>
            </Col>
            <Col md={3}>
              <Card>
                <CardBody className="text-center">
                  <h3 className="mb-0 text-success">{stats.deliveredCount}</h3>
                  <small className="text-muted">{t('DELIVERED')}</small>
                </CardBody>
              </Card>
            </Col>
            <Col md={3}>
              <Card>
                <CardBody className="text-center">
                  <h3 className="mb-0 text-danger">{stats.failedCount}</h3>
                  <small className="text-muted">{t('FAILED')}</small>
                </CardBody>
              </Card>
            </Col>
          </Row>
        )}

        {/* Tabs */}
        <Row>
          <Col>
            <Card>
              <CardHeader>
                <Nav tabs>
                  <NavItem>
                    <NavLink
                      className={activeTab === 'overview' ? 'active' : ''}
                      onClick={() => setActiveTab('overview')}
                      style={{ cursor: 'pointer' }}
                    >
                      <BarChart size={16} className="me-1" />
                      {t('OVERVIEW')}
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      className={activeTab === 'targets' ? 'active' : ''}
                      onClick={() => setActiveTab('targets')}
                      style={{ cursor: 'pointer' }}
                    >
                      <People size={16} className="me-1" />
                      {t('TARGETS')} ({targets.length})
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      className={activeTab === 'settings' ? 'active' : ''}
                      onClick={() => setActiveTab('settings')}
                      style={{ cursor: 'pointer' }}
                    >
                      <Gear size={16} className="me-1" />
                      {t('SETTINGS')}
                    </NavLink>
                  </NavItem>
                </Nav>
              </CardHeader>

              <CardBody>
                <TabContent activeTab={activeTab}>
                  <TabPane tabId="overview">
                    <Row>
                      <Col md={6}>
                        <h5>{t('CAMPAIGN_DETAILS')}</h5>
                        <dl className="row">
                          <dt className="col-sm-4">{t('NAME')}:</dt>
                          <dd className="col-sm-8">{campaign.name}</dd>

                          <dt className="col-sm-4">{t('TYPE')}:</dt>
                          <dd className="col-sm-8">{getCampaignTypeLabel(campaign.type)}</dd>

                          <dt className="col-sm-4">{t('STATUS')}:</dt>
                          <dd className="col-sm-8">
                            <Badge color={getStatusBadgeColor(campaign.status)}>
                              {campaign.status.toUpperCase()}
                            </Badge>
                          </dd>

                          <dt className="col-sm-4">{t('CREATED')}:</dt>
                          <dd className="col-sm-8">{formatDate(campaign.createdAt)}</dd>

                          {campaign.startedAt && (
                            <>
                              <dt className="col-sm-4">{t('STARTED')}:</dt>
                              <dd className="col-sm-8">{formatDate(campaign.startedAt)}</dd>
                            </>
                          )}

                          {campaign.completedAt && (
                            <>
                              <dt className="col-sm-4">{t('COMPLETED')}:</dt>
                              <dd className="col-sm-8">{formatDate(campaign.completedAt)}</dd>
                            </>
                          )}

                          {campaign.description && (
                            <>
                              <dt className="col-sm-4">{t('DESCRIPTION')}:</dt>
                              <dd className="col-sm-8">{campaign.description}</dd>
                            </>
                          )}
                        </dl>
                      </Col>

                      <Col md={6}>
                        <h5>{t('SUCCESS_METRICS')}</h5>
                        <div className="mb-3">
                          <div className="d-flex justify-content-between mb-1">
                            <span>{t('SUCCESS_RATE')}</span>
                            <span>
                              <strong>{calculateSuccessRate()}%</strong>
                            </span>
                          </div>
                          <div className="progress">
                            <div
                              className="progress-bar bg-success"
                              style={{ width: `${calculateSuccessRate()}%` }}
                            />
                          </div>
                        </div>

                        {stats && (
                          <div className="row text-center">
                            <div className="col-6 mb-2">
                              <div className="border rounded p-2">
                                <strong className="d-block text-primary">{stats.sentCount}</strong>
                                <small className="text-muted">{t('MESSAGES_SENT')}</small>
                              </div>
                            </div>
                            <div className="col-6 mb-2">
                              <div className="border rounded p-2">
                                <strong className="d-block text-success">
                                  {stats.deliveredCount}
                                </strong>
                                <small className="text-muted">{t('DELIVERED')}</small>
                              </div>
                            </div>
                            <div className="col-6">
                              <div className="border rounded p-2">
                                <strong className="d-block text-danger">{stats.failedCount}</strong>
                                <small className="text-muted">{t('FAILED')}</small>
                              </div>
                            </div>
                            <div className="col-6">
                              <div className="border rounded p-2">
                                <strong className="d-block text-warning">
                                  {stats.pendingCount}
                                </strong>
                                <small className="text-muted">{t('PENDING')}</small>
                              </div>
                            </div>
                          </div>
                        )}
                      </Col>
                    </Row>
                  </TabPane>

                  <TabPane tabId="targets">
                    <div className="table-responsive">
                      <Table hover>
                        <thead>
                          <tr>
                            <th>{t('NAME')}</th>
                            <th>{t('EMAIL')}</th>
                            <th>{t('PHONE')}</th>
                            <th>{t('STATUS')}</th>
                            <th>{t('PROCESSED_AT')}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {targets.map((target) => (
                            <tr key={target.id}>
                              <td>{target.name || '-'}</td>
                              <td>{target.email || '-'}</td>
                              <td>{target.phone || '-'}</td>
                              <td>
                                <Badge
                                  color={
                                    target.status === 'delivered'
                                      ? 'success'
                                      : target.status === 'failed'
                                      ? 'danger'
                                      : target.status === 'sent'
                                      ? 'primary'
                                      : 'secondary'
                                  }
                                >
                                  {target.status.toUpperCase()}
                                </Badge>
                              </td>
                              <td>{target.processedAt ? formatDate(target.processedAt) : '-'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </div>

                    {targets.length === 0 && (
                      <div className="text-center py-4">
                        <p className="text-muted">{t('NO_TARGETS_FOUND')}</p>
                      </div>
                    )}
                  </TabPane>

                  <TabPane tabId="settings">
                    <CampaignConfigDisplay campaign={campaign} />
                  </TabPane>
                </TabContent>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </PageLayout>
  );
};

CampaignDetailPage.getLayout = function getLayout(page) {
  return <FullLayout>{page}</FullLayout>;
};

export default CampaignDetailPage;
