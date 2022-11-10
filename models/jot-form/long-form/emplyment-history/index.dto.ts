import * as yup from "yup";
import "../../../../utils/yup";

export class EmploymentHistoryExtraDto {
  current_company_name: string;
  current_company_manager_name: string;
  start_date: string | Date;
  authorize?: boolean;
  current_company_phone_number: number;
  current_company_email: string;
  current_company_street_address_line_1: string;
  current_company_street_address_line_2: string;
  current_company_zipcode: number;
  city: string;
  state: string | Date;
  fmcsr: string;
  fcr: string;

  static yupSchema() {
    return yup.object({
      current_company_name:yup.string().required().nullable(),
      current_company_manager_name: yup.string().optional().nullable(),
      current_company_phone_number: yup.string().optional().nullable(),
      city: yup.string().required().nullable(),

      fmcsr: yup.string().optional().nullable(),

      fcr: yup.string().optional().nullable(),

      state: yup.string().required().nullable(),

      current_company_email: yup.string().required().nullable(),

      start_date: yup.date().required().nullable(),

      authorize: yup.boolean().default(false).optional().nullable(),

      current_company_street_address_line_1: yup.string().required().nullable(),

      current_company_street_address_line_2: yup.string().optional().nullable(),

      current_company_zipcode: yup.string().required().nullable(),
    });
  }
}
