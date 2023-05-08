import * as yup from "yup";
import "../../utils/yup";
import { JobEntity } from '../job/job.entity';
import { ApplicantStatus } from '../../enums/applicants/applicant-status.enum';
import { ApplicantEntity } from './applicant.entity';


export class ApplicantJobStatusHistoryEntity {
	id?: number;
	applicant?: ApplicantEntity;
	job?: JobEntity;
	status?: ApplicantStatus;
	status_other?: string;
	reason_codes?: string[] = [];
	reason_codes_other?: string;
	created_at?: string;
	last_updated_at?: string;

	static yupSchema() {
		return yup.object({
		});
	}
}
