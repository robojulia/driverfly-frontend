import * as yup from "yup";
import "../../utils/yup";
export class HireApplicantDto {
	applicantId?: number;
	jobId?: number;
	hr_notes?: string;

	static yupSchema() {
		return yup.object({
			applicantId: yup.number().required().nullable(),
			jobId: yup.number().required().nullable(),
			hr_notes: yup.string().optional().nullable()
		});
	}
}
