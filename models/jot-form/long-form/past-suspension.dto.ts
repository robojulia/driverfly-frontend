import * as yup from "yup";
import { ApplicantExtrasEntity } from "../../applicant/applicant-extras.entity";

export class PastSuspensionDto {
  is_past_license_suspended: boolean;
  PAST_LICENSE_SUSPENSION: ApplicantExtrasEntity;
  has_past_dui: boolean;
  dui_years: string[];

  static yupSchema() {
    return yup.object({
      is_past_license_suspended: yup.boolean().optional().nullable(),
      PAST_LICENSE_SUSPENSION: yup
        .object()
        .when("is_past_license_suspended", {
          is: (v) => !!v,
          then: ApplicantExtrasEntity.yupSchema(),
        })
        .nullable(),
      has_past_dui: yup.bool().nullable(),
      dui_years: yup
        .array(yup.number().min(1900).max(new Date().getFullYear()))
        .nullable(),
    });
  }
}
