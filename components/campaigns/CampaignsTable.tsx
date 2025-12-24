import React, { useState, useEffect, useMemo } from 'react';
import {
  Eye,
  Telephone,
  ChatDots,
  Calendar,
  Person,
  BarChart,
  StopCircle,
} from 'react-bootstrap-icons';
import Link from 'next/link';
import { format } from 'date-fns';

import { GenericTable, TableColumn, TableFilter } from '../common/GenericTable';
import { useTranslation } from '../../hooks/use-translation';
import { useCampaigns } from '../../hooks/campaigns/use-campaigns';
import { CampaignEntity } from '../../models/campaigns/campaign.entity';
import { CampaignStatus } from '../../enums/campaigns/campaign-status.enum';
import { CampaignCommunicationType } from '../../enums/campaigns/campaign-communication-type.enum';
import { CampaignType } from '../../enums/campaigns/campaign-type.enum';
import styles from '../../styles/generic-table.module.css';

interface CampaignsTableProps {
  className?: string;
  defaultJobFilter?: string;
  onDataChange?: (campaigns: CampaignEntity[]) => void;
  campaigns?: CampaignEntity[]; // Optional: provide campaigns directly
  loading?: boolean; // Optional: loading state when campaigns are provided
  showFilters?: boolean; // Optional: whether to show filters (default true)
}

