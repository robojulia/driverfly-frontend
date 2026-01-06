import React, { useState } from 'react';
import { Card, Form, Button, Modal, Table, Row, Col, Badge } from 'react-bootstrap';
import { useTranslation } from '../../hooks/use-translation';

interface AutoRecruitingAddonProps {
  enabled: boolean;
  onToggle: (enabled: boolean) => Promise<void>;
  loading?: boolean;
}

export function AutoRecruitingAddon({
  enabled,
  onToggle,
  loading,
}: AutoRecruitingAddonProps) {
  const { t } = useTranslation();
  const [showPricing, setShowPricing] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [hasViewedPricing, setHasViewedPricing] = useState(false);

  const handleToggleClick = (checked: boolean) => {
    if (checked && !enabled) {
      // Must view pricing first before enabling
      if (!hasViewedPricing) {
        setShowPricing(true);
      } else {
        setShowConfirmation(true);
      }
    } else {
      // Disable immediately with confirmation
      setShowConfirmation(true);
    }
  };

  const handleViewPricing = () => {
    setHasViewedPricing(true);
    setShowPricing(false);
    setShowConfirmation(true);
  };

  const handleConfirm = async () => {
    setShowConfirmation(false);
    const newState = !enabled;
    await onToggle(newState);
  };

  const handleCancel = () => {
    setShowConfirmation(false);
  };

  return (
    <>
      <Card className="mb-4">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-start">
            <div className="flex-grow-1">
              <h5 className="mb-2">Auto Recruiting</h5>
              <p className="text-muted mb-3">
                Automatically match and engage with qualified driver candidates
                based on your job requirements and preferences. Pay per lead with
                hire bonuses.
              </p>
              <Button
                variant="outline-primary"
                size="sm"
                onClick={() => setShowPricing(true)}
              >
                View Pricing Details
              </Button>
            </div>
            <div className="ms-3 d-flex flex-column align-items-end">
              <Form.Check
                type="switch"
                id="auto-recruiting-toggle"
                checked={enabled}
                onChange={(e) => handleToggleClick(e.target.checked)}
                disabled={loading}
                label=""
                style={{ transform: 'scale(1.2)' }}
              />
              <small className="mt-1" style={{ fontSize: '12px', fontWeight: 500 }}>
                {enabled ? 'Enabled' : 'Disabled'}
              </small>
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* Pricing Details Modal */}
      <Modal
        show={showPricing}
        onHide={() => setShowPricing(false)}
        size="xl"
      >
        <Modal.Header closeButton>
          <Modal.Title>Auto Recruiting Pricing</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-4">
            <p className="lead mb-3">
              Pay per qualified lead with bonus fees per hire. Pricing varies by
              driver experience and application type.
            </p>
          </div>

          {/* Pricing Cards */}
          <Row className="mb-4">
            <Col md={6}>
              <Card className="border-primary mb-3">
                <Card.Header className="bg-primary text-white">
                  <h5 className="mb-0">SHORT FORM Applications</h5>
                  <small>Quick application - basic information</small>
                </Card.Header>
                <Card.Body>
                  {/* New Driver */}
                  <div className="mb-4 pb-3 border-bottom">
                    <h6 className="text-primary mb-3">
                      <Badge bg="primary" className="me-2">
                        New Driver
                      </Badge>
                    </h6>
                    <Row>
                      <Col>
                        <div className="p-3 bg-light rounded">
                          <div className="text-muted small mb-1">
                            With ATS Subscription
                          </div>
                          <div className="h4 mb-1">$15</div>
                          <div className="small text-muted">per lead</div>
                          <div className="mt-2 small">
                            <strong>+ $250</strong> per hire OR per 5 leads
                          </div>
                        </div>
                      </Col>
                      <Col>
                        <div className="p-3 bg-light rounded">
                          <div className="text-muted small mb-1">
                            Without ATS Subscription
                          </div>
                          <div className="h4 mb-1">$25</div>
                          <div className="small text-muted">per lead</div>
                          <div className="mt-2 small">
                            <strong>+ $350</strong> per hire OR per 5 leads
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </div>

                  {/* Experienced Driver */}
                  <div>
                    <h6 className="text-success mb-3">
                      <Badge bg="success" className="me-2">
                        Experienced / Safe Driver
                      </Badge>
                    </h6>
                    <Row>
                      <Col>
                        <div className="p-3 bg-light rounded">
                          <div className="text-muted small mb-1">
                            With ATS Subscription
                          </div>
                          <div className="h4 mb-1">$50</div>
                          <div className="small text-muted">per lead</div>
                          <div className="mt-2 small">
                            <strong>+ $450</strong> per hire OR per 5 leads
                          </div>
                        </div>
                      </Col>
                      <Col>
                        <div className="p-3 bg-light rounded">
                          <div className="text-muted small mb-1">
                            Without ATS Subscription
                          </div>
                          <div className="h4 mb-1">$60</div>
                          <div className="small text-muted">per lead</div>
                          <div className="mt-2 small">
                            <strong>+ $550</strong> per hire OR per 5 leads
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col md={6}>
              <Card className="border-info mb-3">
                <Card.Header className="bg-info text-white">
                  <h5 className="mb-0">LONG FORM Applications</h5>
                  <small>Complete application - detailed information</small>
                </Card.Header>
                <Card.Body>
                  {/* New Driver */}
                  <div className="mb-4 pb-3 border-bottom">
                    <h6 className="text-primary mb-3">
                      <Badge bg="primary" className="me-2">
                        New Driver
                      </Badge>
                    </h6>
                    <Row>
                      <Col>
                        <div className="p-3 bg-light rounded">
                          <div className="text-muted small mb-1">
                            With ATS Subscription
                          </div>
                          <div className="h4 mb-1">$45</div>
                          <div className="small text-muted">per lead</div>
                          <div className="mt-2 small">
                            <strong>+ $250</strong> per hire OR per 5 leads
                          </div>
                        </div>
                      </Col>
                      <Col>
                        <div className="p-3 bg-light rounded">
                          <div className="text-muted small mb-1">
                            Without ATS Subscription
                          </div>
                          <div className="h4 mb-1">$55</div>
                          <div className="small text-muted">per lead</div>
                          <div className="mt-2 small">
                            <strong>+ $350</strong> per hire OR per 5 leads
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </div>

                  {/* Experienced Driver */}
                  <div>
                    <h6 className="text-success mb-3">
                      <Badge bg="success" className="me-2">
                        Experienced / Safe Driver
                      </Badge>
                    </h6>
                    <Row>
                      <Col>
                        <div className="p-3 bg-light rounded">
                          <div className="text-muted small mb-1">
                            With ATS Subscription
                          </div>
                          <div className="h4 mb-1">$80</div>
                          <div className="small text-muted">per lead</div>
                          <div className="mt-2 small">
                            <strong>+ $450</strong> per hire OR per 5 leads
                          </div>
                        </div>
                      </Col>
                      <Col>
                        <div className="p-3 bg-light rounded">
                          <div className="text-muted small mb-1">
                            Without ATS Subscription
                          </div>
                          <div className="h4 mb-1">$90</div>
                          <div className="small text-muted">per lead</div>
                          <div className="mt-2 small">
                            <strong>+ $550</strong> per hire OR per 5 leads
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Important Notes */}
          <Card className="border-warning">
            <Card.Header className="bg-warning bg-opacity-10">
              <h6 className="mb-0">
                <i className="bi bi-info-circle me-2"></i>
                Important Terms
              </h6>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <div className="mb-3">
                    <strong>Consecutive Leads:</strong>
                    <p className="mb-0 small text-muted">
                      Combination of both short form and long form application
                      submissions.
                    </p>
                  </div>
                  <div className="mb-3">
                    <strong>Per Hire Fee:</strong>
                    <p className="mb-0 small text-muted">
                      Triggered when a driver stays in "Hired" status for more
                      than 1 week.
                    </p>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="mb-3">
                    <strong>Early Termination:</strong>
                    <p className="mb-0 small text-muted">
                      If terminated before max leads are met without hires, the
                      per-hire fee is prorated based on applicants sent.
                    </p>
                  </div>
                  <div className="mb-3">
                    <strong>Future Hires:</strong>
                    <p className="mb-0 small text-muted">
                      If applicants are hired at any time in the future, the
                      fee still applies.
                    </p>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowPricing(false)}>
            Close
          </Button>
          {!enabled && (
            <Button variant="primary" onClick={handleViewPricing}>
              I Understand - Enable Auto Recruiting
            </Button>
          )}
        </Modal.Footer>
      </Modal>

      {/* Confirmation Modal */}
      <Modal show={showConfirmation} onHide={handleCancel}>
        <Modal.Header closeButton>
          <Modal.Title>
            {enabled ? 'Disable' : 'Enable'} Auto Recruiting
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {enabled ? (
            <p>
              Are you sure you want to disable Auto Recruiting? This will stop
              automatic candidate matching and outreach.
            </p>
          ) : (
            <>
              <h6>Terms & Conditions</h6>
              <p>By enabling Auto Recruiting, you agree to the following:</p>
              <ul>
                <li>
                  Auto Recruiting will automatically search for and contact
                  qualified candidates on your behalf
                </li>
                <li>
                  You will be charged per lead based on driver type, application
                  form type, and your ATS subscription status
                </li>
                <li>
                  Additional charges apply per hire or per 5 consecutive leads
                  (whichever comes first)
                </li>
                <li>
                  You can disable this feature at any time through this billing
                  page
                </li>
                <li>
                  You remain responsible for reviewing and hiring all candidates
                </li>
              </ul>
              <p className="text-muted small">
                For full terms and conditions, please see our{' '}
                <a href="/terms" target="_blank">
                  Terms of Service
                </a>
                .
              </p>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCancel}>
            Cancel
          </Button>
          <Button
            variant={enabled ? 'danger' : 'primary'}
            onClick={handleConfirm}
            disabled={loading}
          >
            {enabled ? 'Disable' : 'Enable'}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
