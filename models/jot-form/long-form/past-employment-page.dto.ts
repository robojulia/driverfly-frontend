import * as yup from "yup";
import { PastEmploymentHistoryDto } from "./past-employment-history/index.dto";

export class PastEmploymentPageDto {
	is_previous_employed: boolean;
	employers: PastEmploymentHistoryDto[];
	employment_gap_details?: string;

	static yupSchema() {
		return yup.object().shape({
			is_previous_employed: yup.boolean().optional().nullable(),
			employers: yup
				.array()
				.when("is_previous_employed", {
					is: (v) => !!v,
					then: yup.array(PastEmploymentHistoryDto.derivedYupSchema()).nullable(),
				})
				.nullable(),
			employment_gap_details: yup.string().optional().nullable(),
		});
	}
}
