import * as yup from "yup";
import { ApplicantExtrasEntity } from "../../applicant/applicant-extras.entity";

export class ViolationHistoryDto {
  VIOLATION_COUNT?: ApplicantExtrasEntity;
  VIOLATION_DETAILS?: ApplicantExtrasEntity;

  static yupSchema() {
    return yup.object({
      VIOLATION_COUNT: ApplicantExtrasEntity.yupSchema(),
      VIOLATION_DETAILS: ApplicantExtrasEntity.yupSchema(),
    });
  }
}
