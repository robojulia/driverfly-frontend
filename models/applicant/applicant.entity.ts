import moment from "moment";
import * as yup from "yup";
import { ApplicantDocumentType } from "../../enums/applicants/applicant-document-type.enum";
import { LicenseRestrictions } from "../../enums/applicants/applicant-license-restrictions-type.enum";
import { ApplicantStatus } from "../../enums/applicants/applicant-status.enum";
import { ApplicantType } from "../../enums/applicants/applicant-type.enum";
import { JobGeography } from "../../enums/jobs/job-geography.enum";
import { JobSchedule } from "../../enums/jobs/job-schedule.enum";
import { BooleanTypeExtra } from "../../enums/jotform/bool-and-not-sure.enum";
import { Status } from "../../enums/status.enum";
import { DriverEndorsement } from "../../enums/users/driver-endorsement.enum";
import { DriverLicenseType } from "../../enums/users/driver-license-type.enum";
import { EducationLevel } from "../../enums/users/education-level.enum";
import { VehicleTransmissionType } from "../../enums/vehicles/vehicle-transmission-type.enum";
import { UtmReferral } from "../auth/utm-referral.interface";
import { CompanyEntity } from "../company/company.entity";
import { DocumentEntity } from "../documents/document.entity";
import { EmployeeEntity } from "../employee/employee.entity";
import { ReferralSourceEntity } from "../referral-source/referral-source.entity";
import { UserEntity } from "../user/user.entity";
import { ApplicantAccidentEntity } from "./applicant-accidentr.entity";
import { ApplicantJobStatusHistoryEntity } from "./applicant-job-status-history.entity";
import { ApplicantMovingViolationEntity } from "./applicant-moving-violation.entity";
import { ApplicantVoeEntity } from "./applicant-voe.entity";
import {
  ApplicantDacEntity,
  ApplicantEmployerEntity,
  ApplicantEquipmentEntity,
  ApplicantExperienceEntity,
  ApplicantExtrasEntity,
  ApplicantJobEntity,
  ApplicantNoteEntity,
} from "./index";

export class ApplicantEntity {
  id?: number;
  version?: number;
  user?: UserEntity;
  company?: CompanyEntity;
  assignedUser?: UserEntity;
  assignedUserId?: number;
  type?: ApplicantType;
  first_name?: string;
  last_name?: string;
  phone?: string;
  email?: string;
  birthdate?: string;
  address_1?: string;
  address_2?: string;
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
  license_restrictions_other?: string;
  can_pass_drug_test?: boolean = true;
  is_owner_operator?: boolean = false;
  transmission_type?: VehicleTransmissionType[] = [];
  endorsements?: DriverEndorsement[] = [];
  endorsements_other?: string;
  highest_degree?: EducationLevel;
  authorized_to_work_in_us?: boolean = true;
  preferred_location?: JobGeography[] = [];
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
  tickets_count?: number;
  tickets_details?: string;
  infractions?: boolean = false;
  infractions_count?: number;
  infractions_details?: string;
  moving_violations?: boolean = false;
  moving_violations_count?: number;
  moving_violations_details?: string;
  must_pass_drug_test?: boolean = true;
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
  dac?: ApplicantDacEntity[];
  extras?: ApplicantExtrasEntity[] = [];
  voeData?: ApplicantVoeEntity[] = [];
  uuid_token?: string;
  status?: Status;
  current_application_status?: ApplicantStatus;
  job_history?: ApplicantJobStatusHistoryEntity;
  employee?: EmployeeEntity;
  is_hired?: boolean = false;
  remarks?: string;
  utm?: UtmReferral;
  // referralSourceId?: number;
  referralSource?: ReferralSourceEntity;
  accident_history?: ApplicantAccidentEntity[];
  moving_violation_history?: ApplicantMovingViolationEntity[];
  already_applied_to_company?: boolean;
  already_worked_to_company?: boolean;
  already_worked_start_date?: Date;
  already_worked_end_date?: Date;
  is_automated_recruiting_lead?: boolean;
  authorize_to_communicate?: BooleanTypeExtra;
  routes?: JobSchedule[];

