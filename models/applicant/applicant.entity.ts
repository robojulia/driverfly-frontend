import { UserEntity } from "../user/user.entity";
import { CompanyEntity } from "../company/company.entity";
import { DocumentEntity } from "../documents/document.entity";
import { DriverLicenseType } from "../../enums/users/driver-license-type.enum";
import { LicenseRestrictions } from "../../enums/applicants/applicant-license-restrictions-type.enum";
import { EducationLevel } from "../../enums/users/education-level.enum";
import { ApplicantType } from "../../enums/applicants/applicant-type.enum";
import * as yup from "yup";
import { VehicleTransmissionType } from "../../enums/vehicles/vehicle-transmission-type.enum";
import { DriverEndorsement } from "../../enums/users/driver-endorsement.enum";
import { ApplicantDocumentType } from "../../enums/applicants/applicant-document-type.enum";
import { JobGeography } from "../../enums/jobs/job-geography.enum";
import {
	ApplicantExperienceEntity,
	ApplicantEquipmentEntity,
	ApplicantEmployerEntity,
	ApplicantNoteEntity,
	ApplicantJobEntity,
	ApplicantDacEntity,
	ApplicantExtrasEntity
} from "./index"
import { ApplicantVoeFormEntity } from "./applicant-voe-form.entity";
import { Status } from "../../enums/status.enum";
import { ApplicantStatus } from "../../enums/applicants/applicant-status.enum";
import { ApplicantJobStatusHistoryEntity } from "./applicant-job-status-history.entity";
import { EmployeeEntity } from "../employee/employee.entity";
import moment from "moment";
import { UtmReferral } from "../auth/utm-referral.interface";


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
	extras?: ApplicantExtrasEntity[] = []
	voeData?: ApplicantVoeFormEntity[] = []
	uuid_token?: string;
	status?: Status;
	current_application_status?: ApplicantStatus;
	job_history?: ApplicantJobStatusHistoryEntity;
	employee?: EmployeeEntity;
	is_hired?: boolean = false;
	remarks?: string;

	utm?: UtmReferral;

	static yupSchema() {
		return yup.object({
			first_name: yup.string().required().nullable().trim(),
			last_name: yup.string().required().nullable().trim(),
			phone: yup.string().nullable(),
			email: yup.string().email().required().nullable(),
			birthdate: yup.date().nullable(),
			street: yup.string().nullable(),
			city: yup.string().nullable(),
			state: yup.string().nullable(),
			zip_code: yup.string().nullable(),
			license_number: yup.string().nullable(),
			license_expiry: yup.date().typeError("INVALID_DATE")
				.test({
					test: (value, context) => {
						if (!Boolean(value)) return true;
						else {
							return yup.date()
								.min(
									moment().endOf("day").add(6, "months")
								)
								.isValidSync(value) || context.createError({
									path: context.path,
									message: "LICENSE_MUST_BE_VALID_FOR_6_MONTHS"
								});
						}
					}
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
			can_pass_drug_test: yup.bool().nullable(),
			is_owner_operator: yup.bool().nullable(),
			transmission_type: yup
				.array((yup.string() as any).enum(VehicleTransmissionType))
				.nullable(),
			endorsements: yup
				.array((yup.string() as any).enum(DriverEndorsement))
				.nullable(),
			highest_degree: (yup.string() as any).enum(EducationLevel).nullable(),
			authorized_to_work_in_us: yup.bool().nullable(),
			emergency_contact_name: yup.string().nullable(),
			emergency_contact_number: yup.string().nullable(),
			emergency_contact_relationship: yup.string().nullable(),
			has_past_dui: yup.bool().nullable(),
			dui_years: yup
				.array(
					yup
						.number()
						.min(new Date().getFullYear() - 5)
						.max(new Date().getFullYear())
				)
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
			is_hired: yup.bool().nullable(),
			remarks: yup.string().optional().nullable(),

			extras: yup.array(ApplicantExtrasEntity.yupSchema()),
		});
	}
}
