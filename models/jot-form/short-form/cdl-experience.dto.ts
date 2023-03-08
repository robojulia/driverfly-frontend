import * as yup from "yup";
import { DriverLicenseType } from "../../../enums/users/driver-license-type.enum";

export class CdlDto {
  license_type: string;
  years_cdl_experience: number;
  is_owner_operator: boolean = false;

  static yupSchema() {
    return yup.object({
      license_type: yup
        .string()
        // .when({
        //   is: (value) => !!value,
        //   then: yup.string().oneOf(Object.values(DriverLicenseType)),
        // })
        .required().nullable()
      ,
      years_cdl_experience: yup
        .number()
        .when("license_type", {
          is: (value) => !!value && value !== DriverLicenseType.NO_CDL,
          then: yup.number().moreThan(0).required(),
        })
        .nullable(),
      is_owner_operator: yup.boolean().nullable(),
    });
  }
}
