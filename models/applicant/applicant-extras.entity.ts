import * as yup from "yup";
import { ApplicantExtras } from "../../enums/applicants/applicant-extras.enum";
import { OtherRequirementType } from "../../enums/users/other-requirements.enum";
import { ApplicantAccidentEntity } from "../applicant/applicant-accidentr.entity";
import { ApplicantMovingViolationEntity } from "../applicant/applicant-moving-violation.entity";
import { AccordianExtras } from "../jot-form/long-form/accordian-info/index.dto";
import { CdlExtras } from "../jot-form/long-form/cdl-object/index.dto";

export class ApplicantExtrasEntity {
	constructor(type?: ApplicantExtras, id?: number) {
		if (!!id) this.id = id;
		if (!!type) this.type = type;
	}
	id?: number;
	type: ApplicantExtras;
	value?: any;

	static yupSchema() {
		return yup.object({
			type: (yup.string().required().nullable() as any).enum(ApplicantExtras),
			value: yup
				.mixed()
				.when("type", {
					is: ApplicantExtras.JOB_DUTIES,
					then: yup.array(yup.string().nullable()).optional().nullable(),
				})
				.when("type", {
					is: ApplicantExtras.ACCIDENT_DETAILS,
					then: yup.array(ApplicantAccidentEntity.yupSchema()),
				})
				.when("type", {
					is: ApplicantExtras.VIOLATION_DETAILS,
					then: yup.array(ApplicantMovingViolationEntity.yupSchema()),
				})
				.when("type", {
					is: ApplicantExtras.APPLY_DATE,
					then: yup.string().required().nullable(),
				})
				.when("type", {
					is: ApplicantExtras.SIGNATURE,
					then: yup.string().required().nullable(),
				})
				.when("type", {
					is: ApplicantExtras.HEAR_ABOUT_US,
					then: yup.string().required().nullable(),
				})
				.when("type", {
					is: ApplicantExtras.REFERAL_NAME,
					then: yup.string().required().nullable(),
				})
				.when("type", {
					is: ApplicantExtras.CDL_NUMBER,
					then: yup.array(CdlExtras.yupSchema()),
				})
				.when("type", {
					is: ApplicantExtras.REQUIRE_W2_EMPLOYMENT,
					then: yup.string().optional().nullable(),
				})
				.when("type", {
					is: ApplicantExtras.OTHER_ABSOLUTELY_REQUIREMENTS,
					then: yup
						.array(
							yup.string().test(
								'is-valid-requirement',
								'Invalid requirement type',
								(value) => {
									if (!value) return true;
									// Allow enum values or strings starting with "OTHERS:"
									return Object.values(OtherRequirementType).includes(value as OtherRequirementType) ||
										value.startsWith('OTHERS:');
								}
							)
						)
						.optional()
						.nullable(),
				})
				.when("type", {
					is: ApplicantExtras.PAST_LICENSE_SUSPENSION,
					then: yup.string().required().nullable(),
				})
				.when("type", {
					is: ApplicantExtras.REASON_FOR_UNABLE_TO_PERFORM_JOB,
					then: yup.string().required().nullable(),
				})
				.when("type", {
					is: ApplicantExtras.CONVICTED_OF_FELONY,
					then: yup.string().required().nullable(),
				})
				.when("type", {
					is: ApplicantExtras.DOT_REGULATION,
					then: yup.string().required().nullable(),
				})
				//for accordian
				.when("type", {
					is: ApplicantExtras.DISCLOSURE_AND_AUTHORIZATION_DATE,
					then: yup.date().required().nullable(),
				})
				.when("type", {
					is: ApplicantExtras.IMPORTANT_DISCLOSURE_BACKGROUND_DATE,
					then: yup.date().required().nullable(),
				})
				.when("type", {
					is: ApplicantExtras.GENERAL_CONSENT,
					then: AccordianExtras.yupSchema(),
				})
				.when("type", {
					is: ApplicantExtras.SIGNATURE_VOE_AUTHORIZATION,
					then: yup.string().required().nullable(),
				})
				.when("type", {
					is: ApplicantExtras.SIGNATURE_DISCLOSURE_AUTHORIZATION,
					then: yup.string().required().nullable(),
				})
				.when("type", {
					is: ApplicantExtras.SIGNATURE_IMPORTANT_BACKGROUND,
					then: yup.string().required().nullable(),
				})
				.when("type", {
					is: ApplicantExtras.SIGNATURE_GENERAL_CONSENT,
					then: yup.string().required().nullable(),
				})
				.when("type", {
					is: ApplicantExtras.BUSINESS_NAME,
					then: yup.string().optional().nullable(),
				})
				.when("type", {
					is: ApplicantExtras.DOT_VERIFICATION_RESULTS,
					then: yup.array(yup.string()).optional().nullable(),
				})
				.when("type", {
					is: ApplicantExtras.DOT_NUMBER,
					then: yup.string().optional().nullable(),
				})
		});
	}
}
