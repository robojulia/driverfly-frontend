import * as yup from "yup";
import { ApplicantExtrasEntity } from "../../applicant/applicant-extras.entity";

export class AccidentHistoryDto {
	accident_count: number;
	ACCIDENT_DETAILS?: ApplicantExtrasEntity;

	static yupSchema() {
		return yup.object({
			accident_count: yup.number()
				.required()
				.when(
					'ACCIDENT_DETAILS',
					(ACCIDENT_DETAILS: ApplicantExtrasEntity, schema) =>
						schema.min(ACCIDENT_DETAILS?.value?.length ?? 0)
							.required()
							.nullable()
				)
				.nullable(),
			ACCIDENT_DETAILS: ApplicantExtrasEntity.yupSchema(),
		});
	}
}
