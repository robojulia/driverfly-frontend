import { useTranslation } from '../../hooks/use-translation';
import React from 'react';
import Link from 'next/link';
import { ViewApplicantDetailProps } from '../../types/applicant/view-application-detail-props.type';
import { ApplicantSuggestedJobEntity } from '../../models/applicant/applicant-suggested-job.entity';
import Section from '../view-details/section';
import { Row, Col } from 'react-bootstrap';

interface ApplicantJobsAppliedToProps extends ViewApplicantDetailProps {
  applicantSuggestedJobs?: ApplicantSuggestedJobEntity[];
}

export default function ApplicantJobsAppliedTo({
  applicant,
  applicantSuggestedJobs,
}: ApplicantJobsAppliedToProps) {
  const { t } = useTranslation();
  const appliedJobs = applicant?.jobs || [];
  const suggestedJobs = applicantSuggestedJobs || [];

  return (
    <Row className="px-2">
      <Col md="12" className="p-0 px-lg-2">
        <Section title={t('JOBS_APPLIED_TO')}>
          <Row>
            {/* Left column: Jobs Applied To */}
            <Col md="6">
              <h6 className="mb-3" style={{ fontWeight: 600, fontSize: '0.95rem' }}>
                {t('APPLIED_JOBS')}
              </h6>
              {appliedJobs.length === 0 ? (
                <div className="text-muted">
                  {t('NO_SPECIFIC_JOB_APPLICATION')}
                </div>
              ) : (
                <div>
                  {appliedJobs.map((appliedJob, idx) => (
                    <div key={idx} className="py-2 border-bottom">
                      <Link href={`/jobs/${appliedJob.job?.id}/${appliedJob.job?.title}`}>
                        <a>{appliedJob.job?.title || t('UNTITLED_JOB')}</a>
                      </Link>
                      {appliedJob.created_at && (
                        <div className="small text-muted">
                          {t('APPLIED_ON')}: {new Date(appliedJob.created_at).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </Col>

            {/* Right column: Jobs to Consider Applicant For */}
            <Col md="6">
              <h6 className="mb-3" style={{ fontWeight: 600, fontSize: '0.95rem' }}>
                {t('CONSIDER_FOR')}
              </h6>
              {suggestedJobs.length === 0 ? (
                <div className="text-muted">{t('NONE')}</div>
              ) : (
                <div>
                  {suggestedJobs.map((sJob, idx) => (
                    <div key={idx} className="py-2 border-bottom">
                      <Link href={`/jobs/${sJob.job.id}/${sJob.job.title}`}>
                        <a>{sJob.job.title}</a>
                      </Link>
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

