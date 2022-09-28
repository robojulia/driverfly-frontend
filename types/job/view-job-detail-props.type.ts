import { JobEntity } from "../../models/job/job.entity";

export type ViewJobDetailProps = {
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