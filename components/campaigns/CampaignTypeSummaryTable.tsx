import React from 'react';
import { Table } from 'reactstrap';
import { format } from 'date-fns';
import { CampaignEntity } from '../../models/campaigns/campaign.entity';
import { CampaignType } from '../../enums/campaigns/campaign-type.enum';
import { CampaignStatus } from '../../enums/campaigns/campaign-status.enum';
import { useTranslation } from '../../hooks/use-translation';

interface CampaignTypeSummaryTableProps {
  campaignsByType: Record<string, CampaignEntity[]>;
  onTypeClick: (type: CampaignType | string) => void;
}

export const CampaignTypeSummaryTable: React.FC<CampaignTypeSummaryTableProps> = ({
  campaignsByType,
  onTypeClick,
}) => {
  const { t } = useTranslation();

  const getCampaignTypeLabel = (type: CampaignType | string): string => {
    // Handle both new enum value and legacy database value
    if (type === CampaignType.REIGNITE_PAST_LEADS || type === 'JOB_REACHOUT') {
      return t('CAMPAIGN_TYPES.REIGNITE_PAST_LEADS');
    }
    return type as string;
  };

  const calculateStats = (campaigns: CampaignEntity[]) => {
    const totalCampaigns = campaigns.length;
    const activeCampaigns = campaigns.filter(c => c.status === CampaignStatus.ACTIVE).length;
    const completedCampaigns = campaigns.filter(c => c.status === CampaignStatus.COMPLETED).length;
    const totalTargets = campaigns.reduce((sum, c) => sum + (c.totalTargets || 0), 0);
    const totalSent = campaigns.reduce((sum, c) => sum + (c.sentCount || 0), 0);
    const totalDelivered = campaigns.reduce((sum, c) => sum + (c.deliveredCount || 0), 0);
    const successRate = totalSent > 0 ? Math.round((totalDelivered / totalSent) * 100) : 0;

    // Find earliest created date
    const createdDates = campaigns.map(c => new Date(c.createdAt)).filter(d => !isNaN(d.getTime()));
    const dateCreated = createdDates.length > 0
      ? new Date(Math.min(...createdDates.map(d => d.getTime())))
      : null;

    // Find most recent completion or start date
    const activityDates = campaigns
      .map(c => c.completedAt || c.startedAt || c.updatedAt)
      .filter(d => d)
      .map(d => new Date(d!))
      .filter(d => !isNaN(d.getTime()));
    const dateLastUsed = activityDates.length > 0
      ? new Date(Math.max(...activityDates.map(d => d.getTime())))
      : null;

    return {
      totalCampaigns,
      activeCampaigns,
      completedCampaigns,
      totalTargets,
      totalSent,
      totalDelivered,
      successRate,
      dateCreated,
      dateLastUsed,
    };
  };

  const campaignTypes = Object.keys(campaignsByType);

  if (campaignTypes.length === 0) {
    return (
      <div className="text-center py-5">
        <p className="text-muted">No campaigns yet</p>
      </div>
    );
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      <Table hover responsive style={{ backgroundColor: 'white', marginBottom: 0 }}>
        <thead style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #dee2e6' }}>
          <tr>
            <th style={{ fontWeight: '600', fontSize: '0.875rem', padding: '1rem' }}>Campaign Type</th>
            <th style={{ fontWeight: '600', fontSize: '0.875rem', padding: '1rem' }}>Date Created</th>
            <th style={{ fontWeight: '600', fontSize: '0.875rem', padding: '1rem' }}>Date Last Used</th>
            <th style={{ fontWeight: '600', fontSize: '0.875rem', padding: '1rem', textAlign: 'center' }}>Total</th>
            <th style={{ fontWeight: '600', fontSize: '0.875rem', padding: '1rem', textAlign: 'center' }}>Active</th>
            <th style={{ fontWeight: '600', fontSize: '0.875rem', padding: '1rem', textAlign: 'center' }}>Completed</th>
            <th style={{ fontWeight: '600', fontSize: '0.875rem', padding: '1rem', textAlign: 'right' }}>Targets</th>
            <th style={{ fontWeight: '600', fontSize: '0.875rem', padding: '1rem', textAlign: 'right' }}>Sent</th>
            <th style={{ fontWeight: '600', fontSize: '0.875rem', padding: '1rem', textAlign: 'right' }}>Delivered</th>
            <th style={{ fontWeight: '600', fontSize: '0.875rem', padding: '1rem', textAlign: 'center' }}>Success Rate</th>
          </tr>
        </thead>
        <tbody>
          {campaignTypes.map((type) => {
            const campaigns = campaignsByType[type];
            const stats = calculateStats(campaigns);

            return (
              <tr
                key={type}
                onClick={() => onTypeClick(type as CampaignType)}
                style={{
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f8f9fa';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '';
                }}
              >
                <td style={{ padding: '1rem', fontWeight: '500', fontSize: '1rem' }}>
                  {getCampaignTypeLabel(type)}
                </td>
                <td style={{ padding: '1rem', fontSize: '0.875rem' }}>
                  {stats.dateCreated ? format(stats.dateCreated, 'MMM d, yyyy') : '-'}
                </td>
                <td style={{ padding: '1rem', fontSize: '0.875rem' }}>
                  {stats.dateLastUsed ? format(stats.dateLastUsed, 'MMM d, yyyy') : '-'}
                </td>
                <td style={{ padding: '1rem', textAlign: 'center', fontSize: '0.875rem', fontWeight: '500' }}>
                  {stats.totalCampaigns}
                </td>
                <td style={{ padding: '1rem', textAlign: 'center', fontSize: '0.875rem' }}>
                  <span style={{ color: '#28a745', fontWeight: '500' }}>{stats.activeCampaigns}</span>
                </td>
                <td style={{ padding: '1rem', textAlign: 'center', fontSize: '0.875rem', color: '#6c757d' }}>
                  {stats.completedCampaigns}
                </td>
                <td style={{ padding: '1rem', textAlign: 'right', fontSize: '0.875rem' }}>
                  {stats.totalTargets.toLocaleString()}
                </td>
                <td style={{ padding: '1rem', textAlign: 'right', fontSize: '0.875rem' }}>
                  {stats.totalSent.toLocaleString()}
                </td>
                <td style={{ padding: '1rem', textAlign: 'right', fontSize: '0.875rem' }}>
                  {stats.totalDelivered.toLocaleString()}
                </td>
                <td style={{ padding: '1rem', textAlign: 'center', fontSize: '0.875rem' }}>
                  <span style={{
                    fontWeight: '600',
                    color: stats.successRate >= 70 ? '#28a745' : stats.successRate >= 50 ? '#ffc107' : '#dc3545'
                  }}>
                    {stats.successRate}%
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </div>
  );
};
