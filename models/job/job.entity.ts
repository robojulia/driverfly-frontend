import * as yup from 'yup';
import '../../utils/yup';
import { DriverEndorsement } from '../../enums/users/driver-endorsement.enum';
import { EducationLevel } from '../../enums/users/education-level.enum';
import { DriverLicenseType } from '../../enums/users/driver-license-type.enum';
import { JobBenefits } from '../../enums/jobs/job-benefits.enum';
import { JobDeliveryType } from '../../enums/jobs/job-delivery-type.enum';
import { JobEquipmentType } from '../../enums/jobs/job-equipment-type.enum';
import { JobGeography } from '../../enums/jobs/job-geography.enum';
import { JobPayMethod } from '../../enums/jobs/job-pay-method.enum';
import { JobSchedule } from '../../enums/jobs/job-schedule.enum';
import { JobTeamDriver } from '../../enums/jobs/job-team-driver.enum';
import { JobEmploymentType } from '../../enums/jobs/job-employment-type.enum';
import { LocationEntity } from '../company/location.entity';
import { VehicleEntity } from '../company/vehicle.entity';
import { JobCriminalEntity } from './job-criminal.entity';
import { JobEquipmentEntity } from './job-equipment.entity';
import { JobMvrEntity } from './job-mvr.entity';
import { JobSkillEntity } from './job-skill.entity';
import { CompanyEntity } from '../company/company.entity';
import { VehicleTransmissionType } from '../../enums/vehicles/vehicle-transmission-type.enum';
import { BasicEntity } from '../BasicEntity.entity';
import { JobPayFrequency } from '../../enums/jobs/job-pay-frequency.enum';
import { JobDrugTestType } from '../../enums/jobs/job-drug-test-type.enum';
import { numberRangeEnd, numberRangeStart } from '../../utils/yup';
import { Status } from '../../enums/status.enum';
import { JobOrientationEntity } from './job-orientation.entity';