export const CampaignsTable: React.FC<CampaignsTableProps> = ({
  className = '',
  defaultJobFilter,
  onDataChange,
  campaigns: campaignsProp,
  loading: loadingProp,
  showFilters = true,
}) => {
  const { t } = useTranslation();
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    sortBy: 'createdAt',
    sortOrder: 'DESC' as 'ASC' | 'DESC',
    status: '',
    ...(defaultJobFilter && { jobId: defaultJobFilter }),
  });

  const {
    campaigns: campaignsFromHook,
    loading: loadingFromHook,
    error,
    total,
    loadCampaigns,
    cancelCampaign,
  } = useCampaigns();

  // Use provided campaigns or load from hook
  const campaigns = campaignsProp !== undefined ? campaignsProp : campaignsFromHook;
  const loading = loadingProp !== undefined ? loadingProp : loadingFromHook;

  useEffect(() => {
    // Only load campaigns if they're not provided as props
    if (campaignsProp === undefined && loadCampaigns) {
      const queryParams = {
        page: currentPage,
        limit: 50,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
        ...(filters.status && { status: filters.status }),
        ...(filters.jobId && { jobId: parseInt(filters.jobId, 10) }),
      };

      console.log('CampaignsTable loading campaigns with params:', queryParams);
      console.log('Raw filters:', filters);

      loadCampaigns(queryParams).catch((err) => {
        console.error('Failed to load campaigns:', err);
      });
    }
  }, [currentPage, filters, loadCampaigns, campaignsProp]);

  // Notify parent component when campaigns data changes
  useEffect(() => {
    console.log('CampaignsTable - campaigns data changed:', campaigns);
    if (onDataChange && campaigns) {
      onDataChange(campaigns);
    }
  }, [campaigns, onDataChange]);

  const handleFilterChange = (key: string, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleLoadMore = () => {
    setCurrentPage((prev) => prev + 1);
  };

  const handleCampaignAction = async (campaignId: number, action: 'cancel') => {
    try {
      if (action === 'cancel') {
        await cancelCampaign(campaignId);
      }
    } catch (err) {
      console.error(`Error performing ${action} on campaign:`, err);
    }
  };

  const getStatusBadgeClass = (status: CampaignStatus): string => {
    switch (status) {
      case CampaignStatus.DRAFT:
        return styles.statusDraft;
      case CampaignStatus.ACTIVE:
        return styles.statusActive;
      case CampaignStatus.PAUSED:
        return styles.statusPaused;
      case CampaignStatus.COMPLETED:
        return styles.statusCompleted;
      case CampaignStatus.CANCELLED:
        return styles.statusCancelled;
      case CampaignStatus.FAILED:
        return styles.statusCancelled; // Use same styling as cancelled (danger/red)
      default:
        return styles.statusDraft;
    }
  };

  const getCommTypeBadgeClass = (type: CampaignCommunicationType): string => {
    switch (type) {
      case CampaignCommunicationType.VOICE:
        return styles.commTypeVoice;
      case CampaignCommunicationType.SMS:
        return styles.commTypeSms;
      default:
        return styles.commTypeVoice;
    }
  };

  const formatStatus = (status: CampaignStatus): string => {
    switch (status) {
      case CampaignStatus.DRAFT:
        return 'Draft';
      case CampaignStatus.ACTIVE:
        return 'Active';
      case CampaignStatus.PAUSED:
        return 'Paused';
      case CampaignStatus.COMPLETED:
        return 'Completed';
      case CampaignStatus.CANCELLED:
        return 'Cancelled';
      case CampaignStatus.FAILED:
        return 'Failed';
      default:
        return status;
    }
  };

  const formatCommunicationType = (type: CampaignCommunicationType): string => {
    switch (type) {
      case CampaignCommunicationType.VOICE:
        return 'Voice';
      case CampaignCommunicationType.SMS:
        return 'SMS';
      default:
        return type;
    }
  };

  const calculateSuccessRate = (delivered: number, total: number): string => {
    if (total === 0) return '0%';
    return `${Math.round((delivered / total) * 100)}%`;
  };

  const getCampaignTypeLabel = (type: CampaignType | string): string => {
    // Handle both new enum value and legacy database value
    if (type === CampaignType.REIGNITE_PAST_LEADS || type === 'JOB_REACHOUT') {
      return t('CAMPAIGN_TYPES.REIGNITE_PAST_LEADS');
    }
    return type as string;
  };

  // Group campaigns by type
  const groupedCampaigns = useMemo(() => {
    if (!campaigns || campaigns.length === 0) return {};

    return campaigns.reduce((acc, campaign) => {
      const type = campaign.type;
      if (!acc[type]) {
        acc[type] = [];
      }
      acc[type].push(campaign);
      return acc;
    }, {} as Record<CampaignType, CampaignEntity[]>);
  }, [campaigns]);

  const columns: TableColumn<CampaignEntity>[] = [
    {
      key: 'campaign',
      label: 'Campaign',
      width: '25%',
      render: (campaign) => (
        <div className={styles.campaignInfo}>
          <div className={styles.campaignName}>
            {campaign.communicationType === CampaignCommunicationType.VOICE ? (
              <Telephone size={16} />
            ) : (
              <ChatDots size={16} />
            )}
            {campaign.name}
          </div>
          {campaign.description && (
            <div className={styles.campaignDescription}>{campaign.description}</div>
          )}
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      width: '12%',
      render: (campaign) => (
        <span className={`${styles.statusBadge} ${getStatusBadgeClass(campaign.status)}`}>
          {formatStatus(campaign.status)}
        </span>
      ),
    },
    {
      key: 'communicationType',
      label: 'Type',
      width: '10%',
      render: (campaign) => (
        <span
          className={`${styles.commTypeBadge} ${getCommTypeBadgeClass(campaign.communicationType)}`}
        >
          {formatCommunicationType(campaign.communicationType)}
        </span>
      ),
    },
    {
      key: 'stats',
      label: 'Performance',
      width: '18%',
      render: (campaign) => (
        <div className={styles.statsContainer}>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Targets:</span>
            <span className={styles.statValue}>{campaign.totalTargets}</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Delivered:</span>
            <span className={styles.statValue}>{campaign.deliveredCount}</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Success:</span>
            <span className={`${styles.statValue} ${styles.successRate}`}>
              {calculateSuccessRate(campaign.deliveredCount, campaign.sentCount)}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: 'dates',
      label: 'Timeline',
      width: '15%',
      render: (campaign) => (
        <div className={styles.statsContainer}>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Created:</span>
            <span className={styles.statValue}>
              {format(new Date(campaign.createdAt), 'MMM d, yyyy')}
            </span>
          </div>
          {campaign.startedAt && (
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Started:</span>
              <span className={styles.statValue}>
                {format(new Date(campaign.startedAt), 'MMM d, yyyy')}
              </span>
            </div>
          )}
          {campaign.completedAt && (
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Completed:</span>
              <span className={styles.statValue}>
                {format(new Date(campaign.completedAt), 'MMM d, yyyy')}
              </span>
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      width: '20%',
      render: (campaign) => (
        <div className={`${styles.flexRow} ${styles.gap2}`}>
          <Link href={`/dashboard/company/campaigns/${campaign.id}`}>
            <a
              className={`${styles.button} ${styles.buttonOutlinePrimary} ${styles.buttonSm} ${styles.keepWhiteOnHover}`}
            >
              <Eye size={14} />
              View
            </a>
          </Link>

          {campaign.status === CampaignStatus.ACTIVE && (
            <button
              onClick={() => handleCampaignAction(campaign.id, 'cancel')}
              className={`${styles.button} ${styles.buttonOutlineSecondary} ${styles.buttonSm}`}
              title="Cancel Campaign"
            >
              <StopCircle size={14} />
              Cancel
            </button>
          )}
        </div>
      ),
    },
  ];

  const tableFilters: TableFilter[] = [
    {
      key: 'sortBy',
      label: 'Sort By',
      type: 'select',
      value: filters.sortBy,
      onChange: (value) => handleFilterChange('sortBy', value),
      options: [
        { value: 'createdAt', label: 'Date Created' },
        { value: 'name', label: 'Campaign Name' },
        { value: 'status', label: 'Status' },
        { value: 'totalTargets', label: 'Target Count' },
        { value: 'deliveredCount', label: 'Delivery Count' },
      ],
    },
    {
      key: 'sortOrder',
      label: 'Order',
      type: 'select',
      value: filters.sortOrder,
      onChange: (value) => handleFilterChange('sortOrder', value),
      options: [
        { value: 'DESC', label: 'Newest First' },
        { value: 'ASC', label: 'Oldest First' },
      ],
    },
    {
      key: 'status',
      label: 'Status',
      type: 'select',
      value: filters.status,
      onChange: (value) => handleFilterChange('status', value),
      options: [
        { value: '', label: 'All Statuses' },
        { value: CampaignStatus.DRAFT, label: 'Draft' },
        { value: CampaignStatus.ACTIVE, label: 'Active' },
        { value: CampaignStatus.PAUSED, label: 'Paused' },
        { value: CampaignStatus.COMPLETED, label: 'Completed' },
        { value: CampaignStatus.CANCELLED, label: 'Cancelled' },
        { value: CampaignStatus.FAILED, label: 'Failed' },
      ],
    },
  ];

  const hasMore = campaigns && campaigns.length < total;

  // If no campaigns, show empty state
  if (!loading && (!campaigns || campaigns.length === 0)) {
    return (
      <GenericTable
        data={[]}
        columns={columns}
        loading={loading}
        emptyTitle="No Marketing Campaigns Yet"
        emptyText="Create your first campaign to start reaching out to potential candidates."
        filters={tableFilters}
        className={className}
      />
    );
  }

  return (
    <div className={className}>
      {/* Filters */}
      {showFilters && (
        <div className={styles.filtersContainer}>
          <div className={styles.filterRow}>
            {tableFilters.map((filter) => (
              <div key={filter.key} className={styles.filterGroup}>
                <label className={styles.filterLabel}>{filter.label}</label>
                <select
                  value={filter.value}
                  onChange={(e) => filter.onChange(e.target.value)}
                  className={styles.filterSelect}
                >
                  {filter.options?.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Render campaigns */}
      {campaignsProp !== undefined ? (
        // When campaigns are provided as props (detail view), show flat list
        <GenericTable
          data={campaigns || []}
          columns={columns}
          loading={loading}
          emptyTitle="No Campaigns"
          emptyText="No campaigns found for this type."
          onLoadMore={undefined}
          hasMore={false}
          loadMoreText=""
        />
      ) : (
        // When loading from hook (summary view), group by campaign type
        <>
          {(Object.entries(groupedCampaigns) as [CampaignType, CampaignEntity[]][]).map(([type, typeCampaigns]) => (
            <div key={type} style={{ marginBottom: '2rem' }}>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                marginBottom: '1rem',
                color: '#2c3e50',
                borderBottom: '2px solid #3498db',
                paddingBottom: '0.5rem'
              }}>
                {getCampaignTypeLabel(type)}
              </h3>
              <GenericTable
                data={typeCampaigns}
                columns={columns}
                loading={loading}
                emptyTitle={`No ${getCampaignTypeLabel(type)} Campaigns`}
                emptyText="No campaigns of this type yet."
                onLoadMore={undefined}
                hasMore={false}
                loadMoreText=""
              />
            </div>
          ))}

          {/* Load More Button (shown at bottom if there are more campaigns) */}
          {hasMore && (
            <div style={{ textAlign: 'center', marginTop: '1rem' }}>
              <button
                onClick={handleLoadMore}
                className={`${styles.button} ${styles.buttonPrimary}`}
                disabled={loading}
              >
                {loading ? 'Loading...' : 'Load More Campaigns'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};
