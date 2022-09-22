import { useTranslation } from '../../hooks/useTranslation';
import React from 'react';
import ViewCard from '../viewDetails/viewCard';
import { Link } from 'react-bootstrap-icons';
import ViewTable from '../viewDetails/viewTable';
import { ViewApplicantDetailProps } from '../../types/applicant/view-application-detail-props.type';


export default function ConsiderFor({ applicant, applicantSuggestedJobs }: ViewApplicantDetailProps) {

    const { t } = useTranslation();

    return (
        <ViewCard title={t("CONSIDER_{name}_FOR", { name: applicant?.first_name })}>
            <ViewTable
                type="OTHER_ROLES"
                headers={{
                    role: "ROLE"
                }}
                items={applicantSuggestedJobs.map(sJob => ({
                    role: <Link href={`/jobs/${sJob.job.id}/${sJob.job.title}`}><a>{sJob.job.title}</a></Link>
                }))}
            />
        </ViewCard>
    )
}
