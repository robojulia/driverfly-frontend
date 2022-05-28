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
import { JobCriminalEntity } from "./job-criminal.entity";
import { JobEquipmentEntity } from "./job-equipment.entity";
import { JobMvrEntity } from './job-mvr.entity';
import { JobSkillEntity } from './job-skill.entity';
import { CompanyEntity } from '../company/company.entity';

import * as yup from "yup";
import "../../utils/yup";

import { VehicleTransmissionType } from '../../enums/vehicles/vehicle-transmission-type.enum';
import { BasicEntity } from '../BasicEntity.entity';
import { JobPayFrequency } from '../../enums/jobs/job-pay-frequency.enum';

export class JobEntity {
    id?: number;
    location: LocationEntity = new LocationEntity();
    company: CompanyEntity = null;
    title: string;
    description: string;
    description_short?: string;
    drivers_needed?: number;
    expiry_date?: string | Date;
    geography?: JobGeography = JobGeography.LOCAL;
    schedule?: JobSchedule;
    schedule_other?: string;
    employment_type?: JobEmploymentType;
    equipment_type?: JobEquipmentType[] = [];
    equipment_type_other?: string;
    delivery_type?: JobDeliveryType[] = [];
    team_drivers?: JobTeamDriver;
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
    cdl_class?: DriverLicenseType[] = [];
    min_years_experience?: number;
    min_degree?: EducationLevel;
    required_skills?: JobSkillEntity[] = [];
    required_skills_other?: string;
    required_equipment?: JobEquipmentEntity[] = [];
    required_endorsement?: DriverEndorsement[] = [];
    transmission_type_experience?: string;
    max_applicant_radius?: number = 100;
    must_pass_drug_test?: boolean = true;
    must_have_clean_mvr?: boolean = true;
    mvr_requirements?: JobMvrEntity[] = [];
    accept_sap_graduates?: boolean = false;
    must_have_clean_criminal_history?: boolean = true;
    criminal_history?: JobCriminalEntity[] = [];
    max_accidents?: number;
    safety_requirements_other?: string;
    created_at?: string | Date;

