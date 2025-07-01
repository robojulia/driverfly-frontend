import React from 'react';
import { Card, Button, Badge, ListGroup } from 'react-bootstrap';
import { Eye, TelephoneFill, Calendar, CheckCircleFill } from 'react-bootstrap-icons';
import Link from 'next/link';
import { CampaignEntity } from '../../models/campaigns/campaign.entity';
import { CampaignStatus } from '../../enums/campaigns/campaign-status.enum';
import { useTranslation } from '../../hooks/use-translation';

interface ExistingJobCampaignsProps {
  campaigns: CampaignEntity[];
  jobTitle: string;
  onManageDraft?: () => void;
}

export const ExistingJobCampaigns: React.FC<ExistingJobCampaignsProps> = ({
  campaigns,
  jobTitle,
  onManageDraft,
}) => {
  const { t } = useTranslation();

  const draftCampaigns = campaigns.filter((c) => c.status === CampaignStatus.DRAFT);
  const completedCampaigns = campaigns.filter(
    (c) => c.status === CampaignStatus.COMPLETED || c.status === CampaignStatus.CANCELLED
  );

  if (draftCampaigns.length > 0) {
    const draftCampaign = draftCampaigns[0];

    return (
      <Card className="border-0 shadow-sm position-sticky" style={{ top: '20px' }}>
        <Card.Body className="text-center p-4">
          <div className="mb-3">
            <TelephoneFill size={48} className="text-warning mb-3" />
            <h4 className="mb-2">Draft Campaign Exists</h4>
            <p className="text-muted mb-4">
              You already have a draft calling campaign for <strong>{jobTitle}</strong>. Manage your
              existing campaign or view its current targets.
            </p>
          </div>

          <Card className="border-warning mb-4">
            <Card.Header className="bg-warning bg-opacity-10">
              <div className="d-flex justify-content-between align-items-center">
                <strong>{draftCampaign.name}</strong>
                <Badge bg="warning">Draft</Badge>
              </div>
            </Card.Header>
            <Card.Body className="py-3">
              <div className="text-start">
                <div className="mb-2">
                  <strong>Target Count:</strong> {draftCampaign.totalTargets || 0} candidates
                </div>
                <div className="mb-2">
                  <strong>Created:</strong> {new Date(draftCampaign.createdAt).toLocaleDateString()}
                </div>
                {draftCampaign.description && (
                  <div>
                    <strong>Description:</strong> {draftCampaign.description}
                  </div>
                )}
              </div>
            </Card.Body>
          </Card>

          <div className="d-grid gap-2">
            <Link href={`/dashboard/company/campaigns/${draftCampaign.id}`} passHref>
              <Button variant="primary" size="lg" className="w-100 py-3">
                <Eye className="me-2" />
                Manage Draft Campaign
              </Button>
            </Link>
            <small className="text-muted mt-1">
              You can update targets, configure settings, or launch your campaign.
            </small>
          </div>
        </Card.Body>
      </Card>
    );
  }

  if (completedCampaigns.length > 0) {
    return (
      <Card className="border-0 shadow-sm position-sticky" style={{ top: '20px' }}>
        <Card.Body className="text-center p-4">
          <div className="mb-3">
            <CheckCircleFill size={48} className="text-success mb-3" />
            <h4 className="mb-2">Previous Campaigns</h4>
            <p className="text-muted mb-4">
              You've run {completedCampaigns.length} campaign
              {completedCampaigns.length !== 1 ? 's' : ''} for <strong>{jobTitle}</strong>. Review
              past results or create a new campaign.
            </p>
          </div>

          <Card className="border-light mb-4">
            <Card.Header className="bg-light">
              <strong>Campaign History</strong>
            </Card.Header>
            <ListGroup variant="flush">
              {completedCampaigns.slice(0, 3).map((campaign) => (
                <ListGroup.Item
                  key={campaign.id}
                  className="d-flex justify-content-between align-items-center"
                >
                  <div className="text-start">
                    <div className="fw-semibold">{campaign.name}</div>
                    <small className="text-muted">
                      {new Date(campaign.createdAt).toLocaleDateString()} • {campaign.totalTargets}{' '}
                      targets
                    </small>
                  </div>
                  <div className="text-end">
                    <Badge
                      bg={campaign.status === CampaignStatus.COMPLETED ? 'success' : 'secondary'}
                      className="mb-1"
                    >
                      {campaign.status === CampaignStatus.COMPLETED ? 'Completed' : 'Cancelled'}
                    </Badge>
                    <br />
                    <Link href={`/dashboard/company/campaigns/${campaign.id}`} passHref>
                      <Button variant="outline-primary" size="sm">
                        <Eye className="me-1" />
                        View
                      </Button>
                    </Link>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
            {completedCampaigns.length > 3 && (
              <Card.Footer className="text-center">
                <Link href="/dashboard/company/campaigns" passHref>
                  <Button variant="link" size="sm">
                    View All {completedCampaigns.length} Campaigns
                  </Button>
                </Link>
              </Card.Footer>
            )}
          </Card>

          <div className="d-grid gap-2">
            <Button
              variant="outline-primary"
              size="lg"
              className="w-100 py-3"
              onClick={onManageDraft}
            >
              <TelephoneFill className="me-2" />
              Create New Campaign
            </Button>
            <small className="text-muted mt-1">
              Start a fresh campaign to reach more qualified candidates.
            </small>
          </div>
        </Card.Body>
      </Card>
    );
  }

  return null;
};
