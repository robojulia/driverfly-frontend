import * as yup from "yup";
import { LicenseRestrictions } from "../../enums/applicants/applicant-license-restrictions-type.enum";
import { ApplicantStatus } from "../../enums/applicants/applicant-status.enum";
import { ApplicantType } from "../../enums/applicants/applicant-type.enum";
import { JobGeography } from "../../enums/jobs/job-geography.enum";
import { DriverEndorsement } from "../../enums/users/driver-endorsement.enum";
import { DriverLicenseType } from "../../enums/users/driver-license-type.enum";
import { VehicleTransmissionType } from "../../enums/vehicles/vehicle-transmission-type.enum";
import "../../utils/yup";

export class SearchApplicantDto {
  status?: ApplicantStatus;
  name?: string;
  type?: ApplicantType;
  endorsements?: DriverEndorsement;
  city?: string;
  preferred_location?: JobGeography;
  state?: string;
  is_owner_operator?: boolean;
  license_restrictions?: LicenseRestrictions;
  years_cdl_experience?: number;
  license_type?: DriverLicenseType;
  transmission_type?: VehicleTransmissionType;
  assignedUserId?: number;
  jobId?: number;
  email?: string;
  withHired?: boolean;
  without?: string[];

  static yupSchema() {
    return yup.object({
      status: (yup.string() as any).enum(ApplicantStatus).nullable(),
      type: (yup.string() as any).enum(ApplicantType).nullable(),
      endorsements: (yup.string() as any).enum(DriverEndorsement).nullable(),
      city: yup.string().nullable(),
      preferred_location: (yup.string() as any).enum(JobGeography).nullable(),
      state: yup.string().nullable(),
      is_owner_operator: yup.boolean().nullable(),
      license_restrictions: (yup.string() as any)
        .enum(LicenseRestrictions)
        .nullable(),
      years_cdl_experience: yup.number().nullable(),
      license_type: (yup.string() as any).enum(DriverLicenseType).nullable(),
      transmission_type: (yup.string() as any)
        .enum(VehicleTransmissionType)
        .nullable(),
      assignedUserId: yup.number().nullable(),
    });
  }
}
