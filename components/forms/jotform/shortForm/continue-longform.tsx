import React, { useContext, useState } from "react";
import styles from "../../../../styles/digitalhiringapp.module.css";
import { useTranslation } from "../../../../hooks/use-translation";
import { useFormik } from "formik";
import { Button, Col, Row } from "react-bootstrap";
import JotformContext, { JotFormContextType } from "../../../../context/jotform-context";
import { toast, ToastContainer } from "react-toastify";
import CompanyApi from "../../../../pages/api/company";
import { CompanyPreferenceCategory } from "../../../../enums/company/company-preference-category.enum";
import { useEffectAsync } from "../../../../utils/react";
import { CompanyPreferenceJotformLabel } from "../../../../enums/company/company-preferences-jotform-label.enum";
import { CompanyPreferenceEntity } from "../../../../models/company/company-preferences.entity";
import { JobEmploymentType } from "../../../../enums/jobs/job-employment-type.enum";
import { ApplicantExtras } from "../../../../enums/applicants/applicant-extras.enum";
import { ApplicantExtrasEntity } from "../../../../models/applicant";


export function ContinueLongForm() {
	const {
		state: { applicant, applicantExtras },
		method: { stepNext },
	}: JotFormContextType = useContext(JotformContext);

	const { t } = useTranslation();
	const [companyCdlPreferences, setCompanyCdlPreferences] = useState<string[]>([])
	const [companyPref, setCompanyPref] = useState<CompanyPreferenceEntity[]>([])

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

			setCompanyCdlPreferences(cdl_class?.value?.map(v => t(`DriverLicenseType.${v}`)) ?? [])

			const companyPref: CompanyPreferenceEntity[] = await companyApi.preferences
				.list(applicant?.company?.id,
					{ category: CompanyPreferenceCategory.JOTFORM }
				)
			setCompanyPref(companyPref)



			if (applicant?.can_pass_drug_test) toast.success(t("successfully_saved_information"));
		}
	}, [applicant?.company])

	// console.log("company prefsss ----", companyPref);
	const OwnerOperator: CompanyPreferenceEntity = companyPref?.find(v => v.label === CompanyPreferenceJotformLabel.EMPLOYMENT_TYPE)
	const CompanyPrefferedMinExperience: CompanyPreferenceEntity = companyPref?.find(v => v.label === CompanyPreferenceJotformLabel.YEARS_CDL_EXPERIENCE)
	const CompanyPrefferedAccidentCountLimit: CompanyPreferenceEntity = companyPref?.find(v => v.label === CompanyPreferenceJotformLabel.MINIMUM_ACCIDENTS)
	const CompanyPrefferedAccidentViolationLimit: CompanyPreferenceEntity = companyPref?.find(v => v.label === CompanyPreferenceJotformLabel.MIN_MOVING_VIOLATIONS)
	const CompanyPreferedLocations: CompanyPreferenceEntity = companyPref?.find(v => v.label === CompanyPreferenceJotformLabel.JOB_GEOGRAPHY)

	const ApplicantAddedRoutes: ApplicantExtrasEntity = applicantExtras.find(v => v.type === ApplicantExtras.ROUTES)

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
	console.log("company prefered Location----", CompanyPreferedLocations?.value)
	console.log("applicant prefered routes----", ApplicantAddedRoutes?.value)
	console.log("final result----", hasJobGeographyInRouteType)


	return (
		<>
			<ToastContainer />
			{
				Boolean(applicant?.can_pass_drug_test) ? (
					<>
						{
							Boolean(!applicant?.is_owner_operator) && Boolean(OwnerOperator?.value?.includes(JobEmploymentType.OWNER_OPERATOR)) ? (

								<>
									<h4 className={`${styles.paragraph} ${styles.margin__top} text-warning  p-1`}>
										{t(
											"{company_name}_OWNER_OPERATOR_VALIDATION",
											{
												company_name: applicant?.company?.name
											},
											{ translateProps: true }
										)}
									</h4>
									<h6 className={`${styles.paragraph} ${styles.margin__top} text-bold  p-1`}>
										{t("OWNER_OPERATOR_VALIDATION_SHORT")}
									</h6>
									<h6 className={`${styles.paragraph} ${styles.margin__top} p-1`}>
										{t(
											"{{company_name}}_OWNER_OPERATOR_VALIDATION_LONG",
											{
												company_name: applicant?.company?.name
											},
											{ translateProps: true }
										)}
									</h6>
									<Row className="mt-3">
										<Col className="text-center" >
											<Button onClick={() => stepNext()}>
												{t("CONTINUE_APPLICATION")}
											</Button>
										</Col>
									</Row>
								</>
							) : (
								<>
									<Row>
										<h4 className={styles.heading__sty}>
											{t(
												"{company_name}_THANKS",
												{ company_name: applicant?.company?.name },
												{ translateProps: true }
											)}
										</h4>
									</Row>
									<Row className="mt-3">
										{(
											Boolean(companyCdlPreferences.length > 0)
											&& !Boolean(companyCdlPreferences.includes(t(`DriverLicenseType.${applicant?.license_type}`)))
										) ? (
											<h6 className={`${styles.paragraph} ${styles.margin__top} bg-danger text-light  p-1`}>
												{t(
													"{company_name}_REQUIRES_{cdl_category}",
													{
														company_name: applicant?.company?.name,
														cdl_category: companyCdlPreferences.join(", ")
													},
													{ translateProps: true }
												)}
											</h6>
										) : (
											Boolean(applicant?.years_cdl_experience < CompanyPrefferedMinExperience?.value) ? (
												<>
													<h4 className={`${styles.paragraph} ${styles.margin__top} text-warning  p-1`}>
														{t(
															"{company_name}_PREFERED_MIN_CDL_EXPERIENCE_VALIDATION_{preffered_experience}",
															{
																company_name: applicant?.company?.name,
																preffered_experience: CompanyPrefferedMinExperience?.value
															},
															{ translateProps: true }
														)}
													</h4>
													<h6 className={`${styles.paragraph} ${styles.margin__top} text-bold  p-1`}>
														{t(
															"{company_name}_PREFERED_MIN_EXPERIECE_VALIDATION_MESSAGE",
															{
																company_name: applicant?.company?.name
															},
															{ translateProps: true }
														)}
													</h6>
													<h6 className={`${styles.paragraph} ${styles.margin__top} p-1`}>
														{t("PREFERED_MIN_EXPERIECE_VALIDATION_MESSAGE_PROCEED")}
													</h6>
												</>



											) : (
												Boolean(applicant?.accident_count > CompanyPrefferedAccidentCountLimit?.value) ? (
													<>
														<h4 className={`${styles.paragraph} ${styles.margin__top} text-warning  p-1`}>
															{t(
																"{company_name}_PREFERED_MIN_ACCIDENT_COUNT_{preffered_accident_count}",
																{
																	company_name: applicant?.company?.name,
																	preffered_accident_count: CompanyPrefferedAccidentCountLimit?.value
																},
																{ translateProps: true }
															)}
														</h4>
														<h6 className={`${styles.paragraph} ${styles.margin__top} text-bold  p-1`}>
															{t(
																"{company_name}_PREFERED_MIN_EXPERIECE_VALIDATION_MESSAGE",
																{
																	company_name: applicant?.company?.name
																},
																{ translateProps: true }
															)}
														</h6>
														<h6 className={`${styles.paragraph} ${styles.margin__top} p-1`}>
															{t("PREFERED_MIN_EXPERIECE_VALIDATION_MESSAGE_PROCEED")}
														</h6>
													</>



												) : (
													Boolean(applicant?.moving_violations_count > CompanyPrefferedAccidentViolationLimit?.value) ? (
														<>
															<h4 className={`${styles.paragraph} ${styles.margin__top} text-warning  p-1`}>
																{t(
																	"{company_name}_PREFERED_MIN_VIOLATION_COUNT_{preffered_violation_count}",
																	{
																		company_name: applicant?.company?.name,
																		preffered_violation_count: CompanyPrefferedAccidentViolationLimit?.value
																	},
																	{ translateProps: true }
																)}
															</h4>
															<h6 className={`${styles.paragraph} ${styles.margin__top} text-bold  p-1`}>
																{t(
																	"{company_name}_PREFERED_MIN_EXPERIECE_VALIDATION_MESSAGE",
																	{
																		company_name: applicant?.company?.name
																	},
																	{ translateProps: true }
																)}
															</h6>
															<h6 className={`${styles.paragraph} ${styles.margin__top} p-1`}>
																{t("PREFERED_MIN_EXPERIECE_VALIDATION_MESSAGE_PROCEED")}
															</h6>
														</>



													) : (
														!Boolean(hasJobGeographyInRouteType) ? (

															<>
																<h4 className={`${styles.paragraph} ${styles.margin__top} text-warning  p-1`}>
																	{t(
																		"{company_name}_PREFERED_ROUTES_VALIDATION_{preffered_routes}",
																		{
																			company_name: applicant?.company?.name,
																			preffered_routes: CompanyPreferedLocations?.value
																		},
																		{ translateProps: true }
																	)}
																</h4>
																<h6 className={`${styles.paragraph} ${styles.margin__top} text-bold  p-1`}>
																	{t(
																		"{company_name}_PREFERED_MIN_EXPERIECE_VALIDATION_MESSAGE",
																		{
																			company_name: applicant?.company?.name
																		},
																		{ translateProps: true }
																	)}
																</h6>
																<h6 className={`${styles.paragraph} ${styles.margin__top} p-1`}>
																	{t("PREFERED_MIN_EXPERIECE_VALIDATION_MESSAGE_PROCEED")}
																</h6>
															</>


														) : ('')
													)
												)
											)

										)}
									</Row>
									<Row className="mt-3">
										<Col className="text-center" >
											<Button  onClick={() => stepNext()}>
												{t("CONTINUE_APPLICATION")}
											</Button>
										</Col>
									</Row>
								</>
							)
						}
					</>

				) : (
					<Row>
						<h6 className={`${styles.paragraph} ${styles.margin__top}  text-danger  p-1`}>
							{t('DRUG_TEST_VALIDATION')}
						</h6>
						<h6 className={`${styles.paragraph} ${styles.margin__top} p-1`}>
							{t('DRUG_TEST_VALIDATION_FAIL_MESSAGE')}
						</h6>
					</Row>
				)

			}
		</>
	);
}
