import React, { useEffect, useState } from 'react';
import { ArrowRight, PeopleFill, TrophyFill } from 'react-bootstrap-icons';
import Link from 'next/link';
import { useTranslation } from '../../hooks/use-translation';
import { useFeatureFlags } from '../../context/feature-flag-context';
import EligibilityApi from '../../pages/api/eligibility';
import styles from '../../styles/eligibility.module.css';

interface EligibilityBannerProps {
  jobId: number;
  className?: string;
}

interface EligibilitySummary {
  totalApplicants: number;
  eligibleApplicants: number;
  topScorePercent: number;
}

export const EligibilityBanner: React.FC<EligibilityBannerProps> = ({ jobId, className = '' }) => {
  const { t } = useTranslation();
  const { isFeatureEnabled } = useFeatureFlags();
  const [summary, setSummary] = useState<EligibilitySummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEligibilitySummary = async () => {
      try {
        setLoading(true);
        const api = new EligibilityApi();
        const data = await api.getJobEligibilitySummary(jobId);
        setSummary(data);
      } catch (error) {
        console.error('Failed to load eligibility summary:', error);
        // Set default values on error
        setSummary({
          totalApplicants: 0,
          eligibleApplicants: 0,
          topScorePercent: 0,
        });
      } finally {
        setLoading(false);
      }
    };

    if (jobId) {
      loadEligibilitySummary();
    }
  }, [jobId]);

  // Check if the eligibility banner feature is enabled
  if (!isFeatureEnabled('eligibility_analysis')) {
    return null;
  }

  if (loading) {
    return (
      <div className={`${styles.eligibilityContainer} ${styles.eligibilityBanner} ${className}`}>
        <div className={styles.loading}>
          <div className={styles.loadingSpinner}></div>
          <span>Loading eligibility data...</span>
        </div>
      </div>
    );
  }

  if (!summary) {
    return null;
  }

  const { totalApplicants, eligibleApplicants } = summary;
  const eligibilityRate =
    totalApplicants > 0 ? Math.round((eligibleApplicants / totalApplicants) * 100) : 0;

  // Determine if this is exciting news
  const isExciting = eligibleApplicants >= 10 || eligibilityRate >= 50;

  return (
    <div className={styles.eligibilityContainer}>
      <Link href={`/dashboard/company/jobs/${jobId}/applicants/eligibility`}>
        <a
          className={`${styles.eligibilityBanner} ${styles.clickable} ${
            isExciting ? styles.highlight : ''
          } ${className}`}
        >
          <div className={styles.eligibilityBannerContent}>
            <div className={styles.eligibilityBannerLeft}>
              <div className={styles.eligibilityBannerText}>
                <PeopleFill />
                {eligibleApplicants === 0
                  ? 'No eligible applicants found yet'
                  : eligibleApplicants === 1
                  ? '1 eligible applicant found!'
                  : `${eligibleApplicants} eligible applicants found!`}
              </div>
              <div className={styles.eligibilityBannerSubtext}>
                {totalApplicants > 0 ? (
                  <>
                    {eligibilityRate}% match rate • {totalApplicants} total applicants
                  </>
                ) : (
                  'Check detailed eligibility analysis and discover quality matches'
                )}
              </div>
            </div>
            <div className={styles.eligibilityBannerAction}>
              View applicants <ArrowRight className="ms-2" />
            </div>
          </div>
        </a>
      </Link>
    </div>
  );
};
