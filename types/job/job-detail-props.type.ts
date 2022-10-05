import { JobEntity } from "../../models/job/job.entity";

export type JobDetailProps = {
    job: JobEntity;
    relatedJobs?: JobEntity[];

}