export class JobEntity {
  id?: number;
  slug?: string;
  location?: LocationEntity = new LocationEntity();
  company?: CompanyEntity = null;
  title?: string;
  description?: string;
  description_short?: string;
  drivers_needed?: number;
  expiry_date?: string | Date;
  geography?: JobGeography;
  schedule?: JobSchedule;
  schedule_other?: string;
  employment_type?: JobEmploymentType;
  equipment_type?: JobEquipmentType[] = [];
  equipment_type_other?: string;
  delivery_type?: JobDeliveryType[] = [];
  team_drivers?: JobTeamDriver = JobTeamDriver.NO_TEAM_DRIVER;
  pay_method?: JobPayMethod;
  pay_frequency?: JobPayFrequency;
  min_salary?: number;
  max_salary?: number;
  min_rate?: number;
  max_rate?: number;
  min_miles?: number;
  max_miles?: number;
  min_hours?: number;
  max_hours?: number;
  min_percent?: number;
  max_percent?: number;
  min_weekly_pay?: number;
  max_weekly_pay?: number;
  benefits?: JobBenefits[] = [];
  benefits_other?: string;
  vehicles?: VehicleEntity[] = [];
  cdl_class?: DriverLicenseType;
  min_years_experience?: number;
  min_experience_in_months?: number;
  min_experience_in_years?: number;
  min_degree?: EducationLevel;
  required_skills?: JobSkillEntity[] = [];
  required_skills_other?: string;
  required_equipment?: JobEquipmentEntity[] = [];
  required_endorsement?: DriverEndorsement[] = [];
  transmission_type_experience?: VehicleTransmissionType[] = [];
  max_applicant_radius?: number = 100;
  must_pass_drug_test?: boolean = true;
  drug_test_type?: JobDrugTestType[] = [];
  must_have_clean_mvr?: boolean = true;
  mvr_requirements?: JobMvrEntity[] = [];
  accept_sap_graduates?: boolean = false;
  must_have_clean_criminal_history?: boolean = true;
  criminal_history?: JobCriminalEntity[] = [];
  safety_requirements_other?: string;
  is_orientation_needed?: boolean = true;
  orientation?: JobOrientationEntity;
  created_at?: string | Date;
  applicantsCount?: number;
  status?: Status;
  static yupSchema() {
    return yup.object().shape(
      {
        title: yup.string().required().max(100).nullable(),
        location: LocationEntity.yupConnectSchema(true),
        is_orientation_needed: yup.boolean().default(false),
        orientation: yup
          .mixed()
          .when('is_orientation_needed', {
            is: Boolean,
            then: JobOrientationEntity.yupSchema(),
          })
          .nullable(),
        description: yup.string().max(1500).required().nullable(),
        drivers_needed: yup.number().min(0).nullable(),
        expiry_date: yup.date().nullable(),
        geography: (yup.string() as any).enum(JobGeography).required().nullable(),
        max_applicant_radius: yup
          .number()
          .min(1)
          .when('geography', {
            is: JobGeography.LOCAL,
            then: yup.number().max(100),
          })
          .when('geography', {
            is: JobGeography.REGIONAL,
            then: yup.number().max(1500),
          })
          .when('geography', {
            is: JobGeography.OTR,
            then: yup.number().max(3000),
          })
          .nullable(),
        schedule: (yup.string() as any).enum(JobSchedule).required().nullable(),
        schedule_other: yup
          .string()
          .when('schedule', {
            is: (v) => v == JobSchedule.OTHER,
            then: yup.string().required().nullable(),
          })
          .nullable(),
        employment_type: (yup.string() as any).enum(JobEmploymentType).required().nullable(),
        equipment_type: yup.array((yup.string() as any).enum(JobEquipmentType)).nullable(),
        equipment_type_other: yup
          .string()
          .when('equipment_type', {
            is: (a) => a?.includes(JobEquipmentType.OTHER),
            then: yup.string().required().nullable(),
          })
          .nullable(),
        delivery_type: yup.array((yup.string() as any).enum(JobDeliveryType)).nullable(),
        team_drivers: (yup.string() as any).enum(JobTeamDriver).nullable(),
        //yup.array(
        pay_method: (yup.string() as any).enum(JobPayMethod).required().nullable(),
        //),
        min_salary: yup
          .number()
          .when('pay_method', {
            is: (v) => v == JobPayMethod.SALARY,
            then: numberRangeStart('max_salary', 0).required(),
          })
          .when('pay_method', {
            is: (v) => v == JobPayMethod.OPEN_TO_NEGOTIATE,
            then: numberRangeStart('max_salary', 0).optional(),
          })
          .nullable(),
        max_salary: yup
          .number()
          .when('pay_method', {
            is: (v) => v == JobPayMethod.SALARY,
            then: numberRangeEnd('min_salary', 0, true).required(),
          })
          .when('pay_method', {
            is: (v) => v == JobPayMethod.OPEN_TO_NEGOTIATE,
            then: numberRangeEnd('min_salary', 0, true).optional(),
          })
          .nullable(),
        min_rate: yup
          .number()
          .when('pay_method', {
            is: (v) => v == JobPayMethod.RATE_PER_MILE || v == JobPayMethod.HOURLY,
            then: numberRangeStart('max_rate', 0).required(),
          })
          .when('pay_method', {
            is: (v) => v == JobPayMethod.OPEN_TO_NEGOTIATE,
            then: numberRangeStart('max_rate', 0).optional(),
          })
          .nullable(),
        max_rate: yup
          .number()
          .when('pay_method', {
            is: (v) => v == JobPayMethod.RATE_PER_MILE || v == JobPayMethod.HOURLY,
            then: numberRangeEnd('min_rate', 0, true).required(),
          })
          .when('pay_method', {
            is: (v) => v == JobPayMethod.OPEN_TO_NEGOTIATE,
            then: numberRangeEnd('min_rate', 0, true).optional(),
          })
          .nullable(),
        min_hours: yup
          .number()
          .when('pay_method', {
            is: (v) => v == JobPayMethod.HOURLY,
            then: numberRangeStart('max_hours', 0).required(),
          })
          .when('pay_method', {
            is: (v) => v == JobPayMethod.OPEN_TO_NEGOTIATE,
            then: numberRangeStart('max_hours', 0).optional(),
          })
          .nullable(),
        max_hours: yup
          .number()
          .when('pay_method', {
            is: (v) => v == JobPayMethod.HOURLY,
            then: numberRangeEnd('min_hours', 0, true).required(),
          })
          .when('pay_method', {
            is: (v) => v == JobPayMethod.OPEN_TO_NEGOTIATE,
            then: numberRangeEnd('min_hours', 0, true).optional(),
          })
          .nullable(),
        min_percent: yup
          .number()
          .when('pay_method', {
            is: (v) => v == JobPayMethod.PERCENT_PER_MOVE || v == JobPayMethod.PERCENT_PER_WEIGHT,
            then: numberRangeStart('max_percent', 0).required(),
          })
          .when('pay_method', {
            is: (v) => v == JobPayMethod.OPEN_TO_NEGOTIATE,
            then: numberRangeStart('max_percent', 0).optional(),
          })
          .nullable(),
        max_percent: yup
          .number()
          .when('pay_method', {
            is: (v) => v == JobPayMethod.PERCENT_PER_MOVE || v == JobPayMethod.PERCENT_PER_WEIGHT,
            then: numberRangeEnd('min_percent', 0, true).required(),
          })
          .when('pay_method', {
            is: (v) => v == JobPayMethod.OPEN_TO_NEGOTIATE,
            then: numberRangeEnd('min_percent', 0, true).optional(),
          })
          .nullable(),
        min_miles: yup
          .number()
          .when('pay_method', {
            is: (v) => v == JobPayMethod.RATE_PER_MILE,
            then: numberRangeStart('max_miles', 0).required(),
          })
          .when('pay_method', {
            is: (v) => v == JobPayMethod.OPEN_TO_NEGOTIATE,
            then: numberRangeStart('max_miles', 0).optional(),
          })
          .nullable(),
        max_miles: yup
          .number()
          .when('pay_method', {
            is: (v) => v == JobPayMethod.RATE_PER_MILE,
            then: numberRangeEnd('min_miles', 0, true).required(),
          })
          .when('pay_method', {
            is: (v) => v == JobPayMethod.OPEN_TO_NEGOTIATE,
            then: numberRangeEnd('min_miles', 0, true).optional(),
          })
          .nullable(),
        min_weekly_pay: yup
          .number()
          .when('pay_method', {
            is: (v) => v == JobPayMethod.OPEN_TO_NEGOTIATE,
            then: numberRangeStart('max_weekly_pay', 0).optional(),
            otherwise: numberRangeStart('max_weekly_pay', 0).required(),
          })
          .nullable(),
        max_weekly_pay: yup
          .number()
          .when('pay_method', {
            is: (v) => v == JobPayMethod.OPEN_TO_NEGOTIATE,
            then: numberRangeEnd('min_weekly_pay', 0, true).optional(),
            otherwise: numberRangeEnd('min_weekly_pay', 0, true).required(),
          })
          .nullable(),
        benefits: yup.array((yup.string() as any).enum(JobBenefits)).nullable(),
        benefits_other: yup
          .string()
          .when('benefits', {
            is: (v) => v?.includes(JobBenefits.OTHER),
            then: yup.string().required().nullable(),
          })
          .nullable(),
        vehicles: (yup.array(BasicEntity.yupSchema()) as any)
          .unique('id', 'SELECT_UNIQUE_VEHICLE_MESSAGE')
          .nullable(),
        cdl_class: (yup.string() as any).enum(DriverLicenseType).required().nullable(),
        min_years_experience: yup.number().min(0).nullable(),
        min_experience_in_months: yup.number().min(0).max(11).nullable(),
        min_experience_in_years: yup.number().min(0).nullable(),
        min_degree: (yup.string() as any).enum(EducationLevel).nullable(),
        required_skills: (yup.array(JobSkillEntity.yupSchema()) as any).unique('type'),
        required_skills_other: yup.string().max(250).nullable(),
        required_equipment: (yup.array(JobEquipmentEntity.yupSchema()) as any).unique('type'),

        required_endorsement: yup.array((yup.string() as any).enum(DriverEndorsement)).nullable(),
        transmission_type_expereince: yup.array(
          (yup.string() as any).enum(VehicleTransmissionType)
        ),
        must_pass_drug_test: yup.boolean().default(true),
        drug_test_type: yup.array((yup.string() as any).enum(JobDrugTestType)).nullable(),
        must_have_clean_mvr: yup.boolean().default(true),
        mvr_requirements: (yup.array(JobMvrEntity.yupSchema()) as any).unique('type').nullable(),
        accept_sap_graduates: yup.boolean().default(false),
        must_have_clean_criminal_history: yup.boolean().default(true),
        criminal_history: (yup.array(JobCriminalEntity.yupSchema()) as any).unique('type'),
        safety_requirements_other: yup.string().max(250).nullable(),
      },
      [['min_experience_in_months', 'min_experience_in_years']]
    );
  }
}
