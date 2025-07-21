import React from 'react';
import { Alert } from 'react-bootstrap';
import { ExclamationTriangleFill, Gear } from 'react-bootstrap-icons';
import { useAuth } from '../../../hooks/use-auth';

interface CompanyDisableBannerProps {
  className?: string;
}

const CompanyDisableBanner: React.FC<CompanyDisableBannerProps> = ({ className = '' }) => {
  const { company, user } = useAuth();

  // Don't show banner if no company or company is not disabled
  if (!company?.disabled) {
    return null;
  }

  // Check if user potentially has multiple companies by checking if they have company_admin or super_admin privileges
  const canSwitchCompanies = user?.jwt?.company_admin || user?.jwt?.super_admin;

  return (
    <Alert
      variant="danger"
      className={`mb-0 border-0 rounded-0 ${className}`}
      style={{ borderRadius: 0 }}
    >
      <div className="container-fluid">
        <div className="d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center">
            <ExclamationTriangleFill className="me-2" size={20} />
            <div>
              <strong>Company Account Disabled</strong>
              <div className="small">
                Your company account has been disabled. Most actions are currently blocked. Please
                contact support for assistance.
              </div>
            </div>
          </div>

          {canSwitchCompanies && (
            <div className="d-flex align-items-center">
              <Gear className="me-2" size={16} />
              <span className="small text-muted">Switch to another company if available</span>
            </div>
          )}
        </div>
      </div>
    </Alert>
  );
};

export default CompanyDisableBanner;
