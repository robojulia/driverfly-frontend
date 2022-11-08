import * as yup from "yup";
import "../../../../utils/yup";

export class EmploymentHistoryExtraDto {
  employed_type: boolean | boolean = false;
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
      current_company_manager_name: yup
        .string()
        .when("employed_type", {
          is: (v) => !!v,
          then: yup.string().required().nullable(),
          otherwise: yup.string().optional().nullable(),
        })
        .nullable(),

      city: yup
        .string()
        .when("employed_type", {
          is: (v) => !!v,
          then: yup.string().required().nullable(),
          otherwise: yup.string().optional().nullable(),
        })
        .nullable(),

      fmcsr: yup
        .string()
        .when("employed_type", {
          is: (v) => !!v,
          then: yup.string().required().nullable(),
          otherwise: yup.string().optional().nullable(),
        })
        .nullable(),

      fcr: yup
        .string()
        .when("employed_type", {
          is: (v) => !!v,
          then: yup.string().required().nullable(),
          otherwise: yup.string().optional().nullable(),
        })
        .nullable(),

      state: yup
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
      start_date: yup
        .string()
        .when("employed_type", {
          is: (v) => !!v,
          then: yup.string().required().nullable(),
          otherwise: yup.string().optional().nullable(),
        })
        .nullable(),

      authorize: yup
        .string()
        .when("employed_type", {
          is: (v) => !!v,
          then: yup.boolean().default(false).required().nullable(),
          otherwise: yup.boolean().default(false).optional().nullable(),
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
