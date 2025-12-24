import React from 'react';
import { Row, Col } from 'reactstrap';
import { TelephoneFill, ChatDotsFill, CalendarFill } from 'react-bootstrap-icons';
import CampaignStatusBadge from './CampaignStatusBadge';
import { CampaignType } from '../../../enums/campaigns/campaign-type.enum';
import { CampaignCommunicationType } from '../../../enums/campaigns/campaign-communication-type.enum';
import styles from './CampaignHeader.module.css';

interface CampaignHeaderProps {
  campaign: any;
  stats?: any;
}

const CampaignHeader: React.FC<CampaignHeaderProps> = ({ campaign, stats }) => {
  const getCommunicationIcon = (type: CampaignCommunicationType) => {
    switch (type) {
      case CampaignCommunicationType.VOICE:
        return <TelephoneFill className={styles.communicationIcon} />;
      case CampaignCommunicationType.SMS:
        return <ChatDotsFill className={styles.communicationIcon} />;
      default:
        return <ChatDotsFill className={styles.communicationIcon} />;
    }
  };

  const getCommunicationLabel = (type: CampaignCommunicationType) => {
    switch (type) {
      case CampaignCommunicationType.VOICE:
        return 'Voice Campaign';
      case CampaignCommunicationType.SMS:
        return 'SMS Campaign';
      default:
        return 'Campaign';
    }
  };

  const getCampaignTypeLabel = (type: CampaignType) => {
    switch (type) {
      case CampaignType.REIGNITE_PAST_LEADS:
        return 'Reignite Past Leads';
      default:
        return type;
    }
  };

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (!campaign) return null;

  return (
    <div className={styles.campaignHeader}>
      <Row className="align-items-center">
        <Col>
          {/* Campaign Title and Status */}
          <div className={styles.titleSection}>
            <h1 className={styles.campaignTitle}>{campaign.name}</h1>
            <CampaignStatusBadge status={campaign.status} className={styles.statusBadge} />
          </div>

          {/* Campaign Metadata */}
          <div className={styles.metadataSection}>
            <div className={styles.metadataItem}>
              <span className={styles.metadataLabel}>Type:</span>
              <span className={styles.metadataValue}>{getCampaignTypeLabel(campaign.type)}</span>
            </div>

            <div className={styles.metadataDivider} />

            <div className={styles.metadataItem}>
              <span className={styles.metadataLabel}>Communication:</span>
              <span className={styles.metadataValue}>
                {getCommunicationIcon(campaign.communicationType)}
                {getCommunicationLabel(campaign.communicationType)}
              </span>
            </div>

            <div className={styles.metadataDivider} />

            <div className={styles.metadataItem}>
              <span className={styles.metadataLabel}>Created:</span>
              <span className={styles.metadataValue}>
                <CalendarFill className={styles.communicationIcon} />
                {formatDate(campaign.createdAt)}
              </span>
            </div>

            {stats && stats.totalTargets > 0 && (
              <>
                <div className={styles.metadataDivider} />
                <div className={styles.metadataItem}>
                  <span className={styles.metadataLabel}>Targets:</span>
                  <span className={styles.metadataValue}>
                    {stats.totalTargets.toLocaleString()}
                  </span>
                </div>
              </>
            )}
          </div>

          {/* Campaign Description */}
          {campaign.description && (
            <div className={styles.descriptionSection}>
              <p className={styles.campaignDescription}>{campaign.description}</p>
            </div>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default CampaignHeader;
