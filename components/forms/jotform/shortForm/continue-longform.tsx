import React, { useContext, useEffect, useState } from "react";
import { Button, Col, Row } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import styles from "../../../../styles/digitalhiringapp.module.css";
import { useTranslation } from "../../../../hooks/use-translation";
import JotformContext, {
	JotFormContextType,
} from "../../../../context/jotform-context";
import CompanyApi from "../../../../pages/api/company";
import { useEffectAsync } from "../../../../utils/react";
import { CompanyPreferenceJotformLabel } from "../../../../enums/company/company-preferences-jotform-label.enum";
import { CompanyPreferenceEntity } from "../../../../models/company/company-preferences.entity";
import { JobEmploymentType } from "../../../../enums/jobs/job-employment-type.enum";
import { DriverLicenseType } from "../../../../enums/users/driver-license-type.enum";
import { JobGeography } from "../../../../enums/jobs/job-geography.enum";
import { ApplicantExtras } from "../../../../enums/applicants/applicant-extras.enum";

export function ContinueLongForm() {
	const {
		state: { applicant, company },
		method: { stepNext },
	}: JotFormContextType = useContext(JotformContext);

	const { t } = useTranslation();
	const companyApi = new CompanyApi();

	const [companyPreferences, setCompanyPreferences] = useState<
		CompanyPreferenceEntity[]
	>([]);
	const [showSuccess, setShowSuccess] = useState<boolean>(true);

	useEffect(() => {
		if (Boolean(showSuccess) && Boolean(applicant)) {
			!Boolean(applicant?.can_pass_drug_test)
				? toast.error(t("UNABLE_TO_SAVE_INFORMATION"))
				: toast.success(t("successfully_saved_information"));
			setShowSuccess(false);
		}
	}, [applicant?.can_pass_drug_test]);

	useEffectAsync(async () => {
		if (applicant?.company) {
			const data = await companyApi.preferences.list(applicant.company?.id);
			setCompanyPreferences(data);
		}
	}, [applicant?.company]);

	const companyPrefferedEmploymentType: JobEmploymentType[] =
		companyPreferences?.find(
			({ label }) => label == CompanyPreferenceJotformLabel.EMPLOYMENT_TYPE
		)?.value ?? [];

	const companyPrefferedCDL: DriverLicenseType[] =
		companyPreferences?.find(
			({ label }) => label == CompanyPreferenceJotformLabel.CDL_CLASS
		)?.value ?? [];

	const companyPrefferedMinExperience: number =
		companyPreferences?.find(
			({ label }) =>
				label == CompanyPreferenceJotformLabel.YEARS_CDL_EXPERIENCE
		)?.value ?? 0;

	const companyPrefferedAccidentCountLimit: number =
		companyPreferences?.find(
			({ label }) => label == CompanyPreferenceJotformLabel.MINIMUM_ACCIDENTS
		)?.value ?? 0;

	const companyPrefferedMinViolationLimit: number =
		companyPreferences?.find(
			({ label }) =>
				label == CompanyPreferenceJotformLabel.MIN_MOVING_VIOLATIONS
		)?.value ?? 0;

	const companyPrefferedLocations: JobGeography[] =
		companyPreferences?.find(
			({ label }) => label == CompanyPreferenceJotformLabel.JOB_GEOGRAPHY
		)?.value ?? [];

	function applicantHasPreferredLocation(): boolean {
		for (let i = 0; i < companyPrefferedLocations?.length; i++) {
			if (
				applicant?.preferred_location?.includes(companyPrefferedLocations[i])
			) {
				return true;
			}
		}
		return false;
	}

	function Content(): React.JSX.Element {
		if (!Boolean(applicant?.can_pass_drug_test))
			return (
				<Row>
					<h6
						className={`${styles.paragraph} ${styles.margin__top} text-danger p-1`}
					>
						{t("DRUG_TEST_VALIDATION")}
					</h6>
					<h6 className={`${styles.paragraph} ${styles.margin__top} p-1`}>
						{t("DRUG_TEST_VALIDATION_FAIL_MESSAGE")}
					</h6>
				</Row>
			);

		return (
			<>
				<Row>
					<h1 className={styles.carrierName}>
						{t("{company_name}_THANKS", {
							company_name: applicant?.company?.name || company.name,
						})}
					</h1>
				</Row>
				<Row className="mt-3">
					{Boolean(companyPrefferedCDL.length) &&
						!Boolean(companyPrefferedCDL?.includes(applicant?.license_type)) ? (
						<h6
							className={`${styles.paragraph} ${styles.margin__top} bg-danger text-light  p-1`}
						>
							{t(
								"{company_name}_REQUIRES_{cdl_category}",
								{
									company_name: applicant?.company?.name || company.name,
									cdl_category: companyPrefferedCDL
										?.map((v) => t(`DriverLicenseType.${v}`))
										?.join(", "),
								},
								{ translateProps: true }
							)}
						</h6>
					) : Boolean(
						applicant?.years_cdl_experience < companyPrefferedMinExperience
					) ? (
						<>
							<h4
								className={`${styles.paragraph} ${styles.margin__top} text-warning  p-1`}
							>
								{t(
									"{company_name}_PREFERED_MIN_CDL_EXPERIENCE_VALIDATION_{preffered_experience}",
									{
										company_name: applicant?.company?.name || company.name,
										preffered_experience: companyPrefferedMinExperience,
									}
								)}
							</h4>
							<h6
								className={`${styles.paragraph} ${styles.margin__top} text-bold  p-1`}
							>
								{t(
									"MIN_EXPERIECE_VALIDATION_MESSAGE_PREFERED_MIN_CDL_{preffered_experience}",
									{
										preffered_experience: companyPrefferedMinExperience,
									}
								)}
							</h6>
							<h6 className={`${styles.paragraph} ${styles.margin__top} p-1`}>
								{t("PREFERED_MIN_EXPERIECE_VALIDATION_MESSAGE_PROCEED")}
							</h6>
						</>
					) : Boolean(
						applicant?.accident_count > companyPrefferedAccidentCountLimit
					) ? (
						<>
							<h4
								className={`${styles.paragraph} ${styles.margin__top} text-warning  p-1`}
							>
								{t(
									"{company_name}_PREFERED_MIN_ACCIDENT_COUNT_{preffered_accident_count}",
									{
										company_name: applicant?.company?.name || company.name,
										preffered_accident_count:
											companyPrefferedAccidentCountLimit,
									}
								)}
							</h4>
							<h6
								className={`${styles.paragraph} ${styles.margin__top} text-bold  p-1`}
							>
								{t(
									"PREFERED_MIN_EXPERIECE_VALIDATION_MESSAGE_MIN_ACCIDENT_COUNT_{preffered_accident_count}",
									{
										preffered_accident_count:
											companyPrefferedAccidentCountLimit,
									}
								)}
							</h6>
							<h6 className={`${styles.paragraph} ${styles.margin__top} p-1`}>
								{t("PREFERED_MIN_EXPERIECE_VALIDATION_MESSAGE_PROCEED")}
							</h6>
						</>
					) : Boolean(
						applicant?.moving_violations_count >
						companyPrefferedMinViolationLimit
					) ? (
						<>
							<h4
								className={`${styles.paragraph} ${styles.margin__top} text-warning  p-1`}
							>
								{t(
									"{company_name}_PREFERED_MIN_VIOLATION_COUNT_{preffered_violation_count}",
									{
										company_name: applicant?.company?.name || company.name,
										preffered_violation_count:
											companyPrefferedMinViolationLimit,
									}
								)}
							</h4>
							<h6
								className={`${styles.paragraph} ${styles.margin__top} text-bold  p-1`}
							>
								{t(
									"PREFERED_MIN_EXPERIECE_VALIDATION_MESSAGE_PREFERED_MIN_VIOLATION_COUNT_{preffered_violation_count}",
									{
										preffered_violation_count:
											companyPrefferedMinViolationLimit,
									}
								)}
							</h6>
							<h6 className={`${styles.paragraph} ${styles.margin__top} p-1`}>
								{t("PREFERED_MIN_EXPERIECE_VALIDATION_MESSAGE_PROCEED")}
							</h6>
						</>
					) : (
						Boolean(companyPrefferedLocations?.length) &&
						!Boolean(applicantHasPreferredLocation())
					) ? (
						<>
							<h4
								className={`${styles.paragraph} ${styles.margin__top} text-warning  p-1`}
							>
								{t(
									"{company_name}_PREFERED_ROUTES_VALIDATION_{preffered_routes}",
									{
										company_name: applicant?.company?.name || company.name,
										preffered_routes: companyPrefferedLocations
											?.map((v) => t(`JobGeography.${v}`))
											?.join(", "),
									},
									{ translateProps: true }
								)}
							</h4>
							<h6
								className={`${styles.paragraph} ${styles.margin__top} text-bold  p-1`}
							>
								{t(
									"PREFERED_MIN_EXPERIECE_VALIDATION_MESSAGE_PREFERED_ROUTES_VALIDATION_{preffered_routes}",
									{
										preffered_routes: companyPrefferedLocations
											?.map((v) => t(`JobGeography.${v}`))
											?.join(", "),
									},
									{ translateProps: true }
								)}
							</h6>
							<h6 className={`${styles.paragraph} ${styles.margin__top} p-1`}>
								{t("PREFERED_MIN_EXPERIECE_VALIDATION_MESSAGE_PROCEED")}
							</h6>

							{Boolean(
								companyPrefferedEmploymentType?.includes(JobEmploymentType.W2)
							) &&
								!Boolean(
									applicant?.extras.some(
										(v) => v.type == ApplicantExtras.REQUIRE_W2_EMPLOYMENT
									)
								) && (
									<>
										<h4
											className={`${styles.paragraph} ${styles.margin__top} text-warning p-1`}
										>
											{t("{company_name}_W2_VALIDATION", {
												company_name: applicant?.company?.name || company.name,
											})}
										</h4>
									</>
								)}
						</>
					) : (Boolean(
						companyPrefferedEmploymentType?.includes(
							JobEmploymentType.OWNER_OPERATOR
						)
					) && !Boolean(applicant?.is_owner_operator)
					) ? (
						<>
							<h4
								className={`${styles.paragraph} ${styles.margin__top} text-warning p-1`}
							>
								{t("{company_name}_OWNER_OPERATOR_VALIDATION", {
									company_name: applicant?.company?.name || company.name,
								})}
							</h4>
							<h6
								className={`${styles.paragraph} ${styles.margin__top} text-bold p-1`}
							>
								{t("OWNER_OPERATOR_VALIDATION_SHORT")}
							</h6>
							<h6 className={`${styles.paragraph} ${styles.margin__top} p-1`}>
								{t("{{company_name}}_OWNER_OPERATOR_VALIDATION_LONG", {
									company_name: applicant?.company?.name || company.name,
								})}
							</h6>
						</>
					) : (
						""
					)}
				</Row>
				<Row className="mt-3">
					<Col className="text-center">
						<Button onClick={() => stepNext()}>
							{t("CONTINUE_APPLICATION")}
						</Button>
					</Col>
				</Row>
			</>
		);
	}

	return (
		<>
			<ToastContainer />
			<Content />
		</>
	);
}