  static yupSchema() {
    return yup.object({
      first_name: yup.string().required().nullable().trim(),
      last_name: yup.string().required().nullable().trim(),
      phone: yup.string().nullable(),
      email: yup.string().email().required().nullable(),
      birthdate: yup.date().nullable(),
      address_1: yup.string().nullable(),
      address_2: yup.string().nullable(),
      street: yup.string().nullable(),
      city: yup.string().nullable(),
      state: yup.string().nullable(),
      zip_code: yup.string().nullable(),
      license_number: yup.string().trim().nullable(),
      license_expiry: yup
        .date()
        .typeError("INVALID_DATE")
        .test({
          name: "is-expired",
          message: "LICENSE_HAS_EXPIRED",
          test: function (value) {
            if (!value) return true;
            return moment(value).isAfter(moment().startOf("day"));
          },
        })
        .test({
          test: (value, context) => {
            if (!Boolean(value)) return true;
            else {
              return (
                yup
                  .date()
                  .min(moment().endOf("day").add(6, "months"))
                  .isValidSync(value) ||
                context.createError({
                  path: context.path,
                  message: "LICENSE_MUST_BE_VALID_FOR_6_MONTHS",
                })
              );
            }
          },
        })
        .nullable(),
      license_state: yup.string().nullable(),
      license_type: yup
        .string()
        .when("license_number", {
          is: (license_number) => !!license_number,
          then: (yup.string() as any).required().enum(DriverLicenseType),
        })
        .nullable(),
      years_cdl_experience: yup.number().min(0).nullable(),
      preferred_location: yup
        .array((yup.string() as any).enum(JobGeography))
        .nullable(),
      license_restrictions: yup
        .array((yup.string() as any).enum(LicenseRestrictions))
        .nullable(),
      license_restrictions_other: yup
        .string()
        // .when("license_restrictions", {
        // 	is: v => v && v.includes(LicenseRestrictions.OTHER),
        // 	then: yup.string().trim().required(),
        // })
        .trim()
        .nullable(),
      can_pass_drug_test: yup.bool().nullable(),
      is_owner_operator: yup.bool().nullable(),
      transmission_type: yup
        .array((yup.string() as any).enum(VehicleTransmissionType))
        .nullable(),
      endorsements: yup
        .array((yup.string() as any).enum(DriverEndorsement))
        .nullable(),
      endorsements_other: yup
        .string()
        .trim()
        // .when("endorsements", {
        // 	is: v => v && v.includes(DriverEndorsement.OTHER),
        // 	then: yup.string().trim().required(),
        // })
        .nullable(),
      highest_degree: (yup.string() as any).enum(EducationLevel).nullable(),
      authorized_to_work_in_us: yup.bool().nullable(),
      emergency_contact_name: yup.string().nullable(),
      emergency_contact_number: yup.string().nullable(),
      emergency_contact_relationship: yup.string().nullable(),
      has_past_dui: yup.bool().nullable(),
      dui_years: yup
        .array(yup.number().min(1900).max(new Date().getFullYear()))
        .nullable(),
      criminal_history: yup.string().nullable(),
      accident_count: yup
        .number()
        .required()
        .when(
          "accident_history",
          (accident_history: ApplicantAccidentEntity[], schema) =>
            schema
              .min(accident_history?.length ?? 0)
              .required()
              .nullable()
        )
        .nullable(),
      accident_history: yup
        .array(ApplicantAccidentEntity.yupSchema())
        .nullable(),
      moving_violation_history: yup
        .array(ApplicantMovingViolationEntity.yupSchema())
        .nullable(),
      accident_details: yup.string().nullable(),
      license_revoked: yup.bool().nullable(),
      license_revoked_details: yup.string().nullable(),
      psp_violations: yup.bool().nullable(),
      psp_violations_details: yup.string().nullable(),
      tickets: yup.bool().nullable(),

      tickets_count: yup.number().min(0).nullable(),
      tickets_details: yup.string().nullable(),
      infractions: yup.bool().nullable(),
      infractions_count: yup.number().min(0).nullable(),
      infractions_details: yup.string().nullable(),
      moving_violations: yup.bool().nullable(),
      moving_violations_count: yup
        .number()
        .required()
        .when(
          "moving_violation_history",
          (
            moving_violation_history: ApplicantMovingViolationEntity[],
            schema
          ) =>
            schema
              .min(moving_violation_history?.length ?? 0)
              .required()
              .nullable()
        )
        .nullable(),
      moving_violations_details: yup.string().nullable(),

      positive_drug_test: yup.bool().nullable(),
      positive_drug_test_details: yup.string().nullable(),
      equipment_experience: (
        yup.array(ApplicantExperienceEntity.yupSchema()) as any
      ).unique("type", { mapper: ApplicantExperienceEntity.key }),
      equipment_owned: (
        yup.array(ApplicantEquipmentEntity.yupSchema()) as any
      ).unique("type", { mapper: ApplicantEquipmentEntity.key }),
      employers: yup.array(ApplicantEmployerEntity.yupSchema()),
      documents: (
        yup.array(DocumentEntity.yupSchema(ApplicantDocumentType)) as any
      ).unique("type"), //modify file error messages
      jobs: (yup.array(ApplicantJobEntity.yupSchema()) as any).unique("job.id"),
      assignedUserId: yup.number().optional().nullable(),
      // is_hired: yup.bool().nullable(),
      remarks: yup.string().optional().nullable(),

      extras: yup.array(ApplicantExtrasEntity.yupSchema()),
    });
  }

