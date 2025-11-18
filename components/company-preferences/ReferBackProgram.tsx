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
      <Card className="border-0 shadow-sm mb-4" style={{ background: 'white' }}>
        <Card.Body className="p-4">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h5 className="mb-1" style={{ color: '#1a202c', fontWeight: '600', fontSize: '14px' }}>
                Refer Back Program
              </h5>
              <p className="mb-0 small" style={{ color: '#718096' }}>
                Enable automatic referral tracking and rewards.{' '}
                <a
                  href="#"
                  onClick={(e) => { e.preventDefault(); handleInfoClick(); }}
                  style={{ color: '#006078' }}
                >
                  Learn more
                </a>
              </p>
            </div>

            <div className="d-flex align-items-center gap-3">
              <span className="small" style={{ color: isEnabled ? '#1a202c' : '#718096', fontWeight: '500' }}>
                {isEnabled ? 'Active' : 'Disabled'}
              </span>
              <BaseCheck
                checked={isEnabled}
                onChange={(e) => handleToggleChange(e.target.checked)}
                disabled={loading}
              />
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
