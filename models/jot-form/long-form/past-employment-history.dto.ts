import * as yup from "yup";
import { ApplicantExtrasEntity } from "../../applicant/applicant-extras.entity";

export class PastEmploymentHistoryDto {
	is_previous_employed: boolean;
	PAST_EMPLOYER: ApplicantExtrasEntity;

	static yupSchema() {
		return yup.object({
			is_previous_employed: yup.boolean().optional().nullable(),
			PAST_EMPLOYER: yup
				.object()
				.when("is_previous_employed", {
					is: (v) => !!v,
					then: ApplicantExtrasEntity.yupSchema(),
				})
				.nullable(),
		});
	}
}
