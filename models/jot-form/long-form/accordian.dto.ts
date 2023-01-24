import * as yup from "yup";
import { ApplicantExtrasEntity } from "../../applicant/applicant-extras.entity";

export class AccordianDto {
	SIGNATURE_VOE_AUTHORIZATION: ApplicantExtrasEntity;
	SIGNATURE_DISCLOSURE_AUTHORIZATION: ApplicantExtrasEntity;
	SIGNATURE_IMPORTANT_BACKGROUND: ApplicantExtrasEntity;
	SIGNATURE_GENERAL_CONSENT: ApplicantExtrasEntity;
	EMPLOYEE_SS_OR_ID: ApplicantExtrasEntity;
	DISCLOSURE_AND_AUTHORIZATION_DATE: ApplicantExtrasEntity;
	IMPORTANT_DISCLOSURE_BACKGROUND_DATE: ApplicantExtrasEntity;
	GENERAL_CONSENT: ApplicantExtrasEntity;

	static yupSchema() {
		return yup.object({
			SIGNATURE_VOE_AUTHORIZATION: ApplicantExtrasEntity.yupSchema(),
			SIGNATURE_DISCLOSURE_AUTHORIZATION: ApplicantExtrasEntity.yupSchema(),
			SIGNATURE_IMPORTANT_BACKGROUND: ApplicantExtrasEntity.yupSchema(),
			SIGNATURE_GENERAL_CONSENT: ApplicantExtrasEntity.yupSchema(),
			EMPLOYEE_SS_OR_ID: ApplicantExtrasEntity.yupSchema(),
			DISCLOSURE_AND_AUTHORIZATION_DATE: ApplicantExtrasEntity.yupSchema(),
			IMPORTANT_DISCLOSURE_BACKGROUND_DATE: ApplicantExtrasEntity.yupSchema(),
			GENERAL_CONSENT: ApplicantExtrasEntity.yupSchema(),
		});
	}
}
