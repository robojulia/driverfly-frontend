import * as yup from "yup";
import { ApplicantExtrasEntity } from "../../applicant/applicant-extras.entity";
import { HearAboutUsType } from "../../../enums/jotform/hear-about-type.enum";

export class HearAboutUsDto {
	HEAR_ABOUT_US: ApplicantExtrasEntity;
	REFERAL_NAME?: ApplicantExtrasEntity

	static yupSchema() {
		return yup.object({
			HEAR_ABOUT_US: ApplicantExtrasEntity.yupSchema(),
			REFERAL_NAME: yup.object().when("HEAR_ABOUT_US", {
				is: v => v.value == HearAboutUsType.REFERRAL,
				then: ApplicantExtrasEntity.yupSchema()
			}).nullable()
		});
	}
}
