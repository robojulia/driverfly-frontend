import * as yup from "yup";
import { ApplicantExtrasEntity } from "../../applicant/applicant-extras.entity";

export class ViolationHistoryDto {
	VIOLATION_DETAILS?: ApplicantExtrasEntity;
	moving_violations_count?: number;
	static yupSchema() {
		return yup.object({
			VIOLATION_DETAILS: ApplicantExtrasEntity.yupSchema(),
			moving_violations_count: yup.number()
				.required()
				.when(
					'VIOLATION_DETAILS',
					(VIOLATION_DETAILS: ApplicantExtrasEntity, schema) =>
						schema.min(VIOLATION_DETAILS?.value?.length ?? 0)
							.required()
							.nullable()
				)
				.nullable(),
		});
	}
}
