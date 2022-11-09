import moment from "moment";
import * as yup from "yup";
import { ApplicantExtrasEntity } from "../../applicant/applicant-extras.entity";

export class DrugTestDto {
  is_tested_positive: boolean;
  DOT_REGULATION: ApplicantExtrasEntity;

  static yupSchema() {
    return yup.object({
      is_tested_positive: yup.boolean().optional().nullable(),
      DOT_REGULATION: yup
        .object()
        .when("is_tested_positive", {
          is: (v) => !!v,
          then: ApplicantExtrasEntity.yupSchema(),
        })
        .nullable(),
    });
  }
}
