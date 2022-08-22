import { UserEntity } from '../user/user.entity';
import { CompanyEntity } from '../company/company.entity';
import { DocumentEntity } from '../documents/document.entity';
import { ApplicantExperienceEntity } from './applicant-experience.entity';
import { DriverLicenseType } from '../../enums/users/driver-license-type.enum';
import { LicenseRestrictions} from '../../enums/applicants/applicant-license-restrictions-type.enum';
import { ApplicantEquipmentEntity } from './applicant-equipment.entity';
import { EducationLevel } from '../../enums/users/education-level.enum';
import { ApplicantEmployerEntity } from './applicant-employer.entity';
import { ApplicantNoteEntity } from './applicant-note.entity';
import { ApplicantType } from '../../enums/applicants/applicant-type.enum';
import { ApplicantJobEntity } from './applicant-job.entity';
import * as yup from "yup";
import { VehicleTransmissionType } from '../../enums/vehicles/vehicle-transmission-type.enum';
import { DriverEndorsement } from '../../enums/users/driver-endorsement.enum';
import { ApplicantDocumentType } from '../../enums/applicants/applicant-document-type.enum';
import { JobGeography } from '../../enums/jobs/job-geography.enum';

export class ApplicantEntity {
  id?: number;
  version?: number;
  user?: UserEntity;
  company?: CompanyEntity;
  assignedUser?: UserEntity;
  type?: ApplicantType;
  first_name?: string;
  last_name?: string;
  phone?: string;
  email?: string;
  birthdate?: string;
  street?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  license_number?: string;
  license_expiry?: string;
  license_state?: string;
  license_type?: DriverLicenseType;
  years_cdl_experience?: number;
  // license_restrictions?: LicenseRestrictions;
  license_restrictions?: LicenseRestrictions[] = [];
  can_pass_drug_test?: boolean = true;
  is_owner_operator?: boolean = false;
  transmission_type?: VehicleTransmissionType[] = [];
  endorsements?: DriverEndorsement[] = [];
  highest_degree?: EducationLevel;
  authorized_to_work_in_us?: boolean = true;
  preferred_location?:JobGeography;
  emergency_contact_name?: string;
  emergency_contact_number?: string;
  emergency_contact_relationship?: string;
  has_past_dui?: boolean = false;
  dui_years?: string[] = [];
  criminal_history?: string;
  accident_count?: number;
  accident_details?: string;
  license_revoked?: boolean = false;
  license_revoked_details?: string;
  psp_violations?: boolean = false;
  psp_violations_details?: string;
  tickets?: boolean = false;
  tickets_details?: string;
  positive_drug_test?: boolean = false;
  positive_drug_test_details?: string;
  equipment_experience?: ApplicantExperienceEntity[] = [];
  equipment_owned?: ApplicantEquipmentEntity[] = [];
  employers?: ApplicantEmployerEntity[] = [];
  jobs?: ApplicantJobEntity[] = [];
  notes?: ApplicantNoteEntity[] = [];
  documents?: DocumentEntity[] = [];
  created_at?: string;
  last_updated_at?: string;

  static yupSchema() {
    return yup.object({
        first_name: yup.string().required().nullable(),
        last_name: yup.string().required().nullable(),
        phone: yup.string().nullable(),
        email: yup.string().email().required().nullable(),
        birthdate: yup.date().nullable(),
        street: yup.string().nullable(),
        city: yup.string().nullable(),
        state: yup.string().nullable(),
        zip_code: yup.string().nullable(),
        license_number: yup.string().nullable(),
        license_expiry: yup.date().nullable(),
        license_state: yup.string().nullable(),
        license_type: (yup.string() as any).enum(DriverLicenseType).nullable(),
        years_cdl_experience: yup.number().min(0).nullable(),
        preferred_location: (yup.string() as any).enum(JobGeography).required().nullable(),

        // license_restrictions: (yup.string() as any).enum(LicenseRestrictions).nullable(),

        license_restrictions: yup.array(
          (yup.string() as any).enum(LicenseRestrictions)
        ).nullable(),


        can_pass_drug_test: yup.bool().nullable(),
        is_owner_operator: yup.bool().nullable(),
        transmission_type: yup.array(
          (yup.string() as any).enum(VehicleTransmissionType)
        ).nullable(),
        endorsements: yup.array(
          (yup.string() as any).enum(DriverEndorsement)
        ).nullable(),
        highest_degree: (yup.string() as any).enum(EducationLevel).nullable(),
        authorized_to_work_in_us: yup.bool().nullable(),
        emergency_contact_name: yup.string().nullable(),
        emergency_contact_number: yup.string().nullable(),
        emergency_contact_relationship: yup.string().nullable(),
        has_past_dui: yup.bool().nullable(),
        dui_years: yup.array(
          yup
            .number()
            .min(new Date().getFullYear() - 5)
            .max(new Date().getFullYear())
        ).nullable(),
        criminal_history: yup.string().nullable(),
        accident_count: yup.number().min(0).nullable(),
        accident_details: yup.string().nullable(),
        license_revoked: yup.bool().nullable(),
        license_revoked_details: yup.string().nullable(),
        psp_violations: yup.bool().nullable(),
        psp_violations_details: yup.string().nullable(),
        tickets: yup.bool().nullable(),
        tickets_details: yup.string().nullable(),
        positive_drug_test: yup.bool().nullable(),
        positive_drug_test_details: yup.string().nullable(),
        equipment_experience: (yup.array(
          ApplicantExperienceEntity.yupSchema()
        ) as any).unique("type", { mapper: ApplicantExperienceEntity.key }),
        equipment_owned: (yup.array(
          ApplicantEquipmentEntity.yupSchema()
        ) as any).unique("type", { mapper: ApplicantEquipmentEntity.key }),
        employers: yup.array(
          ApplicantEmployerEntity.yupSchema()
        ),
        documents: (yup.array(
          DocumentEntity.yupSchema(ApplicantDocumentType)
        ) as any).unique("type"),
        jobs: (yup.array(
          ApplicantJobEntity.yupSchema()
        ) as any).unique("job.id")
    });
  }
}
