import { useTranslation } from '../../hooks/use-translation';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ViewApplicantDetailProps } from '../../types/applicant/view-application-detail-props.type';
import { ApplicantSuggestedJobEntity } from '../../models/applicant/applicant-suggested-job.entity';
import Section from '../view-details/section';
import { Row, Col } from 'react-bootstrap';
import EligibilityApi from '../../pages/api/eligibility';
import { useAuth } from '../../hooks/use-auth';

interface ApplicantJobsAppliedToProps extends ViewApplicantDetailProps {
  applicantSuggestedJobs?: ApplicantSuggestedJobEntity[];
}

export default function ApplicantJobsAppliedTo({
  applicant,
  applicantSuggestedJobs,
}: ApplicantJobsAppliedToProps) {
  const { t } = useTranslation();
  const { company } = useAuth();
  const appliedJobs = applicant?.jobs || [];
  const [appliedJobsWithScores, setAppliedJobsWithScores] = useState<any[]>([]);
  const [eligibleJobs, setEligibleJobs] = useState<any[]>([]);
  const [isLoadingScores, setIsLoadingScores] = useState(false);
  const [isLoadingEligible, setIsLoadingEligible] = useState(false);

  useEffect(() => {
    // Fetch eligibility scores for jobs the applicant has already applied to
    const fetchAppliedJobScores = async () => {
      if (!applicant?.id || appliedJobs.length === 0) {
        setAppliedJobsWithScores(appliedJobs);
        return;
      }

      try {
        setIsLoadingScores(true);
        const eligibilityApi = new EligibilityApi();

        // Fetch eligibility score for each applied job
        const jobsWithScores = await Promise.all(
          appliedJobs.map(async (appliedJob) => {
            if (!appliedJob.job?.id) return { ...appliedJob, eligibilityScore: null };

            try {
              const eligibility = await eligibilityApi.getApplicantJobEligibility(
                appliedJob.job.id,
                applicant.id
              );
              return {
                ...appliedJob,
                eligibilityScore: eligibility.score,
                eligibilityStatus: eligibility.eligibilityStatus,
              };
            } catch (error) {
              console.error(`Failed to fetch eligibility for job ${appliedJob.job.id}:`, error);
              return { ...appliedJob, eligibilityScore: null };
            }
          })
        );

        setAppliedJobsWithScores(jobsWithScores);
      } catch (error) {
        console.error('Failed to fetch applied job scores:', error);
        setAppliedJobsWithScores(appliedJobs);
      } finally {
        setIsLoadingScores(false);
      }
    };

    fetchAppliedJobScores();
  }, [applicant?.id, appliedJobs.length]);

  useEffect(() => {
    // Fetch OTHER eligible jobs for this applicant (jobs they haven't applied to)
    const fetchEligibleJobs = async () => {
      if (!applicant?.id || !company?.id) return;

      try {
        setIsLoadingEligible(true);
        const eligibilityApi = new EligibilityApi();
        const response = await eligibilityApi.getApplicantEligibleJobs(applicant.id, {
          companyId: company.id,
          minScore: 50, // Only show jobs where applicant scores at least 50%
        });

        const jobs = response?.jobs || [];

        // Filter out jobs the applicant has already applied to
        const appliedJobIds = appliedJobs.map(aj => aj.job?.id);
        const filteredJobs = jobs.filter((job: any) => !appliedJobIds.includes(job.jobId || job.id));

        setEligibleJobs(filteredJobs);
      } catch (error) {
        console.error('Failed to fetch eligible jobs:', error);
        setEligibleJobs([]);
      } finally {
        setIsLoadingEligible(false);
      }
    };

    fetchEligibleJobs();
  }, [applicant?.id, company?.id, appliedJobs.length]);

  return (
    <Row className="px-2">
      <Col md="12" className="p-0 px-lg-2">
        <Section title={t('JOBS_APPLIED_TO')}>
          <Row>
            {/* Left column: Jobs Applied To (with eligibility scores) */}
            <Col md="6">
              <h6 className="mb-3" style={{ fontWeight: 600, fontSize: '0.95rem' }}>
                {t('APPLIED_JOBS')}
              </h6>
              {isLoadingScores ? (
                <div className="text-muted">
                  <div className="spinner-border spinner-border-sm me-2" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  {t('Loading eligibility scores...')}
                </div>
              ) : appliedJobsWithScores.length === 0 ? (
                <div className="text-muted">
                  {t('NO_SPECIFIC_JOB_APPLICATION')}
                </div>
              ) : (
                <div>
                  {appliedJobsWithScores.map((appliedJob, idx) => (
                    <div key={idx} className="py-2 border-bottom">
                      <div className="d-flex justify-content-between align-items-start">
                        <div style={{ flex: 1 }}>
                          <Link href={`/dashboard/company/jobs/${appliedJob.job?.id}`}>
                            <a>{appliedJob.job?.title || t('UNTITLED_JOB')}</a>
                          </Link>
                          <div className="small text-muted">
                            {appliedJob.created_at && (
                              <div>
                                {t('APPLIED_ON')}: {new Date(appliedJob.created_at).toLocaleDateString()}
                              </div>
                            )}
                          </div>
                        </div>
                        {appliedJob.eligibilityScore !== null && appliedJob.eligibilityScore !== undefined && (
                          <div className="text-end ms-2">
                            <div
                              className="badge"
                              style={{
                                backgroundColor:
                                  appliedJob.eligibilityScore >= 80
                                    ? '#28a745'
                                    : appliedJob.eligibilityScore >= 60
                                    ? '#ffc107'
                                    : '#dc3545',
                                color: 'white',
                                fontSize: '0.875rem',
                              }}
                            >
                              {Math.round(appliedJob.eligibilityScore)}% Match
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Col>

            {/* Right column: Other Eligible Jobs (Auto-calculated based on eligibility) */}
            <Col md="6">
              <h6 className="mb-3" style={{ fontWeight: 600, fontSize: '0.95rem' }}>
                {t('CONSIDER_FOR')}
              </h6>
              <div className="small text-muted mb-2" style={{ fontStyle: 'italic' }}>
                Other jobs at this company the applicant qualifies for
              </div>
              {isLoadingEligible ? (
                <div className="text-muted">
                  <div className="spinner-border spinner-border-sm me-2" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  {t('Calculating eligible jobs...')}
                </div>
              ) : eligibleJobs.length === 0 ? (
                <div className="text-muted">{t('No other eligible jobs found')}</div>
              ) : (
                <div>
                  {eligibleJobs.map((job: any, idx) => (
                    <div key={idx} className="py-2 border-bottom">
                      <div className="d-flex justify-content-between align-items-start">
                        <div style={{ flex: 1 }}>
                          <Link href={`/dashboard/company/jobs/${job.jobId || job.id}`}>
                            <a>{job.jobTitle || job.title}</a>
                          </Link>
                        </div>
                        {job.score !== undefined && (
                          <div className="text-end ms-2">
                            <div
                              className="badge"
                              style={{
                                backgroundColor:
                                  job.score >= 80
                                    ? '#28a745'
                                    : job.score >= 60
                                    ? '#ffc107'
                                    : '#dc3545',
                                color: 'white',
                                fontSize: '0.875rem',
                              }}
                            >
                              {Math.round(job.score)}% Match
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Col>
          </Row>
        </Section>
      </Col>
    </Row>
  );
}

