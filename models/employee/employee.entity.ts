import { JobEntity } from '../job/job.entity';
import { ApplicantEntity } from '../applicant';
import * as yup from "yup";
import "../../utils/yup";
import { Status } from '../../enums/status.enum';
import { UserEntity } from '../user/user.entity';
import { ApplicantExperienceEntity } from '../applicant';
import { DriverLicenseType } from '../../enums/users/driver-license-type.enum';
import { JobGeography } from '../../enums/jobs/job-geography.enum';
import { VehicleTransmissionType } from '../../enums/vehicles/vehicle-transmission-type.enum';
import { DriverEndorsement } from '../../enums/users/driver-endorsement.enum';
import { EducationLevel } from '../../enums/users/education-level.enum';
import { DocumentEntity } from '../documents/document.entity';
import { EmployeeStatus } from '../../enums/applicants/employee-status.enum';
import { CompanyEntity } from '../company/company.entity';
import { CompanyManagerEntity } from '../company/company-manager.entity';
import { EmployeeExperienceEntity } from './employee-experience.entity';
import { EmployeeEquipmentEntity } from './employee-equipment.entity';
import { EmployeeReasonCodeFired, EmployeeReasonCodeQuit } from '../../enums/employee/employee-reason-codes.enum';

export class EmployeeEntity {
	id?: number;
	applicant?: ApplicantEntity;
	// applicantId?: number;
	job?: JobEntity;
	// jobId?: number;
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
	city?: string;
	state?: string;
	zip_code?: string;
	license_number?: string;
	license_expiry?: Date;
	license_state?: string;
	license_type?: string;
	years_cdl_experience?: number;
	can_pass_drug_test?: boolean;
	is_owner_operator?: boolean
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
	company: CompanyEntity;
	hire_date?: string | Date;
	manager?: CompanyManagerEntity;
	documents?: DocumentEntity[] = [];
	termination_date?: Date;

	static yupSchema() {
		return yup.object({
			first_name: yup.string().optional().nullable().trim(),
			last_name: yup.string().optional().nullable().trim(),
			phone: yup.string().nullable(),
			email: yup.string().email().optional().nullable(),
			birthdate: yup.date()
				.nullable()
				.test('age', 'You must be at least 18 years old', function (value) {
					if (!value) return true;

					const currentDate = new Date();
					const birthdate = new Date(value);
					const age = currentDate.getFullYear() - birthdate.getFullYear();

					return age >= 18;
				}),
			street: yup.string().nullable(),
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
			manager: yup.object({
				id: yup.number().optional().nullable()
			}).optional().nullable(),
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
			preferred_location: yup
				.array((yup.string() as any).enum(JobGeography))
				.nullable(),
			job: yup.object({
				id: yup.number().required().nullable()
			}).required().nullable(),
			// status_other: yup.string().when("status", {
			// 	is: EmployeeStatus.OTHER,
			// 	then: yup.string().required().nullable(),
			// }).nullable(),
			equipment_experience: (
				yup.array(EmployeeExperienceEntity.yupSchema()) as any
			).unique("type", { mapper: EmployeeExperienceEntity.key }),
			equipment_owned: (
				yup.array(EmployeeEquipmentEntity.yupSchema()) as any
			)("type", { mapper: EmployeeEquipmentEntity.key }),
			// managerId: yup.number().optional().nullable()
			hire_date: yup.date().nullable(),
		});
	}

	static yupSchemaForMarking() {
		return yup.object({
			id: yup.number().required().nullable(),
			status: (yup.string() as any).enum(EmployeeStatus).required().nullable(),
			reason_codes: (yup.array(yup.string())
				.when("status", {
					is: EmployeeStatus.QUIT,
					then: yup.array((yup.string() as any).enum(EmployeeReasonCodeQuit)).min(1, "SELECT_ONE_PLACEHOLDER").nullable()
				})
				.when("status", {
					is: EmployeeStatus.FIRED,
					then: yup.array((yup.string() as any).enum(EmployeeReasonCodeFired)).min(1, "SELECT_ONE_PLACEHOLDER").nullable()
				}) as any)
				.unique().nullable(),
			reason_codes_other: yup.string().when("reason_codes", {
				is: v => v && v.includes("OTHER"),
				then: yup.string().required().nullable(),
			}).nullable(),

		});
	}

	static yupSchemaForImportEmployees() {
		return yup.object({
			first_name: yup.string().optional().nullable().trim(),
			last_name: yup.string().optional().nullable().trim(),
			phone: yup.string().nullable(),
			email: yup.string().email().optional().nullable(),
			birthdate: yup.date()
				.nullable()
				.test('age', 'You must be at least 18 years old', function (value) {
					if (!value) return true;

					const currentDate = new Date();
					const birthdate = new Date(value);
					const age = currentDate.getFullYear() - birthdate.getFullYear();

					return age >= 18;
				}),
			street: yup.string().nullable(),
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
			preferred_location: yup
				.array((yup.string() as any).enum(JobGeography))
				.nullable(),
			jobId: yup.number().required(),
			// equipment_experience: (
			// 	yup.array(ApplicantExperienceEntity.yupSchema()) as any
			// ).unique("type", { mapper: ApplicantExperienceEntity.key }),
			managerId: yup.number().optional().nullable(),
			hire_date: yup.date().nullable(),
		});
	}
}
