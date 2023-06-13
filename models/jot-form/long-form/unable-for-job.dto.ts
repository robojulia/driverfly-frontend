import * as yup from "yup";
import { ApplicantExtrasEntity } from "../../applicant/applicant-extras.entity";

export class UnableForJobDto {
  is_unable_to_perform: boolean;
  REASON_FOR_UNABLE_TO_PERFORM_JOB: ApplicantExtrasEntity;

  static yupSchema() {
    return yup.object({
      is_unable_to_perform: yup.boolean().optional().nullable(),
      REASON_FOR_UNABLE_TO_PERFORM_JOB: yup
        .object()
        .when("is_unable_to_perform", {
          is: (v) => !!v,
          then: ApplicantExtrasEntity.yupSchema(),
        })
        .nullable(),
    });
  }
}
