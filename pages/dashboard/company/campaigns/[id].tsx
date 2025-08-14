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
  TelephoneFill,
  ChatDotsFill,
  PencilSquare,
  CheckLg,
} from 'react-bootstrap-icons';

import FullLayout from '../../../../components/dashboard/layouts/layout/full-layout';
import PageLayout from '../../../../components/layouts/page/page-layout';
import { ConfirmationModal } from '../../../../components/shared';
import { useFeatureFlags } from '../../../../context/feature-flag-context';
import { useUserContext } from '../../../../context/user-context';
import { useAuth } from '../../../../hooks/use-auth';
import { useTranslation } from '../../../../hooks/use-translation';
import { useCampaign } from '../../../../hooks/campaigns/use-campaigns';
import { CampaignStatus } from '../../../../enums/campaigns/campaign-status.enum';
import { CampaignType } from '../../../../enums/campaigns/campaign-type.enum';
import { CampaignCommunicationType } from '../../../../enums/campaigns/campaign-communication-type.enum';
import { CampaignTargetType } from '../../../../enums/campaigns/campaign-target-type.enum';
import { CampaignConfigDisplay } from '../../../../components/campaigns';
import {
  CampaignOverview,
  CampaignTargetList,
  CampaignTestView,
} from '../../../../components/campaigns/detail';
import { AdminCampaignTest } from '../../../../components/campaigns/detail/AdminCampaignTest';
import { ManualTargetSelectionModal } from '../../../../components/campaigns/ManualTargetSelectionModal';
import CampaignsApi from '../../../../pages/api/campaigns';

