import * as yup from "yup";
import { ApplicantMovingViolationEntity } from "../../applicant/applicant-moving-violation.entity";


export class ViolationHistoryDto {
	moving_violation_history?: ApplicantMovingViolationEntity[];
	moving_violations_count?: number;
	moving_violations_details?: string;

	static yupSchema() {
		return yup.object({
			moving_violation_history: yup.array().of(ApplicantMovingViolationEntity.yupSchema()),
			moving_violations_details: yup.string().nullable(),
			moving_violations_count: yup.number()
				.required()
				.when(
					'moving_violation_history',
					(moving_violation_history: ApplicantMovingViolationEntity[], schema) =>
						schema.min(moving_violation_history?.length ?? 0)
							.required()
							.nullable()
				)
				.nullable(),
		});
	}
}
