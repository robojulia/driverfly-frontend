import React from 'react';
import { Row, Col, Badge, Button } from 'reactstrap';
import { TelephoneFill, ChatDotsFill, PencilSquare, CheckLg, X } from 'react-bootstrap-icons';

import { CampaignEntity } from '../../../models/campaigns/campaign.entity';
import { CampaignStatus } from '../../../enums/campaigns/campaign-status.enum';
import { CampaignType } from '../../../enums/campaigns/campaign-type.enum';
import { CampaignCommunicationType } from '../../../enums/campaigns/campaign-communication-type.enum';
import { CampaignStatsResponse } from '../../../pages/api/campaigns';

interface CampaignOverviewProps {
  campaign: CampaignEntity;
  stats: CampaignStatsResponse | null;
  editingCommunicationType: boolean;
  selectedCommunicationType: CampaignCommunicationType;
  updatingCommunicationType: boolean;
  callCampaignsEnabled: boolean;
  t: (key: string) => string;
  getStatusBadgeColor: (status: CampaignStatus) => string;
  getCampaignTypeLabel: (type: CampaignType) => string;
  formatDate: (date: string | Date) => string;
  calculateSuccessRate: () => number;
  setEditingCommunicationType: (editing: boolean) => void;
  setSelectedCommunicationType: (type: CampaignCommunicationType) => void;
  handleUpdateCommunicationType: () => Promise<void>;
  cancelEditCommunicationType: () => void;
}

export const CampaignOverview: React.FC<CampaignOverviewProps> = ({
  campaign,
  stats,
  editingCommunicationType,
  selectedCommunicationType,
  updatingCommunicationType,
  callCampaignsEnabled,
  t,
  getStatusBadgeColor,
  getCampaignTypeLabel,
  formatDate,
  calculateSuccessRate,
  setEditingCommunicationType,
  setSelectedCommunicationType,
  handleUpdateCommunicationType,
  cancelEditCommunicationType,
}) => {
  return (
    <>
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
              <dt className="col-sm-4">Communication:</dt>
              <dd className="col-sm-8">
                {editingCommunicationType && campaign.status === CampaignStatus.DRAFT ? (
                  <div className="d-flex align-items-center gap-2">
                    <div className="d-flex gap-2">
                      <Button
                        size="sm"
                        color={
                          selectedCommunicationType === CampaignCommunicationType.VOICE
                            ? 'primary'
                            : 'outline-secondary'
                        }
                        disabled={!callCampaignsEnabled}
                        onClick={() =>
                          setSelectedCommunicationType(CampaignCommunicationType.VOICE)
                        }
                      >
                        <TelephoneFill size={14} className="me-1" />
                        Voice
                      </Button>
                      <Button
                        size="sm"
                        color={
                          selectedCommunicationType === CampaignCommunicationType.SMS
                            ? 'success'
                            : 'outline-secondary'
                        }
                        onClick={() => setSelectedCommunicationType(CampaignCommunicationType.SMS)}
                      >
                        <ChatDotsFill size={14} className="me-1" />
                        SMS
                      </Button>
                    </div>
                    <div className="d-flex gap-1">
                      <Button
                        size="sm"
                        color="success"
                        onClick={handleUpdateCommunicationType}
                        disabled={updatingCommunicationType}
                      >
                        <CheckLg size={12} />
                      </Button>
                      <Button
                        size="sm"
                        color="secondary"
                        onClick={cancelEditCommunicationType}
                        disabled={updatingCommunicationType}
                      >
                        <X size={12} />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="d-flex align-items-center gap-2">
                    <span>
                      {campaign.communicationType === CampaignCommunicationType.SMS ? (
                        <>
                          <ChatDotsFill className="text-success me-1" size={14} />
                          SMS Campaign
                        </>
                      ) : (
                        <>
                          <TelephoneFill className="text-primary me-1" size={14} />
                          Voice Campaign
                        </>
                      )}
                    </span>
                    {campaign.status === CampaignStatus.DRAFT && callCampaignsEnabled && (
                      <Button
                        size="sm"
                        color="link"
                        className="p-0 text-muted"
                        onClick={() => setEditingCommunicationType(true)}
                      >
                        <PencilSquare size={12} />
                      </Button>
                    )}
                  </div>
                )}
              </dd>
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
                    <strong className="d-block text-primary">{stats.sentCount}</strong>
                    <small className="text-muted">{t('MESSAGES_SENT')}</small>
                  </div>
                </div>
                <div className="col-6 mb-2">
                  <div className="border rounded p-2">
                    <strong className="d-block text-success">{stats.deliveredCount}</strong>
                    <small className="text-muted">{t('CAMPAIGN_STATES.DELIVERED')}</small>
                  </div>
                </div>
                <div className="col-6">
                  <div className="border rounded p-2">
                    <strong className="d-block text-danger">{stats.failedCount}</strong>
                    <small className="text-muted">{t('CAMPAIGN_STATES.FAILED')}</small>
                  </div>
                </div>
                <div className="col-6">
                  <div className="border rounded p-2">
                    <strong className="d-block text-warning">{stats.pendingCount}</strong>
                    <small className="text-muted">{t('CAMPAIGN_STATES.PENDING')}</small>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Col>
      </Row>
    </>
  );
};
