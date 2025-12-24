import React from 'react';
import { Card, CardBody, CardHeader, Button, Badge } from 'reactstrap';
import { Eye, Pause, Play, TelephoneFill, ChatDotsFill } from 'react-bootstrap-icons';
import { useRouter } from 'next/router';
import { useTranslation } from '../../hooks/use-translation';
import { CampaignEntity } from '../../models/campaigns/campaign.entity';
import { CampaignStatus } from '../../enums/campaigns/campaign-status.enum';
import { CampaignType } from '../../enums/campaigns/campaign-type.enum';
import { CampaignCommunicationType } from '../../enums/campaigns/campaign-communication-type.enum';
import styles from '../../styles/campaigns.module.css';

interface CampaignCardProps {
  campaign: CampaignEntity;
  onAction?: (campaignId: number, action: 'cancel' | 'regenerate') => Promise<void>;
}

export const CampaignCard: React.FC<CampaignCardProps> = ({ campaign, onAction }) => {
  const router = useRouter();
  const { t } = useTranslation();

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
      case CampaignStatus.FAILED:
        return 'danger';
      default:
        return 'secondary';
    }
  };

  const getCampaignTypeLabel = (type: CampaignType) => {
    switch (type) {
      case CampaignType.REIGNITE_PAST_LEADS:
        return t('REIGNITE_PAST_LEADS_CAMPAIGN');
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

  const isDraft = (campaign.status || CampaignStatus.DRAFT) === CampaignStatus.DRAFT;

  const handleAction = async (action: 'cancel' | 'regenerate') => {
    if (onAction) {
      await onAction(campaign.id, action);
    }
  };

  return (
    <Card className={`h-100 ${styles.campaignCard}`}>
      <CardHeader className="bg-white border-bottom">
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <h6
              className="mb-1 font-weight-bold"
              onClick={() => router.push(`/dashboard/company/campaigns/${campaign.id}`)}
            >
              {campaign.communicationType === CampaignCommunicationType.SMS ? (
                <ChatDotsFill className="me-2 text-success" size={16} />
              ) : (
                <TelephoneFill className="me-2 text-primary" size={16} />
              )}
              {campaign.name}
            </h6>
            <small className="text-muted d-block">{getCampaignTypeLabel(campaign.type)}</small>
            <small className="text-muted">
              {campaign.communicationType === CampaignCommunicationType.SMS
                ? 'SMS Campaign'
                : 'Voice Campaign'}
            </small>
          </div>
          <Badge color={getStatusBadgeColor(campaign.status || CampaignStatus.DRAFT)}>
            {(campaign.status || CampaignStatus.DRAFT).toUpperCase()}
          </Badge>
        </div>
      </CardHeader>

      <CardBody>
        {campaign.description && <p className="text-muted small mb-3">{campaign.description}</p>}

        <div className={`${styles.campaignStats} mb-3`}>
          <div className="row text-center">
            {isDraft ? (
              // Draft mode: Show only intended targets
              <div className="col-12">
                <div className="mb-1">
                  <strong className="d-block h4 text-primary">{campaign.totalTargets}</strong>
                  <small className="text-muted">{t('INTENDED_TARGETS')}</small>
                </div>
                <small className="text-muted d-block mt-2">{t('CAMPAIGN_READY_TO_LAUNCH')}</small>
              </div>
            ) : (
              // Active/Completed campaigns: Show full stats
              <>
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
              </>
            )}
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
          {isDraft ? (
            // Draft mode: Show Launch, Refresh Targets, and View buttons
            <div className="d-grid gap-2">
              <Button
                size="sm"
                onClick={() => router.push(`/dashboard/company/campaigns/${campaign.id}`)}
                className={`w-100 mt-2 ${styles.viewButton}`}
              >
                <Eye size={14} className="me-1" />
                {t('VIEW_DETAILS')}
              </Button>
            </div>
          ) : (
            // Active campaigns: Show standard action buttons
            <div className="btn-group w-100" role="group">
              <Button
                size="sm"
                onClick={() => router.push(`/dashboard/company/campaigns/${campaign.id}`)}
                className={styles.viewButton}
              >
                <Eye size={14} className="me-1" />
                {t('VIEW')}
              </Button>

              {(campaign.status || CampaignStatus.DRAFT) === CampaignStatus.ACTIVE && (
                <Button color="outline-warning" size="sm" onClick={() => handleAction('cancel')}>
                  <Pause size={14} className="me-1" />
                  {t('CANCEL')}
                </Button>
              )}
            </div>
          )}
        </div>
      </CardBody>
    </Card>
  );
};
