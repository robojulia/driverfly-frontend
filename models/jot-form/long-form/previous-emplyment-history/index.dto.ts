import * as yup from "yup";
import "../../../../utils/yup";

export class PastEmploymentHistoryExtraDto {
  previous_company_manager_name: string;
  authorize?: boolean;
  previous_company_phone_number: number;
  previous_company_email: string;
  previous_company_street_address_line_1: string;
  previous_company_street_address_line_2: string;
  previous_company_zipcode: number;
  city: string;
  state: string;
  start_date: string;
  end_date: string;
  fmcsr: string | Date;
  fcr: string | Date;

  static yupSchema() {
    return yup.object({
      previous_company_manager_name: yup.string().required().nullable(),
      previous_company_phone_number: yup.string().required().nullable(),
      city: yup.string().required().nullable(),

      fmcsr: yup.string().optional().nullable(),

      fcr: yup.string().optional().nullable(),

      state: yup.string().required().nullable(),
      start_date: yup.date().required().nullable(),
      end_date: yup.date().required().nullable(),
      previous_company_email: yup.string().required().nullable(),

      authorize: yup.boolean().default(false).optional().nullable(),

      previous_company_street_address_line_1: yup
        .string()
        .required()
        .nullable(),

      previous_company_street_address_line_2: yup
        .string()
        .optional()
        .nullable(),

      previous_company_zipcode: yup.string().required().nullable(),
    });
  }
}
