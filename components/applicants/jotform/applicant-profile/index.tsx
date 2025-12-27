import { Col, Row } from "react-bootstrap";

import { ApplicantExtras } from "../../../../enums/applicants/applicant-extras.enum";
import { VehicleTransmissionType } from "../../../../enums/vehicles/vehicle-transmission-type.enum";
import { OtherRequirementType } from "../../../../enums/users/other-requirements.enum";
import { JobEquipmentType } from "../../../../enums/jobs/job-equipment-type.enum";
import { useTranslation } from "../../../../hooks/use-translation";
import { ViewApplicantDetailProps } from "../../../../types/applicant/view-application-detail-props.type";
import ViewCard from "../../../view-details/view-card";
import ViewDetails from "../../../view-details/view-details";
import ViewTable from "../../../view-details/view-table";

interface ApplicantSafetyBackgroundProps extends ViewApplicantDetailProps { }

export default function ApplicantExtrasDetails({
	applicant,
}: ApplicantSafetyBackgroundProps) {
	const { t } = useTranslation();
	// Check for HEAR_ABOUT_US in extras (for backwards compatibility)
	const hear_about_us_extra = applicant.extras?.find(
		(ex) => ex?.type == ApplicantExtras.HEAR_ABOUT_US
	);

	// Prefer referralSource over extras for displaying lead source
	const hear_about_us_display = applicant.referralSource?.name ||
		(hear_about_us_extra?.value ? t(`HearAboutUsType.${hear_about_us_extra.value}`) : null);
	const job_apply_date = applicant.extras?.find(
		(ex) => ex?.type == ApplicantExtras.APPLY_DATE
	);
	const qualified_for_manual_transmission = applicant.transmission_type?.includes(
		VehicleTransmissionType.MANUAL
	);

	const past_license_suspension = applicant.extras?.find(
		(ex) => ex?.type == ApplicantExtras.PAST_LICENSE_SUSPENSION
	);
	const unable_to_perform_job = applicant.extras?.find(
		(ex) => ex?.type == ApplicantExtras.REASON_FOR_UNABLE_TO_PERFORM_JOB
	);

	// Determine felony conviction status from criminal_history field
	const hasCriminalHistory = applicant.criminal_history &&
		applicant.criminal_history.trim() !== '' &&
		applicant.criminal_history !== '__YES_NO_DETAILS__';
	const isConvictedFelony = !!applicant.criminal_history && applicant.criminal_history !== '';
	const felonyConvictionDisplay = isConvictedFelony ?
		(hasCriminalHistory ? applicant.criminal_history : t("YES")) :
		t("NO");

	const dot_regulation = applicant.extras?.find(
		(ex) => ex?.type == ApplicantExtras.DOT_REGULATION
	);

	const cdl_details = applicant.extras?.find(
		(ex) => ex?.type == ApplicantExtras.CDL_NUMBER
	);
	const other_requirement = applicant.extras?.find(
		(ex) => ex?.type == ApplicantExtras.OTHER_ABSOLUTELY_REQUIREMENTS
	);
	const w2_employment = applicant.extras.find(
		(ex) => ex?.type == ApplicantExtras.REQUIRE_W2_EMPLOYMENT
	);

	// Read accident and violation data from direct applicant fields, not extras
	const accident_history = applicant.accident_history || [];
	const moving_violation_history = applicant.moving_violation_history || [];
	const current_employer = applicant.employers?.find(v => !!v.is_current)

	const past_employers = applicant.employers?.filter(v => !!!v.is_current);

	// Format other requirements with custom "Other" text
	const formatOtherRequirements = () => {
		if (!other_requirement?.value || !Array.isArray(other_requirement.value)) {
			return null;
		}

		const requirements = other_requirement.value.map(other => t(`OtherRequirementType.${other}`));

		if (other_requirement.value.includes(OtherRequirementType.OTHERS) && applicant.other_requirements_other) {
			const othersIndex = requirements.findIndex((req, idx) =>
				other_requirement.value[idx] === OtherRequirementType.OTHERS
			);
			if (othersIndex !== -1) {
				requirements[othersIndex] = `${requirements[othersIndex]} - ${applicant.other_requirements_other}`;
			}
		}

		return requirements;
	};

	return (
		<>
			<Row>
				<Col md="6">
					<ViewCard title="BASIC_QUESTIONAIRE">
						<ViewDetails
							default={t("NOT_ANSWERED")}
							obj={{
								Authorize_to_Communicate: applicant.authorize_to_communicate && t(`BooleanPreferenceType.${applicant.authorize_to_communicate}`),
								hear_about_us: hear_about_us_display,
								job_apply_date: job_apply_date?.value,
								qualified_for_manual_transmission:
									!!qualified_for_manual_transmission,
							}}
						/>
					</ViewCard>
				</Col>
				<Col md="6">
					<ViewCard title="SECURITY_QUESTOINS">
						<ViewDetails
							default={t("NOT_ANSWERED")}
							obj={{
								past_license_suspension: past_license_suspension?.value,
								unable_to_perform_job: unable_to_perform_job?.value,
								convicted_of_felony: felonyConvictionDisplay,
								dot_regulation: dot_regulation?.value,
							}}
						/>
					</ViewCard>
				</Col>
				<Col>
					<ViewCard title="PERSONAL_ADDRESS">
						<ViewDetails
							default={t("NOT_ANSWERED")}
							obj={{
								adress_1: applicant?.address_1,
								adress_2: applicant?.address_2,
							}}
						/>
					</ViewCard>
				</Col>

			</Row>
			<Row>
				<Col>
					<ViewCard title="CDL_DETAILS">
						<ViewTable
							type="cdl_number_details"
							headers={{
								license_number: "driver_license_number",
								date: "DATE",
								state: "STATE",
							}}
							items={cdl_details?.value?.map((cdl) => ({
								license_number: cdl?.license_number,
								date: cdl?.date,
								state: cdl?.state,
							}))}
						/>
					</ViewCard>
				</Col>
			</Row>
			{applicant.is_owner_operator && (
				<Row>
					<Col>
						<ViewCard title="EQUIPMENT_OWNED">
							<ViewDetails
								default={t("NOT_ANSWERED")}
								obj={{
									OWNER_OPERATOR_COMPANY_NAME: applicant.owner_operator_company_name,
									OWNER_OPERATOR_DOT_NUMBER: applicant.owner_operator_dot_number,
								}}
							/>
							<ViewTable
								type="equipment_owned"
								headers={{
									type: "TYPE",
									make: "MAKE",
									model: "MODEL",
									year: "YEAR",
								}}
								items={applicant.equipment_owned?.map((v) => ({
									type:
										v.type == JobEquipmentType.OTHER
											? v.type_other
											: t(`JobEquipmentType.${v.type}`),
									make: v.make,
									model: v.model,
									year: v.year,
								}))}
							/>
						</ViewCard>
					</Col>
				</Row>
			)}
			<Row>
				<Col>
					<ViewCard title="PREFERENCES">
						<ViewDetails
							default={t("NOT_ANSWERED")}
							obj={{
								ROUTES: applicant.routes && applicant.routes?.map(route => t(`RouteType.${route}`))
							}}
						/>
						<ViewDetails
							default={t("NOT_ANSWERED")}
							obj={{
								OTHER_ABSOLUTE_REQUIREMENTS: formatOtherRequirements()
							}}
						/>
						<ViewDetails
							default={t("NOT_ANSWERED")}
							obj={{
								W2_requirements: w2_employment?.value && t(`BooleanPreferenceType.${w2_employment?.value}`)
							}}
						/>
					</ViewCard>
				</Col>
			</Row>
			<Row>
				<Col>
					<ViewCard title="ACCIDENT_DEAILS">
						<ViewTable
							type="ACCIDENT_DEAILS"
							headers={{
								at_fault: "at_fault",
								date_of_accident: "date_of_accident",
								dot_recordable: "dot_recordable",
								location_of_accident: "location_of_accident",
								nature_of_accident: "nature_of_accident",
								number_of_fatalaties: "number_of_fatalaties",
								number_of_injured: "number_of_injured",
							}}
							items={accident_history?.map((a) => ({
								at_fault: !!a?.at_fault ? `${t("YES")}` : `${t("NO")}`,
								date_of_accident: a?.date_of_accident,
								dot_recordable: !!a?.dot_recordable
									? `${t("YES")}`
									: `${t("NO")}`,
								location_of_accident: a?.location_of_accident,
								nature_of_accident: a?.nature_of_accident,
								number_of_fatalaties: a?.number_of_fatalaties,
								number_of_injured: a?.number_of_injured,
							}))}
						/>
					</ViewCard>
				</Col>
				<Col md="12">
					<ViewCard title="VIOLATION_DETAILS">
						<ViewTable
							type="VIOLATION_DETAILS"
							headers={{
								charge: "charge",
								date_of_violation: "DATE",
								location: "location",
								penalty: "penalty",
							}}
							items={moving_violation_history?.map((v) => ({
								charge: v?.charge,
								date_of_violation: v?.date_of_violation,
								location: v?.location,
								penalty: v?.penalty,
							}))}
						/>
					</ViewCard>
				</Col>
			</Row>
			<Row>
				<Col md="12">
					<ViewCard title="CURRENT_EMPLOYER">
						<ViewDetails
							default={t("NOT_ANSWERED")}
							obj={{
								NAME: current_employer?.name,
								city: current_employer?.city,
								Email:
									current_employer?.email,
								CURRENT_COMPANY_MANAGER_NAME:
									current_employer?.manager_name,
								phone:
									current_employer?.phone,
								CURRENT_COMPANY_POSITION:
									current_employer?.title,
								ADDRESS_LINE_1:
									current_employer?.address,
								ADDRESS_LINE_2:
									current_employer?.address_2,
								zip_code: current_employer?.zip_code,
								fcr: current_employer?.is_subject_to_drug_tests
									? `${t("YES")}`
									: `${t("NO")}`,
								fmcsr: current_employer?.is_subject_to_fmcsrs
									? `${t("YES")}`
									: `${t("NO")}`,
								START_DATE: !!current_employer?.start_at ? new Date(current_employer?.start_at) : t("NOT_ANSWERED"),
								state: current_employer?.state,
							}}
						/>
					</ViewCard>
				</Col>


				<Col md="12">
					<ViewCard title="PAST_EMPLOYER">
						{
							past_employers.length > 0 ?
								past_employers.map(past_employer => (
									<>
										<ViewCard title={`${past_employer?.name}`}>
											<ViewDetails
												obj={{
													NAME: past_employer?.name,
													city: past_employer?.city,
													START_DATE: !!past_employer?.start_at ? new Date(past_employer?.start_at) : t("NOT_ANSWERED"),
													END_DATE: !!past_employer?.end_at ? new Date(past_employer?.end_at) : t("NOT_ANSWERED"),
													fcr: past_employer?.is_subject_to_drug_tests,
													fmcsr: past_employer?.is_subject_to_fmcsrs
														? `${t("YES")}`
														: `${t("NO")}`,

													PREVIOUS_COMPANY_EMAIL: past_employer?.email,
													PREVIOUS_MANAGER_NAME: past_employer?.manager_name,
													PREVIOUS_COMPANY_PHONE_NUMBER: past_employer?.phone,
													PREVIOUS_COMPANY_ADDRESS_1: past_employer?.address,
													PREVIOUS_COMPANY_ADDRESS_2: past_employer?.address_2,
													zip_code: past_employer?.zip_code,
													state: past_employer?.state,

												}}
											/>
										</ViewCard>
									</>
								))
								: <>{t("PAST_EMPLOYER_NOT_FOUND")}</>
						}
						{applicant.employment_gap_details && (
							<ViewDetails
								default={t("NOT_ANSWERED")}
								obj={{
									EMPLOYMENT_GAP_DETAILS_LABEL: applicant.employment_gap_details,
								}}
							/>
						)}
					</ViewCard>
				</Col>
			</Row>

			<Row>
				<Col>
					<ViewCard title="APPLIED_OR_WORKED_HERE">
						<Row>
							<ViewDetails
								default={t("NOT_ANSWERED")}
								obj={{
									ALREADY_APPLIED_HERE: (applicant.already_applied_to_company)
										? `${t("YES")}`
										: `${t("NO")}`,
									ALREADY_WORKED_HERE: (applicant.already_worked_to_company)
										? `${t("YES")}`
										: `${t("NO")}`,
									START_DATE: applicant.already_worked_start_date,
									END_DATE: applicant.already_worked_end_date,
								}}
							/>
						</Row>
					</ViewCard>
				</Col>
			</Row>
		</>
	);
}
