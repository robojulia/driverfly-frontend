import * as yup from "yup";
import "../../../../utils/yup";

export class EmploymentHistoryExtraDto {
    // is_current_employed: boolean;
    current_company_manager_name: string;
    start_date: string | Date;
    authorize: boolean | boolean = false;
    current_company_phone_number: number;
    current_company_email: string;
    current_company_street_address_line_1: string;
    current_company_street_address_line_2: string;
    current_company_zipcode: number;
    city: string;
    state: string;
    fmcsr: string;
    fcr: string;

    static yupSchema() {
        return yup.object({
            // is_current_employed: yup.boolean().optional().nullable(),

            current_company_manager_name: yup
                .string()
                .required()
                .nullable(),

            city: yup
                .string()
                .required()
                .nullable(),

            fmcsr: yup
                .string()
                .required()
                .nullable(),

            fcr: yup
                .string()
                .required()
                .nullable(),

            state: yup
                .string()
                .required()
                .nullable(),

            current_company_email: yup
                .string()
                .required()
                .nullable(),

            start_date: yup
                .string()
                .required()
                .nullable(),

            authorize: yup
                .boolean()
                .default(false)
                .required()
                .nullable(),

            current_company_street_address_line_1: yup
                .string()
                .required()
                .nullable(),

            current_company_street_address_line_2: yup
                .string()
                .required()
                .nullable(),

            current_company_zipcode: yup
                .string()
                .required()
                .nullable(),
        });
    }
}
