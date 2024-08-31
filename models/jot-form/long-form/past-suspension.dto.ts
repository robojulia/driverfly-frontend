import * as yup from "yup";

export class PastSuspensionDto {
  is_past_license_suspended: boolean;
  license_revoked: boolean;
  license_revoked_details: string;
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
      has_past_dui: yup.bool().nullable(),
      dui_years: yup
        .array(yup.number().min(1900).max(new Date().getFullYear()))
        .nullable(),
    });
  }
}
