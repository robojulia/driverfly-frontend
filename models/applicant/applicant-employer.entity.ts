import * as yup from "yup";
import { ApplicantEntity } from "./applicant.entity";

export class ApplicantEmployerEntity {
    id?: number;
    applicant?: ApplicantEntity;
    name?: string;
    start_at?: string;
    end_at?: string;
    title?: string;
    street?: string;
    city?: string;
    state?: string;
    zip_code?: string;
    phone?: string;
    can_contact: boolean = false;
    is_subject_to_fmcsrs: boolean = false;
    is_subject_to_drug_tests: boolean = false;
    created_at?: string;
    last_updated_at?: string;

    static yupSchema() {
        return yup.object({
            name: yup.string().required().nullable(),
            start_at: yup.date().nullable(),
            end_at: yup.date().nullable(),
            title: yup.string().nullable(),
            street: yup.string().nullable(),
            city: yup.string().nullable(),
            state: yup.string().nullable(),
            zip_code: yup.string().nullable(),
            phone: yup.string().nullable(),
            can_contact: yup.bool().nullable(),
            is_subject_to_fmcsrs: yup.bool().nullable(),
            is_subject_to_drug_tests: yup.bool().nullable(),
        });
    }
}
