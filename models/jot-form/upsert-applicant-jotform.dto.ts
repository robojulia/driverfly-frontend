import * as yup from "yup";
import { ApplicantExtrasEntity } from "../applicant/applicant-extras.entity";
import { ApplicantEntity } from "../applicant/applicant.entity";
import { JobEntity } from "../job/job.entity";
import { UtmReferral } from "../auth/utm-referral.interface";

export class UpsertApplicantJotformDto {
	applicant?: ApplicantEntity;
	applicantExtras?: ApplicantExtrasEntity[];
	jobs?: JobEntity[];
	utm?: UtmReferral;

	static yupSchema(enumType?: object) {
		return yup.object({
			applicant: ApplicantEntity.yupSchema(),
			applicantExtras: ApplicantExtrasEntity.yupSchema(),
			jobs: yup.array(JobEntity.yupSchema()).nullable(),
		});
	}
}
