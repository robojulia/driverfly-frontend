import React, { useState } from 'react';
import { Card, Badge } from 'react-bootstrap';
import { CheckCircleFill, InfoCircleFill } from 'react-bootstrap-icons';
import BaseCheck from '../forms/base-check';
import BaseModal from '../modals/Modal';

interface ReferBackProgramProps {
  isEnabled: boolean;
  onChange: (enabled: boolean) => void;
  loading?: boolean;
}

export const ReferBackProgram: React.FC<ReferBackProgramProps> = ({
  isEnabled,
  onChange,
  loading = false,
}) => {
  const [showInfoModal, setShowInfoModal] = useState(false);

  const handleInfoClick = () => {
    setShowInfoModal(true);
  };

  const handleToggleChange = (checked: boolean) => {
    // Make it harder to turn off - could add confirmation modal here
    onChange(checked);
  };

  return (
    <>
      <Card className={`border-0 shadow-sm mb-4 ${isEnabled ? 'border-success' : ''}`}>
        <Card.Body className="p-4">
          <div className="d-flex justify-content-between align-items-start">
            <div className="flex-grow-1">
              <div className="d-flex align-items-center mb-2">
                {isEnabled && <CheckCircleFill className="me-2 text-success" size={20} />}
                <h5 className="mb-0">Refer Back Program</h5>
                {isEnabled && (
                  <Badge bg="success" className="ms-2">
                    Active
                  </Badge>
                )}
              </div>

              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <p className="mb-1 text-muted">
                    Refer drivers who don&apos;t qualify for your positions to other organizations
                  </p>
                  <button
                    type="button"
                    className="btn btn-link p-0 text-primary small"
                    onClick={handleInfoClick}
                  >
                    <InfoCircleFill className="me-1" size={14} />
                    Learn More
                  </button>
                </div>

                {/* Make toggle more subtle when enabled */}
                <div className={`${isEnabled ? 'opacity-75' : ''}`}>
                  <BaseCheck
                    className="ms-3"
                    checked={isEnabled}
                    onChange={(e) => handleToggleChange(e.target.checked)}
                    disabled={loading}
                  />
                </div>
              </div>

              {isEnabled && (
                <div className="mt-3 p-3 bg-light rounded">
                  <small className="text-muted">
                    Your company is participating in the Refer Back Program. Drivers who apply but
                    don&apos;t qualify for your positions will be referred to other organizations
                    that may be a better fit.
                  </small>
                </div>
              )}
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* Information Modal */}
      {showInfoModal && (
        <BaseModal
          show={showInfoModal}
          onClose={() => setShowInfoModal(false)}
          title="Refer Back Program"
          size="lg"
        >
          <div className="mb-4">
            <p>
              The Refer Back Program helps drivers who apply to your company but don&apos;t qualify
              for your positions by referring them to other organizations that may be a better fit.
            </p>
            <p>
              When drivers apply to your company but don&apos;t meet your requirements or
              aren&apos;t hired, we&apos;ll refer them to other trucking companies that might have
              suitable opportunities.
            </p>

            <div className="alert alert-info" role="alert">
              <h6>How It Works</h6>
              <ul className="mb-0">
                <li>Driver applies to your company through the platform</li>
                <li>
                  If they don&apos;t qualify or aren&apos;t hired, they&apos;re entered into the
                  refer back pool
                </li>
                <li>
                  We refer them to other trucking companies that might have suitable positions for
                  their qualifications
                </li>
              </ul>
            </div>

            <p>
              <span>For questions about this program, please </span>
              <span> </span>
              <span className="text-primary fw-medium">contact our support team</span>
              <span> for more information.</span>
            </p>
          </div>
        </BaseModal>
      )}
    </>
  );
};
