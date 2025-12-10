import * as yup from 'yup';
import { DriverLicenseType } from '../../../enums/users/driver-license-type.enum';
import { ApplicantExtrasEntity } from '../../applicant';

export class CdlDto {
  license_type: string;
  years_cdl_experience: number;

  static yupSchema() {
    return yup.object({
      license_type: yup
        .string()
        .required()
        .nullable(),
      years_cdl_experience: yup
        .number()
        .when('license_type', {
          is: (value) => !!value && value != DriverLicenseType.NO_CDL,
          then: yup.number().min(0).max(99, 'Cannot exceed 99 years').required(),
        })
        .nullable(),
    });
  }
}
