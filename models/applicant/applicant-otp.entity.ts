import { ApplicantEntity } from "./applicant.entity";
import * as yup from "yup"
export class ApplicantOTPEntity {
    id?: number;
    type: string;
    value?: string;
    created_at?: string;
    expiry: string | Date;
    applicant?: ApplicantEntity;
    applicantId?: number

    static yupSchema() {
        return yup.object({
            id: yup.number().required().nullable(),
            applicantId: yup.number().required().nullable(),
            type: yup.string().required().nullable(),
            value: yup.string().required().nullable(),
            created_at: yup.date().required().nullable(),
            expiry: yup.date().required().nullable(),
        });
    }
}