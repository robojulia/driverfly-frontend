import * as yup from "yup";
import { ApplicantExtrasEntity } from "../../applicant/applicant-extras.entity";

export class DriverApplicationDto {
  first_name: string;
  last_name: string;
  APPLY_DATE: ApplicantExtrasEntity;
  SIGNATURE: ApplicantExtrasEntity;
  AUTOMATED_RECRUITING_LEAD: ApplicantExtrasEntity
  static yupSchema() {
    return yup.object({
      first_name: yup
        .string()
        .matches(/^[A-Za-z ]*$/, "PLEASE_ENTER_A_VALID_NAME")
        .required()
        .nullable(),
      last_name: yup
        .string()
        .matches(/^[A-Za-z ]*$/, "PLEASE_ENTER_A_VALID_NAME")
        .required()
        .nullable(),
      APPLY_DATE: ApplicantExtrasEntity.yupSchema(),
      SIGNATURE: ApplicantExtrasEntity.yupSchema(),
      AUTOMATED_RECRUITING_LEAD: ApplicantExtrasEntity.yupSchema(),
    });
  }
}
