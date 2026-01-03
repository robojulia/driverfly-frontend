import React from 'react';
import { Modal, Button, Card, Row, Col, Badge } from 'react-bootstrap';
import {
  TelephoneFill,
  ChatDotsFill,
  InfoCircleFill,
  PeopleFill,
  Upload,
} from 'react-bootstrap-icons';
import { JobEntity } from '../../models/job/job.entity';
import { CampaignCommunicationType } from '../../enums/campaigns/campaign-communication-type.enum';
import { CampaignReachPreviewResponse } from '../../pages/api/campaigns';
import { BulkLeadDto } from '../../models/campaigns/bulk-lead-upload.dto';
import BulkLeadUpload from './campaign-creation/BulkLeadUpload';

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
  creatingCampaign: boolean;
  onCreateCampaign: () => void;
  uploadMode: 'auto' | 'manual';
  onUploadModeChange: (mode: 'auto' | 'manual') => void;
  bulkLeads: BulkLeadDto[];
  onBulkLeadsChange: (leads: BulkLeadDto[], isValid: boolean) => void;
  leadsValid: boolean;
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
  creatingCampaign,
  onCreateCampaign,
  uploadMode,
  onUploadModeChange,
  bulkLeads,
  onBulkLeadsChange,
  leadsValid,
}) => {
  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton className="border-0 pb-2">
        <Modal.Title>Create Campaign</Modal.Title>
      </Modal.Header>
      <Modal.Body className="pt-2">
        {/* Campaign Type Selection */}
        <div className="mb-4">
          <label className="form-label fw-semibold mb-3">Campaign Type</label>
          <Row className="g-3">
            <Col md={6}>
              <Card
                className={`h-100 transition-all ${
                  uploadMode === 'auto'
                    ? 'border-primary border-2 shadow-sm'
                    : 'border-secondary border-opacity-25'
                }`}
                style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
                onClick={() => onUploadModeChange('auto')}
              >
                <Card.Body className="text-center p-4">
                  <div className="mb-3">
                    <PeopleFill size={40} className="text-primary" />
                  </div>
                  <h6 className="mb-2">Auto-Target from Job</h6>
                  <p className="text-muted small mb-0">
                    Automatically target qualified candidates based on job requirements
                  </p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6}>
              <Card
                className={`h-100 transition-all ${
                  uploadMode === 'manual'
                    ? 'border-success border-2 shadow-sm'
                    : 'border-secondary border-opacity-25'
                }`}
                style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
                onClick={() => onUploadModeChange('manual')}
              >
                <Card.Body className="text-center p-4">
                  <div className="mb-3">
                    <Upload size={40} className="text-success" />
                  </div>
                  <h6 className="mb-2">Upload Lead List</h6>
                  <p className="text-muted small mb-0">
                    Import your own contact list (CSV or manual entry)
                  </p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </div>

        {/* Bulk Lead Upload Component (Manual Mode Only) */}
        {uploadMode === 'manual' && (
          <BulkLeadUpload onLeadsChange={onBulkLeadsChange} />
        )}

        {/* Communication Type Selection */}
        <div className="mb-4">
          <label className="form-label fw-semibold mb-3">Communication Method</label>
          <Row className="g-3">
            <Col md={6}>
              <Card
                className={`h-100 transition-all ${
                  selectedCommunicationType === CampaignCommunicationType.VOICE
                    ? 'border-primary border-2 shadow-sm'
                    : 'border-secondary border-opacity-25'
                } ${!callCampaignsEnabled ? 'opacity-50' : ''}`}
                style={{
                  cursor: callCampaignsEnabled ? 'pointer' : 'not-allowed',
                  transition: 'all 0.2s ease',
                }}
                onClick={() => {
                  if (callCampaignsEnabled) {
                    onCommunicationTypeChange(CampaignCommunicationType.VOICE);
                  }
                }}
              >
                <Card.Body className="text-center p-4">
                  <div className="mb-3">
                    <TelephoneFill
                      size={40}
                      className={callCampaignsEnabled ? 'text-primary' : 'text-muted'}
                    />
                  </div>
                  <h6 className={`mb-2 ${!callCampaignsEnabled ? 'text-muted' : ''}`}>
                    Voice Calls
                  </h6>
                  {!callCampaignsEnabled && (
                    <Badge bg="secondary" className="mb-2">
                      Coming Soon
                    </Badge>
                  )}
                  <p className="text-muted small mb-0">
                    {callCampaignsEnabled
                      ? 'Personal phone conversations'
                      : 'Available soon'}
                  </p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6}>
              <Card
                className={`h-100 transition-all ${
                  selectedCommunicationType === CampaignCommunicationType.SMS
                    ? 'border-success border-2 shadow-sm'
                    : 'border-secondary border-opacity-25'
                }`}
                style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
                onClick={() => onCommunicationTypeChange(CampaignCommunicationType.SMS)}
              >
                <Card.Body className="text-center p-4">
                  <div className="mb-3">
                    <ChatDotsFill size={40} className="text-success" />
                  </div>
                  <h6 className="mb-2">SMS Messages</h6>
                  {!callCampaignsEnabled && (
                    <Badge bg="success" className="mb-2">
                      Recommended
                    </Badge>
                  )}
                  <p className="text-muted small mb-0">
                    Direct text messages
                  </p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </div>

        {/* Campaign Overview (Auto Mode Only) */}
        {uploadMode === 'auto' && (
        <Card className="border-0 bg-light mb-4">
          <Card.Body className="p-4">
            <div className="text-center mb-4">
              <div className="mb-2">
                <PeopleFill size={24} className="text-primary me-2" />
                <span className="h2 mb-0">
                  {loadingReachPreview ? (
                    <span className="spinner-border spinner-border-sm" />
                  ) : (
                    reachPreview?.qualifiedPool ?? eligibilityStats?.eligibleApplicants ?? 0
                  )}
                </span>
              </div>
              <p className="text-muted mb-0">
                Qualified candidates ready to reach for <strong>{job.title}</strong>
              </p>
            </div>

            {/* Job Details */}
            <div className="d-flex justify-content-around text-center small">
              <div>
                <div className="text-muted">Location</div>
                <div className="fw-semibold">
                  {job.location?.city}, {job.location?.state}
                </div>
              </div>
              <div className="vr"></div>
              <div>
                <div className="text-muted">CDL Class</div>
                <div className="fw-semibold">{job.cdl_class || 'None'}</div>
              </div>
              <div className="vr"></div>
              <div>
                <div className="text-muted">Method</div>
                <div className="fw-semibold">
                  {selectedCommunicationType === CampaignCommunicationType.SMS ? 'SMS' : 'Voice'}
                </div>
              </div>
            </div>
          </Card.Body>
        </Card>
        )}

        {/* SMS Filtering Notice */}
        {selectedCommunicationType === CampaignCommunicationType.SMS &&
          reachPreview &&
          reachPreview.filteringDetails.filteredForSms > 0 && (
            <div className="alert alert-warning border-0 mb-3">
              <div className="d-flex align-items-start">
                <InfoCircleFill className="me-2 mt-1 flex-shrink-0" />
                <div className="small">
                  <strong>{reachPreview.filteringDetails.filteredForSms} candidates excluded</strong> -
                  {reachPreview.filteringDetails.reasons.noPhoneNumber > 0 && (
                    <span className="d-block text-muted">
                      {reachPreview.filteringDetails.reasons.noPhoneNumber} missing phone number or SMS authorization
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide} disabled={creatingCampaign}>
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={onCreateCampaign}
          disabled={
            creatingCampaign ||
            (uploadMode === 'manual' && (!leadsValid || bulkLeads.length === 0))
          }
          className="px-4"
        >
          {creatingCampaign ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" />
              Creating Campaign...
            </>
          ) : uploadMode === 'manual' ? (
            <>
              <Upload className="me-2" />
              Create Campaign with {bulkLeads.length} Lead{bulkLeads.length !== 1 ? 's' : ''}
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
