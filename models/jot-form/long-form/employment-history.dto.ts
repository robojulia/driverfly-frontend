import moment from "moment";
import * as yup from "yup";

export class EmploymentHistoryDto {
  employed_type: string;
  current_company_manager_name: string;
  current_company_phone_number: number;
  current_company_email: string;
  current_company_street_address_line_1: string;
  current_company_street_address_line_2: string;
  current_company_zipcode: number;
  static yupSchema() {
    return yup.object({
      current_company_manager_name: yup
        .string()
        .when("employed_type", {
          is: (v) => !!v,
          then: yup.string().required().nullable(),
          otherwise: yup.string().optional().nullable(),
        })
        .nullable(),

      current_company_email: yup
        .string()
        .when("employed_type", {
          is: (v) => !!v,
          then: yup.string().required().nullable(),
          otherwise: yup.string().optional().nullable(),
        })
        .nullable(),

      current_company_street_address_line_1: yup
        .string()
        .when("employed_type", {
          is: (v) => !!v,
          then: yup.string().required().nullable(),
          otherwise: yup.string().optional().nullable(),
        })
        .nullable(),

      current_company_street_address_line_2: yup
        .string()
        .when("employed_type", {
          is: (v) => !!v,
          then: yup.string().required().nullable(),
          otherwise: yup.string().optional().nullable(),
        })
        .nullable(),

      current_company_zipcode: yup
        .string()
        .when("employed_type", {
          is: (v) => !!v,
          then: yup.string().required().nullable(),
          otherwise: yup.string().optional().nullable(),
        })
        .nullable(),
    });
  }
}
