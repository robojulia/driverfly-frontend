import * as yup from "yup";
import { ApplicantExtrasEntity } from "../../applicant/applicant-extras.entity";
import { JobGeography } from "../../../enums/jobs/job-geography.enum";

export class PreferencesDto {
	preferred_location?: JobGeography[] = [];
	ROUTES: ApplicantExtrasEntity;
	REQUIRE_W2_EMPLOYMENT?: ApplicantExtrasEntity;
	OTHER_ABSOLUTELY_REQUIREMENTS?: ApplicantExtrasEntity;
	static yupSchema() {
		return yup.object({
			preferred_location: yup
				.array((yup.string() as any).enum(JobGeography))
				.nullable(),
			ROUTES: ApplicantExtrasEntity.yupSchema(),
			REQUIRE_W2_EMPLOYMENT: ApplicantExtrasEntity.yupSchema(),
			OTHER_ABSOLUTELY_REQUIREMENTS: ApplicantExtrasEntity.yupSchema(),
		});
	}
}
