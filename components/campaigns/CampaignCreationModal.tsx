import React from 'react';
import { Modal, Button, Card, Row, Col, Badge } from 'react-bootstrap';
import {
  TelephoneFill,
  ChatDotsFill,
  InfoCircleFill,
  FilterCircleFill,
  PeopleFill,
} from 'react-bootstrap-icons';
import { JobEntity } from '../../models/job/job.entity';
import { CampaignCommunicationType } from '../../enums/campaigns/campaign-communication-type.enum';
import { CampaignReachPreviewResponse } from '../../pages/api/campaigns';

interface CampaignCreationModalProps {
  show: boolean;
  onHide: () => void;
  job: JobEntity;
  selectedCommunicationType: CampaignCommunicationType;
  onCommunicationTypeChange: (type: CampaignCommunicationType) => void;
  callCampaignsEnabled: boolean;
  reachPreview: CampaignReachPreviewResponse | null;
  loadingReachPreview: boolean;
  eligibilityStats: any;
  completedCampaigns: any[];
  creatingCampaign: boolean;
  onCreateCampaign: () => void;
}

export const CampaignCreationModal: React.FC<CampaignCreationModalProps> = ({
  show,
  onHide,
  job,
  selectedCommunicationType,
  onCommunicationTypeChange,
  callCampaignsEnabled,
  reachPreview,
  loadingReachPreview,
  eligibilityStats,
  completedCampaigns,
  creatingCampaign,
  onCreateCampaign,
}) => {
  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>
          {selectedCommunicationType === CampaignCommunicationType.SMS ? (
            <ChatDotsFill className="me-2" />
          ) : (
            <TelephoneFill className="me-2" />
          )}
          {completedCampaigns.length > 0
            ? `Create New ${
                selectedCommunicationType === CampaignCommunicationType.SMS ? 'SMS' : 'Calling'
              } Campaign`
            : `Create ${
                selectedCommunicationType === CampaignCommunicationType.SMS ? 'SMS' : 'Calling'
              } Campaign`}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* Communication Type Selection */}
        <Card className="border-light mb-4">
          <Card.Header className="bg-light">
            <h6 className="mb-0">Choose Communication Method</h6>
          </Card.Header>
          <Card.Body>
            <Row>
              <Col md={6}>
                <Card
                  className={`h-100 ${
                    selectedCommunicationType === CampaignCommunicationType.VOICE
                      ? 'border-primary'
                      : 'border-light'
                  } ${!callCampaignsEnabled ? 'opacity-50' : ''}`}
                  style={{
                    cursor: callCampaignsEnabled ? 'pointer' : 'not-allowed',
                  }}
                  onClick={() => {
                    if (callCampaignsEnabled) {
                      onCommunicationTypeChange(CampaignCommunicationType.VOICE);
                    }
                  }}
                >
                  <Card.Body className="text-center p-3">
                    <TelephoneFill
                      size={32}
                      className={`mb-2 ${callCampaignsEnabled ? 'text-primary' : 'text-muted'}`}
                    />
                    <h6 className={callCampaignsEnabled ? '' : 'text-muted'}>
                      Voice Calls
                      {!callCampaignsEnabled && (
                        <Badge bg="secondary" className="ms-2">
                          Coming Soon
                        </Badge>
                      )}
                    </h6>
                    <small className="text-muted">
                      {callCampaignsEnabled
                        ? 'Personal phone conversations with candidates'
                        : 'Call campaigns are coming soon!'}
                    </small>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={6}>
                <Card
                  className={`h-100 ${
                    selectedCommunicationType === CampaignCommunicationType.SMS
                      ? 'border-success'
                      : 'border-light'
                  } ${!callCampaignsEnabled ? 'border-success bg-light' : ''}`}
                  style={{ cursor: 'pointer' }}
                  onClick={() => onCommunicationTypeChange(CampaignCommunicationType.SMS)}
                >
                  <Card.Body className="text-center p-3">
                    <ChatDotsFill size={32} className="text-success mb-2" />
                    <h6>
                      SMS Messages
                      {!callCampaignsEnabled && (
                        <Badge bg="success" className="ms-2">
                          Recommended
                        </Badge>
                      )}
                    </h6>
                    <small className="text-muted">Text messages to candidates&apos; phones</small>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {!callCampaignsEnabled && (
          <div className="alert alert-info mb-4">
            <InfoCircleFill className="me-2" />
            <strong>SMS campaigns are currently available.</strong> Voice call campaigns are coming
            soon! SMS campaigns provide effective reach and higher engagement rates with qualified
            candidates.
          </div>
        )}

        <div className="text-center mb-4">
          <h5>
            Ready to reach{' '}
            {loadingReachPreview ? (
              <span className="spinner-border spinner-border-sm mx-2" />
            ) : (
              reachPreview?.qualifiedPool ?? eligibilityStats?.eligibleApplicants ?? 0
            )}{' '}
            qualified candidates?
          </h5>
          <p className="text-muted">
            We&apos;ll create a targeted{' '}
            {selectedCommunicationType === CampaignCommunicationType.SMS ? 'SMS' : 'calling'}{' '}
            campaign to reach out to drivers who meet your job requirements but haven&apos;t applied
            yet.
          </p>

          {/* Show SMS filtering info if applicable */}
          {selectedCommunicationType === CampaignCommunicationType.SMS &&
            reachPreview &&
            reachPreview.filteringDetails.filteredForSms > 0 && (
              <div className="alert alert-info mt-3">
                <InfoCircleFill className="me-2" />
                <strong>SMS Compliance:</strong> {reachPreview.filteringDetails.filteredForSms}{' '}
                candidates were filtered out because they don&apos;t authorize SMS communication.
                <div className="mt-2">
                  {reachPreview.filteringDetails.reasons.noPhoneNumber > 0 && (
                    <small className="d-block">
                      • {reachPreview.filteringDetails.reasons.noPhoneNumber} have no phone number
                    </small>
                  )}
                </div>
              </div>
            )}
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
                <strong>Target Pool:</strong>{' '}
                {loadingReachPreview ? (
                  <span className="spinner-border spinner-border-sm" />
                ) : (
                  <>
                    {reachPreview?.qualifiedPool ?? eligibilityStats?.eligibleApplicants ?? 0}{' '}
                    candidates
                  </>
                )}
              </Col>
            </Row>
          </Card.Body>
        </Card>

        <div className="bg-light rounded p-3 mb-4">
          <div className="text-center">
            <strong>Qualified Pool</strong>
            <br />
            {loadingReachPreview ? (
              <span className="spinner-border spinner-border-sm" />
            ) : (
              <span className="text-primary h4">
                {reachPreview?.qualifiedPool ?? eligibilityStats?.eligibleApplicants ?? 0}
              </span>
            )}
            <br />
            <small className="text-muted">eligible candidates</small>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide} disabled={creatingCampaign}>
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={onCreateCampaign}
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
              {selectedCommunicationType === CampaignCommunicationType.SMS ? (
                <ChatDotsFill className="me-2" />
              ) : (
                <TelephoneFill className="me-2" />
              )}
              Create Campaign
            </>
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