  static yupSchemaForApplicantForm() {
    return yup.object({
      first_name: yup.string().required().nullable().trim(),
      last_name: yup.string().required().nullable().trim(),
      phone: yup
        .string()
        .required()
        .test({
          test: (value, context) => {
            console.log("value?.length", value?.length);

            if (value?.length < 17) {
              return context.createError({ message: "yup.phone" });
            }
            return true;
          },
        })
        .nullable(),
      email: yup.string().email().nullable(),
      birthdate: yup.date().nullable(),
      address_1: yup.string().nullable(),
      address_2: yup.string().nullable(),
      street: yup.string().nullable(),
      city: yup.string().nullable(),
      state: yup.string().nullable(),
      zip_code: yup.string().nullable(),
      license_number: yup.string().nullable(),
      license_expiry: yup
        .date()
        .typeError("INVALID_DATE")
        .test(
          'is-expired',
          'LICENSE_HAS_EXPIRED',
          (value) => moment(value).isAfter(moment().startOf('day'))
        )
        .min(
          moment().endOf("day").add(0.5, "years"),
          "LICENSE_MUST_BE_VALID_FOR_6_MONTHS"
        ).nullable(),
      license_state: yup.string().nullable(),
      license_type: (yup.string() as any).enum(DriverLicenseType).nullable(),
      years_cdl_experience: yup.number().min(0).nullable(),
      preferred_location: yup
        .array((yup.string() as any).enum(JobGeography))
        .nullable(),
      license_restrictions: yup
        .array((yup.string() as any).enum(LicenseRestrictions))
        .nullable(),
      license_restrictions_other: yup
        .string()
        .trim()
        // .when("license_restrictions", {
        // 	is: v => v && v.includes(LicenseRestrictions.OTHER),
        // 	then: yup.string().trim().required(),
        // })
        .nullable(),
      can_pass_drug_test: yup.bool().nullable(),
      is_owner_operator: yup.bool().nullable(),
      transmission_type: yup
        .array((yup.string() as any).enum(VehicleTransmissionType))
        .nullable(),
      endorsements: yup
        .array((yup.string() as any).enum(DriverEndorsement))
        .nullable(),
      endorsements_other: yup
        .string()
        .trim()
        // .when("endorsements", {
        // 	is: v => v && v.includes(DriverEndorsement.OTHER),
        // 	then: yup.string().trim().required(),
        // })
        .nullable(),
      highest_degree: (yup.string() as any).enum(EducationLevel).nullable(),
      authorized_to_work_in_us: yup.boolean().optional().nullable(),
      emergency_contact_name: yup.string().nullable(),
      emergency_contact_number: yup.string().nullable(),
      emergency_contact_relationship: yup.string().nullable(),
      has_past_dui: yup.bool().nullable(),
      dui_years: yup
        .array(yup.number().min(1900).max(new Date().getFullYear()))
        .nullable(),
      criminal_history: yup.string().nullable(),
      accident_count: yup
        .number()
        .default(0)
        .required()
        .when(
          "accident_history",
          (accident_history: ApplicantAccidentEntity[], schema) =>
            schema
              .min(accident_history?.length ?? 0)
              .required()
              .nullable()
        )
        .nullable(),
      accident_history: yup
        .array(ApplicantAccidentEntity.yupSchema())
        .nullable(),
      moving_violation_history: yup
        .array(ApplicantMovingViolationEntity.yupSchema())
        .nullable(),
      accident_details: yup.string().nullable(),
      license_revoked: yup.bool().nullable(),
      license_revoked_details: yup.string().nullable(),
      psp_violations: yup.bool().nullable(),
      psp_violations_details: yup.string().nullable(),
      tickets: yup.bool().nullable(),

      tickets_count: yup.number().min(0).nullable(),
      tickets_details: yup.string().nullable(),
      infractions: yup.bool().nullable(),
      infractions_count: yup.number().min(0).nullable(),
      infractions_details: yup.string().nullable(),
      moving_violations: yup.bool().nullable(),
      moving_violations_count: yup
        .number()
        .default(0)
        .required()
        .when(
          "moving_violation_history",
          (
            moving_violation_history: ApplicantMovingViolationEntity[],
            schema
          ) =>
            schema
              .min(moving_violation_history?.length ?? 0)
              .required()
              .nullable()
        )
        .nullable(),
      moving_violations_details: yup.string().nullable(),

      positive_drug_test: yup.bool().nullable(),
      positive_drug_test_details: yup.string().nullable(),
      equipment_experience: (
        yup.array(ApplicantExperienceEntity.yupSchema()) as any
      ).unique("type", { mapper: ApplicantExperienceEntity.key }),
      equipment_owned: (
        yup.array(ApplicantEquipmentEntity.yupSchema()) as any
      ).unique("type", { mapper: ApplicantEquipmentEntity.key }),
      employers: yup.array(ApplicantEmployerEntity.yupSchema()),
      documents: (
        yup.array(DocumentEntity.yupSchema()) as any
      ).unique("type"), //modify file error messages
      jobs: (yup.array(ApplicantJobEntity.yupSchema()) as any).unique("job.id"),
      assignedUserId: yup.number().optional().nullable(),
      // is_hired: yup.bool().nullable(),
      remarks: yup.string().optional().nullable(),

      already_applied_to_company: yup
        .boolean()
        .default(false)
        .optional()
        .nullable(),
      already_worked_to_company: yup
        .boolean()
        .default(false)
        .optional()
        .nullable(),
      already_worked_start_date: yup.date().max(new Date()).nullable(),
      already_worked_end_date: yup
        .date()
        .test({
          test: (value, context) => {
            const start_date = context.resolve(
              yup.ref("already_worked_start_date")
            );
            if (!Boolean(value)) return true;
            if (value > start_date) return true;

            return context.createError({
              path: context.path,
              message: "END_DATE_MUST_BE_AFTER_START_DATE",
            });
          },
        })
        .nullable(),
      is_automated_recruiting_lead: yup
        .boolean()
        .default(false)
        .optional()
        .nullable(),
      authorize_to_communicate: yup
        .string()
        // .default(BooleanTypeExtra.YES)
        .optional()
        .nullable(),
      routes: yup
        .array((yup.string() as any).enum(JobSchedule))
        .min(0)
        .nullable(),

      extras: yup.array(ApplicantExtrasEntity.yupSchema()),
    });
  }

