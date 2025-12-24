import React from 'react';
import { useRouter } from 'next/router';
import { Row, Col, Button, Table, Badge, Modal, ModalHeader, ModalBody } from 'reactstrap';
import { People, ExclamationTriangle } from 'react-bootstrap-icons';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

import { CampaignEntity } from '../../../models/campaigns/campaign.entity';
import { CampaignTargetEntity } from '../../../models/campaigns/campaign-target.entity';
import { CampaignStatus } from '../../../enums/campaigns/campaign-status.enum';
import { CampaignTargetType } from '../../../enums/campaigns/campaign-target-type.enum';
import { CampaignTargetStatus } from '../../../enums/campaigns/campaign-target-status.enum';

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
  isSuperAdmin = false,
}) => {
  const router = useRouter();
  const [hoveredButton, setHoveredButton] = React.useState<number | null>(null);
  const [showResultsModal, setShowResultsModal] = React.useState(false);

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
        <h5 className="fw-bold text-dark mb-0">Campaign Targets ({nonTestTargets.length})</h5>
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
          </div>
        )}
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
                    <span
                      onClick={() => handleTargetClick(target)}
                      style={{ cursor: 'pointer', color: '#1d4355', textDecoration: 'underline' }}
                      className="fw-semibold"
                    >
                      {target.name || '-'}
                    </span>
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
                          onClick={() => setShowResultsModal(true)}
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
      <Modal isOpen={showResultsModal} toggle={() => setShowResultsModal(false)} centered>
        <ModalHeader toggle={() => setShowResultsModal(false)}>
          Communication Summary
        </ModalHeader>
        <ModalBody>
          <div className="text-center py-4">
            <p className="text-muted mb-0">Coming soon</p>
          </div>
        </ModalBody>
      </Modal>
    </>
  );
};
