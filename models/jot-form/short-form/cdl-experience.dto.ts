import * as yup from "yup";
import { DriverLicenseType } from "../../../enums/users/driver-license-type.enum";
import { ApplicantExtrasEntity } from "../../applicant";

export class CdlDto {
  license_type: string;
  years_cdl_experience: number;
  is_owner_operator: boolean = false;
  BUSINESS_NAME: ApplicantExtrasEntity;
  DOT_NUMBER: ApplicantExtrasEntity;

  static yupSchema() {
    return yup.object({
      license_type: yup
        .string()
        // .when({
        //   is: (value) => !!value,
        //   then: yup.string().oneOf(Object.values(DriverLicenseType)),
        // })
        .required()
        .nullable(),
      years_cdl_experience: yup
        .number()
        .when("license_type", {
          is: (value) => !!value && value != DriverLicenseType.NO_CDL,
          then: yup.number().moreThan(-1).required(),
        })
        .nullable(),
      is_owner_operator: yup
        .boolean()
        .when("license_type", {
          is: (value) => !!value && value != DriverLicenseType.NO_CDL,
          then: yup.boolean().required("Owner operator selection is required"),
        })
        .nullable(),
      BUSINESS_NAME: ApplicantExtrasEntity.yupSchema(),
      DOT_NUMBER: ApplicantExtrasEntity.yupSchema(),
    });
  }
}
