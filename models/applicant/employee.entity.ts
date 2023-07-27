import { JobEntity } from '../job/job.entity';
import { ApplicantStatus } from '../../enums/applicants/applicant-status.enum';
import { ApplicantEntity } from './applicant.entity';
import * as yup from "yup";
import "../../utils/yup";
import {
	ApplicantReasonCodeFired,
	ApplicantReasonCodeNotInterested,
	ApplicantReasonCodeNotQualified,
	ApplicantReasonCodeQuit
} from '../../enums/applicants/applicant-reason-codes.enum';
import { Status } from '../../enums/status.enum';

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
	// end_of_employment?: string;

	static yupSchema() {
		return yup.object({
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
		});
	}
}
