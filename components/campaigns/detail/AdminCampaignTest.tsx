import React, { useState } from 'react';
import {
  Row,
  Col,
  Card,
  CardHeader,
  CardBody,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Alert,
} from 'reactstrap';
import {
  Gear,
  PlayFill,
  CheckCircleFill,
  XCircleFill,
  QuestionCircleFill,
} from 'react-bootstrap-icons';

import { CampaignEntity } from '../../../models/campaigns/campaign.entity';
import { CampaignTargetEntity } from '../../../models/campaigns/campaign-target.entity';
import { CampaignType } from '../../../enums/campaigns/campaign-type.enum';
import AdminCampaignsApi, { AdminCampaignCallResultDto } from '../../../pages/api/admin-campaigns';

interface AdminCampaignTestProps {
  campaign: CampaignEntity;
  onTestComplete?: () => void;
  onAddTestTarget?: () => void;
}

export const AdminCampaignTest: React.FC<AdminCampaignTestProps> = ({
  campaign,
  onTestComplete,
  onAddTestTarget,
}) => {
  const [selectedTargetId, setSelectedTargetId] = useState<number | null>(null);
  const [targetSearch, setTargetSearch] = useState<string>('');
  const [showTargetDropdown, setShowTargetDropdown] = useState(false);
  const [outcome, setOutcome] = useState<string>('COMPLETED');
  const [outcomeReason, setOutcomeReason] = useState<string>('');
  const [isInterested, setIsInterested] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const adminApi = new AdminCampaignsApi();

  // Get all campaign targets (not just test targets)
  const allTargets = campaign.targets || [];

  // Filter targets based on search
  const filteredTargets = allTargets
    .filter((target) => {
      if (!targetSearch) return true;

      const searchLower = targetSearch.toLowerCase();
      const targetName = target.name?.toLowerCase() || '';
      const targetEmail = target.email?.toLowerCase() || '';
      const targetPhone = target.phone?.toLowerCase() || '';
      const targetId = target.id?.toString() || '';

      return (
        targetName.includes(searchLower) ||
        targetEmail.includes(searchLower) ||
        targetPhone.includes(searchLower) ||
        targetId.includes(searchLower)
      );
    })
    .slice(0, 50); // Limit to first 50 results for performance

  // Get selected target details
  const selectedTarget = allTargets.find((target) => target.id === selectedTargetId);

  // Handle target selection
  const handleTargetSelect = (target: CampaignTargetEntity) => {
    setSelectedTargetId(target.id);
    setTargetSearch(target.name || target.email || `Target #${target.id}`);
    setShowTargetDropdown(false);
  };

  // Handle search input change
  const handleSearchChange = (value: string) => {
    setTargetSearch(value);
    setShowTargetDropdown(true);
    if (!value) {
      setSelectedTargetId(null);
    }
  };

  console.log('render admin');

  // Only show for job reachout campaigns
  if (campaign.type !== CampaignType.JOB_REACHOUT) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedTargetId) {
      setError('Please select a campaign target');
      return;
    }

    console.log('Submitting test with campaignTargetId:', selectedTargetId);

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const dto: AdminCampaignCallResultDto = {
        campaignTargetId: selectedTargetId,
        outcome,
        outcomeReason: outcomeReason || undefined,
        entities: {
          isInterested: isInterested,
        },
        callMetadata: {
          testMode: true,
          timestamp: new Date().toISOString(),
        },
      };

      console.log('API call dto:', dto);
      console.log('Will call URL:', `admin/campaigns/${dto.campaignTargetId}/test-call-result`);

      const response = await adminApi.testCampaignCallResult(dto);
      setResult(response);

      if (onTestComplete) {
        onTestComplete();
      }
    } catch (err: any) {
      console.error('API call failed:', err);
      setError(err.response?.data?.message || err.message || 'Failed to test campaign call result');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedTargetId(null);
    setTargetSearch('');
    setShowTargetDropdown(false);
    setOutcome('COMPLETED');
    setOutcomeReason('');
    setIsInterested(null);
    setResult(null);
    setError(null);
  };

  const getInterestIcon = (interested: boolean | null) => {
    if (interested === true) return <CheckCircleFill className="text-success" />;
    if (interested === false) return <XCircleFill className="text-danger" />;
    return <QuestionCircleFill className="text-muted" />;
  };

  const getInterestLabel = (interested: boolean | null) => {
    if (interested === true) return 'Interested';
    if (interested === false) return 'Not Interested';
    return 'Unclear / Not Collected';
  };

  return (
    <Row className="mt-5">
      <Col>
        <Card className="border-warning shadow-sm">
          <CardHeader className="bg-warning bg-opacity-15 border-warning py-4">
            <div className="d-flex align-items-center">
              <div
                className="d-flex align-items-center justify-content-center bg-warning text-white rounded-circle me-3"
                style={{ width: '40px', height: '40px' }}
              >
                <Gear size={20} />
              </div>
              <div className="flex-grow-1">
                <h5 className="fw-bold text-dark mb-1">Job Reachout Campaign Call Results</h5>
                <p className="text-muted mb-0 small">
                  Test different call outcomes and simulate campaign microservice responses
                </p>
              </div>
              <div className="badge bg-warning text-dark px-3 py-2 fw-semibold">
                Admin Testing Tool
              </div>
            </div>
          </CardHeader>
          <CardBody className="p-4">
            {error && (
              <Alert color="danger" className="mb-4">
                <strong>Error:</strong> {error}
              </Alert>
            )}

            {result && (
              <Alert color={result.success ? 'success' : 'danger'} className="mb-4">
                <strong>{result.success ? 'Success!' : 'Failed!'}</strong> {result.message}
              </Alert>
            )}

            <div className="bg-light border-start border-4 border-info p-3 mb-4 rounded-end">
              <div className="d-flex align-items-start">
                <QuestionCircleFill className="text-info me-3 mt-1 flex-shrink-0" size={18} />
                <div>
                  <h6 className="fw-semibold text-dark mb-2">About this tool</h6>
                  <p className="mb-0 text-muted">
                    Test different call outcomes for job reachout campaigns. This simulates campaign
                    microservice responses to test SMS delivery and engagement creation.
                  </p>
                </div>
              </div>
            </div>

            <Form onSubmit={handleSubmit}>
              <Row>
                <Col md={6}>
                  {/* Campaign Target Selection */}
                  <FormGroup className="mb-4">
                    <Label for="targetSearch" className="fw-semibold mb-2">
                      Campaign Target <span className="text-danger">*</span>
                    </Label>
                    <div className="position-relative">
                      <Input
                        type="text"
                        id="targetSearch"
                        placeholder="Search targets by name, email, phone, or ID..."
                        value={targetSearch}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        onFocus={() => setShowTargetDropdown(true)}
                        className="form-control-lg"
                        autoComplete="off"
                      />

                      {/* Dropdown with filtered results */}
                      {showTargetDropdown && filteredTargets.length > 0 && (
                        <div
                          className="position-absolute w-100 bg-white border rounded shadow-lg"
                          style={{
                            top: '100%',
                            zIndex: 1050,
                            maxHeight: '300px',
                            overflowY: 'auto',
                          }}
                        >
                          {filteredTargets.map((target) => (
                            <div
                              key={target.id}
                              className="p-3 border-bottom cursor-pointer hover-bg-light"
                              onClick={() => handleTargetSelect(target)}
                              style={{ cursor: 'pointer' }}
                              onMouseEnter={(e) =>
                                (e.currentTarget.style.backgroundColor = '#f8f9fa')
                              }
                              onMouseLeave={(e) =>
                                (e.currentTarget.style.backgroundColor = 'transparent')
                              }
                            >
                              <div className="fw-semibold">
                                Target #{target.id} - {target.name || 'Unknown Name'}
                              </div>
                              <small className="text-muted">
                                {target.email && `📧 ${target.email}`}
                                {target.phone && ` • 📞 ${target.phone}`}
                                {target.isTest && ' • 🧪 Test Target'}
                              </small>
                            </div>
                          ))}
                          {allTargets.length > 50 && (
                            <div className="p-2 text-center text-muted border-top">
                              <small>
                                Showing first 50 results. Continue typing to refine search.
                              </small>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Click outside to close */}
                      {showTargetDropdown && (
                        <div
                          className="position-fixed"
                          style={{
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            zIndex: 1040,
                          }}
                          onClick={() => setShowTargetDropdown(false)}
                        />
                      )}
                    </div>

                    {/* Selected target info */}
                    {selectedTarget && (
                      <div className="mt-2 p-2 bg-light rounded">
                        <small>
                          <strong>Selected:</strong> Target #{selectedTarget.id} -{' '}
                          {selectedTarget.name || 'Unknown'}
                          {selectedTarget.email && ` (${selectedTarget.email})`}
                          {selectedTarget.phone && ` • ${selectedTarget.phone}`}
                        </small>
                      </div>
                    )}

                    <small className="text-muted mt-2 d-block">
                      Search and select any campaign target. Total targets: {allTargets.length}
                    </small>
                  </FormGroup>

                  {/* Call Outcome */}
                  <FormGroup className="mb-4">
                    <Label for="outcomeSelect" className="fw-semibold mb-2">
                      Call Outcome <span className="text-danger">*</span>
                    </Label>
                    <Input
                      type="select"
                      id="outcomeSelect"
                      value={outcome}
                      onChange={(e) => setOutcome(e.target.value)}
                      required
                      className="form-select-lg"
                    >
                      <option value="COMPLETED">COMPLETED - Call was answered and completed</option>
                      <option value="NO_ANSWER">
                        NO_ANSWER - Call went to voicemail/no answer
                      </option>
                      <option value="BUSY">BUSY - Line was busy</option>
                      <option value="FAILED">FAILED - Call failed to connect</option>
                      <option value="CANCELLED">CANCELLED - Call was cancelled</option>
                    </Input>
                  </FormGroup>

                  {/* Outcome Reason (Optional) */}
                  <FormGroup className="mb-4">
                    <Label for="outcomeReason" className="fw-semibold mb-2">
                      Outcome Reason <span className="text-muted">(Optional)</span>
                    </Label>
                    <Input
                      type="select"
                      id="outcomeReason"
                      value={outcomeReason}
                      onChange={(e) => setOutcomeReason(e.target.value)}
                      className="form-select-lg"
                    >
                      <option value="">Select a reason (optional)...</option>
                      <option value="COMPLETED">COMPLETED - Call was completed successfully</option>
                      <option value="NO_ANSWER">NO_ANSWER - No answer or voicemail</option>
                      <option value="BUSY">BUSY - Line was busy</option>
                      <option value="FAILED">FAILED - Call failed to connect</option>
                      <option value="CANCELLED">CANCELLED - Call was cancelled</option>
                      <option value="INVALID_PHONE_NUMBER">
                        INVALID_PHONE_NUMBER - Phone number is invalid
                      </option>
                      <option value="SMS_NOT_AUTHORIZED">
                        SMS_NOT_AUTHORIZED - SMS not authorized for this number
                      </option>
                      <option value="DO_NOT_CALL_VIOLATION">
                        DO_NOT_CALL_VIOLATION - Number is on do not call list
                      </option>
                      <option value="TECHNICAL_ERROR">
                        TECHNICAL_ERROR - Technical error occurred
                      </option>
                    </Input>
                  </FormGroup>
                </Col>

                <Col md={6}>
                  {/* Interest Level */}
                  <FormGroup className="mb-4">
                    <Label className="fw-semibold mb-3">
                      Candidate Interest Level <span className="text-danger">*</span>
                    </Label>
                    <div className="border rounded p-3 bg-light">
                      <FormGroup check className="mb-3">
                        <Input
                          type="radio"
                          id="interested-yes"
                          name="interest"
                          checked={isInterested === true}
                          onChange={() => setIsInterested(true)}
                          className="me-2"
                        />
                        <Label
                          check
                          for="interested-yes"
                          className="d-flex align-items-center"
                          style={{ cursor: 'pointer' }}
                        >
                          {getInterestIcon(true)}
                          <span className="ms-2">
                            <strong className="text-success">Interested</strong>
                            <br />
                            <small className="text-muted">Will trigger SMS with job link</small>
                          </span>
                        </Label>
                      </FormGroup>

                      <FormGroup check className="mb-3">
                        <Input
                          type="radio"
                          id="interested-no"
                          name="interest"
                          checked={isInterested === false}
                          onChange={() => setIsInterested(false)}
                          className="me-2"
                        />
                        <Label
                          check
                          for="interested-no"
                          className="d-flex align-items-center"
                          style={{ cursor: 'pointer' }}
                        >
                          {getInterestIcon(false)}
                          <span className="ms-2">
                            <strong className="text-danger">Not Interested</strong>
                            <br />
                            <small className="text-muted">No SMS sent</small>
                          </span>
                        </Label>
                      </FormGroup>

                      <FormGroup check className="mb-0">
                        <Input
                          type="radio"
                          id="interested-unclear"
                          name="interest"
                          checked={isInterested === null}
                          onChange={() => setIsInterested(null)}
                          className="me-2"
                        />
                        <Label
                          check
                          for="interested-unclear"
                          className="d-flex align-items-center"
                          style={{ cursor: 'pointer' }}
                        >
                          {getInterestIcon(null)}
                          <span className="ms-2">
                            <strong className="text-muted">Unclear/Not Collected</strong>
                            <br />
                            <small className="text-muted">No SMS sent</small>
                          </span>
                        </Label>
                      </FormGroup>
                    </div>
                  </FormGroup>
                </Col>
              </Row>

              {/* Action Buttons */}
              <div className="d-flex gap-3 mt-4 pt-3 border-top">
                <Button
                  type="submit"
                  color="warning"
                  disabled={loading || !selectedTargetId}
                  className="px-4 py-2"
                  size="lg"
                >
                  {loading ? (
                    <>
                      <div className="spinner-border spinner-border-sm me-2" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                      Testing...
                    </>
                  ) : (
                    <>
                      <PlayFill size={16} className="me-2" />
                      Test Call Result
                    </>
                  )}
                </Button>

                <Button
                  type="button"
                  color="outline-secondary"
                  onClick={resetForm}
                  disabled={loading}
                  className="px-4 py-2"
                  size="lg"
                >
                  Reset
                </Button>
              </div>
            </Form>

            {/* Expected Behavior */}
            <div className="mt-5 p-4 bg-light border rounded">
              <h6 className="fw-semibold text-dark mb-3 d-flex align-items-center">
                <QuestionCircleFill className="text-info me-2" size={16} />
                Expected Behavior
              </h6>
              <Row>
                <Col md={6}>
                  <div className="mb-3">
                    <div className="d-flex align-items-center mb-1">
                      <CheckCircleFill className="text-success me-2" size={14} />
                      <strong className="text-success">If Interested = Yes:</strong>
                    </div>
                    <small className="text-muted ms-4">
                      Creates VERBAL_INTEREST engagement + sends SMS with job link through
                      conversation system
                    </small>
                  </div>
                  <div className="mb-3">
                    <div className="d-flex align-items-center mb-1">
                      <XCircleFill className="text-danger me-2" size={14} />
                      <strong className="text-danger">If Interested = No:</strong>
                    </div>
                    <small className="text-muted ms-4">Logs outcome, no SMS sent</small>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="mb-3">
                    <div className="d-flex align-items-center mb-1">
                      <QuestionCircleFill className="text-muted me-2" size={14} />
                      <strong className="text-muted">If Unclear:</strong>
                    </div>
                    <small className="text-muted ms-4">
                      Logs outcome for manual review, no SMS sent
                    </small>
                  </div>
                  <div className="mb-0">
                    <div className="d-flex align-items-center mb-1">
                      <Gear className="text-info me-2" size={14} />
                      <strong className="text-info">Additional Notes:</strong>
                    </div>
                    <small className="text-muted ms-4">
                      SMS sent to selected target&apos;s phone and logged in conversations. Campaign
                      tracking URL includes campaignId for analytics.
                    </small>
                  </div>
                </Col>
              </Row>
            </div>
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};
