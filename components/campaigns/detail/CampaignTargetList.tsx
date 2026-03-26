import React from 'react';
import { useRouter } from 'next/router';
import { Row, Col, Button, Table, Badge, Modal, ModalHeader, ModalBody } from 'reactstrap';
import {
  People,
  ExclamationTriangle,
  CheckCircleFill,
  XCircleFill,
  QuestionCircleFill,
  LightbulbFill,
  ChatLeftTextFill,
} from 'react-bootstrap-icons';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

import { CampaignEntity } from '../../../models/campaigns/campaign.entity';
import { CampaignTargetEntity } from '../../../models/campaigns/campaign-target.entity';
import { CampaignStatus } from '../../../enums/campaigns/campaign-status.enum';
import { CampaignTargetType } from '../../../enums/campaigns/campaign-target-type.enum';
import { CampaignTargetStatus } from '../../../enums/campaigns/campaign-target-status.enum';

// AI Campaign Call Summary interface
interface CampaignCallSummary {
  summary: string;
  keyPoints: string[];
  outcome: 'positive' | 'negative' | 'neutral' | 'unclear';
  confidence: 'high' | 'medium' | 'low';
  recommendedActions?: string[];
  metadata?: {
    generatedAt?: string;
    conversationLength?: number;
    tokensUsed?: number;
  };
}

interface CampaignTargetListProps {
  campaign: CampaignEntity;
  nonTestTargets: CampaignTargetEntity[];
  regeneratingTargets: boolean;
  deletingTargets: Set<number>;
  t: (key: string) => string;
  getTargetStatus: (target: any) => string;
  getTargetStatusBadgeColor: (status: string) => string;
  formatDate: (date: string | Date) => string;
  handleCampaignAction: (action: 'regenerate') => void;
  handleDeleteTarget: (targetId: number) => void;
  setManualTargetModal: (open: boolean) => void;
  onCreateProfiles?: () => void;
  creatingProfiles?: boolean;
  isSuperAdmin?: boolean;
}

