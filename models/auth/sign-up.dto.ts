import * as yup from "yup";
import { SignUpRole } from "../../enums/auth/sign-up-role.enum";
import { stringEnum } from "../../utils/yup";

export class SignUpDto {
	role: SignUpRole;
	name: string;
	first_name: string;
	last_name: string;
	phone: string;
	contact_number: string;
	email: string;
	password: string;
	confirmPassword?: string;
	accept_tos?: boolean = false;
	invite_code?: string;
	utm_source?: string;
	utm_medium?: string;
	utm_campaign?: string;
	utm_content?: string;
	personal_recruiter?: boolean = false;
	company_admin?: boolean = false;

	static yupSchema() {
		return yup.object({
			role: stringEnum(SignUpRole).required().nullable(),
			name: yup
				.string()
				.when("role", {
					is: SignUpRole.COMPANY,
					then: yup.string().trim().required().nullable(),
				})
				.trim()
				.nullable(),
			first_name: yup.string().trim().required().nullable(),
			last_name: yup.string().trim().required().nullable(),
			phone: yup.string().trim().nullable(),
			email: yup.string().trim().email().required().nullable(),

			/* Validating the password. */
			password: yup
				.string()
				.trim()
				.min(8, "PASSWORD_REQUIREMENT_LENGTH")
				.matches(/\d/, "PASSWORD_REQUIREMENT_NUMBER")
				.matches(
					/[`!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~]/,
					"PASSWORD_REQUIREMENT_SPECIAL_CHARACTER"
				)
				.required()
				.nullable(),

			confirmPassword: yup
				.string()
				.trim()
				.oneOf([yup.ref("password")], "PASSWORDS_DO_NOT_MATCH")
				.required()
				.nullable(),
			accept_tos: yup.boolean().oneOf([true], "MUST_BE_CHECKED"),
			personal_recruiter: yup.boolean().nullable(),
			company_admin: yup.boolean().nullable(),
			utm_source: yup.string().trim().nullable(),
			utm_medium: yup.string().trim().nullable(),
			utm_campaign: yup.string().trim().nullable().when("utm_source", {
				is: "rep",
				then: yup.string().trim().required().nullable(),
			}),
			utm_content: yup.string().trim().nullable(),
			invite_code: yup
				.string()
				.when("role", {
					is: SignUpRole.COMPANY,
					then: yup.string().trim().required().nullable(),
				})
				.nullable(),
		});
	}
}
