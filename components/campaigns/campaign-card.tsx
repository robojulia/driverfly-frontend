import React from 'react';
import { Card, CardBody, Badge } from 'reactstrap';
import { CampaignEntity } from '../../models/campaigns/campaign.entity';
import { CampaignType } from '../../enums/campaigns/campaign-type.enum';
import { CampaignStatus } from '../../enums/campaigns/campaign-status.enum';
import { useTranslation } from '../../hooks/use-translation';
import styles from '../../styles/campaigns.module.css';

interface CampaignCardProps {
  campaign: CampaignEntity;
  onView: (campaign: CampaignEntity) => void;
  onAction: (campaignId: number, action: 'cancel' | 'regenerate') => void;
}

export const CampaignCard: React.FC<CampaignCardProps> = ({ campaign, onView, onAction }) => {
  const { t } = useTranslation();

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
    if (campaign.totalTargets === 0) return 0;
    return Math.round((campaign.deliveredCount / campaign.totalTargets) * 100);
  };

  return (
    <Card className={`h-100 ${styles.campaignCard}`}>
      <div className="card-header bg-white border-bottom">
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <h6 className="mb-1 font-weight-bold">{campaign.name}</h6>
            <small className="text-muted">{getCampaignTypeLabel(campaign.type)}</small>
          </div>
          <Badge color={getStatusBadgeColor(campaign.status)}>
            {campaign.status.toUpperCase()}
          </Badge>
        </div>
      </div>

      <CardBody>
        {campaign.description && <p className="text-muted small mb-3">{campaign.description}</p>}

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
                <strong className="d-block text-success">{calculateSuccessRate()}%</strong>
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
        </div>

        <div className={styles.campaignActions}>
          <div className="btn-group w-100" role="group">
            <button className="btn btn-outline-primary btn-sm" onClick={() => onView(campaign)}>
              {t('VIEW')}
            </button>

            {campaign.status === CampaignStatus.RUNNING && (
              <button
                className="btn btn-outline-warning btn-sm"
                onClick={() => onAction(campaign.id, 'cancel')}
              >
                {t('CANCEL')}
              </button>
            )}

            {(campaign.status === CampaignStatus.COMPLETED ||
              campaign.status === CampaignStatus.CANCELLED) && (
              <button
                className="btn btn-outline-success btn-sm"
                onClick={() => onAction(campaign.id, 'regenerate')}
              >
                {t('RESTART')}
              </button>
            )}
          </div>
        </div>
      </CardBody>
    </Card>
  );
};
