import * as yup from "yup";
import { FlagInappropriateJob } from "../../enums/jobs/flag-inappropriate-job.enum";


export class FlagInappropriateJobDto {
    constructor(data) {

        if (data.jobId) {
            this.jobId = data.jobId
        } else if (data.companyId) {
            this.companyId = data.companyId

        }
    }

    jobId?: number;
    companyId?: number;
    type: FlagInappropriateJob;
    type_other?: string;

    static yupSchema() {
        return yup.object({

            jobId: (yup.number().nullable().optional()),
            companyId: (yup.number().nullable().optional()),
            type: (yup.string() as any).enum(FlagInappropriateJob).nullable(),
            type_other: yup.string().when("type", {
                is: v => v == FlagInappropriateJob.OTHER,
                then: yup.string().nullable()
            }).nullable(),

        });

    }
}