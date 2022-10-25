import * as yup from "yup";
import { DriverLicenseType } from "../../../enums/users/driver-license-type.enum";

export class CdlDto {
  license_type: null;
  years_cdl_experience: number;
  is_owner_operator_question: boolean = false;

  static yupSchema() {
    return yup.object({
      license_type: yup
        .string()
        .when({
          is: (value) => !!value,
          then: yup.string().oneOf(Object.values(DriverLicenseType)),
        })
        .nullable(),
      years_cdl_experience: yup
        .number()
        .when("license_type", {
          is: (value) => !!value,
          then: yup.number().moreThan(0).required(),
        })
        .nullable(),
      is_owner_operator_question: yup.boolean().nullable(),
    });
  }
}
