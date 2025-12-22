import moment from 'moment';
import * as yup from 'yup';
import { EmployeeStatus } from '../../enums/applicants/employee-status.enum';
import {
  EmployeeReasonCodeFired,
  EmployeeReasonCodeQuit,
} from '../../enums/employee/employee-reason-codes.enum';
import { JobGeography } from '../../enums/jobs/job-geography.enum';
import { Status } from '../../enums/status.enum';
import { DriverEndorsement } from '../../enums/users/driver-endorsement.enum';
import { DriverLicenseType } from '../../enums/users/driver-license-type.enum';
import { EducationLevel } from '../../enums/users/education-level.enum';
import { VehicleTransmissionType } from '../../enums/vehicles/vehicle-transmission-type.enum';
import { useTranslation } from '../../hooks/use-translation';
import '../../utils/yup';
import { ApplicantEntity } from '../applicant';
import { CompanyManagerEntity } from '../company/company-manager.entity';
import { CompanyEntity } from '../company/company.entity';
import { DocumentEntity } from '../documents/document.entity';
import { JobEntity } from '../job/job.entity';
import { EmployeeEquipmentEntity } from './employee-equipment.entity';
import { EmployeeExperienceEntity } from './employee-experience.entity';
import { EmployeeNoteEntity } from './employee-note.entity';

export class EmployeeEntity {
  id?: number;
  applicant?: ApplicantEntity;
  // applicantId?: number;
  managerId?: number;
  job?: JobEntity;
  jobId?: number;
  status?: EmployeeStatus;
  status_other?: string;
  reason_codes?: string[] = [];
  reason_codes_other?: string;
  created_at?: string;
  last_updated_at?: string;
  active_status?: Status;
  first_name?: string;
  last_name?: string;
  phone?: string;
  email?: string;
  birthdate?: Date;
  street?: string;
  address_1?: string;
  address_2?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  license_number?: string;
  license_expiry?: Date;
  license_state?: string;
  license_type?: string;
  years_cdl_experience?: number;
  can_pass_drug_test?: boolean;
  is_owner_operator?: boolean;
  highest_degree?: string;
  authorized_to_work_in_us?: boolean;
  preferred_location?: string[];
  equipment_experience?: EmployeeExperienceEntity[];
  equipment_owned?: EmployeeEquipmentEntity[] = [];
  transmission_type?: string[];
  endorsements?: string[];
  emergency_contact_name?: string;
  emergency_contact_number?: string;
  emergency_contact_relationship?: string;
  company?: CompanyEntity;
  hire_date?: string | Date;
  manager?: CompanyManagerEntity;
  documents?: DocumentEntity[] = [];
  termination_date?: Date;
  hr_notes?: string;
  notes?: EmployeeNoteEntity[] = [];

  static employeeFormYupSchema() {
    return yup.object({
      first_name: yup.string().trim().nullable(),
      last_name: yup.string().trim().nullable(),
      phone: yup.string().nullable(),
      email: yup.string().email().nullable(),
      birthdate: yup
        .date()
        .nullable()
        .test('age', 'IMPORT_AGE_ERROR', function (value) {
          if (!value) return true;

          const currentDate = new Date();
          const birthdate = new Date(value);
          const age = currentDate.getFullYear() - birthdate.getFullYear();

          return age >= 18;
        }),
      street: yup.string().nullable(),
      address_1: yup.string().nullable(),
      address_2: yup.string().nullable(),
      city: yup.string().nullable(),
      state: yup.string().nullable(),
      zip_code: yup.string().nullable(),
      license_number: yup.string().nullable(),
      license_expiry: yup.date().nullable(),
      license_state: yup.string().nullable(),
      license_type: (yup.string() as any).enum(DriverLicenseType).nullable(),
      years_cdl_experience: yup.number().min(0).nullable(),
      can_pass_drug_test: yup.bool().nullable(),
      is_owner_operator: yup.bool().nullable(),
      transmission_type: yup.array((yup.string() as any).enum(VehicleTransmissionType)).nullable(),
      endorsements: yup.array((yup.string() as any).enum(DriverEndorsement)).nullable(),
      highest_degree: (yup.string() as any).enum(EducationLevel).nullable(),
      authorized_to_work_in_us: yup.bool().nullable(),
      emergency_contact_name: yup.string().nullable(),
      emergency_contact_number: yup.string().nullable(),
      emergency_contact_relationship: yup.string().nullable(),
      preferred_location: yup.array((yup.string() as any).enum(JobGeography)).nullable(),
      job: yup
        .object({
          id: yup.number().nullable(),
        })
        .nullable(),
      equipment_experience: (yup.array(EmployeeExperienceEntity.yupSchema()) as any).unique(
        'type',
        { mapper: EmployeeExperienceEntity.key }
      ),
      equipment_owned: (yup.array(EmployeeEquipmentEntity.yupSchema()) as any).unique('type', {
        mapper: EmployeeEquipmentEntity.key,
      }),
      managerId: yup.number().nullable(),
      hire_date: yup.date().nullable(),
      hr_notes: yup.string().nullable(),
    });
  }

