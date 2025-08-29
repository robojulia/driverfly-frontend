import React, { useState, useEffect } from 'react';
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
import styles from '../../styles/generic-table.module.css';

interface CampaignsTableProps {
  className?: string;
}

export const CampaignsTable: React.FC<CampaignsTableProps> = ({ className = '' }) => {
  const { t } = useTranslation();
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    sortBy: 'createdAt',
    sortOrder: 'DESC' as 'ASC' | 'DESC',
    status: '',
  });

  const { campaigns, loading, error, total, loadCampaigns, cancelCampaign } = useCampaigns();

  useEffect(() => {
    if (loadCampaigns) {
      loadCampaigns({
        page: currentPage,
        limit: 50,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
        ...(filters.status && { status: filters.status }),
      }).catch((err) => {
        console.error('Failed to load campaigns:', err);
      });
    }
  }, [currentPage, filters, loadCampaigns]);

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
            <a className={`${styles.button} ${styles.buttonOutlinePrimary} ${styles.buttonSm}`}>
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
      ],
    },
  ];

  const hasMore = campaigns && campaigns.length < total;

  return (
    <GenericTable
      data={campaigns || []}
      columns={columns}
      loading={loading}
      emptyTitle="No Marketing Campaigns Yet"
      emptyText="Create your first campaign to start reaching out to potential candidates."
      filters={tableFilters}
      onLoadMore={hasMore ? handleLoadMore : undefined}
      hasMore={hasMore}
      loadMoreText="Load More Campaigns"
      className={className}
    />
  );
};
