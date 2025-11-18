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
      <Card className="border-0 shadow-sm mb-4" style={{ background: 'white' }}>
        <Card.Body className="p-4">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h5 className="mb-1" style={{ color: '#1a202c', fontWeight: '600', fontSize: '14px' }}>
                Privacy Settings
              </h5>
              <p className="mb-0 small" style={{ color: '#718096' }}>
                Add SSN field on Digital Hiring Application
              </p>
            </div>

            <div className="d-flex align-items-center gap-3">
              <span className="small" style={{ color: checked ? '#1a202c' : '#718096', fontWeight: '500' }}>
                {checked ? 'Active' : 'Disabled'}
              </span>
              <BaseCheck
                checked={checked}
                onChange={(e) => handleToggleClick(e.target.checked)}
                disabled={loading}
              />
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
              Collecting Social Security Numbers requires careful handling and should only be used
              for candidates who are near to hire.
            </div>

            <div className="mb-4">
              <h5>Terms and Conditions</h5>
              <ul className="list-unstyled">
                <li className="mb-3">
                  <strong>1. Optional Collection</strong>
                  <p className="mb-0 text-muted">
                    SSN collection is optional for all candidates. They are not required to provide
                    it during the application process. If you need an SSN for employment
                    verification, you can communicate this requirement directly to the candidate or
                    they can provide it through alternative secure methods.
                  </p>
                </li>
                <li className="mb-3">
                  <strong>2. Near-to-Hire Candidates</strong>
                  <p className="mb-0 text-muted">
                    You agree that you are collecting SSN information because these candidates are
                    at a point in the application process where they are near to hire and you may
                    need this information for final employment verification and onboarding purposes.
                  </p>
                </li>
                <li className="mb-3">
                  <strong>3. Secure Handling and Privacy</strong>
                  <p className="mb-0 text-muted">
                    You agree to handle all SSN data securely and with respect for user privacy.
                    This includes limiting access to authorized personnel only, using secure
                    communication methods, and following all applicable privacy regulations.
                  </p>
                </li>
              </ul>
            </div>

            <div className="alert alert-info" role="alert">
              <strong>Remember: </strong>
              Candidates can choose not to provide their SSN during the application process. You can
              request this information directly when needed for final hiring decisions.
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
