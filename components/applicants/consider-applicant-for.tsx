import { useTranslation } from '../../hooks/useTranslation';
import { JobEntity } from "../../models/job/job.entity";
import React from 'react';
import { useAuth } from '../../hooks/useAuth'
import ViewCard from '../viewDetails/viewCard';
import { Link } from 'react-bootstrap-icons';
import ViewTable from '../viewDetails/viewTable';
import { ApplicantEntity } from '../../models/applicant/applicant.entity';
import { ApplicantSuggestedJobEntity } from '../../models/applicant/applicant-suggested-job.entity';


export interface ProtectedFields{
    license_number?: boolean | (() => boolean);
    social_security_number?:  boolean | (() => boolean);
}

export interface ViewApplicantDetailProps {
    applicant: ApplicantEntity;
    protectedFields?: ProtectedFields;
    applicantSuggestedJobs: ApplicantSuggestedJobEntity[];

}


export default function ConsiderFor({ applicant, applicantSuggestedJobs }: ViewApplicantDetailProps) {

    const { t } = useTranslation();
    const [encourageModal, setEncourageModal] = React.useState(false)
    const { user } = useAuth();

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
