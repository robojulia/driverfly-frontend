import * as yup from "yup";
import { ApplicantVoeFormEntity } from "../applicant/applicant-voe-form.entity";

export class UpsertApplicantVoeformDto {
	uuid_token: string;
	applicantVoeFormData: ApplicantVoeFormEntity[];

	static yupSchema() {
		return yup.object({
			uuid_token: yup.string().nullable().required(),
			applicantVoeFormData: ApplicantVoeFormEntity.yupSchema(),
		});
	}
}
