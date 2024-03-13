import { JobEntity } from "../../models/job/job.entity";

export type JobDetailProps = {
    quick_apply?: string;
    job: JobEntity;
    relatedJobs?: JobEntity[];

}