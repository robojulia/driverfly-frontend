import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import {
  Telephone,
  Plus,
  Bullseye,
  Stars,
  TelephoneFill,
  Robot,
  PersonBadgeFill,
  BarChartFill,
  ClockFill,
  Eye,
} from 'react-bootstrap-icons';
import { CampaignsTable } from '../campaigns/CampaignsTable';
import { CampaignCreationModal } from '../campaigns/CampaignCreationModal';
import { CampaignEntity } from '../../models/campaigns/campaign.entity';
import { JobEntity } from '../../models/job/job.entity';
import { useTranslation } from '../../hooks/use-translation';
import { useCampaignCreation } from '../../hooks/campaigns/use-campaign-creation';
import styles from '../../styles/job-ai-campaigns.module.css';

interface JobAICampaignsProps {
  job: JobEntity;
  campaigns: CampaignEntity[];
  eligibilityStats: any;
  onCampaignCreated?: () => void;
  className?: string;
}

export const JobAICampaigns: React.FC<JobAICampaignsProps> = ({
  job,
  campaigns,
  eligibilityStats,
  onCampaignCreated,
  className = '',
}) => {
  const { t } = useTranslation();
  const router = useRouter();

  console.log('JobAICampaigns - job.id:', job.id, 'campaigns:', campaigns);

  // Use the shared campaign creation logic
  const {
    campaignModalOpen,
    openCampaignModal,
    closeCampaignModal,
    creatingCampaign,
    handleCreateCampaign,
    selectedCommunicationType,
    handleCommunicationTypeChange,
    callCampaignsEnabled,
    reachPreview,
    loadingReachPreview,
    completedCampaigns,
    canCreateCampaign,
    hasDraftCampaign,
    draftCampaigns,
    uploadMode,
    handleUploadModeChange,
    bulkLeads,
    handleBulkLeadsChange,
    leadsValid,
  } = useCampaignCreation({
    job,
    campaigns,
    eligibilityStats,
    onCampaignCreated,
  });

  // Monitor campaigns table data to determine if we should show empty state
  const handleCampaignsDataChange = (campaigns: CampaignEntity[]) => {
    console.log('JobAICampaigns - handleCampaignsDataChange called with:', campaigns);
  };

  const EmptyState = () => (
    <div className={styles.emptyState}>
      <div className={styles.emptyStateIcon}>
        <div className={styles.aiIconContainer}>
          <Robot className={styles.aiIcon} size={60} />
          <TelephoneFill className={styles.phoneIcon} size={16} />
        </div>
      </div>

      <div className={styles.emptyStateContent}>
        <h3 className={styles.emptyStateTitle}>No AI Campaigns Active for This Job</h3>
        <p className={styles.emptyStateDescription}>
          Launch intelligent recruiting campaigns that automatically contact qualified drivers with
          personalized AI conversations, saving you time while finding the best candidates.
        </p>

        <div className={styles.emptyStateFeatures}>
          <div className={styles.feature}>
            <PersonBadgeFill className={styles.featureIcon} size={20} />
            <div className={styles.featureText}>
              <div className={styles.featureTitle}>Smart Targeting</div>
              <div className={styles.featureDescription}>
                AI identifies and contacts only the most qualified drivers based on your job
                requirements
              </div>
            </div>
          </div>
          <div className={styles.feature}>
            <TelephoneFill className={styles.featureIcon} size={20} />
            <div className={styles.featureText}>
              <div className={styles.featureTitle}>Natural Conversations</div>
              <div className={styles.featureDescription}>
                Advanced AI conducts natural phone conversations with drivers, answering questions
                and qualifying interest
              </div>
            </div>
          </div>
          <div className={styles.feature}>
            <BarChartFill className={styles.featureIcon} size={20} />
            <div className={styles.featureText}>
              <div className={styles.featureTitle}>Real-Time Analytics</div>
              <div className={styles.featureDescription}>
                Track campaign performance, conversion rates, and driver engagement in real-time
              </div>
            </div>
          </div>
          <div className={styles.feature}>
            <ClockFill className={styles.featureIcon} size={20} />
            <div className={styles.featureText}>
              <div className={styles.featureTitle}>24/7 Automation</div>
              <div className={styles.featureDescription}>
                Campaigns run around the clock, reaching drivers at optimal times for maximum
                response
              </div>
            </div>
          </div>
        </div>

        <div className={styles.emptyStateActions}>
          <button
            className={styles.primaryButton}
            onClick={openCampaignModal}
            disabled={!canCreateCampaign}
            title={
              !canCreateCampaign
                ? 'No eligible candidates available'
                : 'Create your first AI campaign'
            }
          >
            <Stars size={20} />
            Launch Your First AI Campaign
            {!canCreateCampaign && <span className={styles.comingSoon}>No Candidates</span>}
          </button>
          <p className={styles.emptyStateNote}>
            {canCreateCampaign
              ? 'Click above to create your first intelligent recruiting campaign'
              : 'No eligible candidates available for campaigns at this time'}
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`${styles.container} ${className}`}>
      <div className={styles.header}>
        <div className={styles.headerIcon}>
          <Stars size={28} />
        </div>
        <div className={styles.headerText}>
          <h2 className={styles.headerTitle}>AI-Powered Recruiting Campaigns</h2>
          <p className={styles.headerDescription}>
            Intelligent automated outreach to qualified drivers using advanced AI conversation flows
          </p>
        </div>
        <div className={styles.headerActions}>
          {hasDraftCampaign ? (
            <button
              className={styles.manageDraftButton}
              onClick={() => router.push(`/dashboard/company/campaigns/${draftCampaigns[0].id}`)}
              title="Manage existing draft campaign"
            >
              <Eye size={16} />
              Manage Draft Campaign
            </button>
          ) : (
            <button
              className={styles.createButton}
              onClick={openCampaignModal}
              disabled={!canCreateCampaign}
              title={
                !canCreateCampaign ? 'No eligible candidates available' : 'Create new AI campaign'
              }
            >
              <Stars size={16} />
              Create Campaign
            </button>
          )}
        </div>
      </div>

      {/* Campaign Table */}
      <div className={styles.campaignsTable}>
        <CampaignsTable
          defaultJobFilter={job.id.toString()}
          onDataChange={handleCampaignsDataChange}
        />
      </div>

      {/* Campaign Creation Modal */}
      <CampaignCreationModal
        show={campaignModalOpen}
        onHide={closeCampaignModal}
        job={job}
        selectedCommunicationType={selectedCommunicationType}
        onCommunicationTypeChange={handleCommunicationTypeChange}
        callCampaignsEnabled={callCampaignsEnabled}
        reachPreview={reachPreview}
        loadingReachPreview={loadingReachPreview}
        eligibilityStats={eligibilityStats}
        creatingCampaign={creatingCampaign}
        onCreateCampaign={handleCreateCampaign}
        uploadMode={uploadMode}
        onUploadModeChange={handleUploadModeChange}
        bulkLeads={bulkLeads}
        onBulkLeadsChange={handleBulkLeadsChange}
        leadsValid={leadsValid}
      />
    </div>
  );
};
