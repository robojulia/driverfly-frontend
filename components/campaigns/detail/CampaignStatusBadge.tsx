import React from 'react';
import { Badge } from 'reactstrap';
import { InfoCircleFill } from 'react-bootstrap-icons';
import { CampaignStatus } from '../../../enums/campaigns/campaign-status.enum';
import styles from './CampaignStatusBadge.module.css';

interface CampaignStatusBadgeProps {
  status: CampaignStatus;
  className?: string;
}

interface StatusConfig {
  color: string;
  label: string;
  description: string;
  icon?: React.ReactNode;
}

const statusConfig: Record<CampaignStatus, StatusConfig> = {
  [CampaignStatus.DRAFT]: {
    color: 'secondary',
    label: 'Draft',
    description: 'Campaign is being prepared. You can edit settings and targets before launching.',
  },
  [CampaignStatus.ACTIVE]: {
    color: 'success',
    label: 'Active',
    description: 'Campaign is currently running and sending messages to targets.',
  },
  [CampaignStatus.PAUSED]: {
    color: 'warning',
    label: 'Paused',
    description: 'Campaign is temporarily stopped but can be resumed at any time.',
  },
  [CampaignStatus.COMPLETED]: {
    color: 'primary',
    label: 'Completed',
    description: 'Campaign has finished sending to all targets successfully.',
  },
  [CampaignStatus.CANCELLED]: {
    color: 'danger',
    label: 'Cancelled',
    description: 'Campaign has been stopped and cannot be resumed.',
  },
  [CampaignStatus.FAILED]: {
    color: 'danger',
    label: 'Failed',
    description: 'Campaign failed to deliver messages to all targets. Please check your configuration and try again.',
  },
};

const CampaignStatusBadge: React.FC<CampaignStatusBadgeProps> = ({ status, className = '' }) => {
  const config = statusConfig[status];

  return (
    <div className={`${styles.statusBadgeContainer} ${className}`}>
      <Badge color={config.color} className={styles.statusBadge} title={config.description}>
        {config.label}
        <InfoCircleFill className={styles.infoIcon} />
      </Badge>
      <div className={styles.tooltip}>
        <div className={styles.tooltipContent}>
          <strong>{config.label}</strong>
          <div className={styles.tooltipDescription}>{config.description}</div>
        </div>
      </div>
    </div>
  );
};

export default CampaignStatusBadge;
