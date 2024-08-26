import * as yup from "yup";
import { ApplicantAccidentEntity } from "../../applicant/applicant-accidentr.entity";

export class AccidentHistoryDto {
	accident_count: number;
	accident_details?: string;
	accident_history?: ApplicantAccidentEntity[];

	static yupSchema() {
		return yup.object({
			accident_count: yup.number()
				.required()
				.when(
					'accident_history',
					(accident_history: ApplicantAccidentEntity[], schema) =>
						schema.min(accident_history?.length ?? 0)
							.required()
							.nullable()
				)
				.nullable(),
			accident_details: yup.string().nullable(),
			accident_history: yup.array().of(ApplicantAccidentEntity.yupSchema()),
		});
	}
}

// Old Schema Definition
// export class AccidentHistoryDto {
// 	accident_count: number;
// 	ACCIDENT_DETAILS?: ApplicantExtrasEntity;

// 	static yupSchema() {
// 		return yup.object({
// 			accident_count: yup.number()
// 				.required()
// 				.when(
// 					'ACCIDENT_DETAILS',
// 					(ACCIDENT_DETAILS: ApplicantExtrasEntity, schema) =>
// 						schema.min(ACCIDENT_DETAILS?.value?.length ?? 0)
// 							.required()
// 							.nullable()
// 				)
// 				.nullable(),
// 			ACCIDENT_DETAILS: ApplicantExtrasEntity.yupSchema(),
// 		});
// 	}
// }


