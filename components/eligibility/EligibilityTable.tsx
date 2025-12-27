import React, { useState, useEffect } from 'react';
import { EyeFill, PersonFill, GeoAltFill, CalendarFill, StarFill, BuildingFill } from 'react-bootstrap-icons';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import Link from 'next/link';
import moment from 'moment';
import { useTranslation } from '../../hooks/use-translation';
import { useAuth } from '../../hooks/use-auth';
import EligibilityApi, {
  ApplicantEligibilityResponse,
  ApplicantEligibilityScore,
  EligibilityQueryParams,
} from '../../pages/api/eligibility';
import AutoRecruitIndicator from './AutoRecruitIndicator';
import HiredIndicator from './HiredIndicator';
import { FitComparisonModal } from './FitComparisonModal';
import styles from '../../styles/eligibility.module.css';

interface EligibilityTableProps {
  jobId: number;
  className?: string;
}

export const EligibilityTable: React.FC<EligibilityTableProps> = ({ jobId, className = '' }) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [appliedData, setAppliedData] = useState<ApplicantEligibilityResponse | null>(null);
  const [eligibleData, setEligibleData] = useState<ApplicantEligibilityResponse | null>(null);
  const [crossCompanyData, setCrossCompanyData] = useState<ApplicantEligibilityResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<EligibilityQueryParams>({
    limit: 100,
    offset: 0,
    sortBy: 'score',
    sortOrder: 'DESC',
    minScore: 0,
  });
  const [showFitModal, setShowFitModal] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState<ApplicantEligibilityScore | null>(null);

  // Check if user manages multiple companies
  const hasMultipleCompanies = user?.jwt?.companies && user.jwt.companies.length > 1;

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

      // Fetch cross-company eligible candidates if user manages multiple companies
      if (hasMultipleCompanies) {
        try {
          const crossCompanyResult = await api.getJobEligibilityScores(jobId, {
            ...newFilters,
            appliedOnly: false,
            crossCompany: true,
          });
          setCrossCompanyData(crossCompanyResult);
        } catch (error) {
          console.error('Failed to load cross-company eligibility data:', error);
          setCrossCompanyData(null);
        }
      }
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

      // Fetch more cross-company candidates if applicable
      if (hasMultipleCompanies) {
        try {
          const crossCompanyResult = await api.getJobEligibilityScores(jobId, {
            ...newFilters,
            appliedOnly: false,
            crossCompany: true,
          });

          setCrossCompanyData((prev) =>
            prev
              ? {
                  ...crossCompanyResult,
                  scoredApplicants: [...prev.scoredApplicants, ...(crossCompanyResult.scoredApplicants || [])],
                }
              : crossCompanyResult
          );
        } catch (error) {
          console.error('Failed to load more cross-company data:', error);
        }
      }
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
      case 'UNKNOWN':
        return styles.unknown;
      default:
        return styles.notEligible;
    }
  };

  const formatStatus = (status: string): string => {
    switch (status) {
      case 'ELIGIBLE':
        return 'Yes';
      case 'PARTIALLY_ELIGIBLE':
        return 'Partially';
      case 'NOT_ELIGIBLE':
        return 'No';
      case 'UNKNOWN':
        return 'Unk';
      default:
        return status;
    }
  };

  const handleStatusBadgeClick = (applicant: ApplicantEligibilityScore) => {
    setSelectedApplicant(applicant);
    setShowFitModal(true);
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
  // This includes general applicants AND those who applied to other jobs in this company
  const eligibleApplicants = (eligibleData?.scoredApplicants || []).filter(
    (applicant: ApplicantEligibilityScore) =>
      !applicant.applicant.hasApplied &&
      (applicant.eligibilityStatus === 'ELIGIBLE' || applicant.eligibilityStatus === 'PARTIALLY_ELIGIBLE')
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
          const appliedDateA = new Date(a.applicant.created_at || 0).getTime();
          const appliedDateB = new Date(b.applicant.created_at || 0).getTime();
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

  // Cross-company eligible candidates: those from other companies in the network
  const crossCompanyApplicants = (crossCompanyData?.scoredApplicants || []).filter(
    (applicant: ApplicantEligibilityScore) =>
      !applicant.applicant.hasApplied &&
      (applicant.eligibilityStatus === 'ELIGIBLE' || applicant.eligibilityStatus === 'PARTIALLY_ELIGIBLE')
  );

  const sortedAppliedApplicants = applySorting(appliedApplicants);
  const sortedEligibleApplicants = applySorting(eligibleApplicants);
  const sortedCrossCompanyApplicants = applySorting(crossCompanyApplicants);

  const renderApplicantRow = (applicant: ApplicantEligibilityScore, showCompany: boolean = false) => (
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
          {applicant.eligibilityStatus === 'UNKNOWN' && applicant.scoringDetails?.missingFields ? (
            <OverlayTrigger
              placement="top"
              overlay={
                <Tooltip id={`tooltip-${applicant.applicantId}`}>
                  <div style={{ textAlign: 'left' }}>
                    <strong>Missing Information:</strong>
                    <ul style={{ margin: '4px 0', paddingLeft: '20px' }}>
                      {applicant.scoringDetails.missingFields.map((field, idx) => (
                        <li key={idx}>{field}</li>
                      ))}
                    </ul>
                  </div>
                </Tooltip>
              }
            >
              <span
                className={`${styles.statusBadge} ${getStatusBadgeClass(
                  applicant.eligibilityStatus
                )} ${styles.clickableBadge}`}
                onClick={() => handleStatusBadgeClick(applicant)}
              >
                {formatStatus(applicant.eligibilityStatus)}
              </span>
            </OverlayTrigger>
          ) : (
            <span
              className={`${styles.statusBadge} ${getStatusBadgeClass(
                applicant.eligibilityStatus
              )} ${styles.clickableBadge}`}
              onClick={() => handleStatusBadgeClick(applicant)}
            >
              {formatStatus(applicant.eligibilityStatus)}
            </span>
          )}
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

      {showCompany && (
        <td>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <BuildingFill size={14} className={styles.textGray500} />
            <span className={styles.textGray500}>
              {applicant.applicant.appliedCompanyName || '-'}
            </span>
          </div>
        </td>
      )}

      <td>
        <span className={styles.textGray500}>
          {applicant.applicant.created_at
            ? moment(applicant.applicant.created_at).format('MMM DD, YYYY')
            : applicant.lastUpdated
            ? moment(applicant.lastUpdated).format('MMM DD, YYYY')
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
          <h3 style={{ marginTop: '1.5rem', marginBottom: '0.75rem', fontSize: '1.25rem', fontWeight: '600', color: 'var(--text-primary)', background: 'transparent' }}>
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
                {sortedAppliedApplicants.map((applicant) => renderApplicantRow(applicant, false))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Eligible Candidates Table */}
      {sortedEligibleApplicants.length > 0 && (
        <>
          <h3 style={{ marginTop: '2rem', marginBottom: '0.5rem', fontSize: '1.25rem', fontWeight: '600', color: 'var(--text-primary)', background: 'transparent' }}>
            Eligible Candidates ({sortedEligibleApplicants.length})
          </h3>
          <p className={styles.textGray500} style={{ marginBottom: '0.75rem', fontSize: '0.9rem' }}>
            These candidates match your job requirements but haven't applied yet. They may have submitted general applications or applied to other jobs within your company.
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
                {sortedEligibleApplicants.map((applicant) => renderApplicantRow(applicant, false))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Cross-Company Eligible Candidates Table */}
      {hasMultipleCompanies && sortedCrossCompanyApplicants.length > 0 && (
        <>
          <h3 style={{ marginTop: '2rem', marginBottom: '0.5rem', fontSize: '1.25rem', fontWeight: '600', color: 'var(--text-primary)', background: 'transparent' }}>
            Eligible Candidates from Network Companies ({sortedCrossCompanyApplicants.length})
          </h3>
          <p className={styles.textGray500} style={{ marginBottom: '0.75rem', fontSize: '0.9rem' }}>
            These candidates match your job requirements and applied to other companies in your network. Consider reaching out to them for this position.
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
                  <th>Company</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedCrossCompanyApplicants.map((applicant) => renderApplicantRow(applicant, true))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Load More */}
      {(appliedData?.pagination.hasMore || eligibleData?.pagination.hasMore || crossCompanyData?.pagination.hasMore) && (
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

      {appliedApplicants.length === 0 && eligibleApplicants.length === 0 && crossCompanyApplicants.length === 0 && (
        <div className={styles.emptyState}>
          <div className={styles.emptyStateTitle}>No Applicants Found</div>
          <p className={styles.emptyStateText}>
            No applicants match the current criteria. Try adjusting your filters or check back
            later.
          </p>
        </div>
      )}

      {/* Fit Comparison Modal */}
      {selectedApplicant && (
        <FitComparisonModal
          show={showFitModal}
          onHide={() => {
            setShowFitModal(false);
            setSelectedApplicant(null);
          }}
          jobId={jobId}
          applicantId={selectedApplicant.applicantId}
          applicantName={`${selectedApplicant.applicant.firstName} ${selectedApplicant.applicant.lastName}`}
          eligibilityStatus={selectedApplicant.eligibilityStatus}
        />
      )}
    </div>
  );
};
