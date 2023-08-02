import { JobEntity } from '../job/job.entity';
import { ApplicantStatus } from '../../enums/applicants/applicant-status.enum';
import { ApplicantEntity } from '../applicant';
import * as yup from "yup";
import "../../utils/yup";
import {
	ApplicantReasonCodeFired,
	ApplicantReasonCodeNotInterested,
	ApplicantReasonCodeNotQualified,
	ApplicantReasonCodeQuit
} from '../../enums/applicants/applicant-reason-codes.enum';
import { Status } from '../../enums/status.enum';
import { UserEntity } from '../user/user.entity';
import { ApplicantExperienceEntity } from '../applicant';
import { DriverLicenseType } from '../../enums/users/driver-license-type.enum';
import { JobGeography } from '../../enums/jobs/job-geography.enum';
import { VehicleTransmissionType } from '../../enums/vehicles/vehicle-transmission-type.enum';
import { DriverEndorsement } from '../../enums/users/driver-endorsement.enum';
import { EducationLevel } from '../../enums/users/education-level.enum';
import { DocumentEntity } from '../documents/document.entity';

export class EmployeeEntity {
	id?: number;
	applicant?: ApplicantEntity;
	// applicantId?: number;
	job?: JobEntity;
	// jobId?: number;
	status?: ApplicantStatus;
	status_other?: string;
	reason_codes?: string[] = [];
	reason_codes_other?: string;
	created_at?: string;
	last_updated_at?: string;
	active_status?: Status;
	assignedUser: UserEntity;
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
	equipment_experience?: ApplicantExperienceEntity[];
	transmission_type?: string[];
	endorsements?: string[];
	emergency_contact_name?: string;
	emergency_contact_number?: string;
	emergency_contact_relationship?: string;

	documents?: DocumentEntity[] = [];

	static yupSchema() {
		return yup.object({
			first_name: yup.string().optional().nullable().trim(),
			last_name: yup.string().optional().nullable().trim(),
			phone: yup.string().nullable(),
			email: yup.string().email().optional().nullable(),
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
			job: yup.object({
				id: yup.number().required().nullable()
			}).required().nullable(),
			status: (yup.string() as any).enum(ApplicantStatus).required().nullable(),
			status_other: yup.string().when("status", {
				is: ApplicantStatus.OTHER,
				then: yup.string().required().nullable(),
			}).nullable(),
			reason_codes: (yup.array(yup.string())
				.when("status", {
					is: ApplicantStatus.INACTIVE_CONTACTED_NOT_QUALIFIED,
					then: yup.array((yup.string() as any).enum(ApplicantReasonCodeNotQualified)).min(1).nullable()
				})
				.when("status", {
					is: ApplicantStatus.INACTIVE_CONTACTED_UNINTERESTED,
					then: yup.array((yup.string() as any).enum(ApplicantReasonCodeNotInterested)).min(1).nullable()
				})
				.when("status", {
					is: ApplicantStatus.INACTIVE_QUIT,
					then: yup.array((yup.string() as any).enum(ApplicantReasonCodeQuit)).min(1).nullable()
				})
				.when("status", {
					is: ApplicantStatus.INACTIVE_FIRED,
					then: yup.array((yup.string() as any).enum(ApplicantReasonCodeFired)).min(1).nullable()
				}) as any)
				.unique().nullable(),
			reason_codes_other: yup.string().when("reason_codes", {
				is: v => v && v.includes("OTHER"),
				then: yup.string().required().nullable(),
			}).nullable(),
			equipment_experience: (
				yup.array(ApplicantExperienceEntity.yupSchema()) as any
			).unique("type", { mapper: ApplicantExperienceEntity.key }),
			assignedUserId: yup.number().optional().nullable()
		});
	}
}
