import * as yup from "yup";
import { ApplicantExtrasEntity } from "../../applicant/applicant-extras.entity";

export class SubmissionDetailsDto {
  name: string;
//   last_name: string;
//   APPLY_DATE: ApplicantExtrasEntity;
  SIGNATURE: ApplicantExtrasEntity;
  static yupSchema() {
    return yup.object({
      name: yup
        .string()
        .matches(/^[A-Za-z ]*$/, "Please enter valid name")
        .required()
        .nullable(),
    //   last_name: yup
    //     .string()
    //     .matches(/^[A-Za-z ]*$/, "Please enter valid name")
    //     .required()
    //     .nullable(),
    //   APPLY_DATE: ApplicantExtrasEntity.yupSchema(),
      SIGNATURE: ApplicantExtrasEntity.yupSchema(),
    });
  }
}