export const CampaignTargetList: React.FC<CampaignTargetListProps> = ({
  campaign,
  nonTestTargets,
  regeneratingTargets,
  deletingTargets,
  t,
  getTargetStatus,
  getTargetStatusBadgeColor,
  formatDate,
  handleCampaignAction,
  handleDeleteTarget,
  setManualTargetModal,
  onCreateProfiles,
  creatingProfiles = false,
  isSuperAdmin = false,
}) => {
  const router = useRouter();
  const [hoveredButton, setHoveredButton] = React.useState<number | null>(null);
  const [selectedTarget, setSelectedTarget] = React.useState<CampaignTargetEntity | null>(null);

  const leadTargets = nonTestTargets.filter(
    (t) => t.targetType === CampaignTargetType.LEAD
  );

  // Helper to get outcome badge color
  const getOutcomeBadgeColor = (outcome?: string) => {
    switch (outcome) {
      case 'positive':
        return 'success';
      case 'negative':
        return 'danger';
      case 'neutral':
        return 'secondary';
      default:
        return 'warning';
    }
  };

  // Helper to get outcome icon
  const getOutcomeIcon = (outcome?: string) => {
    switch (outcome) {
      case 'positive':
        return <CheckCircleFill className="me-1" />;
      case 'negative':
        return <XCircleFill className="me-1" />;
      default:
        return <QuestionCircleFill className="me-1" />;
    }
  };

  // Helper to get confidence badge color
  const getConfidenceBadgeColor = (confidence?: string) => {
    switch (confidence) {
      case 'high':
        return 'success';
      case 'medium':
        return 'warning';
      case 'low':
        return 'secondary';
      default:
        return 'light';
    }
  };

  const handleTargetClick = (target: CampaignTargetEntity) => {
    if (target.targetType === CampaignTargetType.APPLICANT) {
      router.push(`/dashboard/company/applicants/${target.targetId}`);
    } else if (target.targetType === CampaignTargetType.EMPLOYEE) {
      router.push(`/dashboard/company/compliance/employee-directory/${target.targetId}`);
    }
  };

  const getViewResultsStyle = (targetId: number) => {
    if (hoveredButton === targetId) {
      return {
        background: 'linear-gradient(135deg, #30c6c2 0%, #006078 100%)',
        borderColor: 'transparent',
        color: 'white',
        transition: 'all 0.3s ease',
      };
    }
    return {
      transition: 'all 0.3s ease',
    };
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h5 className="fw-bold text-dark mb-0">Campaign Targets ({nonTestTargets.length})</h5>
          {leadTargets.length > 0 && (
            <small className="text-muted">
              {leadTargets.length} manually uploaded lead{leadTargets.length !== 1 ? 's' : ''} without driver profiles
            </small>
          )}
        </div>
        <div className="d-flex gap-2">
          {leadTargets.length > 0 && onCreateProfiles && (
            <Button
              color="success"
              size="sm"
              onClick={onCreateProfiles}
              disabled={creatingProfiles || regeneratingTargets}
              title="Create driver profiles for manually uploaded leads so notes from calls can be stored"
            >
              {creatingProfiles ? (
                <>
                  <div className="spinner-border spinner-border-sm me-1" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  Creating Profiles...
                </>
              ) : (
                <>Create Driver Profiles ({leadTargets.length})</>
              )}
            </Button>
          )}
          {(campaign?.status || CampaignStatus.DRAFT) === CampaignStatus.DRAFT && (
            <>
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
              <Button
                color="primary"
                size="sm"
                onClick={() => setManualTargetModal(true)}
                disabled={regeneratingTargets}
              >
                {t('ADD_TARGETS')}
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="table-responsive">
        <Table className="align-middle">
          <thead className="table-light">
            <tr>
              {isSuperAdmin && (
                <th className="fw-semibold" style={{ width: '80px' }}>
                  <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip id="superadmin-tooltip">Superadmin visible only</Tooltip>}
                  >
                    <span style={{ cursor: 'help' }}>
                      ID <ExclamationTriangle size={14} className="text-warning ms-1" />
                    </span>
                  </OverlayTrigger>
                </th>
              )}
              <th className="fw-semibold">{t('NAME')}</th>
              <th className="fw-semibold">{t('EMAIL')}</th>
              <th className="fw-semibold">{t('PHONE')}</th>
              <th className="fw-semibold">{t('STATUS')}</th>
              <th className="fw-semibold">{t('PROCESSED_AT')}</th>
              <th className="fw-semibold" style={{ width: '150px' }}>
                {t('ACTIONS')}
              </th>
            </tr>
          </thead>
          <tbody>
            {nonTestTargets.map((target) => {
              const targetStatus = getTargetStatus(target);
              return (
                <tr key={target.id}>
                  {isSuperAdmin && (
                    <td>
                      <code className="text-muted small">{target.id}</code>
                    </td>
                  )}
                  <td>
                    {target.targetType === CampaignTargetType.LEAD ? (
                      <div>
                        <span className="fw-semibold text-dark">{target.name || '-'}</span>
                        <br />
                        <small className="text-warning">No profile yet</small>
                      </div>
                    ) : (
                      <span
                        onClick={() => handleTargetClick(target)}
                        style={{ cursor: 'pointer', color: '#1d4355', textDecoration: 'underline' }}
                        className="fw-semibold"
                      >
                        {target.name || '-'}
                      </span>
                    )}
                  </td>
                  <td>{target.email || '-'}</td>
                  <td>{target.phone || '-'}</td>
                  <td>
                    <Badge color={getTargetStatusBadgeColor(targetStatus)}>
                      {targetStatus.toUpperCase()}
                    </Badge>
                  </td>
                  <td>{target.processedAt ? formatDate(target.processedAt) : '-'}</td>
                  <td>
                    <div className="d-flex gap-2">
                      {targetStatus.toLowerCase() === CampaignTargetStatus.DELIVERED.toLowerCase() && (
                        <Button
                          color="info"
                          size="sm"
                          outline
                          style={getViewResultsStyle(target.id)}
                          onMouseEnter={() => setHoveredButton(target.id)}
                          onMouseLeave={() => setHoveredButton(null)}
                          onClick={() => setSelectedTarget(target)}
                          title="View campaign results for this target"
                        >
                          View Results
                        </Button>
                      )}
                      {(campaign?.status || CampaignStatus.DRAFT) === CampaignStatus.DRAFT && (
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
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div>

      {nonTestTargets.length === 0 && (
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
                    <div className="spinner-border spinner-border-sm me-1" role="status">
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
                disabled={regeneratingTargets}
              >
                <People size={14} className="me-1" />
                {t('ADD_TARGETS')}
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Communication Summary Modal */}
      <Modal isOpen={!!selectedTarget} toggle={() => setSelectedTarget(null)} centered size="lg">
        <ModalHeader toggle={() => setSelectedTarget(null)}>
          <ChatLeftTextFill className="me-2" />
          Communication Summary - {selectedTarget?.name || 'Unknown'}
        </ModalHeader>
        <ModalBody>
          {selectedTarget && (
            <>
              {/* Call Outcome Section */}
              <div className="mb-4">
                <h6 className="fw-semibold text-muted mb-3">Call Outcome</h6>
                <div className="d-flex gap-3 align-items-center">
                  <Badge color={selectedTarget.failed ? 'danger' : 'success'} className="px-3 py-2">
                    {selectedTarget.failed ? 'Failed' : 'Success'}
                  </Badge>
                  {selectedTarget.metadata?.outcomeReason && (
                    <span className="text-muted">
                      Reason: <strong>{selectedTarget.metadata.outcomeReason}</strong>
                    </span>
                  )}
                  {selectedTarget.processedAt && (
                    <span className="text-muted small">
                      {formatDate(selectedTarget.processedAt)}
                    </span>
                  )}
                </div>
              </div>

              {/* AI Summary Section */}
              {selectedTarget.metadata?.campaignCallSummary ? (
                <>
                  {/* Summary */}
                  <div className="mb-4">
                    <h6 className="fw-semibold text-muted mb-2">
                      <LightbulbFill className="me-2 text-warning" />
                      AI Summary
                    </h6>
                    <div className="bg-light p-3 rounded border">
                      <p className="mb-2">
                        {(selectedTarget.metadata.campaignCallSummary as CampaignCallSummary).summary}
                      </p>
                      <div className="d-flex gap-2">
                        <Badge
                          color={getOutcomeBadgeColor(
                            (selectedTarget.metadata.campaignCallSummary as CampaignCallSummary).outcome
                          )}
                        >
                          {getOutcomeIcon(
                            (selectedTarget.metadata.campaignCallSummary as CampaignCallSummary).outcome
                          )}
                          {(selectedTarget.metadata.campaignCallSummary as CampaignCallSummary).outcome?.toUpperCase()}
                        </Badge>
                        <Badge
                          color={getConfidenceBadgeColor(
                            (selectedTarget.metadata.campaignCallSummary as CampaignCallSummary).confidence
                          )}
                          className="text-dark"
                        >
                          {(selectedTarget.metadata.campaignCallSummary as CampaignCallSummary).confidence?.toUpperCase()}{' '}
                          confidence
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Key Points */}
                  {(selectedTarget.metadata.campaignCallSummary as CampaignCallSummary).keyPoints?.length > 0 && (
                    <div className="mb-4">
                      <h6 className="fw-semibold text-muted mb-2">Key Points</h6>
                      <ul className="mb-0">
                        {(selectedTarget.metadata.campaignCallSummary as CampaignCallSummary).keyPoints.map(
                          (point, index) => (
                            <li key={index} className="mb-1">
                              {point}
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  )}

                  {/* Recommended Actions */}
                  {(selectedTarget.metadata.campaignCallSummary as CampaignCallSummary).recommendedActions?.length >
                    0 && (
                    <div className="mb-4">
                      <h6 className="fw-semibold text-muted mb-2">Recommended Actions</h6>
                      <ul className="mb-0">
                        {(
                          selectedTarget.metadata.campaignCallSummary as CampaignCallSummary
                        ).recommendedActions?.map((action, index) => (
                          <li key={index} className="mb-1 text-primary">
                            {action}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Metadata */}
                  {(selectedTarget.metadata.campaignCallSummary as CampaignCallSummary).metadata && (
                    <div className="text-muted small border-top pt-3">
                      <span>
                        Generated:{' '}
                        {(selectedTarget.metadata.campaignCallSummary as CampaignCallSummary).metadata
                          ?.generatedAt
                          ? formatDate(
                              (selectedTarget.metadata.campaignCallSummary as CampaignCallSummary).metadata
                                ?.generatedAt as string
                            )
                          : 'Unknown'}
                      </span>
                      {(selectedTarget.metadata.campaignCallSummary as CampaignCallSummary).metadata
                        ?.conversationLength && (
                        <span className="ms-3">
                          Conversation Items:{' '}
                          {
                            (selectedTarget.metadata.campaignCallSummary as CampaignCallSummary).metadata
                              ?.conversationLength
                          }
                        </span>
                      )}
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-4">
                  <QuestionCircleFill size={32} className="text-muted mb-3" />
                  <p className="text-muted mb-0">
                    No AI summary available for this communication.
                  </p>
                  {selectedTarget.metadata?.entities && (
                    <div className="mt-3 text-start">
                      <h6 className="fw-semibold text-muted mb-2">Collected Data</h6>
                      <pre className="bg-light p-3 rounded small">
                        {JSON.stringify(selectedTarget.metadata.entities, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </ModalBody>
      </Modal>
    </>
  );
};
