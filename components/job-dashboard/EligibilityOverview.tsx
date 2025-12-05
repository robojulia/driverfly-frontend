import React from 'react';
import { FilterCircleFill } from 'react-bootstrap-icons';
import { EligibilityTable } from '../eligibility/EligibilityTable';
import styles from '../../styles/job-dashboard.module.css';

interface EligibilityOverviewProps {
  jobId: number;
  loading?: boolean;
  className?: string;
  eligibilityStats?: any;
  loadingStats?: boolean;
}

export const EligibilityOverview: React.FC<EligibilityOverviewProps> = ({
  jobId,
  className = '',
  eligibilityStats,
  loadingStats,
}) => {
  return (
    <div className={className}>
      {/* Stats Cards Section */}
      {loadingStats ? (
        <div className="text-center p-4">
          <div className="spinner-border text-primary" />
          <p className="mt-2 text-muted">Loading eligibility data...</p>
        </div>
      ) : (
        <div className="row g-3 mb-0 d-none d-lg-flex">
          <div className="col-md-4">
            <div className="card">
              <div className="card-body text-center py-3">
                <div className="d-flex align-items-center justify-content-center mb-2">
                  <i
                    className="bi bi-person-fill text-primary me-2"
                    style={{ fontSize: '1.5rem' }}
                  ></i>
                  <div className="h3 mb-0 text-primary">
                    {eligibilityStats?.totalApplicants || 0}
                  </div>
                </div>
                <div className="text-muted">Applied</div>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card">
              <div className="card-body text-center py-3">
                <div className="d-flex align-items-center justify-content-center mb-2">
                  <i
                    className="bi bi-check-circle-fill text-success me-2"
                    style={{ fontSize: '1.5rem' }}
                  ></i>
                  <div className="h3 mb-0 text-success">
                    {eligibilityStats?.eligibleApplicants || 0}
                  </div>
                </div>
                <div className="text-muted">Eligible</div>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card">
              <div className="card-body text-center py-3">
                <div className="d-flex align-items-center justify-content-center mb-2">
                  <i
                    className="bi bi-database-fill text-info me-2"
                    style={{ fontSize: '1.5rem' }}
                  ></i>
                  <div className="h3 mb-0 text-info">
                    {eligibilityStats?.eligibleFromSystem || 0}
                  </div>
                </div>
                <div className="text-muted">Eligible from Entire System</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Eligibility Table Section */}
      <div className={styles.eligibilitySection} style={{ marginTop: '2rem' }}>
        <div className={styles.sectionContent}>
          <EligibilityTable jobId={jobId} />
        </div>
      </div>
    </div>
  );
};
