import { Col, Row } from "react-bootstrap";
import { JobEquipmentType } from "../../enums/jobs/job-equipment-type.enum";
import { BooleanType } from "../../enums/jotform/boolean-type.enum";
import { OtherRequirementType } from "../../enums/users/other-requirements.enum";
import { LicenseRestrictions } from "../../enums/applicants/applicant-license-restrictions-type.enum";
import { useTranslation } from "../../hooks/use-translation";
import { ViewApplicantDetailProps } from "../../types/applicant/view-application-detail-props.type";
import { calculateAge } from "../../utils/date";
import ViewCard from "../view-details/view-card";
import ViewDetails from "../view-details/view-details";
export function ViewApplicantUtm({ utm }) {
	const { t } = useTranslation();
	return (<ul>
		<li>{t("UtmReferral.utm_source")}:{utm?.utm_source}</li>
		<li>{t("UtmReferral.utm_medium")}:{utm?.utm_medium}</li>
		<li>{t("UtmReferral.utm_campaign")}:{utm?.utm_campaign}</li>
		<li>{t("UtmReferral.utm_content")}:{utm?.utm_content}</li>
	</ul>)
}
export default function ViewApplicantDetail({
	applicant,
	hideAssignTo,
}: ViewApplicantDetailProps) {
	const { t } = useTranslation();

	const assignTo = !!hideAssignTo ? {} : { ASSIGNED_TO: applicant.assignedUser?.name || t("NONE"), }

	// Format other requirements with custom "Other" text
	const formatOtherRequirements = () => {
		if (!applicant.other_requirements || applicant.other_requirements.length === 0) {
			return null;
		}

		const requirements = applicant.other_requirements.map((v) => t(`OtherRequirementType.${v}`));

		if (applicant.other_requirements.includes(OtherRequirementType.OTHERS) && applicant.other_requirements_other) {
			const othersIndex = requirements.findIndex((req, idx) =>
				applicant.other_requirements[idx] === OtherRequirementType.OTHERS
			);
			if (othersIndex !== -1) {
				requirements[othersIndex] = `${requirements[othersIndex]} - ${applicant.other_requirements_other}`;
			}
		}

		return requirements;
	};

	// Format license restrictions with custom "Other" text
	const formatLicenseRestrictions = () => {
		if (!applicant.license_restrictions || applicant.license_restrictions.length === 0) {
			return null;
		}

		const restrictions = applicant.license_restrictions.map((v) => t(`LicenseRestrictions.${v}`));

		if (applicant.license_restrictions.includes(LicenseRestrictions.OTHER) && applicant.license_restrictions_other) {
			const othersIndex = restrictions.findIndex((req, idx) =>
				applicant.license_restrictions[idx] === LicenseRestrictions.OTHER
			);
			if (othersIndex !== -1) {
				restrictions[othersIndex] = `${restrictions[othersIndex]} - ${applicant.license_restrictions_other}`;
			}
		}

		return restrictions;
	};
	// const currentStatus = !!hideCurrentStatus
	// 	? {}
	// 	: {
	// 		APPLICANT_CURRENT_STATUS: (applicant?.jobs?.length && applicant?.current_application_status)
	// 			? t(`ApplicantStatus.${applicant?.current_application_status}`)
	// 			: t("GENERAL_INTAKE"),
	// 	}

	return (
		<>
			<ViewCard title={`${applicant.first_name} ${applicant.last_name}`}>
				<Row>
					<Col className="px-2">
						<ViewDetails
							default={t("NOT_ANSWERED")}
							obj={{
								...assignTo,
							APPLICANT_CURRENT_STATUS: applicant?.current_application_status ? t(`ApplicantStatus.${applicant?.current_application_status}`) : t("GENERAL_INTAKE"),
							REMARKS: applicant?.remarks ? `${applicant?.remarks}` : t("N/A"),
								PHONE: applicant.phone,
								EMAIL: applicant.email,
								STREET: applicant.street,
								CITY: applicant.city,
								STATE_AND_ZIP: `${applicant?.state || ""} ${applicant?.zip_code || ""
									}`.trim(),
							}}
						/>
					</Col>
				</Row>
				<Row>
					<Col className="px-2">
						<ViewDetails
							default={t("NOT_ANSWERED")}
							obj={{
								driver_license_number: applicant.license_number,
								// driver_license_number: protectedFields?.license_number
								// 	? applicant.license_number
								// 		? applicant.license_number
								// 		: t("NOT_ANSWERED")
								// 	: t("HIDDEN"),
								expiration_date: applicant.license_expiry ? new Date(applicant.license_expiry) : null,
								// expiration_date: protectedFields?.license_number
								// 	? ((applicant.license_number && applicant.license_expiry)
								// 		? new Date(applicant.license_expiry)
								// 		: t("NOT_ANSWERED"))
								// 	: t("HIDDEN"),
								state_issued: applicant.license_state,
								// state_issued: protectedFields?.license_number
								// 	? ((applicant.license_number && applicant.license_state)
								// 		? applicant.license_state
								// 		: t("NOT_ANSWERED"))
								// 	: t("HIDDEN"),
								cdl_class_type:
									applicant.license_type
										? t(`DriverLicenseType.${applicant.license_type}`)
										: t("NOT_ANSWERED"),
								years_cdl_experience: applicant.years_cdl_experience,
								OWNER_OPERATOR: {
									text: applicant.is_owner_operator,
									default: t("UNKNOWN"),
								},
								AUTHORIZED_TO_WORK_IN_THE_US: applicant.authorized_to_work_in_us,
								PREFERRED_LOCATION: applicant.preferred_location?.map((v) =>
									t(`JobGeography.${v}`)
								),
								ROUTE_TYPE: applicant.routes?.map((v) =>
									t(`RouteType.${v}`)
								),
								OTHER_REQUIREMENTS: formatOtherRequirements(),
							}}
						/>
					</Col>
					<Col className="px-2">
						<ViewDetails
							default={t("NOT_ANSWERED")}
							obj={{
								transmission_type: applicant.transmission_type?.map((v) =>
									t(`VehicleTransmissionType.${v}`)
								),
								"ENDORSEMENTS / LICENSE_RESTRICTIONS": (() => {
									const endorsements = applicant.endorsements?.map((v) => t(`DriverEndorsement.${v}`));
									const restrictions = formatLicenseRestrictions();
									const parts = [];
									if (endorsements?.length) parts.push(endorsements.join(", "));
									if (restrictions?.length) parts.push(restrictions.join(", "));
									return parts.length ? parts.join(" / ") : null;
								})(),
								above_21: applicant.birthdate
									? calculateAge(applicant.birthdate) >= 21
									: null,
								highest_degree: applicant.highest_degree
									? t(`EducationLevel.${applicant.highest_degree}`)
									: null,
								emergency_contact: applicant.emergency_contact_name,
								phone: applicant.emergency_contact_number,
								relationship: applicant.emergency_contact_relationship,
								AUTOMATED_RECRUITING_LEAD: Boolean(applicant?.is_automated_recruiting_lead) ? BooleanType.YES : BooleanType.NO,
								LEAD_TYPE: applicant.type ? t(`ApplicantType.${applicant.type}`) : null,
								REFERRAL_NAME: applicant.utm?.referral_name,
								UTM_SOURCE: applicant.utm?.utm_source,
								UTM_MEDIUM: applicant.utm?.utm_medium,
								UTM_CAMPAIGN: applicant.utm?.utm_campaign,
								UTM_CONTENT: applicant.utm?.utm_content,
							}}
						/>
					</Col>
				</Row>
				<Row>
					<Col md="6">
						<ViewDetails
							default={t("NONE")}
							obj={{
								equipment_experience: {
									items: applicant.equipment_experience?.map((v) => ({
										type:
											v.type == JobEquipmentType.OTHER
												? v.type_other
												: t(`JobEquipmentType.${v.type}`),
										start_year: v.start_year,
									end_year: v.end_year,
									years: v.years,
									})),
								},
							}}
						/>
					</Col>
					<Col md="6">
						{applicant.is_owner_operator && (
							<ViewDetails
								default={t("NONE")}
								obj={{
									EQUIPMENT_OWNED: {
										show: applicant.is_owner_operator || false,
										items: applicant.equipment_owned?.map((v) => ({
											type:
												v.type == JobEquipmentType.OTHER
													? v.type_other
													: t(`JobEquipmentType.${v.type}`),
											make: v.make,
											model: v.model,
											year: v.year,
										})),
									},
								}}
							/>
						)}
					</Col>
				</Row>
			</ViewCard>
		</>
	);
}
