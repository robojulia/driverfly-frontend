import * as yup from "yup";
import { FlagInappropriateApplicant } from "../../enums/jobs/flag-inappropriate-applicant.enum";


export class FlagInappropriateApplicantDto {
    constructor(applicantId) {
        this.applicantId = applicantId

    }
    applicantId: number;
    type: FlagInappropriateApplicant;
    type_other?: string;

    static yupSchema() {
        return yup.object({

            applicantId: yup.number().nullable().required(),
            type: (yup.string() as any).enum(FlagInappropriateApplicant).nullable(),
            type_other: yup.string().when("other", {
                is: v => v == FlagInappropriateApplicant.OTHER,
                then: yup.string().nullable()
            }).nullable(),

        });

    }
}