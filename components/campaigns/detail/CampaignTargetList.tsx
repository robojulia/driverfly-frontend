import React from 'react';
import { Row, Col, Button, Table, Badge } from 'reactstrap';
import { People } from 'react-bootstrap-icons';

import { CampaignEntity } from '../../../models/campaigns/campaign.entity';
import { CampaignTargetEntity } from '../../../models/campaigns/campaign-target.entity';
import { CampaignStatus } from '../../../enums/campaigns/campaign-status.enum';

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
}) => {
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
        <Table hover className="align-middle">
          <thead className="table-light">
            <tr>
              <th className="fw-semibold">{t('NAME')}</th>
              <th className="fw-semibold">{t('EMAIL')}</th>
              <th className="fw-semibold">{t('PHONE')}</th>
              <th className="fw-semibold">{t('STATUS')}</th>
              <th className="fw-semibold">{t('PROCESSED_AT')}</th>
              {(campaign?.status || CampaignStatus.DRAFT) === CampaignStatus.DRAFT && (
                <th className="fw-semibold" style={{ width: '100px' }}>
                  {t('ACTIONS')}
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {nonTestTargets.map((target) => {
              const targetStatus = getTargetStatus(target);
              return (
                <tr key={target.id}>
                  <td>{target.name || '-'}</td>
                  <td>{target.email || '-'}</td>
                  <td>{target.phone || '-'}</td>
                  <td>
                    <Badge color={getTargetStatusBadgeColor(targetStatus)}>
                      {targetStatus.toUpperCase()}
                    </Badge>
                  </td>
                  <td>{target.processedAt ? formatDate(target.processedAt) : '-'}</td>
                  {(campaign?.status || CampaignStatus.DRAFT) === CampaignStatus.DRAFT && (
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
    </>
  );
};