  static yupSchemaForApplyForm() {
    return yup.object({
      first_name: yup.string().required().nullable().trim(),
      last_name: yup.string().required().nullable().trim(),
      phone: yup
        .string()
        .required()
        .test({
          test: (value, context) => {
            if (value?.length < 17) {
              return context.createError({ message: "yup.phone" });
            }
            return true;
          },
        })
        .nullable(),
      email: yup.string().email().required().nullable(),
      birthdate: yup.date().nullable(),
      address_1: yup.string().nullable(),
      address_2: yup.string().nullable(),
      street: yup.string().nullable(),
      city: yup.string().nullable(),
      state: yup.string().nullable(),
      zip_code: yup.string().nullable(),
      license_number: yup.string().nullable(),
      license_expiry: yup
        .date()
        .typeError("INVALID_DATE")
        .test({
          test: (value, context) => {
            if (!Boolean(value)) return true;
            else {
              return (
                yup
                  .date()
                  .min(moment().endOf("day").add(6, "months"))
                  .isValidSync(value) ||
                context.createError({
                  path: context.path,
                  message: "LICENSE_MUST_BE_VALID_FOR_6_MONTHS",
                })
              );
            }
          },
        })
        .nullable(),
      license_state: yup.string().nullable(),
      license_type: (yup.string() as any).enum(DriverLicenseType).nullable(),
      years_cdl_experience: yup
        .number()
        .when("license_type", {
          is: (value) => !!value && value != DriverLicenseType.NO_CDL,
          then: yup.number().moreThan(-1).required(),
        })
        .nullable(),
      preferred_location: yup
        .array((yup.string() as any).enum(JobGeography))
        .nullable(),
      license_restrictions: yup
        .array((yup.string() as any).enum(LicenseRestrictions))
        .nullable(),
      license_restrictions_other: yup
        .string()
        .trim()
        // .when("license_restrictions", {
        // 	is: v => v && v.includes(LicenseRestrictions.OTHER),
        // 	then: yup.string().trim().required(),
        // })
        .nullable(),
      is_owner_operator: yup.bool().nullable(),
      transmission_type: yup
        .array((yup.string() as any).enum(VehicleTransmissionType))
        .nullable(),
      endorsements: yup
        .array((yup.string() as any).enum(DriverEndorsement))
        .nullable(),
      endorsements_other: yup
        .string()
        .trim()
        // .when("endorsements", {
        // 	is: v => v && v.includes(DriverEndorsement.OTHER),
        // 	then: yup.string().trim().required(),
        // })
        .nullable(),
      highest_degree: (yup.string() as any).enum(EducationLevel).nullable(),
      emergency_contact_name: yup.string().nullable(),
      emergency_contact_number: yup.string().nullable(),
      emergency_contact_relationship: yup.string().nullable(),
      has_past_dui: yup.bool().nullable(),
      dui_years: yup
        .array(yup.number().min(1900).max(new Date().getFullYear()))
        .nullable(),
      criminal_history: yup.string().nullable(),
      can_pass_drug_test: yup.boolean().nullable(),
      accident_count: yup.number().required().min(0).nullable(),
      moving_violations_count: yup.number().required().min(0).nullable(),
      authorized_to_work_in_us: yup.bool().nullable(),
      authorize_to_communicate: yup
        .string()
        .required()
        .nullable(),
      accident_details: yup.string().nullable(),
      license_revoked: yup.bool().nullable(),
      license_revoked_details: yup
        .string()
        .when("license_revoked", {
          is: (v) => !!v,
          then: yup.string().required().nullable(),
        })
        .nullable(),
      psp_violations: yup.bool().nullable(),
      psp_violations_details: yup.string().nullable(),
      tickets: yup.bool().nullable(),

      tickets_count: yup.number().min(0).nullable(),
      tickets_details: yup.string().nullable(),
      infractions: yup.bool().nullable(),
      infractions_count: yup.number().min(0).nullable(),
      infractions_details: yup.string().nullable(),
      moving_violations: yup.bool().nullable(),
      moving_violations_details: yup.string().nullable(),

      positive_drug_test: yup.bool().nullable(),
      positive_drug_test_details: yup.string().nullable(),
      equipment_experience: (
        yup.array(ApplicantExperienceEntity.yupSchema()) as any
      ).unique("type", { mapper: ApplicantExperienceEntity.key }),
      equipment_owned: (
        yup.array(ApplicantEquipmentEntity.yupSchema()) as any
      ).unique("type", { mapper: ApplicantEquipmentEntity.key }),
      employers: yup.array(ApplicantEmployerEntity.yupSchema()),
      documents: (
        yup.array(DocumentEntity.yupSchema(ApplicantDocumentType)) as any
      ).unique("type"), //modify file error messages
      jobs: (yup.array(ApplicantJobEntity.yupSchema()) as any).unique("job.id"),
      assignedUserId: yup.number().optional().nullable(),
      // is_hired: yup.bool().nullable(),
      remarks: yup.string().optional().nullable(),
    });
  }

