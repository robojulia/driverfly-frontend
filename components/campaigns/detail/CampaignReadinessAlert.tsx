import React from 'react';
import { Alert } from 'reactstrap';
import { CheckCircleFill, ExclamationTriangleFill, InfoCircleFill } from 'react-bootstrap-icons';
import { CampaignStatus } from '../../../enums/campaigns/campaign-status.enum';
import styles from './CampaignReadinessAlert.module.css';

interface CampaignReadinessAlertProps {
  campaign: any;
  stats?: any;
}

const CampaignReadinessAlert: React.FC<CampaignReadinessAlertProps> = ({ campaign, stats }) => {
  // Only show for draft campaigns
  if (campaign?.status !== CampaignStatus.DRAFT) {
    return null;
  }

  const hasTargets = (stats?.totalTargets || 0) > 0;
  const hasConfig = campaign?.config && Object.keys(campaign.config).length > 0;

  const getReadinessStatus = () => {
    if (!hasTargets) {
      return {
        type: 'warning' as const,
        icon: <ExclamationTriangleFill className="me-2" />,
        title: 'Campaign Not Ready',
        message: 'Generate targets before launching this campaign.',
        action: 'Click "Refresh Targets" to find eligible candidates.',
      };
    }

    if (hasTargets && hasConfig) {
      return {
        type: 'success' as const,
        icon: <CheckCircleFill className="me-2" />,
        title: 'Campaign Ready to Launch',
        message: `Ready to send to ${stats.totalTargets.toLocaleString()} targets.`,
        action: 'Click "Launch Campaign" when you\'re ready to start.',
      };
    }

    return {
      type: 'info' as const,
      icon: <InfoCircleFill className="me-2" />,
      title: 'Campaign Configuration',
      message: 'Review campaign settings before launching.',
      action: 'Ensure all campaign details are configured correctly.',
    };
  };

  const readiness = getReadinessStatus();

  return (
    <Alert color={readiness.type} className={styles.readinessAlert}>
      <div className={styles.alertContent}>
        <div className={styles.alertHeader}>
          {readiness.icon}
          <strong>{readiness.title}</strong>
        </div>
        <div className={styles.alertBody}>
          <p className={styles.alertMessage}>{readiness.message}</p>
          <small className={styles.alertAction}>{readiness.action}</small>
        </div>
      </div>
    </Alert>
  );
};

export default CampaignReadinessAlert;
