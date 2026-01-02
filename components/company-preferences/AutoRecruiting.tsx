import React, { useState } from 'react';
import { Card } from 'react-bootstrap';
import BaseCheck from '../forms/base-check';
import BaseModal from '../modals/Modal';

interface AutoRecruitingProps {
  isEnabled: boolean;
  onChange: (enabled: boolean) => void;
  loading?: boolean;
}

export const AutoRecruiting: React.FC<AutoRecruitingProps> = ({
  isEnabled,
  onChange,
  loading = false,
}) => {
  const [showInfoModal, setShowInfoModal] = useState(false);

  const handleInfoClick = () => {
    setShowInfoModal(true);
  };

  const handleToggleChange = (checked: boolean) => {
    onChange(checked);
  };

  return (
    <>
      <Card className="border-0 shadow-sm mb-4" style={{ background: 'white' }}>
        <Card.Body className="p-4">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h5 className="mb-1" style={{ color: '#1a202c', fontWeight: '600', fontSize: '14px' }}>
                Auto Recruiting
              </h5>
              <p className="mb-0 small" style={{ color: '#718096' }}>
                Automatically receive qualified and interested applicants for your job listings.{' '}
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
          title="Auto Recruiting"
          size="lg"
        >
          <div className="mb-4">
            <p>
              Hire fast and efficiently through DriverFly&apos;s Auto Recruiting Services. Our system
              intelligently matches you with qualified and interested applicants for your active job
              listings.
            </p>

            <div className="alert alert-info" role="alert">
              <h6>These applicants will be:</h6>
              <ul className="mb-0">
                <li>
                  <strong>Qualified</strong> based on your active job listings
                </li>
                <li>
                  <strong>Interested</strong> in your applicable job postings
                </li>
                <li>
                  Provided with completed applications ready for your review
                </li>
              </ul>
            </div>

            <div className="alert alert-warning" role="alert">
              <strong>Note:</strong> Disabling auto recruiting may reduce your influx of qualified candidates
              and potential hires.
            </div>

            <p>
              <span>For questions about this service, please </span>
              <span className="text-primary fw-medium">contact our support team</span>
              <span> for more information.</span>
            </p>
          </div>
        </BaseModal>
      )}
    </>
  );
};
