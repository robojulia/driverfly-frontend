import * as yup from "yup";
import { InappropriateJobFlag } from "../../enums/support/inappropriate-job-flag.enum"


export class FlagInappropriateJobDto {
    constructor(jobId) {
        this.jobId = jobId
    }

    jobId: number;
    type: InappropriateJobFlag;
    type_other?: string;

    static yupSchema() {
        return yup.object({

            jobId: (yup.number().nullable().required()),
            type: (yup.string() as any).enum(InappropriateJobFlag).nullable(),
            type_other: yup.string().when("type", {
                is: v => v == InappropriateJobFlag.OTHER,
                then: yup.string().nullable()
            }).nullable(),

        });

    }
}