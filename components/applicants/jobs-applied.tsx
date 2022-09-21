import { Accordion, Col, Container, Row } from 'react-bootstrap';
import { useTranslation } from '../../hooks/useTranslation';
import { JobEntity } from "../../models/job/job.entity";
import React from 'react';
import ViewModal from '../viewDetails/viewModal';
import { useAuth } from '../../hooks/useAuth'
import { JobEquipmentType } from '../../enums/jobs/job-equipment-type.enum';
import applicant from '../../pages/api/applicant';
import { calculateAge, dateRange } from '../../utils/date';
import ViewCard from '../viewDetails/viewCard';
import ViewDetails from '../viewDetails/viewDetails';
import { AccordionSummary, AccordionDetails } from '@mui/material';
import { ArrowsExpand, Link } from 'react-bootstrap-icons';
import { buildAddress } from '../../utils/common';
import { ApplicantStatus } from '../../enums/applicants/applicant-status.enum';
import ShowEnumFromString from '../enum-filters/show-enum-from-string';
import ViewTable from '../viewDetails/viewTable';


export interface JobsApplicantProps {
    className?: string;
    job: JobEntity;
    relatedJobs?: React.ReactNode;
    canApply?: boolean | (() => boolean);
    canSave?: boolean | (() => boolean);
    hideVehicles?: boolean | (() => boolean);
    hideCompanyName?: boolean | (() => boolean);
    hideSocialLinks?: boolean | (() => boolean);
    viewAllJobsLink?: string;
}


export default function JobsApplicant({ applicant }) {

    const { t } = useTranslation();
    const [encourageModal, setEncourageModal] = React.useState(false)
    const { user } = useAuth();

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
