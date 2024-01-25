import * as yup from "yup";
import "../../../../utils/yup";

export class WorkedBeforeExtrasDto {
	start_date: string | Date
	end_date: string | Date
	static yupSchema() {
		return yup.object({
			start_date: yup.date().max(new Date()).nullable(),
			end_date: yup.date()
			.test({
				test: (value, context) => {
					const start_date = context.resolve(yup.ref('start_date'));
					if (!Boolean(value)) return true;
					if (value > start_date) return true;

					return context.createError({
						path: context.path,
						message: 'END_DATE_MUST_BE_AFTER_START_DATE'
					})
				}
			}).nullable(),
		});
	}
}
