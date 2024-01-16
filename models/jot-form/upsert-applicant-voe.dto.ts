import * as yup from "yup";
import { ApplicantVoeEntity } from "../applicant/applicant-voe.entity";

export class UpsertApplicantVoeformDto {
	applicant_uuid_token: string;
	employer_uuid_token: string;
	voeData: ApplicantVoeEntity;

	static yupSchema() {
		return yup.object({
			applicant_uuid_token: yup.string().nullable().required(),
			employer_uuid_token: yup.string().nullable().required(),
			// applicantVoeFormData: ApplicantVoeEntity.yupSchema(),
		});
	}
}
