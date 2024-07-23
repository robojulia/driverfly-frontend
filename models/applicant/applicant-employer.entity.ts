import * as yup from "yup";
import { DocumentEntity } from "../documents/document.entity";
import { ApplicantVoeEntity } from "./applicant-voe.entity";
import { ApplicantEntity } from "./applicant.entity";

export class ApplicantEmployerEntity {
	id?: number;
	applicant?: ApplicantEntity;
	name?: string;
	start_at?: string;
	end_at?: string;
	title?: string;
	street?: string;
	city?: string;
	state?: string;
	zip_code?: string;
	phone?: string;
	can_contact?: boolean = false;
	is_subject_to_fmcsrs?: boolean = false;
	is_subject_to_drug_tests?: boolean = false;
	created_at?: string;
	last_updated_at?: string;

	manager_name?: string;
	email?: string;
	address?: string;
	address_2?: string;
	uuid_token?: string;
	is_current?: boolean;

	voe_submitted?: boolean;
	voe_attempts?: any;
	auto_voe_attempts?: any;

	voeData?: ApplicantVoeEntity;
	documents?: DocumentEntity[];

	static yupSchema() {
		return yup.object({
			name: yup.string().required().trim().nullable(),
			manager_name: yup.string().optional().trim().nullable(),
			email: yup.string().email().optional().nullable(),
			address: yup.string().optional().trim().nullable(),
			address_2: yup.string().optional().trim().nullable(),
			start_at: yup.date().max(new Date()).nullable(),
			end_at: yup.date().when('is_current', {
				is: is_current => !is_current,
				then: yup.date().required().test({
					test: (value, context) => {
						const start_date = context.resolve(yup.ref('start_at'));
						if (!Boolean(value)) return true;
						if (value > start_date) return true;

						return context.createError({
							path: context.path,
							message: 'END_DATE_MUST_BE_AFTER_START_DATE'
						})
					}
				}
				)
			}).nullable(),
			title: yup.string().nullable().trim(),
			street: yup.string().nullable().trim(),
			city: yup.string().nullable().trim(),
			state: yup.string().nullable(),
			zip_code: yup.string().nullable(),
			phone: yup.string().nullable(),
			can_contact: yup.bool().nullable(),
			is_subject_to_fmcsrs: yup.bool().nullable(),
			is_subject_to_drug_tests: yup.bool().nullable(),
			is_current: yup.boolean().nullable(),
		});
	}

	static yupEditApplicantSchema() {
		return yup.object({
			name: yup.string().required().trim().nullable(),
			manager_name: yup.string().optional().trim().nullable(),
			email: yup.string().email().optional().nullable(),
			address: yup.string().optional().trim().nullable(),
			address_2: yup.string().optional().trim().nullable(),
			start_at: yup.date().max(new Date()).nullable(),
			end_at: yup.date().when('is_current', {
				is: is_current => !is_current,
				then: yup.date().test({
					test: (value, context) => {
						const start_date = context.resolve(yup.ref('start_at'));
						if (!Boolean(value)) return true;
						if (value > start_date) return true;

						return context.createError({
							path: context.path,
							message: 'END_DATE_MUST_BE_AFTER_START_DATE'
						})
					}
				}
				)
			}).nullable(),
			title: yup.string().nullable().trim(),
			street: yup.string().nullable().trim(),
			city: yup.string().nullable().trim(),
			state: yup.string().nullable(),
			zip_code: yup.string().nullable(),
			phone: yup.string().nullable(),
			can_contact: yup.bool().nullable(),
			is_subject_to_fmcsrs: yup.bool().nullable(),
			is_subject_to_drug_tests: yup.bool().nullable(),
			is_current: yup.boolean().nullable(),
		});
	}
}