  static yupSchemaForImportApplicants() {
    return yup.object({
      first_name: yup.string().required().nullable().trim(),
      last_name: yup.string().required().nullable().trim(),
      phone: yup.string().required().nullable(),
      email: yup.string().email().nullable(),
      birthdate: yup.date().nullable(),
      address_1: yup.string().nullable(),
      address_2: yup.string().nullable(),
      city: yup.string().nullable(),
      state: yup.string().nullable(),
      zip_code: yup.string().nullable(),
      license_number: yup.string().nullable(),
      license_expiry: yup
        .date()
        .typeError("INVALID_DATE")
        .test({
          name: 'is-expired',
          message: 'LICENSE_HAS_EXPIRED',
          test: function (value) {
            if (!value) return true;
            return moment(value).isAfter(moment().startOf('day'));
          },
        })
        .test({
          test: (value, context) => {
            if (!Boolean(value)) return true;
            else {
              return (
                yup
                  .date()
                  .min(moment().endOf("day").add(6, "months"))
                  .isValidSync(value) ||
                context.createError({
                  path: context.path,
                  message: "LICENSE_MUST_BE_VALID_FOR_6_MONTHS",
                })

              );
            }
          },
        })
        .nullable(),
      license_state: yup.string().nullable(),
      license_type: (yup.string() as any).enum(DriverLicenseType).nullable(),
      years_cdl_experience: yup.number().min(0).nullable(),
      preferred_location: yup
        .array((yup.string() as any).enum(JobGeography))
        .nullable(),
      license_restrictions: yup
        .array((yup.string() as any).enum(LicenseRestrictions))
        .nullable(),
      license_restrictions_other: yup
        .string()
        .trim()
        // .when("license_restrictions", {
        // 	is: v => v && v.includes(LicenseRestrictions.OTHER),
        // 	then: yup.string().trim().required(),
        // })
        .nullable(),
      can_pass_drug_test: yup.bool().nullable(),
      is_owner_operator: yup.bool().nullable(),
      transmission_type: yup
        .array((yup.string() as any).enum(VehicleTransmissionType))
        .nullable(),
      endorsements: yup
        .array((yup.string() as any).enum(DriverEndorsement))
        .nullable(),
      endorsements_other: yup
        .string()
        .trim()
        // .when("endorsements", {
        // 	is: v => v && v.includes(DriverEndorsement.OTHER),
        // 	then: yup.string().trim().required(),
        // })
        .nullable(),
      highest_degree: (yup.string() as any).enum(EducationLevel).nullable(),
      authorized_to_work_in_us: yup.bool().nullable(),
      emergency_contact_name: yup.string().nullable(),
      emergency_contact_number: yup.string().nullable(),
      emergency_contact_relationship: yup.string().nullable(),
      has_past_dui: yup.bool().nullable(),
      dui_years: yup
        .array(yup.number().min(1900).max(new Date().getFullYear()))
        .nullable(),
      criminal_history: yup.string().nullable(),
      accident_count: yup.number().min(0).nullable(),
      accident_details: yup.string().nullable(),
      license_revoked: yup.bool().nullable(),
      license_revoked_details: yup.string().nullable(),
      psp_violations: yup.bool().nullable(),
      psp_violations_details: yup.string().nullable(),
      tickets: yup.bool().nullable(),

      tickets_count: yup.number().min(0).nullable(),
      tickets_details: yup.string().nullable(),
      infractions: yup.bool().nullable(),
      infractions_count: yup.number().min(0).nullable(),
      infractions_details: yup.string().nullable(),
      moving_violations: yup.bool().nullable(),
      moving_violations_count: yup.number().min(0).nullable(),
      moving_violations_details: yup.string().nullable(),

      positive_drug_test: yup.bool().nullable(),
      positive_drug_test_details: yup.string().nullable(),
      equipment_experience: (
        yup.array(ApplicantExperienceEntity.yupSchemaForImport()) as any
      ).unique("type", { mapper: ApplicantExperienceEntity.key }),
      equipment_owned: (
        yup.array(ApplicantEquipmentEntity.yupSchema()) as any
      ).unique("type", { mapper: ApplicantEquipmentEntity.key }),
      employers: yup.array(ApplicantEmployerEntity.yupSchema()),
      documents: (
        yup.array(DocumentEntity.yupSchema(ApplicantDocumentType)) as any
      ).unique("type"), //modify file error messages
      jobs: (yup.array(ApplicantJobEntity.yupSchema()) as any).unique("job.id"),
      assignedUserId: yup.number().optional().nullable(),
      // is_hired: yup.bool().nullable(),
      remarks: yup.string().optional().nullable(),
    });
  }


