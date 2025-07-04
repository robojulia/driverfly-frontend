import { useState } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { Card, Button, Badge, Modal, Row, Col } from 'react-bootstrap';
import {
  TelephoneFill,
  PeopleFill,
  StarFill,
  FilterCircleFill,
  CheckCircleFill,
} from 'react-bootstrap-icons';
import { ExistingJobCampaigns } from '../campaigns';
import { JobEntity } from '../../models/job/job.entity';
import { CampaignEntity } from '../../models/campaigns/campaign.entity';
import { CampaignStatus } from '../../enums/campaigns/campaign-status.enum';
import { useTranslation } from '../../hooks/use-translation';
import { globalAjaxExceptionHandler } from '../../utils/ajax';
import CampaignsApi, { CreateJobReachoutCampaignDto } from '../../pages/api/campaigns';

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
  const router = useRouter();
  const { t } = useTranslation();
  const [campaignModalOpen, setCampaignModalOpen] = useState(false);
  const [creatingCampaign, setCreatingCampaign] = useState(false);

  // Check if there are any existing campaigns
  const draftCampaigns = campaigns.filter((c) => c.status === CampaignStatus.DRAFT);
  const completedCampaigns = campaigns.filter(
    (c) => c.status === CampaignStatus.COMPLETED || c.status === CampaignStatus.CANCELLED
  );
  const hasExistingCampaigns = campaigns.length > 0;
  const hasDraftCampaign = draftCampaigns.length > 0;

  const handleCreateCampaign = async () => {
    // Prevent creating duplicate draft campaigns
    if (hasDraftCampaign) {
      toast.warning(
        'You already have a draft campaign for this job. Please manage the existing draft campaign.'
      );
      setCampaignModalOpen(false);
      return;
    }

    try {
      setCreatingCampaign(true);
      const campaignsApi = new CampaignsApi();

      const campaignDto: CreateJobReachoutCampaignDto = {
        jobId: job.id,
        name: `Job Reachout - ${job.title}`,
        description: `Reaching out to qualified candidates for ${job.title} position`,
        minScore: 50, // Minimum eligibility score
        filters: {
          appliedOnly: false, // Exclude those who already applied to this job
          excludeDirectApplicants: true, // Only get candidates who applied to company but not this specific job
        },
      };

      const campaign = await campaignsApi.createJobReachoutCampaign(campaignDto);

      toast.success('Campaign created successfully! Redirecting to campaign management...');

      // Navigate to the campaign page
      setTimeout(() => {
        router.push(`/dashboard/company/campaigns/${campaign.id}`);
      }, 1500);

      // Call the callback if provided
      if (onCampaignCreated) {
        onCampaignCreated();
      }
    } catch (error) {
      // Handle specific ConflictException for duplicate draft campaigns
      if (error.response?.status === 409) {
        toast.warning(
          'You already have a draft campaign for this job. Please manage the existing draft campaign instead.',
          { autoClose: 8000 }
        );
      } else {
        globalAjaxExceptionHandler(error, {
          toast: toast,
          t: t,
          defaultMessage: 'Failed to create campaign',
        });
      }
    } finally {
      setCreatingCampaign(false);
      setCampaignModalOpen(false);
    }
  };

  if (campaignsLoading || !eligibilityStats) {
    return null;
  }

  // Debug logging
  console.log('CampaignCta Debug:', {
    campaigns,
    campaignsLength: campaigns.length,
    hasExistingCampaigns,
    draftCampaigns,
    completedCampaigns,
    eligibilityStats,
  });

  return (
    <>
      {hasExistingCampaigns ? (
        <ExistingJobCampaigns
          campaigns={campaigns}
          jobTitle={job.title}
          onManageDraft={() => setCampaignModalOpen(true)}
        />
      ) : (
        <Card className="border-0 shadow-sm position-sticky" style={{ top: '20px' }}>
          <Card.Body className="text-center p-4">
            <div className="mb-3">
              <TelephoneFill size={48} className="text-primary mb-3" />
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
              onClick={() => setCampaignModalOpen(true)}
              disabled={!eligibilityStats?.eligibleApplicants}
            >
              <TelephoneFill className="me-2" />
              Create Calling Campaign
            </Button>

            {!eligibilityStats?.eligibleApplicants && (
              <small className="text-muted mt-2 d-block">
                No eligible candidates found for this job
              </small>
            )}
          </Card.Body>
        </Card>
      )}

      {/* Campaign Creation Modal */}
      <Modal show={campaignModalOpen} onHide={() => setCampaignModalOpen(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <TelephoneFill className="me-2" />
            {completedCampaigns.length > 0
              ? 'Create New Calling Campaign'
              : 'Create Calling Campaign'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {completedCampaigns.length > 0 && (
            <div className="alert alert-info mb-4">
              <strong>Note:</strong> You&apos;ve previously run {completedCampaigns.length} campaign
              {completedCampaigns.length !== 1 ? 's' : ''} for this job. This will create a fresh
              campaign with updated targets.
            </div>
          )}

          <div className="text-center mb-4">
            <h5>
              Ready to reach {eligibilityStats?.eligibleApplicants || 0} qualified candidates?
            </h5>
            <p className="text-muted">
              We&apos;ll create a targeted calling campaign to reach out to drivers who meet your
              job requirements but haven&apos;t applied yet.
            </p>
          </div>

          <Card className="border-primary mb-4">
            <Card.Header className="bg-primary text-white">
              <h6 className="mb-0">
                <FilterCircleFill className="me-2" />
                Campaign Targeting
              </h6>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <strong>Job:</strong> {job.title}
                  <br />
                  <strong>Location:</strong> {job.location?.city}, {job.location?.state}
                  <br />
                  <strong>CDL Required:</strong> {job.cdl_class || 'None'}
                </Col>
                <Col md={6}>
                  <strong>Target Pool:</strong> {eligibilityStats?.eligibleApplicants || 0}{' '}
                  candidates
                  <br />
                  <strong>Min Score:</strong> 50% match
                  <br />
                  <strong>Excludes:</strong> Already applied
                </Col>
              </Row>
            </Card.Body>
          </Card>

          <div className="bg-light rounded p-3 mb-4">
            <Row className="text-center">
              <Col xs={4}>
                <PeopleFill className="text-primary mb-2 d-block" size={24} />
                <strong>Qualified Pool</strong>
                <br />
                <span className="text-primary h5">{eligibilityStats?.eligibleApplicants || 0}</span>
              </Col>
              <Col xs={4}>
                <TelephoneFill className="text-success mb-2 d-block" size={24} />
                <strong>Est. Contacts</strong>
                <br />
                <span className="text-success h5">
                  {Math.round((eligibilityStats?.eligibleApplicants || 0) * 0.7)}
                </span>
              </Col>
              <Col xs={4}>
                <StarFill className="text-warning mb-2 d-block" size={24} />
                <strong>Est. Interest</strong>
                <br />
                <span className="text-warning h5">
                  {Math.round((eligibilityStats?.eligibleApplicants || 0) * 0.2)}
                </span>
              </Col>
            </Row>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setCampaignModalOpen(false)}
            disabled={creatingCampaign}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleCreateCampaign}
            disabled={creatingCampaign}
            className="px-4"
          >
            {creatingCampaign ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" />
                Creating Campaign...
              </>
            ) : (
              <>
                <TelephoneFill className="me-2" />
                Create Campaign
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
