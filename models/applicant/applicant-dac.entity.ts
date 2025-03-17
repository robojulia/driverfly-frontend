import * as yup from "yup";
import { CompanyEntity } from '../company/company.entity';
import { ApplicantEntity } from './applicant.entity';

export class ApplicantDacEntity {
    id?: number;
    applicant?: ApplicantEntity;
    company?: CompanyEntity;
    type?: string;
    value?: boolean;
    created_at?: string;
    last_updated_at?: string;
    details?: string;

    static yupSchema() {
        return yup.object({
            type: yup.string().required().nullable(),
            value: yup.boolean().default(false),
            details: yup.string().nullable()
        });
    }
}