  static yupSchemaForMarking() {
    return yup.object({
      id: yup.number().required().nullable(),
      status: (yup.string() as any).enum(EmployeeStatus).required().nullable(),
      reason_codes: (
        yup
          .array(yup.string())
          .when('status', {
            is: EmployeeStatus.QUIT,
            then: yup
              .array((yup.string() as any).enum(EmployeeReasonCodeQuit))
              .min(1, 'SELECT_THE_REASON')
              .nullable(),
          })
          .when('status', {
            is: EmployeeStatus.FIRED,
            then: yup
              .array((yup.string() as any).enum(EmployeeReasonCodeFired))
              .min(1, 'SELECT_THE_REASON')
              .nullable(),
          }) as any
      )
        .unique()
        .nullable(),
      reason_codes_other: yup
        .string()
        .when('reason_codes', {
          is: (v) => v && v.includes('OTHER'),
          then: yup.string().trim().required().nullable(),
        })
        .nullable(),
      termination_date: yup
        .date()
        .required()
        .test('is-after-hire-date', 'TERMINATION_DATE_MUST_BE_AFTER_HIRE_DATE', function (value) {
          const hire_date = this.resolve(yup.ref('hire_date')); // Get the hire_date from the context

          if (!value) return true;

          // Convert both dates to Date objects (if they aren't already)
          const hireDate = hire_date instanceof Date ? hire_date : new Date(hire_date as string);
          const terminationDate = value instanceof Date ? value : new Date(value as string);

          return terminationDate > hireDate;
        })
        .nullable(),
    });
  }

  static yupSchemaForImportEmployees() {
    return yup.object({
      first_name: yup.string().optional().nullable().trim(),
      last_name: yup.string().optional().nullable().trim(),
      phone: yup
        .string()
        .nullable()
        .test({
          name: 'phone',
          message: 'IMPORT_PHONE_ERROR',
          test: (value) => {
            var patt = new RegExp(/^\+?1?\s*?\(?\d{3}(?:\)|[-|\s])?\s*?\d{3}[-|\s]?\d{4}$/);
            return patt.test(value);
          },
        }),
      email: yup.string().email().optional().nullable(),
      birthdate: yup
        .date()
        .nullable()
        .test('age', 'IMPORT_AGE_ERROR', function (value) {
          if (!value) return true;

          const currentDate = new Date();
          const birthdate = new Date(value);
          const age = currentDate.getFullYear() - birthdate.getFullYear();

          return age >= 18;
        }),
      address_1: yup.string().nullable(),
      address_2: yup.string().nullable(),
      city: yup.string().nullable(),
      state: yup.string().nullable(),
      zip_code: yup.string().nullable(),
      license_number: yup.string().required().nullable(),
      license_expiry: yup
        .date()
        .typeError('IMPORT_DATE_ERROR')
        .min(moment().endOf('day'), 'LICENSE_MUST_BE_VALID_AFTER_TODAY')
        .required()
        .nullable(),
      license_state: yup.string().nullable().required(),
      license_type: (yup.string() as any).enum(DriverLicenseType).nullable(),
      years_cdl_experience: yup.number().min(0).nullable(),
      can_pass_drug_test: yup.bool().nullable(),
      is_owner_operator: yup.bool().nullable(),
      transmission_type: yup.array((yup.string() as any).enum(VehicleTransmissionType)).nullable(),
      endorsements: yup.array((yup.string() as any).enum(DriverEndorsement)).nullable(),
      highest_degree: (yup.string() as any).enum(EducationLevel).nullable(),
      authorized_to_work_in_us: yup.bool().nullable(),
      emergency_contact_name: yup.string().nullable(),
      emergency_contact_number: yup
        .string()
        .nullable()
        .test({
          name: 'emergency_contact_number',
          message: 'IMPORT_PHONE_ERROR',
          test: (value) => {
            var patt = new RegExp(/^\+?1?\s*?\(?\d{3}(?:\)|[-|\s])?\s*?\d{3}[-|\s]?\d{4}$/);
            return patt.test(value);
          },
        }),
      emergency_contact_relationship: yup.string().nullable(),
      preferred_location: yup.array((yup.string() as any).enum(JobGeography)).nullable(),
      jobId: yup.number().required(),
      managerId: yup.number().optional().nullable(),
      hire_date: yup.date().nullable(),
    });
  }
}
