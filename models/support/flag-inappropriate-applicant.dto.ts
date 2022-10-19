import * as yup from "yup";
import { InappropriateApplicantFlag } from "../../enums/support/inappropriate-applicant-flag.enum"

export class FlagInappropriateApplicantDto {
    constructor(applicantId) {
        this.applicantId = applicantId
    }
    applicantId: number;
    type: InappropriateApplicantFlag;
    type_other?: string;

    static yupSchema() {
        return yup.object({
            applicantId: yup.number().nullable().required(),
            type: (yup.string() as any).enum(InappropriateApplicantFlag).nullable(),
            type_other: yup.string().when("other", {
                is: v => v == InappropriateApplicantFlag.OTHER,
                then: yup.string().nullable()
            }).nullable(),
        });

    }
}