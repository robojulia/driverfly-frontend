import React from 'react';
import { ApplicantStatus } from '../../enums/applicants/applicant-status.enum';
import ShowEnumFromString from '../enum-filters/show-enum-from-string';
import { ViewApplicantDetailProps } from '../../types/applicant/view-application-detail-props.type';
import { useTranslation } from '../../hooks/use-translation';
import Section from '../view-details/section';

interface ApplicantJobsAppliedProps extends ViewApplicantDetailProps { }

export default function ApplicantJobsApplied({ applicant }: ApplicantJobsAppliedProps) {
    const { t } = useTranslation();

    const jobs = applicant?.jobs || [];

    return (
        <Section title={t('JOBS_APPLIED_TO_WITH_YOU')}>
            {jobs.length === 0 ? (
                <div className="text-muted">{t('NONE')}</div>
            ) : (
                <div>
                    {jobs.map((aJob, idx) => (
                        <div key={idx} className="d-flex justify-content-between align-items-start py-2 border-bottom">
                            <div style={{ flex: 1, minWidth: 200 }}>
                                <a href={`/jobs/${aJob.job.id}/${aJob.job.title}`}>{aJob.job?.title}</a>
                            </div>
                            <div className="mx-3" style={{ minWidth: 140 }}>
                                <ShowEnumFromString popover={true} value={aJob.status} labelPrefix="ApplicantStatus" enumArray={ApplicantStatus} />
                            </div>
                            <div style={{ minWidth: 160 }} className="text-nowrap text-muted">
                                {new Date(aJob.created_at).toDateString()}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </Section>
    );
}
