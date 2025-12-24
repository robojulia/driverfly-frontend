import React from 'react';
import { Card, CardBody, Badge } from 'reactstrap';
import { CampaignEntity } from '../../models/campaigns/campaign.entity';
import { CampaignType } from '../../enums/campaigns/campaign-type.enum';
import { CampaignStatus } from '../../enums/campaigns/campaign-status.enum';
import { useTranslation } from '../../hooks/use-translation';
import styles from '../../styles/campaigns.module.css';

interface CampaignTypeSummaryCardProps {
  campaignType: CampaignType;
  campaigns: CampaignEntity[];
  onClick: () => void;
}

export const CampaignTypeSummaryCard: React.FC<CampaignTypeSummaryCardProps> = ({
  campaignType,
  campaigns,
  onClick,
}) => {
  const { t } = useTranslation();

  const getCampaignTypeLabel = (type: CampaignType | string): string => {
    // Handle both new enum value and legacy database value
    if (type === CampaignType.REIGNITE_PAST_LEADS || type === 'JOB_REACHOUT') {
      return t('CAMPAIGN_TYPES.REIGNITE_PAST_LEADS');
    }
    return type as string;
  };

  // Calculate summary statistics
  const totalCampaigns = campaigns.length;
  const activeCampaigns = campaigns.filter(c => c.status === CampaignStatus.ACTIVE).length;
  const completedCampaigns = campaigns.filter(c => c.status === CampaignStatus.COMPLETED).length;
  const totalTargets = campaigns.reduce((sum, c) => sum + (c.totalTargets || 0), 0);
  const totalDelivered = campaigns.reduce((sum, c) => sum + (c.deliveredCount || 0), 0);
  const totalSent = campaigns.reduce((sum, c) => sum + (c.sentCount || 0), 0);
  const successRate = totalSent > 0 ? Math.round((totalDelivered / totalSent) * 100) : 0;

  return (
    <Card
      className={styles.campaignTypeSummaryCard}
      onClick={onClick}
      style={{ cursor: 'pointer', transition: 'all 0.2s' }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '';
        e.currentTarget.style.transform = '';
      }}
    >
      <CardBody>
        <div style={{ marginBottom: '1rem' }}>
          <h4 style={{ marginBottom: '0.5rem', fontSize: '1.5rem', fontWeight: '600' }}>
            {getCampaignTypeLabel(campaignType)}
          </h4>
          <p style={{ color: '#6c757d', fontSize: '0.9rem', marginBottom: 0 }}>
            Click to view all deployments
          </p>
        </div>

        <div className="row">
          <div className="col-md-3 col-6 mb-3">
            <div>
              <small className="text-muted d-block">Total Campaigns</small>
              <strong style={{ fontSize: '1.5rem', color: '#2c3e50' }}>{totalCampaigns}</strong>
            </div>
          </div>
          <div className="col-md-3 col-6 mb-3">
            <div>
              <small className="text-muted d-block">Active</small>
              <strong style={{ fontSize: '1.5rem', color: '#28a745' }}>{activeCampaigns}</strong>
            </div>
          </div>
          <div className="col-md-3 col-6 mb-3">
            <div>
              <small className="text-muted d-block">Completed</small>
              <strong style={{ fontSize: '1.5rem', color: '#6c757d' }}>{completedCampaigns}</strong>
            </div>
          </div>
          <div className="col-md-3 col-6 mb-3">
            <div>
              <small className="text-muted d-block">Success Rate</small>
              <strong style={{ fontSize: '1.5rem', color: '#17a2b8' }}>{successRate}%</strong>
            </div>
          </div>
        </div>

        <div className="row mt-2">
          <div className="col-md-4 col-6">
            <div>
              <small className="text-muted d-block">Total Targets</small>
              <strong style={{ fontSize: '1.25rem' }}>{totalTargets.toLocaleString()}</strong>
            </div>
          </div>
          <div className="col-md-4 col-6">
            <div>
              <small className="text-muted d-block">Sent</small>
              <strong style={{ fontSize: '1.25rem' }}>{totalSent.toLocaleString()}</strong>
            </div>
          </div>
          <div className="col-md-4 col-6">
            <div>
              <small className="text-muted d-block">Delivered</small>
              <strong style={{ fontSize: '1.25rem' }}>{totalDelivered.toLocaleString()}</strong>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};
