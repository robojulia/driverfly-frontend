import * as yup from "yup";
import { ApplicantExtrasEntity } from "../../applicant/applicant-extras.entity";

export class ViolationHistoryDto {
  violations_last_3_years: string;
  VIOLATION_DETAILS?: ApplicantExtrasEntity;

  static yupSchema() {
    return yup.object({
      violations_last_3_years: yup.number().nullable(),
      VIOLATION_DETAILS: ApplicantExtrasEntity.yupSchema(),
    });
  }
}
