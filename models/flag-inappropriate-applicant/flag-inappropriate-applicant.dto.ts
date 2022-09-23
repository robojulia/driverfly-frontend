import * as yup from "yup";
import { FlagInappropriateApplicant } from "../../enums/jobs/flag-inappropriate-applicant.enum";


export class FlagInappropriateApplicantDto {
    constructor(applicantId) {
        this.applicantId = applicantId

    }
    applicantId: number;
    flag_inappropriate_applicant: FlagInappropriateApplicant;
    other_options?: string;

    static yupSchema() {
        return yup.object({

            applicantId: yup.number().nullable().required(),
            flag_inappropriate_applicant: (yup.string() as any).enum(FlagInappropriateApplicant).nullable(),
            other_options: yup.string().when("flag_inappropriate_applicant", {
                is: v => v == FlagInappropriateApplicant.OTHER,
                then: yup.string().nullable()
            }).nullable(),

        });

    }
}