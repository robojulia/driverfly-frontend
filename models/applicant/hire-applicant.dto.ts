import * as yup from "yup";
import "../../utils/yup";
export class HireApplicantDto {
	applicantId?: number;
	jobId?: number;

	static yupSchema() {
		return yup.object({
			applicantId: yup.number().required().nullable(),
			jobId: yup.number().required().nullable()
		});
	}
}
