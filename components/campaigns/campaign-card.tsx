import React from 'react';
import { Card, CardBody, CardHeader, Button, Badge } from 'reactstrap';
import { Eye, Pause, Play } from 'react-bootstrap-icons';
import { useRouter } from 'next/router';
import { useTranslation } from '../../hooks/use-translation';
import { CampaignEntity } from '../../models/campaigns/campaign.entity';
import { CampaignStatus } from '../../enums/campaigns/campaign-status.enum';
import { CampaignType } from '../../enums/campaigns/campaign-type.enum';
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
              {campaign.name}
            </h6>
            <small className="text-muted">{getCampaignTypeLabel(campaign.type)}</small>
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
              <div className="row g-2">
                <div className="col-6">
                  <Button
                    color="primary"
                    size="sm"
                    disabled={true} // We cant launch a draft campaign yet
                    onClick={() => router.push(`/dashboard/company/campaigns/${campaign.id}`)}
                    className="w-100"
                  >
                    <Play size={14} className="me-1" />
                    {t('LAUNCH_CAMPAIGN')}
                  </Button>
                </div>
                <div className="col-6">
                  <Button
                    color="info"
                    size="sm"
                    onClick={() => handleAction('regenerate')}
                    className="w-100"
                  >
                    <svg
                      width="12"
                      height="12"
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
                    {t('REFRESH_TARGETS')}
                  </Button>
                </div>
              </div>
              <Button
                color="outline-secondary"
                size="sm"
                onClick={() => router.push(`/dashboard/company/campaigns/${campaign.id}`)}
                className="w-100 mt-2"
              >
                <Eye size={14} className="me-1" />
                {t('VIEW_DETAILS')}
              </Button>
            </div>
          ) : (
            // Active campaigns: Show standard action buttons
            <div className="btn-group w-100" role="group">
              <Button
                color="outline-primary"
                size="sm"
                onClick={() => router.push(`/dashboard/company/campaigns/${campaign.id}`)}
              >
                <Eye size={14} className="me-1" />
                {t('VIEW')}
              </Button>

              {(campaign.status || CampaignStatus.DRAFT) === CampaignStatus.RUNNING && (
                <Button color="outline-warning" size="sm" onClick={() => handleAction('cancel')}>
                  <Pause size={14} className="me-1" />
                  {t('CANCEL')}
                </Button>
              )}

              {((campaign.status || CampaignStatus.DRAFT) === CampaignStatus.COMPLETED ||
                (campaign.status || CampaignStatus.DRAFT) === CampaignStatus.CANCELLED) && (
                <Button
                  color="outline-success"
                  size="sm"
                  onClick={() => handleAction('regenerate')}
                >
                  <Play size={14} className="me-1" />
                  {t('RESTART')}
                </Button>
              )}
            </div>
          )}
        </div>
      </CardBody>
    </Card>
  );
};
