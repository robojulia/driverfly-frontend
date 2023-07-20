import React, { useContext, useEffect, useState } from "react";
import { Button, Col, Row } from "react-bootstrap";
import BaseSelect from "../../base-select";
import { useFormik } from "formik";
import { useTranslation } from "../../../../hooks/use-translation";
import { HearAboutUsDto } from "../../../../models/jot-form/short-form/hear-about.dto";
import JotformContext, { JotFormContextType } from "../../../../context/jotform-context";
import { ApplicantExtras } from "../../../../enums/applicants/applicant-extras.enum";
import { ApplicantExtrasEntity } from "../../../../models/applicant/applicant-extras.entity";
import styles from "../../../../styles/digitalhiringapp.module.css";
import { HearAboutUsType } from "../../../../enums/jotform/hear-about-type.enum";
import BaseInput from "../../base-input";
import ApplicantApi from "../../../../pages/api/applicant";
import { toast, ToastContainer } from "react-toastify";
import { globalAjaxExceptionHandler } from "../../../../utils/ajax";
import { LoaderIcon } from "../../../loading/loader-icon";
import CompanyApi from "../../../../pages/api/company";
import { CompanyPreferenceEntity } from "../../../../models/company/company-preferences.entity";
import { CompanyPreferenceCategory } from "../../../../enums/company/company-preference-category.enum";
import { CompanyPreferenceJotformLabel } from "../../../../enums/company/company-preferences-jotform-label.enum";
import { useEffectAsync } from "../../../../utils/react";
import { BooleanType } from "../../../../enums/jotform/boolean-type.enum";

