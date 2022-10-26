import moment from "moment";
import * as yup from "yup";

export class PastEmploymentHistoryDto {
  employed_type: string;
  previous_company_manager_name: string;
  previous_company_phone_number: number;
  previous_company_email: string;
  previous_company_street_address_line_1: string;
  previous_company_street_address_line_2: string;
  previous_company_zipcode: number;
  start_date: string;
  end_date: string;
  static yupSchema() {
    return yup.object({
      previous_company_manager_name: yup
        .string()
        .when("employed_type", {
          is: (v) => !!v,
          then: yup.string().required().nullable(),
          otherwise: yup.string().optional().nullable(),
        })
        .nullable(),

      previous_company_email: yup
        .string()
        .when("employed_type", {
          is: (v) => !!v,
          then: yup.string().required().nullable(),
          otherwise: yup.string().optional().nullable(),
        })
        .nullable(),

      previous_company_street_address_line_1: yup
        .string()
        .when("employed_type", {
          is: (v) => !!v,
          then: yup.string().required().nullable(),
          otherwise: yup.string().optional().nullable(),
        })
        .nullable(),

      previous_company_street_address_line_2: yup
        .string()
        .when("employed_type", {
          is: (v) => !!v,
          then: yup.string().required().nullable(),
          otherwise: yup.string().optional().nullable(),
        })
        .nullable(),

      previous_company_zipcode: yup
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
