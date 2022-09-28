import * as yup from "yup";
import { FlagInappropriateJob } from "../../enums/jobs/flag-inappropriate-job.enum";


export class FlagInappropriateJobDto {
    constructor(jobId){
        this.jobId = jobId
    }
    jobId: number;
    type: FlagInappropriateJob;
    type_other?: string;

    static yupSchema() {
        return yup.object({

            jobId: (yup.number().nullable().required()),
            type: (yup.string() as any).enum(FlagInappropriateJob).nullable(),
            type_other: yup.string().when("type", {
                is: v => v == FlagInappropriateJob.OTHER,
                then: yup.string().nullable()
            }).nullable(),

        });
        
    }
}