export function HearAbout() {
	const {
		state: { applicantExtras, applicant, jobs },
		method: { setApplicantExtras, stepNext, stepBack, setApplicant },
	}: JotFormContextType = useContext(JotformContext);


	const [companyCdlPreferences, setCompanyCdlPreferences] = useState<string[]>([])
	const [companyPref, setCompanyPref] = useState<CompanyPreferenceEntity[]>([])


	const { t } = useTranslation();

	const form = useFormik({
		initialValues: new HearAboutUsDto(),
		validationSchema: HearAboutUsDto.yupSchema(),
		onSubmit: async (values) => {
			const applicantApi = new ApplicantApi();
			const { HEAR_ABOUT_US, REFERAL_NAME, GOOD_FIT } = values;
			if (applicant?.can_pass_drug_test) {
				try {
					const filteredExtras = ([
						...applicantExtras,
						{ ...HEAR_ABOUT_US },
						{ ...REFERAL_NAME },
						{ ...GOOD_FIT },
					]).filter(v => !!v?.value)

					const data = await applicantApi.jotform.create({
						applicant,
						applicantExtras: filteredExtras,
						jobs
					});
					setApplicantExtras(filteredExtras)
					setApplicant({
						...applicant,
						...data
					});

					// stepNext();

				} catch (error) {
					console.log(error);
					globalAjaxExceptionHandler(error, { formik: form, toast: toast, t: t });
				}
			} else {
				// stepNext();
			}
		},
		onReset: (values) => {
			stepBack();
		},
	});

	useEffectAsync(async () => {
		if (applicant?.company) {
			const companyApi = new CompanyApi();
			const cdl_class: CompanyPreferenceEntity = await companyApi.preferences
				.list(applicant?.company?.id,
					{ category: CompanyPreferenceCategory.JOTFORM }
				)
				.then((preferences: CompanyPreferenceEntity[]) =>
					preferences?.find((v) =>
						v?.label === CompanyPreferenceJotformLabel.CDL_CLASS
					)
				);

			setCompanyCdlPreferences(cdl_class?.value?.map(v => v ?? []))

			const companyPref: CompanyPreferenceEntity[] = await companyApi.preferences
				.list(applicant?.company?.id,
					{ category: CompanyPreferenceCategory.JOTFORM }
				)
			setCompanyPref(companyPref)



			if (applicant?.can_pass_drug_test) toast.success(t("successfully_saved_information"));
		}
	}, [applicant?.company])


	const CompanyPrefferedEmploymentType: CompanyPreferenceEntity = companyPref?.find(v => v.label === CompanyPreferenceJotformLabel.EMPLOYMENT_TYPE)
	const CompanyPrefferedMinExperience: CompanyPreferenceEntity = companyPref?.find(v => v.label === CompanyPreferenceJotformLabel.YEARS_CDL_EXPERIENCE)
	const CompanyPrefferedAccidentCountLimit: CompanyPreferenceEntity = companyPref?.find(v => v.label === CompanyPreferenceJotformLabel.MINIMUM_ACCIDENTS)
	const CompanyPrefferedAccidentViolationLimit: CompanyPreferenceEntity = companyPref?.find(v => v.label === CompanyPreferenceJotformLabel.MIN_MOVING_VIOLATIONS)
	const CompanyPreferedLocations: CompanyPreferenceEntity = companyPref?.find(v => v.label === CompanyPreferenceJotformLabel.JOB_GEOGRAPHY)
	const ApplicantAddedRoutes: ApplicantExtrasEntity = applicantExtras.find(v => v.type === ApplicantExtras.ROUTES)

	const ApplicantSalariedW2: ApplicantExtrasEntity = applicantExtras?.find(v => v.type == ApplicantExtras.REQUIRE_W2_EMPLOYMENT && v.value == BooleanType.YES)


	function checkJobGeographyInRouteType(RouteType: string[], JobGeography: string[]): boolean {
		for (let i = 0; i < RouteType?.length; i++) {
			for (let j = 0; j < JobGeography?.length; j++) {
				if (RouteType[i]?.includes(JobGeography[j])) {
					return true;
				}
			}
		}
		return false;
	}

	const hasJobGeographyInRouteType = checkJobGeographyInRouteType(ApplicantAddedRoutes?.value, CompanyPreferedLocations?.value);

	const checkApplicantEligibility = () => {
		if (Boolean(companyCdlPreferences.length > 0)
			&& !Boolean(companyCdlPreferences.includes(applicant?.license_type))) {
			return false
		}

		if (Boolean(applicant?.years_cdl_experience < CompanyPrefferedMinExperience?.value)) {
			return false
		}

		if (
			!Boolean(hasJobGeographyInRouteType) &&
			!Boolean(
				(CompanyPrefferedEmploymentType?.value?.includes('W2') && ApplicantSalariedW2) ||
				(CompanyPrefferedEmploymentType?.value?.includes('CONTRACT') && applicant?.is_owner_operator && ApplicantSalariedW2)

			)
		) {
			return false
		}
		if ((CompanyPrefferedEmploymentType?.value?.includes('OWNER_OPERATOR') && !applicant?.is_owner_operator)) {
			return false
		}

		if (Boolean(applicant?.accident_count > CompanyPrefferedAccidentCountLimit?.value)
			&& Boolean(applicant?.moving_violations_count > CompanyPrefferedAccidentViolationLimit?.value)) {
			return false
		}

		return true
	}


	useEffect(() => {
		if (checkApplicantEligibility()) {
			console.log("Applicant is suitable");
			form?.setFieldValue("GOOD_FIT.value", true)
		} else {
			console.log("Applicant is not suitable");
			form?.setFieldValue("GOOD_FIT.value", false)
		}
	}, [form.values])



	useEffect(() => {
		const apx = applicantExtras?.find(
			(v) => v.type === ApplicantExtras.HEAR_ABOUT_US
		);
		const apx_referal_name = applicantExtras?.find(
			(v) => v.type === ApplicantExtras.REFERAL_NAME
		);
		const apx_good_Fit = applicantExtras?.find(
			(v) => v.type === ApplicantExtras.GOOD_FIT
		);
		form.setValues({
			...form.values,
			HEAR_ABOUT_US: !!apx?.type
				? apx
				: new ApplicantExtrasEntity(ApplicantExtras.HEAR_ABOUT_US),
			REFERAL_NAME: !!apx_referal_name?.type
				? apx_referal_name
				: new ApplicantExtrasEntity(ApplicantExtras.REFERAL_NAME),
			GOOD_FIT: !!apx_good_Fit?.type
				? apx_good_Fit
				: new ApplicantExtrasEntity(ApplicantExtras.GOOD_FIT)
		});
	}, [applicantExtras]);

	// useEffect(() => {
	// 	console.log("form values", form.values);
	// 	console.log("form error", form.errors);
	// }, [form.values, form.errors]);

	return (
		<>
			<form onSubmit={form.handleSubmit} onReset={form.handleReset}>
				<Row>
					<h4 className={styles.heading__sty}>
						{t("HOW_DID_YOU_HEAR_ABOUT_US")}
					</h4>
				</Row>
				<Row>
					<BaseSelect
						className="mt-3 mb-3"
						labelPrefix="HearAboutUsType"
						enumType={HearAboutUsType}
						name="HEAR_ABOUT_US.value"
						placeholder="CHOOSE"
						formik={form}
					/>
				</Row>

				{form.values?.HEAR_ABOUT_US?.value === HearAboutUsType.REFERRAL && (
					<Row className={styles.bold}>
						<BaseInput
							className="col mb-4"
							name="REFERAL_NAME.value"
							placeholder="REFERRAL_NAME"
							label="REFERRAL_NAME"
							formik={form}
						/>
					</Row>
				)}
				<Row className="mt-3">
					<Col>
						<Button className="float-md-right" type="reset">
							{t("BACK")}
						</Button>
					</Col>

					<Col>
						<Button
							disabled={form.isValidating || form.isSubmitting || !form.isValid}
							className="float-md-left float-right"
							type="submit"
						>
							{t("NEXT")} <LoaderIcon isLoading={!!form?.isSubmitting} />
						</Button>
					</Col>
				</Row>
			</form>
		</>
	);
}