  static yupSchemaForApplicantBasicDetailsForm() {
    return yup.object({
      first_name: yup.string().required().nullable().trim(),
      last_name: yup.string().required().nullable().trim(),
      phone: yup
        .string()
        .required()
        .test({
          test: (value, context) => {
            console.log("value?.length", value?.length);

            if (value?.length < 17) {
              return context.createError({ message: "yup.phone" });
            }
            return true;
          },
        })
        .nullable(),
      email: yup.string().email().nullable(),
      birthdate: yup.date().nullable(),
      address_1: yup.string().nullable(),
      address_2: yup.string().nullable(),
      street: yup.string().nullable(),
      city: yup.string().nullable(),
      state: yup.string().nullable(),
      zip_code: yup.string().nullable(),
      license_number: yup.string().nullable(),
      license_expiry: yup
        .date()
        .typeError("INVALID_DATE")
        .test({
          name: 'is-expired',
          message: 'LICENSE_HAS_EXPIRED',
          test: function (value) {
            if (!value) return true;
            return moment(value).isAfter(moment().startOf('day'));
          },
        })
        .test({
          test: (value, context) => {
            if (!Boolean(value)) return true;
            else {
              return (
                yup
                  .date()
                  .min(moment().endOf("day").add(6, "months"))
                  .isValidSync(value) ||
                context.createError({
                  path: context.path,
                  message: "LICENSE_MUST_BE_VALID_FOR_6_MONTHS",
                })

              );
            }
          },
        })
        .nullable(),
      license_state: yup.string().nullable(),
      license_type: (yup.string() as any).enum(DriverLicenseType).nullable(),
      years_cdl_experience: yup.number().min(0).nullable(),
      preferred_location: yup
        .array((yup.string() as any).enum(JobGeography))
        .nullable(),
      license_restrictions: yup
        .array((yup.string() as any).enum(LicenseRestrictions))
        .nullable(),
      license_restrictions_other: yup
        .string()
        .trim()
        .nullable(),
      can_pass_drug_test: yup.bool().nullable(),
      is_owner_operator: yup.bool().nullable(),
      transmission_type: yup
        .array((yup.string() as any).enum(VehicleTransmissionType))
        .nullable(),
      endorsements: yup
        .array((yup.string() as any).enum(DriverEndorsement))
        .nullable(),
      endorsements_other: yup
        .string()
        .trim()
        .nullable(),
      highest_degree: (yup.string() as any).enum(EducationLevel).nullable(),
      authorized_to_work_in_us: yup.boolean().optional().nullable(),
      emergency_contact_name: yup.string().nullable(),
      emergency_contact_number: yup.string().nullable(),
      emergency_contact_relationship: yup.string().nullable(),
    });
  }