    static yupSchema() {
        return yup.object({
            title: yup.string().required().max(100).nullable(),
            location: BasicEntity.yupSchema(),
            description: yup.string().max(250).required().nullable(),
            description_short: yup.string().max(250).required().nullable(),
            drivers_needed: yup.number().min(0).nullable(),
            expiry_date: yup.date().nullable(),
            geography: (yup.string() as any).enum(JobGeography).required().nullable(),
            max_applicant_radius: yup.number().min(1)
                .when("geography", {
                    is: JobGeography.LOCAL,
                    then: yup.number().max(100)
                }).when("geography", {
                    is: JobGeography.REGIONAL,
                    then: yup.number().max(1000)
                }).when("geography", {
                    is: JobGeography.OTR,
                    then: yup.number().max(3000)
                }).nullable(),
            schedule: (yup.string() as any).enum(JobSchedule).required().nullable(),
            schedule_other: yup.string().when("schedule", {
                is: v => v === JobSchedule.OTHER,
                then: yup.string().required().nullable()
            }).nullable(),
            employment_type: (yup.string() as any).enum(JobEmploymentType).required().nullable(),
            equipment_type: yup.array(
                (yup.string() as any).enum(JobEquipmentType)
            ),
            equipment_type_other: yup.string().when("equipment_type", {
                is: a => a.includes(JobEquipmentType.OTHER),
                then: yup.string().required().nullable()
            }).nullable(),
            delivery_type: yup.array(
                (yup.string() as any).enum(JobDeliveryType)
            ).min(1,),
            team_drivers: (yup.string() as any).enum(JobTeamDriver).required().nullable(),
            pay_method: //yup.array(
                (yup.string() as any).enum(JobPayMethod).required().nullable(),
            //),
            min_salary: yup.number().when("pay_method", {
                is: v => v === JobPayMethod.SALARY,
                then: yup.number().min(0).required().nullable()
            }).nullable(),
            max_salary: yup.number().when("pay_method", {
                is: v => v === JobPayMethod.SALARY,
                then: yup.number().min(0).required().nullable()
            }).nullable(),
            min_rate: yup.number().when("pay_method", {
                is: v => v === JobPayMethod.RATE_PER_MILE || v === JobPayMethod.HOURLY,
                then: yup.number().min(0).required().nullable()
            }).nullable(),
            max_rate: yup.number().when("pay_method", {
                is: v => v === JobPayMethod.RATE_PER_MILE || v === JobPayMethod.HOURLY,
                then: yup.number().min(0).required().nullable()
            }).nullable(),
            min_hours: yup.number().when("pay_method", {
                is: v => v === JobPayMethod.HOURLY,
                then: yup.number().min(0).required().nullable()
            }).nullable(),
            max_hours: yup.number().when("pay_method", {
                is: v => v === JobPayMethod.HOURLY,
                then: yup.number().min(0).required().nullable()
            }).nullable(),
            min_percent: yup.number().when("pay_method", {
                is: v => v === JobPayMethod.PERCENT_PER_MOVE || v === JobPayMethod.PERCENT_PER_WEIGHT,
                then: yup.number().min(0).required().nullable()
            }).nullable(),
            max_percent: yup.number().when("pay_method", {
                is: v => v === JobPayMethod.PERCENT_PER_MOVE || v === JobPayMethod.PERCENT_PER_WEIGHT,
                then: yup.number().min(0).required().nullable()
            }).nullable(),
            min_miles: yup.number().when("pay_method", {
                is: v => v === JobPayMethod.RATE_PER_MILE,
                then: yup.number().min(0).required().nullable()
            }).nullable(),
            max_miles: yup.number().when("pay_method", {
                is: v => v === JobPayMethod.RATE_PER_MILE,
                then: yup.number().min(0).required().nullable()
            }).nullable(),
            min_weekly_pay: yup.number().min(0).required().nullable(),
            max_weekly_pay: yup.number().min(0).required().nullable(),
            benefits: yup.array(
                (yup.string() as any).enum(JobBenefits)
            ),
            benefits_other: yup.string().when("benefits", {
                is: v => v.includes(JobBenefits.OTHER),
                then: yup.string().required().nullable()
            }).nullable(),
            vehicles: (yup.array(
                BasicEntity.yupSchema()
            ) as any).unique("id").nullable(),
            cdl_class: yup.array(
                (yup.string() as any)
                    .enum(DriverLicenseType)
            ),
            min_years_experience: yup.number().min(0).nullable(),
            min_degree: (yup.string() as any).enum(EducationLevel).nullable(),
            required_skills: (yup.array(
                JobSkillEntity.yupSchema()
            ) as any).unique("type"),
            required_skills_other: yup.string().max(250).nullable(),
            required_equipment: (yup.array(
                JobEquipmentEntity.yupSchema()
            ) as any).unique("type"),
            required_endorsement: yup.array(
                (yup.string() as any).enum(DriverEndorsement)
            ),
            transmission_type_expereince: yup.array(
                (yup.string() as any).enum(VehicleTransmissionType)
            ),
            must_pass_drug_test: yup.boolean().default(true),
            must_have_clean_mvr: yup.boolean().default(true),
            mvr_requirements: (yup.array(
                JobMvrEntity.yupSchema()
            ) as any).unique("type"),
            accept_sap_graduates: yup.boolean().default(false),
            must_have_clean_criminal_history: yup.boolean().default(true),
            criminal_history: (yup.array(
                JobCriminalEntity.yupSchema()
            ) as any).unique("type"),
            max_accidents: yup.number().min(0).nullable(),
            safety_requirements_other: yup.string().max(250).nullable(),
        });

    }
}
