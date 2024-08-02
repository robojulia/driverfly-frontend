import { ApplicantEntity } from './applicant.entity';
import * as yup from "yup";
import { CompanyEntity } from '../company/company.entity';
import { ApplicantDac } from '../../enums/applicants/applicant-dac.enum';

export class ApplicantDacEntity {
    id?: number;
    applicant?: ApplicantEntity;
    company?: CompanyEntity;
    type?: ApplicantDac;
    value?: boolean;
    created_at?: string;
    last_updated_at?: string;
    details?: string;

    static yupSchema() {
        return yup.object({
            type: (yup.string() as any).enum(ApplicantDac).required().nullable(),
            value: yup.boolean().default(false),
            details: yup.string().nullable()
        });
    }
}
