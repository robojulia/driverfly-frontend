import { ApplicantEntity } from "./applicant.entity";

export interface ApplicantEmployerEntity {
    id?: number;
    applicant?: ApplicantEntity;
    name?: string;
    start_at?: string;
    end_at?: string;
    title?: string;
    address?: string;
    street?: string;
    city?: string;
    state?: string;
    zip_code?: string;
    phone?: string;
    can_contact: boolean;
    is_subject_to_fmcsrs: boolean;
    is_subject_to_drug_tests: boolean;
    created_at: string;
    last_updated_at?: string;
}
