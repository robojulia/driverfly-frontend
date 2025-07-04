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
    <div className={`${styles.eligibilityOverviewContainer} ${className}`}>
      {/* Stats Cards Section */}
      <div className={styles.statsSection}>
        {loadingStats ? (
          <div className="text-center p-4">
            <div className="spinner-border text-primary" />
            <p className="mt-2 text-muted">Loading eligibility data...</p>
          </div>
        ) : (
          <div className={styles.statsCards}>
            <div className={`${styles.statCard} ${styles.primaryStat}`}>
              <div className={styles.statNumber}>{eligibilityStats?.totalApplicants || 0}</div>
              <div className={styles.statLabel}>Total Applications</div>
              <div className={styles.statSubtext}>
                {eligibilityStats?.recentApplications || 0} submitted this week
                {eligibilityStats?.totalApplicants > 0 && (
                  <>
                    <br />
                    <span style={{ fontWeight: 500 }}>
                      {((eligibilityStats?.recentApplications || 0) / 7).toFixed(1)} per day avg
                    </span>
                  </>
                )}
              </div>
            </div>

            <div className={`${styles.statCard} ${styles.successStat}`}>
              <div className={styles.statNumber}>{eligibilityStats?.eligibleApplicants || 0}</div>
              <div className={styles.statLabel}>Qualified Candidates</div>
              <div className={styles.statSubtext}>
                {(eligibilityStats?.eligibilityRate || 0).toFixed(1)}% meet requirements
                {eligibilityStats?.averageScore > 0 && (
                  <>
                    <br />
                    <span style={{ fontWeight: 500 }}>
                      {eligibilityStats.averageScore.toFixed(1)} avg score
                    </span>
                  </>
                )}
              </div>
            </div>

            <div className={`${styles.statCard} ${styles.dangerStat}`}>
              <div className={styles.statNumber}>{eligibilityStats?.ineligibleApplicants || 0}</div>
              <div className={styles.statLabel}>Needs Review</div>
              <div className={styles.statSubtext}>
                Missing key requirements
                {eligibilityStats?.totalApplicants > 0 && (
                  <>
                    <br />
                    <span style={{ fontWeight: 500 }}>
                      {(100 - (eligibilityStats?.eligibilityRate || 0)).toFixed(1)}% rejection rate
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Eligibility Table Section */}
      <div className={styles.eligibilitySection}>
        <div className={styles.sectionHeader}>
          <h3 className={styles.sectionTitle}>
            <FilterCircleFill />
            Applicant Eligibility Analysis
          </h3>
        </div>

        <div className={styles.sectionContent}>
          <EligibilityTable jobId={jobId} />
        </div>
      </div>
    </div>
  );
};
