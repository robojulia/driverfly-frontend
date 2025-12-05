import React, { useState, useEffect } from 'react';
import { EyeFill, PersonFill, GeoAltFill, CalendarFill, StarFill } from 'react-bootstrap-icons';
import Link from 'next/link';
import moment from 'moment';
import { useTranslation } from '../../hooks/use-translation';
import EligibilityApi, {
  ApplicantEligibilityResponse,
  ApplicantEligibilityScore,
  EligibilityQueryParams,
} from '../../pages/api/eligibility';
import AutoRecruitIndicator from './AutoRecruitIndicator';
import HiredIndicator from './HiredIndicator';
import styles from '../../styles/eligibility.module.css';

interface EligibilityTableProps {
  jobId: number;
  className?: string;
}

export const EligibilityTable: React.FC<EligibilityTableProps> = ({ jobId, className = '' }) => {
  const { t } = useTranslation();
  const [appliedData, setAppliedData] = useState<ApplicantEligibilityResponse | null>(null);
  const [eligibleData, setEligibleData] = useState<ApplicantEligibilityResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<EligibilityQueryParams>({
    limit: 100,
    offset: 0,
    sortBy: 'score',
    sortOrder: 'DESC',
    minScore: 0,
  });

  const loadData = async (newFilters: EligibilityQueryParams = filters) => {
    try {
      setLoading(true);
      const api = new EligibilityApi();

      // Fetch applied applicants separately
      const appliedResult = await api.getJobEligibilityScores(jobId, {
        ...newFilters,
        appliedOnly: true,
      });

      // Fetch eligible candidates (who haven't applied) separately
      const eligibleResult = await api.getJobEligibilityScores(jobId, {
        ...newFilters,
        appliedOnly: false,
      });

      setAppliedData(appliedResult);
      setEligibleData(eligibleResult);
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

  const handleLoadMore = async () => {
    const newFilters = {
      ...filters,
      offset: (filters.offset || 0) + (filters.limit || 100),
    };
    setFilters(newFilters);

    try {
      const api = new EligibilityApi();

      // Fetch more applied applicants
      const appliedResult = await api.getJobEligibilityScores(jobId, {
        ...newFilters,
        appliedOnly: true,
      });

      // Fetch more eligible candidates
      const eligibleResult = await api.getJobEligibilityScores(jobId, {
        ...newFilters,
        appliedOnly: false,
      });

      // Append new data to existing data
      setAppliedData((prev) =>
        prev
          ? {
              ...appliedResult,
              scoredApplicants: [...prev.scoredApplicants, ...(appliedResult.scoredApplicants || [])],
            }
          : appliedResult
      );

      setEligibleData((prev) =>
        prev
          ? {
              ...eligibleResult,
              scoredApplicants: [...prev.scoredApplicants, ...(eligibleResult.scoredApplicants || [])],
            }
          : eligibleResult
      );
    } catch (error) {
      console.error('Failed to load more data:', error);
    }
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

  if (loading && !appliedData && !eligibleData) {
    return (
      <div className={`${styles.eligibilityContainer} ${className}`}>
        <div className={styles.loading}>
          <div className={styles.loadingSpinner}></div>
          <span>Loading eligibility analysis...</span>
        </div>
      </div>
    );
  }

  if (!appliedData && !eligibleData) {
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

  // Get applicants from the separate data sets
  const appliedApplicants = appliedData?.scoredApplicants || [];

  // Eligible candidates: those who have NOT applied to this job but ARE eligible/partially eligible
  // Filter out those who already applied (hasApplied) and those who applied to other specific jobs
  const eligibleApplicants = (eligibleData?.scoredApplicants || []).filter(
    (applicant: ApplicantEligibilityScore) =>
      !applicant.applicant.hasApplied &&
      (applicant.eligibilityStatus === 'ELIGIBLE' || applicant.eligibilityStatus === 'PARTIALLY_ELIGIBLE') &&
      !applicant.applicant.appliedJobId
  );

  // Apply sorting based on current filters
  const applySorting = (applicants: ApplicantEligibilityScore[]) => {
    const sortBy = filters.sortBy || 'score';
    const sortOrder = filters.sortOrder || 'DESC';

    return [...applicants].sort((a, b) => {
      let compareValue = 0;

      switch (sortBy) {
        case 'score':
          compareValue = a.score - b.score;
          break;
        case 'firstName':
          compareValue = a.applicant.firstName.localeCompare(b.applicant.firstName);
          break;
        case 'lastName':
          compareValue = a.applicant.lastName.localeCompare(b.applicant.lastName);
          break;
        case 'yearsExperience':
          compareValue = a.applicant.yearsExperience - b.applicant.yearsExperience;
          break;
        case 'interestLevel':
          const interestOrder = { 'HIGH': 3, 'MEDIUM': 2, 'LOW': 1, 'NONE': 0 };
          const aInterest = interestOrder[a.applicant.interestTier || 'NONE'];
          const bInterest = interestOrder[b.applicant.interestTier || 'NONE'];
          compareValue = aInterest - bInterest;
          break;
        case 'engagementCount':
          compareValue = (a.applicant.engagementCount || 0) - (b.applicant.engagementCount || 0);
          break;
        case 'dateApplied':
          const appliedDateA = new Date(a.applicant.dateApplied || 0).getTime();
          const appliedDateB = new Date(b.applicant.dateApplied || 0).getTime();
          compareValue = appliedDateA - appliedDateB;
          break;
        case 'createdAt':
        default:
          const dateA = new Date(a.lastUpdated || a.applicant.created_at || 0).getTime();
          const dateB = new Date(b.lastUpdated || b.applicant.created_at || 0).getTime();
          compareValue = dateA - dateB;
          break;
      }

      return sortOrder === 'DESC' ? -compareValue : compareValue;
    });
  };

  const sortedAppliedApplicants = applySorting(appliedApplicants);
  const sortedEligibleApplicants = applySorting(eligibleApplicants);

  const renderApplicantRow = (applicant: ApplicantEligibilityScore) => (
    <tr key={applicant.applicantId}>
      <td>
        <div className={styles.applicantInfo}>
          <div className={styles.applicantName}>
            <PersonFill />
            {applicant.applicant.firstName} {applicant.applicant.lastName}
            {applicant.applicant.isHired && <HiredIndicator />}
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            className={`${styles.statusBadge} ${getStatusBadgeClass(
              applicant.eligibilityStatus
            )}`}
          >
            {formatStatus(applicant.eligibilityStatus)}
          </span>
          {applicant.applicant.type === 'AUTO_RECRUIT' && <AutoRecruitIndicator />}
        </div>
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
        ) : applicant.applicant.appliedJobTitle ? (
          <span className={styles.textGray500} title={applicant.applicant.appliedJobTitle}>
            {applicant.applicant.appliedJobTitle}
          </span>
        ) : (
          <span className={styles.textGray500}>General</span>
        )}
      </td>

      <td>
        <span className={styles.textGray500}>
          {applicant.applicant.hasApplied && applicant.applicant.dateApplied
            ? moment(applicant.applicant.dateApplied).format('MMM DD, YYYY')
            : applicant.applicant.created_at
            ? moment(applicant.applicant.created_at).format('MMM DD, YYYY')
            : '-'}
        </span>
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
        </div>
      </td>
    </tr>
  );

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
              <option value="dateApplied">Date Applied</option>
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
        </div>
      </div>

      {/* Applied Applicants Table */}
      {sortedAppliedApplicants.length > 0 && (
        <>
          <h3 className={styles.tableTitle} style={{ marginTop: '1.5rem', marginBottom: '0.75rem' }}>
            Applied Applicants ({sortedAppliedApplicants.length})
          </h3>
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
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedAppliedApplicants.map(renderApplicantRow)}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Eligible Candidates Table */}
      {sortedEligibleApplicants.length > 0 && (
        <>
          <h3 className={styles.tableTitle} style={{ marginTop: '2rem', marginBottom: '0.5rem' }}>
            Eligible Candidates ({sortedEligibleApplicants.length})
          </h3>
          <p className={styles.textGray500} style={{ marginBottom: '0.75rem', fontSize: '0.9rem' }}>
            These candidates match your job requirements but haven't applied yet. They submitted general applications and are eligible for this position.
          </p>
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
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedEligibleApplicants.map(renderApplicantRow)}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Load More */}
      {(appliedData?.pagination.hasMore || eligibleData?.pagination.hasMore) && (
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

      {appliedApplicants.length === 0 && eligibleApplicants.length === 0 && (
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
