import { Col, Row } from "react-bootstrap";
import { JobEquipmentType } from "../../enums/jobs/job-equipment-type.enum";
import { BooleanType } from "../../enums/jotform/boolean-type.enum";
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
								REMARKS: Boolean(applicant?.current_application_status && applicant?.remarks) ? `${applicant?.remarks}` : t("N/A"),
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
								ENDORSEMENTS: applicant.endorsements?.map((v) =>
									t(`DriverEndorsement.${v}`)
								),
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
											quantity: v.quantity,
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
