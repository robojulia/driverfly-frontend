import * as yup from "yup";
import { DocumentEntity } from "../documents/document.entity";
import { EmployeeEntity } from "./employee.entity";

export class EmployeeEmployerEntity {
    id?: number;
    employee?: EmployeeEntity;
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

    manager_name?: string;
    email?: string;
    address?: string;
    address_2?: string;
    uuid_token?: string;
    is_current: boolean;

    voe_submitted?: boolean;
    voe_attempts?: number;

    documents: DocumentEntity[];

    static yupSchema() {
        return yup.object({
            name: yup.string().required().nullable(),
            manager_name: yup.string().optional().nullable(),
            email: yup.string().optional().nullable(),
            address: yup.string().optional().nullable(),
            address_2: yup.string().optional().nullable(),
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
            is_current: yup.boolean().nullable(),
        });
    }
}
