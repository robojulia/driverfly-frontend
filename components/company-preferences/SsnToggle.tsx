import React, { useState } from 'react';
import { Card, Button } from 'react-bootstrap';
import { InfoCircleFill } from 'react-bootstrap-icons';
import BaseCheck from '../forms/base-check';
import UnifiedModal from '../modals/Modal';

interface SsnToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  loading?: boolean;
}

export const SsnToggle: React.FC<SsnToggleProps> = ({ checked, onChange, loading = false }) => {
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [pendingChange, setPendingChange] = useState<boolean | null>(null);

  const handleToggleClick = (newValue: boolean) => {
    if (newValue && !checked) {
      // Show terms modal when enabling SSN collection
      setPendingChange(newValue);
      setShowTermsModal(true);
    } else {
      // Allow disabling without modal
      onChange(newValue);
    }
  };

  const handleAcceptTerms = () => {
    if (pendingChange !== null) {
      onChange(pendingChange);
      setPendingChange(null);
    }
    setShowTermsModal(false);
  };

  const handleRejectTerms = () => {
    setPendingChange(null);
    setShowTermsModal(false);
  };

  return (
    <>
      <Card className="border-0 shadow-sm mb-4">
        <Card.Body className="p-4">
          <div className="d-flex justify-content-between align-items-start">
            <div className="flex-grow-1">
              <h5 className="mb-2 d-flex align-items-center">
                <InfoCircleFill className="me-2 text-primary" size={20} />
                Privacy Settings
              </h5>
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <p className="mb-1 fw-medium">Add SSN on Digital Hiring Application</p>
                  <p className="text-muted small mb-0">
                    Collect Social Security Numbers during the application process
                  </p>
                </div>
                <BaseCheck
                  className="ms-3"
                  checked={checked}
                  onChange={(e) => handleToggleClick(e.target.checked)}
                  disabled={loading}
                />
              </div>
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* Terms and Conditions Modal */}
      {showTermsModal && (
        <UnifiedModal
          show={showTermsModal}
          onClose={handleRejectTerms}
          title="Privacy Notice: SSN Collection"
          size="lg"
        >
          <div>
            <div className="alert alert-warning mb-4" role="alert">
              <strong>IMPORTANT: </strong>
              Collecting Social Security Numbers is a significant privacy concern and should only be
              used for employment verification purposes.
            </div>

            <div className="mb-4">
              <h5>Terms and Conditions</h5>
              <ul className="list-unstyled">
                <li className="mb-3">
                  <strong>1. Employment Verification Only</strong>
                  <p className="mb-0 text-muted">
                    SSNs will only be used to verify employment eligibility and conduct background
                    checks. No other use is permitted.
                  </p>
                </li>
                <li className="mb-3">
                  <strong>2. Final Stage Candidates Only</strong>
                  <p className="mb-0 text-muted">
                    SSNs should only be collected from candidates who are in the final stages of the
                    hiring process, not from all applicants.
                  </p>
                </li>
                <li className="mb-3">
                  <strong>3. Restricted Access</strong>
                  <p className="mb-0 text-muted">
                    Only authorized personnel will have access to SSN information, and access will
                    be logged and monitored.
                  </p>
                </li>
                <li className="mb-3">
                  <strong>4. Data Security</strong>
                  <p className="mb-0 text-muted">
                    All SSN data is encrypted at rest and in transit, with industry-standard
                    security measures in place.
                  </p>
                </li>
              </ul>
            </div>

            <div className="alert alert-info" role="alert">
              <strong>NOTE: </strong>
              The DHA will be disabled for phone numbers that are not already in the system to
              prevent public collection of SSNs.
            </div>

            <div className="d-flex justify-content-center gap-3 mt-4">
              <Button variant="outline-secondary" onClick={handleRejectTerms}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleAcceptTerms}>
                I Accept Terms and Conditions
              </Button>
            </div>
          </div>
        </UnifiedModal>
      )}
    </>
  );
};
