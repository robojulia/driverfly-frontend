import { Col, Row } from "react-bootstrap";

import React, { useEffect } from "react";
import { useTranslation } from "../../../../hooks/use-translation";
import ViewDetails from "../../../view-details/view-details";
import ViewCard from "../../../view-details/view-card";
import { ViewApplicantDetailProps } from "../../../../types/applicant/view-application-detail-props.type";
import { ApplicantExtras } from "../../../../enums/applicants/applicant-extras.enum";
import ViewTable from "../../../view-details/view-table";
import ShowFormattedDate from "../../../jobs/show-formatted-date";

interface ApplicantSafetyBackgroundProps extends ViewApplicantDetailProps { }

export default function ApplicantExtrasDetails({
	applicant,
}: ApplicantSafetyBackgroundProps) {
	const { t } = useTranslation();
	const authToCommunicate = applicant.extras.find(
		(ex) => ex?.type === ApplicantExtras.AUTHORIZE_TO_COMMUNICATE
	);
	const hear_about_us = applicant.extras.find(
		(ex) => ex?.type === ApplicantExtras.HEAR_ABOUT_US
	);
	const job_apply_date = applicant.extras.find(
		(ex) => ex?.type === ApplicantExtras.APPLY_DATE
	);
	const qualified_for_manual_transmission = applicant.extras.find(
		(ex) => ex?.type === ApplicantExtras.QUALIFIED_FOR_MANUAL_TRANSMISSION
	);

	const past_license_suspension = applicant.extras.find(
		(ex) => ex?.type === ApplicantExtras.PAST_LICENSE_SUSPENSION
	);
	const unable_to_perform_job = applicant.extras.find(
		(ex) => ex?.type === ApplicantExtras.REASON_FOR_UNABLE_TO_PERFORM_JOB
	);
	const convicted_of_felony = applicant.extras.find(
		(ex) => ex?.type === ApplicantExtras.CONVICTED_OF_FELONY
	);
	const dot_regulation = applicant.extras.find(
		(ex) => ex?.type === ApplicantExtras.DOT_REGULATION
	);

	const lineAdress = applicant.extras.find(
		(ex) => ex?.type === ApplicantExtras.LINE_ADDRESS
	);
	const cdl_details = applicant.extras.find(
		(ex) => ex?.type === ApplicantExtras.CDL_NUMBER
	);
	const routes = applicant.extras.find(
		(ex) => ex?.type === ApplicantExtras.ROUTES
	);
	const other_requirement = applicant.extras.find(
		(ex) => ex?.type === ApplicantExtras.OTHER_ABSOLUTELY_REQUIREMENTS
	);
	const w2_employment = applicant.extras.find(
		(ex) => ex?.type === ApplicantExtras.REQUIRE_W2_EMPLOYMENT
	);

	const accident_details = applicant.extras.find(
		(ex) => ex?.type === ApplicantExtras.ACCIDENT_DETAILS
	);
	const violation_details = applicant.extras.find(
		(ex) => ex?.type === ApplicantExtras.VIOLATION_DETAILS
	);
	const current_employer = applicant.employers.find(v => !!v.is_current)

	const past_employer = applicant.employers.filter(v => !!!v.is_current);

	const already_applied = applicant.extras.find(
		(ex) => ex?.type === ApplicantExtras.ALREADY_APPLIED_TO_COMPANY
	);
	const already_worked_here = applicant.extras.find(
		(ex) => ex?.type === ApplicantExtras.ALREADY_WORKED_TO_COMPANY
	);
	const employee_ss_id = applicant.extras.find(
		(ex) => ex?.type === ApplicantExtras.EMPLOYEE_SS_OR_ID
	);
	const disclosure_date = applicant.extras.find(
		(ex) => ex?.type === ApplicantExtras.DISCLOSURE_AND_AUTHORIZATION_DATE
	);
	const important_background_date = applicant.extras.find(
		(ex) => ex?.type === ApplicantExtras.IMPORTANT_DISCLOSURE_BACKGROUND_DATE
	);
	const general_consent = applicant.extras.find(
		(ex) => ex?.type === ApplicantExtras.GENERAL_CONSENT
	);

	return (
		<>
			<Row>
				<Col md="6">
					<ViewCard title="BASIC_QUESTIONAIRE">
						<ViewDetails
							default={t("NOT_ANSWERED")}
							obj={{
								Authorize_to_Communicate: authToCommunicate?.value && t(`BooleanPreferenceType.${authToCommunicate?.value}`),
								hear_about_us: hear_about_us?.value && t(`HearAboutUsType.${hear_about_us?.value}`),
								job_apply_date: job_apply_date?.value,
								qualified_for_manual_transmission:
									qualified_for_manual_transmission?.value,
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
								convicted_of_felony: convicted_of_felony?.value,
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
								adress_1: lineAdress?.value?.address_1,
								adress_2: lineAdress?.value?.address_2,
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
			<Row>
				<Col>
					<ViewCard title="PREFERENCES">
						<ViewDetails
							default={t("NOT_ANSWERED")}
							obj={{
								ROUTES: routes?.value && routes?.value?.map(route => t(`RouteType.${route}`))
							}}
						/>
						<ViewDetails
							default={t("NOT_ANSWERED")}
							obj={{
								OTHER_ABSOLUTE_REQUIREMENTS: other_requirement?.value && other_requirement?.value?.map(other => t(`OtherRequirementType.${other}`))
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
							items={accident_details?.value?.map((a) => ({
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
							items={violation_details?.value.map((v) => ({
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
								city: current_employer?.city,
								CURRENT_COMPANY_EMAIL:
									current_employer?.email,
								CURRENT_COMPANY_MANAGER_NAME:
									current_employer?.manager_name,
								CURRENT_COMPANY_NAME:
									current_employer?.name,
								CURRENT_COMPANY_PHONE_NUMBER:
									current_employer?.phone,
								CURRENT_COMPANY_POSITION:
									current_employer?.title,
								CURRENT_COMPANY_STREET_ADDRESS_LINE_1:
									current_employer?.address,
								CURRENT_COMPANY_STREET_ADDRESS_LINE_2:
									current_employer?.address_2,
								zip_code: current_employer?.zip_code,
								fcr: current_employer?.is_subject_to_drug_tests
									? `${t("YES")}`
									: `${t("NO")}`,
								fmcsr: current_employer?.is_subject_to_fmcsrs
									? `${t("YES")}`
									: `${t("NO")}`,
								START_DATE: new Date(current_employer?.start_at),
								state: current_employer?.state,
							}}
						/>
					</ViewCard>
				</Col>
				<Col>
					<ViewCard title="PAST_EMPLOYER">
						<ViewTable
							type="PAST_EMPLOYER"
							headers={{
								city: "city",
								END_DATE: "END_DATE",
								fcr: "fcr",
								fmcsr: "fmcsr",
								PREVIOUS_COMPANY_EMAIL: "PREVIOUS_COMPANY_EMAIL",
								PREVIOUS_MANAGER_NAME: "PREVIOUS_MANAGER_NAME",
								PREVIOUS_COMPANY_PHONE_NUMBER: "PREVIOUS_COMPANY_PHONE_NUMBER",
								PREVIOUS_COMPANY_ADDRESS_1: "PREVIOUS_COMPANY_ADDRESS_1",
								PREVIOUS_COMPANY_ADDRESS_2: "PREVIOUS_COMPANY_ADDRESS_2",
								zip_code: "zip_code",
								START_DATE: "START_DATE",
								state: "state"
							}}
							items={past_employer?.map((v) => ({
								city: v?.city,
								END_DATE: <ShowFormattedDate date={v?.end_at} hideTime />,
								fcr: v?.is_subject_to_drug_tests
									? `${t("YES")}`
									: `${t("NO")}`,
								fmcsr: v?.is_subject_to_fmcsrs
									? `${t("YES")}`
									: `${t("NO")}`,
								PREVIOUS_COMPANY_EMAIL: v?.email,
								PREVIOUS_MANAGER_NAME: v?.manager_name,
								PREVIOUS_COMPANY_PHONE_NUMBER: v?.phone,
								PREVIOUS_COMPANY_ADDRESS_1: v?.address,
								PREVIOUS_COMPANY_ADDRESS_2: v?.address_2,
								zip_code: v?.zip_code,
								START_DATE: <ShowFormattedDate date={v?.start_at} hideTime />,
								state: v?.state,


							}))}
						/>
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
									ALREADY_APPLIED_HERE: already_applied?.value,
									ALREADY_WORKED_HERE: !!already_worked_here?.value?.start_date
										? `${t("YES")}`
										: `${t("NO")}`,
									START_DATE: already_worked_here?.value?.start_date,
									END_DATE: already_worked_here?.value?.end_date,
								}}
							/>
						</Row>
					</ViewCard>
				</Col>
			</Row>
		</>
	);
}
