import * as yup from "yup";
import { ApplicantExtrasEntity } from "../applicant/applicant-extras.entity";
import { ApplicantEntity } from "../applicant/applicant.entity";
import { JobEntity } from "../job/job.entity";

export class UpsertApplicantJotformDto {
	applicant?: ApplicantEntity;
	applicantExtras?: ApplicantExtrasEntity[];
	jobs?: JobEntity[];
	utm?: {
		utm_source?: string;
		utm_medium?: string;
		utm_campaign?: string;
		utm_content?: string;
	}

	static yupSchema(enumType?: object) {
		return yup.object({
			applicant: ApplicantEntity.yupSchema(),
			applicantExtras: ApplicantExtrasEntity.yupSchema(),
			jobs: yup.array(JobEntity.yupSchema()).nullable(),
		});
	}
}
