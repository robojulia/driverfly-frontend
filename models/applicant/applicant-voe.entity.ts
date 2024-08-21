import * as yup from "yup";
import { ApplicantEmployerEntity } from "./applicant-employer.entity";
import { ApplicantEntity } from "./applicant.entity";
import { ReasonsForLeavingEmployment } from "../../enums/users/reasons-for-leaving-employment";
import { BooleanType } from "../../enums/jotform/boolean-type.enum";


export class ApplicantVoeEntity {
	constructor() { }
	id?: number;
	uuid_token?: string;
	applicant?: ApplicantEntity;
	employer?: ApplicantEmployerEntity;
	was_employed?: boolean;
	position?: string;
	start_date?: Date;
	end_date?: Date;
	reason_to_leave?: ReasonsForLeavingEmployment;
	focal_person_name?: string;
	focal_person_title?: string;
	focal_person_phone?: string;
	focal_person_email?: string;
	signed_date?: Date;
	signature?: string;
	did_drive_check?: BooleanType;
	drived_vehicle?: string;
	safety_performance?: boolean;
	registered_accidents_details?: boolean;
	accidents_reported_to_government?: string;
	allow_share?: boolean;
	created_at?: Date;
	last_updated_at?: Date;

	static yupSchemaEmployedByUs() {
		return yup.object({
			was_employed: yup.boolean().optional().nullable(),
		});
	}

	static yupSchemaAccidentHistory() {
		return yup.object({
			position: yup.string().required().nullable(),
			start_date: yup.date().required().nullable(),
			end_date: yup
				.date()
				.required()
				.test({
					test: (value, context) => {
						const start_date = context.resolve(
							yup.ref("start_date")
						);
						if (!Boolean(value)) return true;
						if (value > start_date) return true;

						return context.createError({
							path: context.path,
							message: "END_DATE_MUST_BE_AFTER_START_DATE",
						});
					},
				})
				.nullable(),
			did_drive_check: yup
				.mixed<BooleanType>()
				.oneOf(Object.values(BooleanType))
				.required()
				.nullable(),
			safety_performance: yup.boolean().nullable(),
			registered_accidents_details: yup
				.boolean()
				.nullable(),
			reason_to_leave: yup
				.mixed<ReasonsForLeavingEmployment>()
				.oneOf(Object.values(ReasonsForLeavingEmployment))
				.required()
				.nullable(),
		});
	}

	static yupSchemaSubmissionDetails() {
		return yup.object({
			signature: yup.string().required().nullable(),
			focal_person_name: yup.string().required().nullable(),
			focal_person_title: yup.string().required().nullable(),
			focal_person_phone: yup.string().required().nullable(),
			focal_person_email: yup.string().required().nullable(),
			signed_date: yup.date().required().nullable(),
			allow_share: yup.boolean().optional().nullable(),
		});
	}
}
