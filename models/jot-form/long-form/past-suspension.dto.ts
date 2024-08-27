import * as yup from "yup";
import { ApplicantExtrasEntity } from "../../applicant/applicant-extras.entity";

export class PastSuspensionDto {
  is_past_license_suspended: boolean;
  license_revoked: boolean;
  license_revoked_details: string;
  PAST_LICENSE_SUSPENSION: ApplicantExtrasEntity;
  has_past_dui: boolean;
  dui_years: string[];

  static yupSchema() {
    return yup.object({
      is_past_license_suspended: yup.boolean().optional().nullable(),
      license_revoked: yup.bool().nullable(),
      license_revoked_details: yup
        .string()
        .when("license_revoked", {
          is: (v) => !!v,
          then: yup.string().required().nullable(),
        })
        .nullable(),
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
