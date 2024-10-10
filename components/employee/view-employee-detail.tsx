import { Button, Col, Row } from "react-bootstrap";
import { useTranslation } from "../../hooks/use-translation";
import React from "react";
import { JobEquipmentType } from "../../enums/jobs/job-equipment-type.enum";
import { calculateAge } from "../../utils/date";
import ViewCard from "../view-details/view-card";
import ViewDetails from "../view-details/view-details";
import { ViewEmployeeDetailProps } from "../../types/employee/view-employee-details-props.type";
export default function ViewEmployeeDetails({
	employee,
	protectedFields,
	noTitle,
}: ViewEmployeeDetailProps) {
	const { t } = useTranslation();

	return (
		<>

			<ViewCard title={`${employee.first_name} ${employee.last_name}`} noTitle={noTitle}>
				<Row>
					<Col className="px-2">
						<ViewDetails
							default={t("NOT_ANSWERED")}
							obj={{
								PHONE: employee.phone,
								EMAIL: employee.email,
								ADDRESS_LINE_1: employee.address_1,
								ADDRESS_LINE_2: employee.address_2,
								CITY: employee.city,
								STATE_AND_ZIP: `${employee?.state || ""} ${employee?.zip_code || ""
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
								driver_license_number: employee.license_number,
								expiration_date: employee.license_expiry ? new Date(employee.license_expiry) : null,
								state_issued: employee.license_state,
								cdl_class_type: employee.license_type
									? t(`DriverLicenseType.${employee.license_type}`)
									: null,
								years_cdl_experience: employee.years_cdl_experience,
								OWNER_OPERATOR: {
									text: employee.is_owner_operator,
									default: t("UNKNOWN"),
								},
								AUTHORIZED_TO_WORK_IN_THE_US: employee.authorized_to_work_in_us,
								PREFERRED_LOCATION: employee.preferred_location?.map((v) =>
									t(`JobGeography.${v}`)
								),
							}}
						/>
					</Col>
					<Col className="px-2">
						<ViewDetails
							default={t("NOT_ANSWERED")}
							obj={{
								transmission_type: employee.transmission_type?.map((v) =>
									t(`VehicleTransmissionType.${v}`)
								),
								ENDORSEMENTS: employee.endorsements?.map((v) =>
									t(`DriverEndorsement.${v}`)
								),
								above_21: employee.birthdate
									? calculateAge(employee.birthdate) >= 21
									: null,
								highest_degree: employee.highest_degree
									? t(`EducationLevel.${employee.highest_degree}`)
									: null,
								emergency_contact: employee.emergency_contact_name,
								phone: employee.emergency_contact_number,
								relationship: employee.emergency_contact_relationship,
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
									items: employee.equipment_experience?.map((v) => ({
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
						{employee.is_owner_operator && (
							<ViewDetails
								default={t("NONE")}
								obj={{
									EQUIPMENT_OWNED: {
										items: employee.equipment_owned?.map((v) => ({
											type:
												v.type == JobEquipmentType.OTHER
													? v.type_other
													: t(`JobEquipmentType.${v.type}`),
											years: v.quantity,
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
