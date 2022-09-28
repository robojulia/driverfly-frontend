import * as yup from "yup";
import { FlagInappropriateJob } from "../../enums/jobs/flag-inappropriate-job.enum";


export class FlagInappropriateJobDto {
    constructor(jobId){
        this.jobId = jobId
    }
    jobId: number;
    type: FlagInappropriateJob;
    other_options?: string;

    static yupSchema() {
        return yup.object({

            jobId: (yup.number().nullable().required()),
            type: (yup.string() as any).enum(FlagInappropriateJob).nullable(),
            other_options: yup.string().when("type", {
                is: v => v == FlagInappropriateJob.OTHER,
                then: yup.string().nullable()
            }).nullable(),

        });
        
    }
}