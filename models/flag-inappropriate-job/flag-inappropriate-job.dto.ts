import * as yup from "yup";
import { FlagInappropriateJob } from "../../enums/jobs/flag-inappropriate-job.enum";


export class FlagInappropriateJobDto {
    constructor(jobId){
        this.jobId = jobId
    }
    jobId: number;
    flag_inappropriate_job: FlagInappropriateJob;
    other_options?: string;

    static yupSchema() {
        return yup.object({

            jobId: (yup.number().nullable().required()),
            flag_inappropriate_job: (yup.string() as any).enum(FlagInappropriateJob).nullable(),
            other_options: yup.string().when("flag_inappropriate_job", {
                is: v => v == FlagInappropriateJob.OTHER,
                then: yup.string().nullable()
            }).nullable(),

        });
        
    }
}