  static yupSchemaApplicantExperienceForm() {
    return yup.object({
      equipment_experience: (
        yup.array(ApplicantExperienceEntity.yupSchemaForImport()) as any
      ).unique("type", { mapper: ApplicantExperienceEntity.key }),
    });
  }

  static yupSchemaApplicantEquipmentForm() {
    return yup.object({
      equipment_owned: (
        yup.array(ApplicantEquipmentEntity.yupSchema()) as any
      ).unique("type", { mapper: ApplicantEquipmentEntity.key }),
    });
  }

  static yupSchemaForApplicantWorkHistory() {
    return yup.object({
      employers: yup.array(ApplicantEmployerEntity.yupEditApplicantSchema()),
    });
  }

  static yupSchemaForApplicantAlreadyAppliedForm() {
    return yup.object({
      first_name: yup.string().required().nullable().trim(),
      last_name: yup.string().required().nullable().trim(),
      phone: yup
        .string()
        .required()
        .test({
          test: (value, context) => {
            if (value?.length < 17) {
              return context.createError({ message: "yup.phone" });
            }
            return true;
          },
        })
        .nullable(),
      email: yup.string().email().required().nullable(),
      birthdate: yup.date().nullable(),
      address_1: yup.string().nullable(),
      address_2: yup.string().nullable(),
      street: yup.string().nullable(),
      city: yup.string().nullable(),
      state: yup.string().nullable(),
      zip_code: yup.string().nullable(),
      license_number: yup.string().nullable(),
      license_expiry: yup
        .date()
        .typeError("INVALID_DATE")
        .test({
          test: (value, context) => {
            if (!Boolean(value)) return true;
            else {
              return (
                yup
                  .date()
                  .min(moment().endOf("day").add(6, "months"))
                  .isValidSync(value) ||
                context.createError({
                  path: context.path,
                  message: "LICENSE_MUST_BE_VALID_FOR_6_MONTHS",
                })
              );
            }
          },
        })
        .nullable(),
      license_state: yup.string().nullable(),
      license_type: (yup.string() as any).enum(DriverLicenseType).nullable(),
      years_cdl_experience: yup.number().min(0).nullable(),
      preferred_location: yup
        .array((yup.string() as any).enum(JobGeography))
        .nullable(),
      license_restrictions: yup
        .array((yup.string() as any).enum(LicenseRestrictions))
        .nullable(),
      license_restrictions_other: yup
        .string()
        .trim()
        // .when("license_restrictions", {
        // 	is: v => v && v.includes(LicenseRestrictions.OTHER),
        // 	then: yup.string().trim().required(),
        // })
        .nullable(),
      is_owner_operator: yup.bool().nullable(),
      transmission_type: yup
        .array((yup.string() as any).enum(VehicleTransmissionType))
        .nullable(),
      endorsements: yup
        .array((yup.string() as any).enum(DriverEndorsement))
        .nullable(),
      endorsements_other: yup
        .string()
        .trim()
        // .when("endorsements", {
        // 	is: v => v && v.includes(DriverEndorsement.OTHER),
        // 	then: yup.string().trim().required(),
        // })
        .nullable(),
      highest_degree: (yup.string() as any).enum(EducationLevel).nullable(),
      emergency_contact_name: yup.string().nullable(),
      emergency_contact_number: yup.string().nullable(),
      emergency_contact_relationship: yup.string().nullable(),
      has_past_dui: yup.bool().nullable(),
      dui_years: yup
        .array(yup.number().min(1900).max(new Date().getFullYear()))
        .nullable(),
      criminal_history: yup.string().nullable(),
      can_pass_drug_test: yup.boolean().nullable(),
      accident_count: yup.number().min(0).nullable(),
      moving_violations_count: yup.number().min(0).nullable(),
      authorized_to_work_in_us: yup.bool().nullable(),
      accident_details: yup.string().nullable(),
      license_revoked: yup.bool().nullable(),
      license_revoked_details: yup
        .string()
        .when("license_revoked", {
          is: (v) => !!v,
          then: yup.string().required().nullable(),
        })
        .nullable(),
      psp_violations: yup.bool().nullable(),
      psp_violations_details: yup.string().nullable(),
      tickets: yup.bool().nullable(),

      tickets_count: yup.number().min(0).nullable(),
      tickets_details: yup.string().nullable(),
      infractions: yup.bool().nullable(),
      infractions_count: yup.number().min(0).nullable(),
      infractions_details: yup.string().nullable(),
      moving_violations: yup.bool().nullable(),
      moving_violations_details: yup.string().nullable(),

      positive_drug_test: yup.bool().nullable(),
      positive_drug_test_details: yup.string().nullable(),
      equipment_experience: (
        yup.array(ApplicantExperienceEntity.yupSchema()) as any
      ).unique("type", { mapper: ApplicantExperienceEntity.key }),
      equipment_owned: (
        yup.array(ApplicantEquipmentEntity.yupSchema()) as any
      ).unique("type", { mapper: ApplicantEquipmentEntity.key }),
      employers: yup.array(ApplicantEmployerEntity.yupSchema()),
      documents: (
        yup.array(DocumentEntity.yupSchema(ApplicantDocumentType)) as any
      ).unique("type"), //modify file error messages
      jobs: (yup.array(ApplicantJobEntity.yupSchema()) as any).unique("job.id"),
      assignedUserId: yup.number().optional().nullable(),
      // is_hired: yup.bool().nullable(),
      remarks: yup.string().optional().nullable(),
    });
  }

