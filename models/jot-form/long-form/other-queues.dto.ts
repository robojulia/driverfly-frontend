import * as yup from "yup";
import { ApplicantExtrasEntity } from "../../applicant/applicant-extras.entity";

export class OtherQueuesDto {
  CDL_NUMBER?: ApplicantExtrasEntity;
  static yupSchema() {
    return yup.object({
      CDL_NUMBER: ApplicantExtrasEntity.yupSchema(),
    });
  }
}
