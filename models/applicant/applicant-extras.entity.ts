import * as yup from "yup";
import { ApplicantExtras } from "../../enums/applicants/applicant-extras.enum";
import { OtherRequirementType } from "../../enums/users/other-requirements.enum";
import { RouteType } from "../../enums/vehicles/routes-type.enum";
import { AccidentHistoryEntity } from "../jot-form/long-form/accident-last-5-years/index.dto";
import { AccordianExtras } from "../jot-form/long-form/accordian-info/index.dto";
import { BackgroundInfoLineAddress } from "../jot-form/long-form/backgorund-info/index.dto";
import { CdlExtras } from "../jot-form/long-form/cdl-object/index.dto";
import { VioalationExtrasEntity } from "../jot-form/long-form/violaton-history/index.dto";
import { WorkedBeforeExtrasDto } from "../jot-form/long-form/worked-before/index.dto";
import { BooleanTypeExtra } from "../../enums/jotform/bool-and-not-sure.enum";

export class ApplicantExtrasEntity {
	constructor(type?: ApplicantExtras) {
		console.log("type===", type)
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
					is: ApplicantExtras.AUTHORIZE_TO_COMMUNICATE,
					then: yup.string().required().nullable().default(BooleanTypeExtra.YES),
				})
				.when("type", {
					is: ApplicantExtras.ACCIDENT_DETAILS,
					then: yup.array(AccidentHistoryEntity.yupSchema()),
				})
				.when("type", {
					is: ApplicantExtras.VIOLATION_DETAILS,
					then: yup.array(VioalationExtrasEntity.yupSchema()),
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
					is: ApplicantExtras.LINE_ADDRESS,
					then: BackgroundInfoLineAddress.yupSchema(),
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
					is: ApplicantExtras.QUALIFIED_FOR_MANUAL_TRANSMISSION,
					then: yup.string().optional().nullable(),
				})
				.when("type", {
					is: ApplicantExtras.CDL_NUMBER,
					then: yup.array(CdlExtras.yupSchema()),
				})
				.when("type", {
					is: ApplicantExtras.ROUTES,
					then: yup
						.array((yup.string() as any).enum(RouteType))
						.min(0)
						.typeError("Choose atleast one!")
						.nullable(),
				})
				.when("type", {
					is: ApplicantExtras.REQUIRE_W2_EMPLOYMENT,
					then: yup.string().optional().nullable(),
				})
				.when("type", {
					is: ApplicantExtras.OTHER_ABSOLUTELY_REQUIREMENTS,
					then: yup
						.array((yup.string() as any).enum(OtherRequirementType))
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
				.when("type", {
					is: ApplicantExtras.ALREADY_APPLIED_TO_COMPANY,
					then: yup.boolean().default(false).optional().nullable(),
				})
				.when("type", {
					is: ApplicantExtras.ALREADY_WORKED_TO_COMPANY,
					then: WorkedBeforeExtrasDto.yupSchema(),
				})
				//for accordian
				.when("type", {
					is: ApplicantExtras.DISCLOSURE_AND_AUTHORIZATION_DATE,
					then: yup.date().required().nullable(),
				})
				.when("type", {
					is: ApplicantExtras.EMPLOYEE_SS_OR_ID,
					then: yup.string().optional().nullable(),
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
					is: ApplicantExtras.DOT_NUMBER,
					then: yup.string().optional().nullable(),
				})
				.when("type", {
					is: ApplicantExtras.GOOD_FIT,
					then: yup.boolean().optional().nullable(),
				})
				.when("type", {
					is: ApplicantExtras.AUTOMATED_RECRUITING_LEAD,
					then: yup.boolean().optional().nullable(),
				})
		});
	}
}
