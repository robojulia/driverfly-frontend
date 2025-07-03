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
import {
  ArrowLeft,
  BarChart,
  People,
  Gear,
  Pause,
  Play,
  X,
  ChevronLeft,
  Trash,
} from 'react-bootstrap-icons';

import FullLayout from '../../../../components/dashboard/layouts/layout/full-layout';
import PageLayout from '../../../../components/layouts/page/page-layout';
import { ConfirmationModal } from '../../../../components/shared';
import { useFeatureFlags } from '../../../../context/feature-flag-context';
import { useTranslation } from '../../../../hooks/use-translation';
import { useCampaign } from '../../../../hooks/campaigns/use-campaigns';
import { CampaignStatus } from '../../../../enums/campaigns/campaign-status.enum';
import { CampaignType } from '../../../../enums/campaigns/campaign-type.enum';
import { CampaignConfigDisplay } from '../../../../components/campaigns';
import { ManualTargetSelectionModal } from '../../../../components/campaigns/ManualTargetSelectionModal';

const CampaignDetailPage = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { id } = router.query;
  const { isFeatureEnabled, isLoading: flagsLoading } = useFeatureFlags();

  const campaignId = id ? parseInt(id as string) : 0;
  const {
    campaign,
    targets,
    stats,
    loading,
    error,
    loadCampaign,
    cancelCampaign,
    startCampaign,
    regenerateTargets,
    deleteTarget,
    addManualTargets,
  } = useCampaign(campaignId);

  const [activeTab, setActiveTab] = useState('overview');
  const [regeneratingTargets, setRegeneratingTargets] = useState(false);
  const [deletingTargets, setDeletingTargets] = useState<Set<number>>(new Set());
  const [confirmDeleteModal, setConfirmDeleteModal] = useState(false);
  const [confirmStartModal, setConfirmStartModal] = useState(false);
  const [confirmCancelModal, setConfirmCancelModal] = useState(false);
  const [confirmRefreshModal, setConfirmRefreshModal] = useState(false);
  const [manualTargetModal, setManualTargetModal] = useState(false);
  const [addingManualTargets, setAddingManualTargets] = useState(false);
  const [targetToDelete, setTargetToDelete] = useState<{ id: number; name: string } | null>(null);

  // Feature flag check - only redirect after flags are loaded
  useEffect(() => {
    if (!flagsLoading && !isFeatureEnabled('CAMPAIGNS_ENABLED')) {
      router.push('/dashboard/company');
    }
  }, [flagsLoading, isFeatureEnabled, router]);

  // Don't render anything while feature flags are loading
  if (flagsLoading) {
    return null;
  }

  // Don't render if campaigns are disabled
  if (!isFeatureEnabled('CAMPAIGNS_ENABLED')) {
    return null;
  }

  const handleCampaignAction = async (action: 'cancel' | 'regenerate') => {
    try {
      if (action === 'cancel') {
        await cancelCampaign();
      } else if (action === 'regenerate') {
        setConfirmRefreshModal(true);
      }
    } catch (err) {
      console.error(`Error performing ${action} on campaign:`, err);
      // Error handling is managed by the hook
    }
  };

  const confirmRefreshTargets = async () => {
    try {
      setRegeneratingTargets(true);
      await regenerateTargets();
      setConfirmRefreshModal(false);
    } catch (err) {
      console.error('Error regenerating targets:', err);
      // Error handling is managed by the hook
    } finally {
      setRegeneratingTargets(false);
    }
  };

  const handleStartCampaign = () => {
    setConfirmStartModal(true);
  };

  const confirmStartCampaign = async () => {
    try {
      await startCampaign();
      setConfirmStartModal(false);
    } catch (err) {
      console.error('Error starting campaign:', err);
      // Error handling is managed by the hook
    }
  };

  const handleCancelCampaign = () => {
    setConfirmCancelModal(true);
  };

  const confirmCancelCampaign = async () => {
    try {
      await cancelCampaign();
      setConfirmCancelModal(false);
    } catch (err) {
      console.error('Error cancelling campaign:', err);
      // Error handling is managed by the hook
    }
  };

  const handleDeleteTarget = async (targetId: number) => {
    const target = targets?.find((t) => t.id === targetId);
    setTargetToDelete({
      id: targetId,
      name: target?.name || target?.email || 'Unknown Target',
    });
    setConfirmDeleteModal(true);
  };

  const confirmDeleteTarget = async () => {
    if (!targetToDelete) return;

    try {
      setDeletingTargets((prev) => new Set(prev).add(targetToDelete.id));
      await deleteTarget(targetToDelete.id);
      // The hook will automatically update the targets list
    } catch (err) {
      console.error('Error deleting target:', err);
      // Error handling is managed by the hook
    } finally {
      setDeletingTargets((prev) => {
        const newSet = new Set(prev);
        newSet.delete(targetToDelete.id);
        return newSet;
      });
      setConfirmDeleteModal(false);
      setTargetToDelete(null);
    }
  };

  const handleAddManualTargets = async (applicantIds: number[]) => {
    try {
      setAddingManualTargets(true);
      const result = await addManualTargets(applicantIds);

      // Show success message or handle result
      console.log('Manual targets added:', result);
    } catch (err) {
      console.error('Error adding manual targets:', err);
      throw err;
    } finally {
      setAddingManualTargets(false);
    }
  };

  const getStatusBadgeColor = (status: CampaignStatus) => {
    switch (status) {
      case CampaignStatus.DRAFT:
        return 'secondary';
      case CampaignStatus.ACTIVE:
        return 'primary';
      case CampaignStatus.PAUSED:
        return 'info';
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
        return t('CAMPAIGN_TYPES.JOB_REACHOUT');
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
                <ChevronLeft />
              </Button>
              <div className="flex-grow-1">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <h1 className="h3 mb-0">{campaign.name}</h1>
                    <div className="d-flex align-items-center gap-2 mt-1">
                      <Badge color={getStatusBadgeColor(campaign.status || CampaignStatus.DRAFT)}>
                        {(campaign.status || CampaignStatus.DRAFT).toUpperCase()}
                      </Badge>
                      <span className="text-muted">•</span>
                      <span className="text-muted">{getCampaignTypeLabel(campaign.type)}</span>
                    </div>
                  </div>
                  <div className="d-flex gap-2">
                    {(campaign.status || CampaignStatus.DRAFT) === CampaignStatus.ACTIVE && (
                      <>
                        <Button color="info" size="sm" onClick={loadCampaign}>
                          <svg
                            width="14"
                            height="14"
                            className="me-1"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                            <path d="M21 3v5h-5" />
                            <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                            <path d="M3 21v-5h5" />
                          </svg>
                          {t('REFRESH')}
                        </Button>
                        <Button color="danger" size="sm" onClick={handleCancelCampaign}>
                          <Pause size={14} className="me-1" />
                          {t('CANCEL_CAMPAIGN')}
                        </Button>
                      </>
                    )}
                    {(campaign.status || CampaignStatus.DRAFT) === CampaignStatus.DRAFT && (
                      <>
                        <Button color="success" size="sm" onClick={handleStartCampaign}>
                          <Play size={14} className="me-1" />
                          {t('START_CAMPAIGN')}
                        </Button>
                        <Button
                          color="info"
                          size="sm"
                          onClick={() => handleCampaignAction('regenerate')}
                          disabled={regeneratingTargets}
                        >
                          {regeneratingTargets ? (
                            <>
                              <div className="spinner-border spinner-border-sm me-1" role="status">
                                <span className="visually-hidden">Loading...</span>
                              </div>
                              {t('REFRESHING_TARGETS')}
                            </>
                          ) : (
                            <>{t('REFRESH_TARGETS')}</>
                          )}
                        </Button>
                      </>
                    )}
                    {(campaign.status || CampaignStatus.DRAFT) === CampaignStatus.PAUSED && (
                      <Button color="success" size="sm" onClick={handleStartCampaign}>
                        <Play size={14} className="me-1" />
                        {t('RESUME_CAMPAIGN')}
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
              <Card className="border-0 shadow-sm h-100">
                <CardBody className="text-center py-4">
                  <h2 className="mb-2 fw-bold text-dark">{stats.totalTargets}</h2>
                  <small className="text-muted fw-semibold">{t('TOTAL_TARGETS')}</small>
                </CardBody>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="border-0 shadow-sm h-100">
                <CardBody className="text-center py-4">
                  <h2 className="mb-2 fw-bold text-primary">{stats.sentCount}</h2>
                  <small className="text-muted fw-semibold">{t('SENT')}</small>
                </CardBody>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="border-0 shadow-sm h-100">
                <CardBody className="text-center py-4">
                  <h2 className="mb-2 fw-bold text-success">{stats.deliveredCount}</h2>
                  <small className="text-muted fw-semibold">{t('DELIVERED')}</small>
                </CardBody>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="border-0 shadow-sm h-100">
                <CardBody className="text-center py-4">
                  <h2 className="mb-2 fw-bold text-danger">{stats.failedCount}</h2>
                  <small className="text-muted fw-semibold">{t('FAILED')}</small>
                </CardBody>
              </Card>
            </Col>
          </Row>
        )}

        {/* Tabs */}
        <Row>
          <Col>
            <Card className="shadow-sm">
              <CardHeader className="bg-white border-bottom">
                <Nav tabs className="card-header-tabs">
                  <NavItem>
                    <NavLink
                      className={`${
                        activeTab === 'overview' ? 'active bg-brand text-white' : 'text-dark'
                      } fw-semibold`}
                      onClick={() => setActiveTab('overview')}
                      style={{
                        cursor: 'pointer',
                        border: 'none',
                        borderRadius: '0.375rem 0.375rem 0 0',
                      }}
                    >
                      <BarChart size={16} className="me-2" />
                      {t('OVERVIEW')}
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      className={`${
                        activeTab === 'targets' ? 'active bg-brand text-white' : 'text-dark'
                      } fw-semibold`}
                      onClick={() => setActiveTab('targets')}
                      style={{
                        cursor: 'pointer',
                        border: 'none',
                        borderRadius: '0.375rem 0.375rem 0 0',
                      }}
                    >
                      <People size={16} className="me-2" />
                      {t('TARGETS')} ({targets?.length || 0})
                    </NavLink>
                  </NavItem>
                </Nav>
              </CardHeader>

              <CardBody className="p-4">
                <TabContent activeTab={activeTab}>
                  <TabPane tabId="overview">
                    <div className="mb-4">
                      <h5 className="fw-bold text-dark mb-3">Campaign Overview</h5>
                    </div>

                    <Row>
                      <Col md={6}>
                        <div className="bg-light rounded p-3 h-100">
                          <h6 className="fw-semibold text-dark mb-3">{t('CAMPAIGN_DETAILS')}</h6>
                          <dl className="row mb-0">
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
                            )}{' '}
                          </dl>
                        </div>
                      </Col>

                      <Col md={6}>
                        <div className="bg-light rounded p-3 h-100">
                          <h6 className="fw-semibold text-dark mb-3">{t('SUCCESS_METRICS')}</h6>
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
                                  <strong className="d-block text-primary">
                                    {stats.sentCount}
                                  </strong>
                                  <small className="text-muted">{t('MESSAGES_SENT')}</small>
                                </div>
                              </div>
                              <div className="col-6 mb-2">
                                <div className="border rounded p-2">
                                  <strong className="d-block text-success">
                                    {stats.deliveredCount}
                                  </strong>
                                  <small className="text-muted">
                                    {t('CAMPAIGN_STATES.DELIVERED')}
                                  </small>
                                </div>
                              </div>
                              <div className="col-6">
                                <div className="border rounded p-2">
                                  <strong className="d-block text-danger">
                                    {stats.failedCount}
                                  </strong>
                                  <small className="text-muted">
                                    {t('CAMPAIGN_STATES.FAILED')}
                                  </small>
                                </div>
                              </div>
                              <div className="col-6">
                                <div className="border rounded p-2">
                                  <strong className="d-block text-warning">
                                    {stats.pendingCount}
                                  </strong>
                                  <small className="text-muted">
                                    {t('CAMPAIGN_STATES.PENDING')}
                                  </small>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </Col>
                    </Row>
                  </TabPane>

                  <TabPane tabId="targets">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h5 className="fw-bold text-dark mb-0">
                        Campaign Targets ({targets?.length || 0})
                      </h5>
                      {(campaign?.status || CampaignStatus.DRAFT) === CampaignStatus.DRAFT && (
                        <div className="d-flex gap-2">
                          <Button
                            color="info"
                            size="sm"
                            onClick={() => handleCampaignAction('regenerate')}
                            disabled={regeneratingTargets}
                          >
                            {regeneratingTargets ? (
                              <>
                                <div
                                  className="spinner-border spinner-border-sm me-1"
                                  role="status"
                                >
                                  <span className="visually-hidden">Loading...</span>
                                </div>
                                {t('REFRESHING_TARGETS')}
                              </>
                            ) : (
                              <>{t('REFRESH_TARGETS')}</>
                            )}
                          </Button>
                          <Button
                            color="primary"
                            size="sm"
                            onClick={() => setManualTargetModal(true)}
                            disabled={regeneratingTargets || addingManualTargets}
                          >
                            {t('ADD_TARGETS')}
                          </Button>
                        </div>
                      )}
                    </div>

                    <div className="table-responsive">
                      <Table hover className="align-middle">
                        <thead className="table-light">
                          <tr>
                            <th className="fw-semibold">{t('NAME')}</th>
                            <th className="fw-semibold">{t('EMAIL')}</th>
                            <th className="fw-semibold">{t('PHONE')}</th>
                            <th className="fw-semibold">{t('STATUS')}</th>
                            <th className="fw-semibold">{t('PROCESSED_AT')}</th>
                            {(campaign?.status || CampaignStatus.DRAFT) ===
                              CampaignStatus.DRAFT && (
                              <th className="fw-semibold" style={{ width: '100px' }}>
                                {t('ACTIONS')}
                              </th>
                            )}
                          </tr>
                        </thead>
                        <tbody>
                          {targets?.map((target) => (
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
                              {(campaign?.status || CampaignStatus.DRAFT) ===
                                CampaignStatus.DRAFT && (
                                <td>
                                  <Button
                                    color="danger"
                                    size="sm"
                                    outline
                                    onClick={() => handleDeleteTarget(target.id)}
                                    disabled={deletingTargets.has(target.id)}
                                    title="Remove target from campaign"
                                  >
                                    {deletingTargets.has(target.id) ? (
                                      <>
                                        <div
                                          className="spinner-border spinner-border-sm me-1"
                                          role="status"
                                          style={{ width: '12px', height: '12px' }}
                                        >
                                          <span className="visually-hidden">Deleting...</span>
                                        </div>
                                        Removing...
                                      </>
                                    ) : (
                                      'Remove'
                                    )}
                                  </Button>
                                </td>
                              )}
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </div>

                    {(!targets || targets.length === 0) && (
                      <div className="text-center py-5">
                        <People size={48} className="text-muted mb-3" />
                        <h6 className="text-muted mb-2">No Targets Found</h6>
                        <p className="text-muted small mb-0">
                          {campaign?.status === CampaignStatus.DRAFT
                            ? "This campaign doesn't have any targets yet. Use the 'Refresh Targets' button to generate targets based on your campaign criteria."
                            : "This campaign doesn't have any targets yet."}
                        </p>
                        {campaign?.status === CampaignStatus.DRAFT && (
                          <div className="d-flex gap-2 justify-content-center mt-3">
                            <Button
                              color="primary"
                              size="sm"
                              onClick={() => handleCampaignAction('regenerate')}
                              disabled={regeneratingTargets}
                            >
                              {regeneratingTargets ? (
                                <>
                                  <div
                                    className="spinner-border spinner-border-sm me-1"
                                    role="status"
                                  >
                                    <span className="visually-hidden">Loading...</span>
                                  </div>
                                  {t('REFRESHING_TARGETS')}
                                </>
                              ) : (
                                <>{t('REFRESH_TARGETS')}</>
                              )}
                            </Button>
                            <Button
                              color="outline-primary"
                              size="sm"
                              onClick={() => setManualTargetModal(true)}
                              disabled={regeneratingTargets || addingManualTargets}
                            >
                              <People size={14} className="me-1" />
                              {t('ADD_TARGETS')}
                            </Button>
                          </div>
                        )}
                      </div>
                    )}
                  </TabPane>
                </TabContent>
              </CardBody>
            </Card>
          </Col>
        </Row>

        {/* Delete Confirmation Modal */}
        <ConfirmationModal
          isOpen={confirmDeleteModal}
          onClose={() => setConfirmDeleteModal(false)}
          onConfirm={confirmDeleteTarget}
          title="Confirm Target Removal"
          message={
            <div>
              <h6 className="mb-1">Remove Target from Campaign</h6>
              <p className="text-muted mb-0">
                Are you sure you want to remove <strong>{targetToDelete?.name}</strong> from this
                campaign?
              </p>
            </div>
          }
          confirmText="Remove"
          confirmButtonColor="danger"
          isLoading={targetToDelete ? deletingTargets.has(targetToDelete.id) : false}
          loadingText="Removing..."
          icon="danger"
          additionalContent={
            <div className="alert alert-warning">
              <small>
                <strong>Note:</strong> This action be reversed by refreshing the targets. The target
                will be removed from this campaign and will not receive any calls.
              </small>
            </div>
          }
        />

        {/* Start Campaign Confirmation Modal */}
        <ConfirmationModal
          isOpen={confirmStartModal}
          onClose={() => setConfirmStartModal(false)}
          onConfirm={confirmStartCampaign}
          title="Start Campaign"
          message={
            <div>
              <h6 className="mb-1">Start Campaign: {campaign?.name}</h6>
              <p className="text-muted mb-0">
                Are you sure you want to start this campaign? This will begin contacting all targets
                and the campaign will become live.
              </p>
            </div>
          }
          confirmText="Start Campaign"
          confirmButtonColor="success"
          isLoading={false}
          loadingText="Starting..."
          icon="success"
          additionalContent={
            <div className="alert alert-info">
              <small>
                <strong>Note:</strong> Once started, the campaign will begin immediately and targets
                will start receiving calls. You can pause the campaign at any time.
              </small>
            </div>
          }
        />

        {/* Cancel Campaign Confirmation Modal */}
        <ConfirmationModal
          isOpen={confirmCancelModal}
          onClose={() => setConfirmCancelModal(false)}
          onConfirm={confirmCancelCampaign}
          title="Cancel Campaign"
          message={
            <div>
              <h6 className="mb-1">Cancel Campaign: {campaign?.name}</h6>
              <p className="text-muted mb-0">
                Are you sure you want to cancel this campaign? This action cannot be undone and the
                campaign cannot be restarted.
              </p>
            </div>
          }
          confirmText="Cancel Campaign"
          confirmButtonColor="danger"
          isLoading={false}
          loadingText="Cancelling..."
          icon="danger"
          additionalContent={
            <div className="alert alert-warning">
              <small>
                <strong>Warning:</strong> Cancelling this campaign is permanent. All ongoing calls
                will be stopped immediately and you will need to create a new campaign to contact
                these targets again.
              </small>
            </div>
          }
        />

        {/* Refresh Targets Confirmation Modal */}
        <ConfirmationModal
          isOpen={confirmRefreshModal}
          onClose={() => setConfirmRefreshModal(false)}
          onConfirm={confirmRefreshTargets}
          title="Refresh Campaign Targets"
          message={
            <div>
              <h6 className="mb-1">Refresh Targets: {campaign?.name}</h6>
              <p className="text-muted mb-0">
                Are you sure you want to refresh the campaign targets? This will recreate all
                intended targets based on the current campaign criteria.
              </p>
            </div>
          }
          confirmText="Refresh Targets"
          confirmButtonColor="primary"
          isLoading={regeneratingTargets}
          loadingText="Refreshing..."
          icon="info"
          additionalContent={
            <div className="alert alert-info">
              <small>
                <strong>Note:</strong> This action will regenerate all targets based on your
                campaign criteria. Any previously deleted targets that still meet the eligibility
                requirements will be re-added to the campaign. The target list will be updated to
                reflect any changes in your driver database or campaign settings.
              </small>
            </div>
          }
        />

        {/* Manual Target Selection Modal */}
        <ManualTargetSelectionModal
          isOpen={manualTargetModal}
          onClose={() => setManualTargetModal(false)}
          onAddTargets={handleAddManualTargets}
          loading={addingManualTargets}
        />
      </Container>
    </PageLayout>
  );
};

CampaignDetailPage.getLayout = function getLayout(page) {
  return <FullLayout>{page}</FullLayout>;
};

export default CampaignDetailPage;
