import React from 'react';
import ViewCard from '../view-details/view-card';
import { Link } from 'react-bootstrap-icons';
import { ApplicantStatus } from '../../enums/applicants/applicant-status.enum';
import ShowEnumFromString from '../enum-filters/show-enum-from-string';
import ViewTable from '../view-details/view-table';
import { ViewApplicantDetailProps } from '../../types/applicant/view-application-detail-props.type';

interface ApplicantJobsAppliedProps extends ViewApplicantDetailProps { }

export default function ApplicantJobsApplied({ applicant }: ApplicantJobsAppliedProps) {

    return (
        <ViewCard title="JOBS_APPLIED_TO_WITH_YOU">
            <ViewTable
                type="JOBS"
                headers={{
                    title: "JOB",
                    status: "STATUS",
                    date_applied: "DATE_APPLIED"
                }}
                items={applicant?.jobs?.map(aJob => ({
                    title: <Link href={`/jobs/${aJob.job.id}/${aJob.job.title}`}><a>{aJob.job.title}</a></Link>,
                    status: <ShowEnumFromString skipLowerCase popover={true} str={aJob.status} labelPrefix="ApplicantStatus" enumArray={ApplicantStatus} />,
                    date_applied: new Date(aJob.created_at).toDateString()
                }))}
            />
        </ViewCard>
    )
}
