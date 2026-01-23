import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { Card, Button, Badge, Modal, Row, Col } from 'react-bootstrap';
import {
  TelephoneFill,
  PeopleFill,
  StarFill,
  FilterCircleFill,
  CheckCircleFill,
  ChatDotsFill,
  InfoCircleFill,
} from 'react-bootstrap-icons';
import { ExistingJobCampaigns } from '../campaigns';
import { CampaignCreationModal } from '../campaigns/CampaignCreationModal';
import { JobEntity } from '../../models/job/job.entity';
import { CampaignEntity } from '../../models/campaigns/campaign.entity';
import { CampaignStatus } from '../../enums/campaigns/campaign-status.enum';
import { CampaignCommunicationType } from '../../enums/campaigns/campaign-communication-type.enum';
import { useTranslation } from '../../hooks/use-translation';
import { useCampaignCreation } from '../../hooks/campaigns/use-campaign-creation';

interface CampaignCtaProps {
  job: JobEntity;
  campaigns: CampaignEntity[];
  campaignsLoading: boolean;
  eligibilityStats: any;
  onCampaignCreated?: () => void;
}

export function CampaignCta({
  job,
  campaigns,
  campaignsLoading,
  eligibilityStats,
  onCampaignCreated,
}: CampaignCtaProps) {
  const { t } = useTranslation();

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
    hasExistingCampaigns,
    completedCampaigns,
    canCreateCampaign,
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

  if (campaignsLoading || !eligibilityStats) {
    return null;
  }

  return (
    <>
      {hasExistingCampaigns ? (
        <ExistingJobCampaigns
          campaigns={campaigns}
          jobTitle={job.title}
          onManageDraft={openCampaignModal}
        />
      ) : (
        <Card className="border-0 shadow-sm position-sticky" style={{ top: '20px' }}>
          <Card.Body className="text-center p-4">
            <div className="mb-3">
              {selectedCommunicationType === CampaignCommunicationType.SMS ? (
                <ChatDotsFill size={48} className="text-primary mb-3" />
              ) : (
                <TelephoneFill size={48} className="text-primary mb-3" />
              )}
              <h4 className="mb-2">Reach More Qualified Candidates</h4>
              <p className="text-muted mb-4">
                Don&apos;t wait for candidates to find you. Proactively reach out to qualified
                drivers who are looking for opportunities.
              </p>
            </div>

            {/* Stats Preview */}
            <div className="bg-light rounded p-3 mb-4">
              <Row className="text-center">
                <Col xs={6}>
                  <div className="mb-2">
                    <PeopleFill className="text-success me-1" />
                    <strong className="h5 text-success">
                      {eligibilityStats?.eligibleApplicants || 0}
                    </strong>
                  </div>
                  <small className="text-muted">Eligible Candidates</small>
                </Col>
                <Col xs={6}>
                  <div className="mb-2">
                    <StarFill className="text-warning me-1" />
                    <strong className="h5 text-warning">
                      {eligibilityStats?.totalApplicants || 0}
                    </strong>
                  </div>
                  <small className="text-muted">Total in Pool</small>
                </Col>
              </Row>
            </div>

            <div className="mb-4">
              <h6 className="mb-2">What You&apos;ll Get:</h6>
              <div className="text-start">
                <div className="mb-2">
                  <CheckCircleFill className="text-success me-2" />
                  <small>Automated outreach to qualified candidates</small>
                </div>
                <div className="mb-2">
                  <CheckCircleFill className="text-success me-2" />
                  <small>AI-filtered by job requirements</small>
                </div>
                <div className="mb-2">
                  <CheckCircleFill className="text-success me-2" />
                  <small>Real-time campaign tracking</small>
                </div>
                <div className="mb-2">
                  <CheckCircleFill className="text-success me-2" />
                  <small>Increased application rate</small>
                </div>
              </div>
            </div>

            <Button
              variant="primary"
              size="lg"
              className="w-100 py-3"
              onClick={openCampaignModal}
              disabled={!eligibilityStats?.eligibleApplicants && !eligibilityStats?.eligibleFromSystem}
            >
              {selectedCommunicationType === CampaignCommunicationType.SMS ? (
                <ChatDotsFill className="me-2" />
              ) : (
                <TelephoneFill className="me-2" />
              )}
              Create{' '}
              {selectedCommunicationType === CampaignCommunicationType.SMS ? 'SMS' : 'Calling'}{' '}
              Campaign
            </Button>

            {!eligibilityStats?.eligibleApplicants && !eligibilityStats?.eligibleFromSystem && (
              <div className="alert alert-warning mt-3 text-start">
                <InfoCircleFill className="me-2" />
                <strong>Campaign Unavailable</strong>
                <div className="mt-2">
                  <small>
                    No eligible candidates found for this job. Campaigns can only target candidates
                    who:
                  </small>
                  <ul className="mb-0 mt-1" style={{ fontSize: '0.875rem' }}>
                    <li>Applied directly to this job within the last 30 days, OR applied to general intake or other jobs at any time</li>
                    <li>Meet critical job requirements (CDL, experience, geography)</li>
                    <li>Have a minimum eligibility score of 50+</li>
                    <li>Can pass drug tests and background checks if required</li>
                  </ul>
                </div>
              </div>
            )}
          </Card.Body>
        </Card>
      )}

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
    </>
  );
}
