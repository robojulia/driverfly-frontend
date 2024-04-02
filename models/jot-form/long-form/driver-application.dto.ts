import * as yup from "yup";
import { ApplicantExtrasEntity } from "../../applicant/applicant-extras.entity";

export class DriverApplicationDto {
  first_name: string;
  last_name: string;
  APPLY_DATE: ApplicantExtrasEntity;
  SIGNATURE: ApplicantExtrasEntity;
  is_automated_recruiting_lead: boolean;
  static yupSchema() {
    return yup.object({
      first_name: yup
        .string()
        // .matches(/^[A-Za-z ]*$/, "PLEASE_ENTER_A_VALID_NAME")
        .required()
        .nullable(),
      last_name: yup
        .string()
        // .matches(/^[A-Za-z ]*$/, "PLEASE_ENTER_A_VALID_NAME")
        .required()
        .nullable(),
      APPLY_DATE: ApplicantExtrasEntity.yupSchema(),
      SIGNATURE: ApplicantExtrasEntity.yupSchema(),
      is_automated_recruiting_lead: yup.boolean().nullable(),
    });
  }
}
