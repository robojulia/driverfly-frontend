import * as yup from 'yup';
import { LicenseRestrictions } from '../../enums/applicants/applicant-license-restrictions-type.enum';
import { ApplicantStatus } from '../../enums/applicants/applicant-status.enum';
import { ApplicantType } from '../../enums/applicants/applicant-type.enum';
import { JobGeography } from '../../enums/jobs/job-geography.enum';
import { DriverEndorsement } from '../../enums/users/driver-endorsement.enum';
import { DriverLicenseType } from '../../enums/users/driver-license-type.enum';
import { VehicleTransmissionType } from '../../enums/vehicles/vehicle-transmission-type.enum';
import '../../utils/yup';

export class SearchApplicantDto {
  status?: ApplicantStatus;
  name?: string;
  type?: ApplicantType;
  endorsements?: DriverEndorsement;
  city?: string;
  is_paginated?: boolean;
  preferred_location?: JobGeography;
  state?: string;
  is_owner_operator?: boolean;
  license_restrictions?: LicenseRestrictions | LicenseRestrictions[];
  years_cdl_experience?: number;
  limit?: number;
  page?: number;
  license_type?: DriverLicenseType;
  transmission_type?: VehicleTransmissionType;
  assignedUserId?: number;
  jobId?: number;
  email?: string;
  withHired?: boolean;
  without?: string[];
  includeEligibility?: boolean;

  static yupSchema() {
    return yup.object({
      status: (yup.array() as any).nullable(),
      type: (yup.string() as any).enum(ApplicantType).nullable(),
      endorsements: (yup.array() as any).nullable(),
      city: yup.string().nullable(),
      preferred_location: (yup.array() as any).nullable(),
      state: (yup.array() as any).nullable(),
      is_owner_operator: yup.boolean().nullable(),
      license_restrictions: (yup.array() as any).nullable(),
      years_cdl_experience: yup.number().nullable(),
      license_type: (yup.string() as any).enum(DriverLicenseType).nullable(),
      transmission_type: (yup.array() as any).nullable(),
      assignedUserId: (yup.array() as any).nullable(),
    });
  }
}