  static yupSchemaForApplicantAlreadyWorkedForm() {
    return yup.object({
      already_applied_to_company: yup
        .boolean()
        .default(false)
        .optional()
        .nullable(),
      already_worked_to_company: yup
        .boolean()
        .default(false)
        .optional()
        .nullable(),
      already_worked_start_date: yup.date().max(new Date()).nullable(),
      already_worked_end_date: yup
        .date()
        .test({
          test: (value, context) => {
            const start_date = context.resolve(
              yup.ref("already_worked_start_date")
            );
            if (!Boolean(value)) return true;
            if (value > start_date) return true;

            return context.createError({
              path: context.path,
              message: "END_DATE_MUST_BE_AFTER_START_DATE",
            });
          },
        })
        .nullable(),

    });
  }

  static yupSchemaForApplicantSafetyBackgroundForm() {
    return yup.object({
      has_past_dui: yup.bool().nullable(),
      dui_years: yup
        .array(yup.number().min(1900).max(new Date().getFullYear()))
        .nullable(),
      criminal_history: yup.string().nullable(),
      can_pass_drug_test: yup.boolean().nullable(),
      accident_count: yup.number().min(0).nullable(),
      moving_violations_count: yup.number().min(0).nullable(),
      authorized_to_work_in_us: yup.bool().nullable(),
      accident_details: yup.string().nullable(),
      license_revoked: yup.bool().nullable(),
      license_revoked_details: yup
        .string()
        .when("license_revoked", {
          is: (v) => !!v,
          then: yup.string().required().nullable(),
        })
        .nullable(),
      psp_violations: yup.bool().nullable(),
      psp_violations_details: yup.string().nullable(),
      tickets: yup.bool().nullable(),
      tickets_count: yup.number().min(0).nullable(),
      tickets_details: yup.string().nullable(),
      infractions: yup.bool().nullable(),
      infractions_count: yup.number().min(0).nullable(),
      infractions_details: yup.string().nullable(),
      moving_violations: yup.bool().nullable(),
      moving_violations_details: yup.string().nullable(),
      positive_drug_test: yup.bool().nullable(),
      positive_drug_test_details: yup.string().nullable(),
    });
  }

  static yupSchemaForApplicantDocumentsForm() {
    return yup.object({
      documents: (
        yup.array(DocumentEntity.yupSchema()) as any
      ).unique("type"),
    });
  }

  static yupSchemaForApplicantJobsAppliedWithYouForm() {
    return yup.object({
      jobs: (yup.array(ApplicantJobEntity.yupSchema()) as any).unique("job.id"),
    });
  }
}

