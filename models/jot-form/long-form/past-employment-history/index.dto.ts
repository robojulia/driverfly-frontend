import * as yup from "yup";
import "../../../../utils/yup";
import { ApplicantEmployerEntity } from "../../../applicant";

export class PastEmploymentHistoryDto extends ApplicantEmployerEntity {
	constructor() {
		super()
		this.is_current = false
	}

	static derivedYupSchema() {
		return yup.object({
			name: yup.string().required().nullable(),
			manager_name: yup.string().required().nullable(),
			phone: yup.string().optional().nullable(),
			city: yup.string().required().nullable()
				.matches(/^[aA-zZ\s]+$/, "Only character are allowed for this field "),
			is_subject_to_fmcsrs: yup.bool().nullable(),
			is_subject_to_drug_tests: yup.bool().nullable(),
			state: yup.string().required().nullable(),
			start_at: yup.date().required().nullable(),
			end_at: yup.date().required().nullable(),
			email: yup.string().required().nullable(),
			can_contact: yup.boolean().default(false).optional().nullable(),
			address: yup
				.string()
				.optional()
				.nullable(),
			address_2: yup
				.string()
				.optional()
				.nullable(),
			zip_code: yup.string()
				.required()
				.matches(/^[0-9]+$/, "Must be only digits")
				.min(5, 'Must be exactly 5 digits')
				.max(5, 'Must be exactly 5 digits'),
		});
	}
}
