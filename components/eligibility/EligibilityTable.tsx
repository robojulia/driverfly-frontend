import React, { useState, useEffect } from 'react';
import { EyeFill, PersonFill, GeoAltFill, CalendarFill, StarFill } from 'react-bootstrap-icons';
import Link from 'next/link';
import { useTranslation } from '../../hooks/use-translation';
import EligibilityApi, {
  ApplicantEligibilityResponse,
  ApplicantEligibilityScore,
  EligibilityQueryParams,
} from '../../pages/api/eligibility';
import styles from '../../styles/eligibility.module.css';

interface EligibilityTableProps {
  jobId: number;
  className?: string;
}

export const EligibilityTable: React.FC<EligibilityTableProps> = ({ jobId, className = '' }) => {
  const { t } = useTranslation();
  const [data, setData] = useState<ApplicantEligibilityResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<EligibilityQueryParams>({
    limit: 50,
    offset: 0,
    sortBy: 'score',
    sortOrder: 'DESC',
    minScore: 0,
    appliedOnly: false,
  });

  const loadData = async (newFilters: EligibilityQueryParams = filters) => {
    try {
      setLoading(true);
      const api = new EligibilityApi();
      const result = await api.getJobEligibilityScores(jobId, newFilters);
      setData(result);
    } catch (error) {
      console.error('Failed to load eligibility data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (jobId) {
      loadData();
    }
  }, [jobId]);

  const handleFilterChange = (key: keyof EligibilityQueryParams, value: any) => {
    const newFilters = { ...filters, [key]: value, offset: 0 };
    setFilters(newFilters);
    loadData(newFilters);
  };

  const handleLoadMore = () => {
    const newFilters = {
      ...filters,
      offset: (filters.offset || 0) + (filters.limit || 50),
    };
    setFilters(newFilters);
    loadData(newFilters).then(() => {
      if (data) {
        // Append new data to existing data
        setData((prev) =>
          prev
            ? {
                ...prev,
                scoredApplicants: [...prev.scoredApplicants, ...(data.scoredApplicants || [])],
              }
            : null
        );
      }
    });
  };

  const getStatusBadgeClass = (status: string): string => {
    switch (status) {
      case 'ELIGIBLE':
        return styles.eligible;
      case 'PARTIALLY_ELIGIBLE':
        return styles.partiallyEligible;
      case 'NOT_ELIGIBLE':
        return styles.notEligible;
      default:
        return styles.notEligible;
    }
  };

  const formatStatus = (status: string): string => {
    switch (status) {
      case 'ELIGIBLE':
        return 'Eligible';
      case 'PARTIALLY_ELIGIBLE':
        return 'Partially Eligible';
      case 'NOT_ELIGIBLE':
        return 'Not Eligible';
      default:
        return status;
    }
  };

  const getInterestLevelBadgeClass = (tier: string): string => {
    switch (tier) {
      case 'HIGH':
        return styles.interestHigh;
      case 'MEDIUM':
        return styles.interestMedium;
      case 'LOW':
        return styles.interestLow;
      case 'NONE':
      default:
        return styles.interestNone;
    }
  };

  const formatInterestLevel = (tier: string): string => {
    switch (tier) {
      case 'HIGH':
        return 'High';
      case 'MEDIUM':
        return 'Medium';
      case 'LOW':
        return 'Low';
      case 'NONE':
      default:
        return 'No Activity';
    }
  };

  const shouldShowEngagementBadge = (applicant: any): boolean => {
    return (
      applicant.hasApplied &&
      applicant.interestTier &&
      applicant.daysSinceLastEngagement !== null &&
      applicant.daysSinceLastEngagement <= 3
    );
  };

  if (loading && !data) {
    return (
      <div className={`${styles.eligibilityContainer} ${className}`}>
        <div className={styles.loading}>
          <div className={styles.loadingSpinner}></div>
          <span>Loading eligibility analysis...</span>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className={`${styles.eligibilityContainer} ${className}`}>
        <div className={styles.emptyState}>
          <div className={styles.emptyStateTitle}>Unable to Load Data</div>
          <p className={styles.emptyStateText}>
            Failed to load eligibility data. Please try again.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.eligibilityContainer} ${className} ${styles.fadeIn}`}>
      {/* Filters */}
      <div className={styles.filtersContainer}>
        <div className={styles.filterRow}>
          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Sort By</label>
            <select
              value={filters.sortBy || 'score'}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              className={styles.filterSelect}
            >
              <option value="score">Best Match</option>
              <option value="interestLevel">Interest Level</option>
              <option value="engagementCount">Engagement Count</option>
              <option value="firstName">First Name</option>
              <option value="lastName">Last Name</option>
              <option value="yearsExperience">Experience</option>
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Order</label>
            <select
              value={filters.sortOrder || 'DESC'}
              onChange={(e) => handleFilterChange('sortOrder', e.target.value as 'ASC' | 'DESC')}
              className={styles.filterSelect}
            >
              <option value="DESC">High to Low</option>
              <option value="ASC">Low to High</option>
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Applicant Type</label>
            <div className={styles.filterCheckbox}>
              <input
                type="checkbox"
                id="appliedOnly"
                checked={filters.appliedOnly || false}
                onChange={(e) => handleFilterChange('appliedOnly', e.target.checked)}
              />
              <label htmlFor="appliedOnly">Job applicants only</label>
            </div>
          </div>
        </div>
      </div>

      {/* Applicants Table */}
      <div className={styles.applicantEligibilityTableWrapper}>
        <table className={styles.applicantEligibilityTable}>
          <thead>
            <tr>
              <th>Applicant</th>
              <th>Status</th>
              <th>Experience</th>
              <th>Interest</th>
              <th>Location</th>
              <th>Applied</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.scoredApplicants.map((applicant: ApplicantEligibilityScore) => (
              <tr key={applicant.applicantId}>
                <td>
                  <div className={styles.applicantInfo}>
                    <div className={styles.applicantName}>
                      <PersonFill />
                      {applicant.applicant.firstName} {applicant.applicant.lastName}
                      {shouldShowEngagementBadge(applicant.applicant) ? (
                        <span className={styles.recentEngagementBadge}>
                          <StarFill size={12} />
                        </span>
                      ) : null}
                    </div>
                    <div className={styles.applicantDetails}>{applicant.applicant.phone}</div>
                  </div>
                </td>

                <td>
                  <span
                    className={`${styles.statusBadge} ${getStatusBadgeClass(
                      applicant.eligibilityStatus
                    )}`}
                  >
                    {formatStatus(applicant.eligibilityStatus)}
                  </span>
                </td>

                <td>
                  <div>
                    <strong>{applicant.applicant.yearsExperience}</strong> years
                  </div>
                </td>

                <td>
                  {applicant.applicant.hasApplied && applicant.applicant.interestTier ? (
                    <div className={styles.interestLevelCell}>
                      <span
                        className={`${styles.interestBadge} ${getInterestLevelBadgeClass(
                          applicant.applicant.interestTier
                        )}`}
                      >
                        {formatInterestLevel(applicant.applicant.interestTier)}
                      </span>
                    </div>
                  ) : applicant.applicant.isInterested && !applicant.applicant.hasApplied ? (
                    <div className={styles.interestLevelCell}>
                      <span
                        className={`${styles.interestBadge} ${styles.interestedBadge}`}
                        title="This candidate has expressed interest but has not yet applied"
                      >
                        Interested
                      </span>
                    </div>
                  ) : (
                    <span className={styles.textGray500}>-</span>
                  )}
                </td>

                <td>
                  <span className={styles.textGray500}>{applicant.applicant.location}</span>
                </td>

                <td>
                  {applicant.applicant.hasApplied ? (
                    <span className={styles.appliedBadge}>Applied</span>
                  ) : (
                    <span className={styles.textGray500}>General</span>
                  )}
                </td>

                <td>
                  <div className={`${styles.flexRow} ${styles.gap2}`}>
                    <Link
                      href={`/dashboard/company/jobs/${jobId}/applicants/${applicant.applicantId}/eligibility`}
                    >
                      <a
                        className={`${styles.button} ${styles.buttonOutlinePrimary} ${styles.buttonSm}`}
                      >
                        <EyeFill />
                        Details
                      </a>
                    </Link>

                    {/* <Link href={`/dashboard/company/applicants/${applicant.applicantId}`}>
                      <a
                        className={`${styles.button} ${styles.buttonOutlineSecondary} ${styles.buttonSm}`}
                      >
                        Profile
                      </a>
                    </Link> */}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Load More */}
      {data.pagination.hasMore && (
        <div className={`${styles.textCenter} ${styles.mt3}`}>
          <button
            className={`${styles.button} ${styles.buttonOutlinePrimary}`}
            onClick={handleLoadMore}
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Load More Applicants'}
          </button>
        </div>
      )}

      {data.scoredApplicants.length === 0 && (
        <div className={styles.emptyState}>
          <div className={styles.emptyStateTitle}>No Applicants Found</div>
          <p className={styles.emptyStateText}>
            No applicants match the current criteria. Try adjusting your filters or check back
            later.
          </p>
        </div>
      )}
    </div>
  );
};
