import { ApplicantEntity } from './applicant.entity';
import * as yup from "yup";
import { CompanyEntity } from '../company/company.entity';
import { ApplicantDac } from '../../enums/applicants/applicant-dac.enum';

export class ApplicantDacEntity {
    id?: number;
    applicant?: ApplicantEntity;
    company?: CompanyEntity;
    type?: ApplicantDac;
    value?: string;
    created_at?: string;
    last_updated_at?: string;

    static yupSchema() {
        return yup.object({
            // type: 
            // value: 
        });
    }
}
