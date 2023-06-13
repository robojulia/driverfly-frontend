import * as yup from "yup";
import { ApplicantExtras } from "../../../enums/applicants/applicant-extras.enum";
import { ApplicantExtrasEntity } from "../../applicant/applicant-extras.entity";

export class DriverApplicationDto {
  first_name: string;
  last_name: string;
  APPLY_DATE: ApplicantExtrasEntity;
  SIGNATURE: ApplicantExtrasEntity;
  static yupSchema() {
    return yup.object({
      first_name: yup
        .string()
        .matches(/^[A-Za-z ]*$/, "Please enter valid name")
        .required()
        .nullable(),
      last_name: yup
        .string()
        .matches(/^[A-Za-z ]*$/, "Please enter valid name")
        .required()
        .nullable(),
      APPLY_DATE: ApplicantExtrasEntity.yupSchema(),
      SIGNATURE: ApplicantExtrasEntity.yupSchema(),
    });
  }
}
