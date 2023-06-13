import * as yup from "yup";
import { ApplicantVoeFormEntity } from "../applicant/applicant-voe-form.entity";

export class UpsertApplicantVoeformDto {
	applicant_uuid_token: string;
	employer_uuid_token: string;
	applicantVoeFormData: ApplicantVoeFormEntity[];

	static yupSchema() {
		return yup.object({
			applicant_uuid_token: yup.string().nullable().required(),
			employer_uuid_token: yup.string().nullable().required(),
			applicantVoeFormData: ApplicantVoeFormEntity.yupSchema(),
		});
	}
}