const CampaignDetailPage = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { id } = router.query;
  const { isFeatureEnabled, isLoading: flagsLoading } = useFeatureFlags();
  const { user, isSuperAdmin } = useAuth();

  console.log(user, isSuperAdmin);

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
  const [editingCommunicationType, setEditingCommunicationType] = useState(false);
  const [selectedCommunicationType, setSelectedCommunicationType] =
    useState<CampaignCommunicationType>(
      campaign?.communicationType || CampaignCommunicationType.VOICE
    );
  const [updatingCommunicationType, setUpdatingCommunicationType] = useState(false);

  // Test campaign state
  const [addingTestTarget, setAddingTestTarget] = useState(false);
  const [sendingTest, setSendingTest] = useState(false);
  const [testSent, setTestSent] = useState(false);
  const [testError, setTestError] = useState<string | null>(null);

  // Feature flag check - only redirect after flags are loaded
  useEffect(() => {
    if (!flagsLoading && !isFeatureEnabled('CAMPAIGNS_ENABLED')) {
      router.push('/dashboard/company');
    }
  }, [flagsLoading, isFeatureEnabled, router]);

  // Update selected communication type when campaign loads
  useEffect(() => {
    if (campaign?.communicationType) {
      setSelectedCommunicationType(campaign.communicationType);
    }
  }, [campaign?.communicationType]);

  // Don't render anything while feature flags are loading
  if (flagsLoading) {
    return null;
  }

  // Don't render if campaigns are disabled
  if (!isFeatureEnabled('CAMPAIGNS_ENABLED')) {
    return null;
  }

  // Test campaign handlers
  const handleAddTestTarget = async () => {
    try {
      setAddingTestTarget(true);
      setTestError(null);

      const campaignsApi = new CampaignsApi();
      await campaignsApi.addTestUserToCampaign(campaignId);

      // Refresh campaign data to update targets
      await loadCampaign();
      setTestSent(false); // Reset test sent status when adding new test target
    } catch (error: any) {
      console.error('Error adding test target:', error);
      setTestError(error.message || 'Failed to add test target');
    } finally {
      setAddingTestTarget(false);
    }
  };

  const handleSendTest = async () => {
    try {
      setSendingTest(true);
      setTestError(null);

      const campaignsApi = new CampaignsApi();
      await campaignsApi.sendTestCampaign(campaignId);

      setTestSent(true);
    } catch (error: any) {
      console.error('Error sending test:', error);
      setTestError(error.message || 'Failed to send test campaign');
    } finally {
      setSendingTest(false);
    }
  };

  const getUserPhoneNumber = () => {
    return user?.contact_number || user?.cell_number || 'No phone number';
  };

  const hasPhoneNumber = () => {
    return !!(user?.contact_number || user?.cell_number);
  };

  // Helper function to filter out test targets
  const getNonTestTargets = () => {
    return targets?.filter((target) => !target.isTest) || [];
  };

  // Helper function to check if current user is already a test target
  const isCurrentUserTestTarget = () => {
    return targets?.some((target) => target.isTest && target.targetId === user?.id) || false;
  };

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

  const handleUpdateCommunicationType = async () => {
    if (!campaign || selectedCommunicationType === campaign.communicationType) {
      setEditingCommunicationType(false);
      return;
    }

    try {
      setUpdatingCommunicationType(true);
      const campaignsApi = new CampaignsApi();
      await campaignsApi.update(campaign.id, {
        communicationType: selectedCommunicationType,
      });

      // Refresh campaign data
      await loadCampaign();
      setEditingCommunicationType(false);
    } catch (err) {
      console.error('Error updating communication type:', err);
      // Reset to original value
      setSelectedCommunicationType(campaign.communicationType);
    } finally {
      setUpdatingCommunicationType(false);
    }
  };

  const cancelEditCommunicationType = () => {
    setSelectedCommunicationType(campaign?.communicationType || CampaignCommunicationType.VOICE);
    setEditingCommunicationType(false);
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
        return t(type);
    }
  };

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString();
  };

  const addCurrentUserAsTestTarget = () => {
    if (!user || !campaign) return;

    // Add current user as a test target for the campaign
    const testTarget = {
      id: Date.now(), // Temporary ID for UI
      campaignId: campaign.id,
      targetType: CampaignTargetType.LEAD, // Use 'lead' type for test users
      targetId: user.id,
      name: `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'Test User',
      email: user.email,
      phone: user.cell_number || '+1234567890', // Fallback for testing
      status: 'pending',
      processed: false,
      failed: false,
      isTest: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // This would typically be done via API call to actually add the test target
    // For now, we'll just update the local state for UI purposes
    if (campaign.targets) {
      campaign.targets.push(testTarget as any);
    } else {
      campaign.targets = [testTarget as any];
    }
  };

  const calculateSuccessRate = () => {
    if (!stats || stats.totalTargets === 0) return 0;
    return Math.round((stats.deliveredCount / stats.totalTargets) * 100);
  };

  const getTargetStatus = (target: any) => {
    if (!target.processed) {
      return 'pending';
    } else if (target.failed) {
      return 'failed';
    } else {
      return 'delivered';
    }
  };

  const getTargetStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'success';
      case 'failed':
        return 'danger';
      case 'sent':
        return 'primary';
      case 'pending':
      default:
        return 'secondary';
    }
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

  console.log(campaign, isSuperAdmin && campaign.type === CampaignType.JOB_REACHOUT);

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
                    <h1 className="h3 mb-0">
                      {campaign.communicationType === CampaignCommunicationType.SMS ? (
                        <ChatDotsFill className="text-success me-2" size={24} />
                      ) : (
                        <TelephoneFill className="text-primary me-2" size={24} />
                      )}
                      {campaign.name}
                    </h1>
                    <div className="d-flex align-items-center gap-2 mt-1">
                      <Badge color={getStatusBadgeColor(campaign.status || CampaignStatus.DRAFT)}>
                        {(campaign.status || CampaignStatus.DRAFT).toUpperCase()}
                      </Badge>
                      <span className="text-muted">•</span>
                      <span className="text-muted">{getCampaignTypeLabel(campaign.type)}</span>
                      <span className="text-muted">•</span>
                      <span className="text-muted">
                        {campaign.communicationType === CampaignCommunicationType.SMS
                          ? 'SMS'
                          : 'Voice'}
                      </span>
                    </div>
                  </div>
                  <div className="d-flex gap-2">
                    {(campaign.status || CampaignStatus.DRAFT) === CampaignStatus.ACTIVE && (
                      <>
                        <Button color="info" size="sm" onClick={loadCampaign}>
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
                      {t('TARGETS')} ({getNonTestTargets().length})
                    </NavLink>
                  </NavItem>
                </Nav>
              </CardHeader>

              <CardBody className="p-4">
                <TabContent activeTab={activeTab}>
                  <TabPane tabId="overview">
                    <CampaignOverview
                      campaign={campaign}
                      stats={stats}
                      editingCommunicationType={editingCommunicationType}
                      selectedCommunicationType={selectedCommunicationType}
                      updatingCommunicationType={updatingCommunicationType}
                      t={t}
                      getStatusBadgeColor={getStatusBadgeColor}
                      getCampaignTypeLabel={getCampaignTypeLabel}
                      formatDate={formatDate}
                      calculateSuccessRate={calculateSuccessRate}
                      setEditingCommunicationType={setEditingCommunicationType}
                      setSelectedCommunicationType={setSelectedCommunicationType}
                      handleUpdateCommunicationType={handleUpdateCommunicationType}
                      cancelEditCommunicationType={cancelEditCommunicationType}
                    />

                    {/* Test Campaign Section */}
                    <CampaignTestView
                      campaign={campaign}
                      user={user}
                      addingTestTarget={addingTestTarget}
                      sendingTest={sendingTest}
                      testSent={testSent}
                      testError={testError}
                      isCurrentUserTestTarget={isCurrentUserTestTarget}
                      getUserPhoneNumber={getUserPhoneNumber}
                      hasPhoneNumber={hasPhoneNumber}
                      handleAddTestTarget={handleAddTestTarget}
                      handleSendTest={handleSendTest}
                    />

                    {/* Admin Test Campaign Section - Super Admin Only */}
                    {isSuperAdmin && campaign.type === CampaignType.JOB_REACHOUT && (
                      <AdminCampaignTest
                        campaign={campaign}
                        onAddTestTarget={addCurrentUserAsTestTarget}
                      />
                    )}
                  </TabPane>

                  <TabPane tabId="targets">
                    <CampaignTargetList
                      campaign={campaign}
                      nonTestTargets={getNonTestTargets()}
                      regeneratingTargets={regeneratingTargets}
                      deletingTargets={deletingTargets}
                      t={t}
                      getTargetStatus={getTargetStatus}
                      getTargetStatusBadgeColor={getTargetStatusBadgeColor}
                      formatDate={formatDate}
                      handleCampaignAction={handleCampaignAction}
                      handleDeleteTarget={handleDeleteTarget}
                      setManualTargetModal={setManualTargetModal}
                    />
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
                {selectedCommunicationType === CampaignCommunicationType.SMS
                  ? 'Are you sure you want to start this campaign? This will begin sending SMS messages to all targets and the campaign will become live.'
                  : 'Are you sure you want to start this campaign? This will begin contacting all targets by phone and the campaign will become live.'}
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
                <strong>Note:</strong> Once started, the campaign will begin immediately and targets will start receiving {selectedCommunicationType === CampaignCommunicationType.SMS ? 'texts' : 'calls'}. You can pause the campaign at any time.
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
