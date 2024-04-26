import { JobEntity } from "../../models/job/job.entity";

export type JobDetailProps = {
    error?: any;
    job: JobEntity;
    quick_apply?: string;
    relatedJobs?: JobEntity[];

}