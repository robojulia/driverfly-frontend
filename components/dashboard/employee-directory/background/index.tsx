import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { EmployeeStatus } from '../../../../enums/applicants/employee-status.enum';
import { JobEquipmentType } from '../../../../enums/jobs/job-equipment-type.enum';
import { useAuth } from '../../../../hooks/use-auth';
import { useTranslation } from '../../../../hooks/use-translation';
import { ViewApplicantBackgroundProps } from '../../../../types/applicant/view-application-background-props.type';
import { calculateAge } from '../../../../utils/date';
import ViewEmployeeDetails from '../../../employee/view-employee-detail';
import ViewDetails from '../../../view-details/view-details';
import moment from 'moment';


export default function Background({ employee }: ViewApplicantBackgroundProps) {

	const router = useRouter()
	const { t } = useTranslation();

	const onViewProfileCLick = () => router.push(`/dashboard/company/applicants/${employee?.applicant?.id}/edit`)
	const onEditClick = () => router.push(`/dashboard/company/compliance/employee-directory/${employee?.id}/edit`)

	let { user, hasPermission } = useAuth();

	const [protectedFields, setProtectedFields] = useState({
		license_number: false,
	});

	useEffect(() => {
		setProtectedFields({
			license_number: hasPermission("CanViewEmployee.license_number"),
		});
	}, [user]);


	return (
		<div className="employee_directory_tabs">
			{employee && (
				<>
					{/* Header Card with teal/dark background */}
					<div style={{
						background: 'linear-gradient(135deg, rgb(0, 96, 120) 0%, rgb(29, 67, 84) 100%)',
						borderRadius: '0.5rem',
						padding: '1.5rem',
						marginBottom: '1.5rem'
					}}>
						<div className="d-flex align-items-center justify-content-between">
							<div className="d-flex align-items-center">
								<div style={{
									width: '64px',
									height: '64px',
									borderRadius: '50%',
									backgroundColor: 'rgba(255, 255, 255, 0.2)',
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									marginRight: '1rem'
								}}>
									<span style={{ fontSize: '1.5rem', fontWeight: 600, color: '#fff' }}>
										{employee.first_name?.[0]}{employee.last_name?.[0]}
									</span>
								</div>
								<div>
									<h2 style={{ color: '#fff', margin: 0, fontSize: '1.5rem', fontWeight: 600 }}>
										{employee.first_name} {employee.last_name}
									</h2>
									<p style={{ color: 'rgba(255, 255, 255, 0.9)', margin: '0.25rem 0 0.5rem 0', fontSize: '0.95rem' }}>
										{employee?.job?.title || t('NOT_ANSWERED')}
									</p>
									<div className="d-flex align-items-center flex-wrap" style={{ gap: '0.5rem' }}>
										<span style={{
											backgroundColor: 'rgba(59, 130, 246, 0.9)',
											color: '#fff',
											padding: '0.25rem 0.75rem',
											borderRadius: '9999px',
											fontSize: '0.75rem',
											fontWeight: 500
										}}>
											{employee?.hire_date ? moment.utc(employee.hire_date).format('MM/DD/YYYY') : t('N/A')}
										</span>
										{employee?.license_state && (
											<span style={{
												backgroundColor: 'rgba(255, 255, 255, 0.2)',
												color: '#fff',
												padding: '0.25rem 0.75rem',
												borderRadius: '9999px',
												fontSize: '0.75rem',
												fontWeight: 500,
												border: '1px solid rgba(255, 255, 255, 0.3)'
											}}>
												{employee.license_state} {t('LICENSE')}
											</span>
										)}
									</div>
								</div>
							</div>
							{!!!(employee.status == EmployeeStatus.FIRED || employee.status == EmployeeStatus.QUIT) && (
								<Button
									onClick={onEditClick}
									size="sm"
									style={{
										backgroundColor: 'transparent',
										border: '1px solid rgba(255, 255, 255, 0.5)',
										color: '#fff',
										padding: '0.4rem 1rem',
										fontSize: '0.875rem'
									}}
									className="hover-white-btn"
								>
									{t("EDIT")}
								</Button>
							)}
						</div>
					</div>

					{/* Employment Information Card */}
					<div className="bg-white p-4 rounded mb-3">
						<h5 className="mb-3 font-weight-bold">{t('Employment Information')}</h5>
						<Row>
							<Col md={6}>
								<ViewDetails
									default={t("NOT_ANSWERED")}
									obj={{
										POSITION: employee?.job?.title,
										HIRE_DATE: employee?.hire_date
											? moment.utc(employee.hire_date).format('ddd MMM DD YYYY')
											: t("N/A"),
									}}
								/>
							</Col>
							<Col md={6}>
								<ViewDetails
									default={t("NOT_ANSWERED")}
									obj={{
										TERMINAL: `${employee?.job?.location?.street ?? ""}, ${employee?.job?.location?.city ?? ""},  ${employee?.job?.location?.state ?? ""}, ${employee?.job?.location?.zip_code ?? ""}`,
										MANAGER: employee?.manager?.name ? employee?.manager?.name : t('NO_MANAGER_ASSIGNED'),
									}}
								/>
							</Col>
						</Row>
						{employee?.termination_date && (
							<Row className="mt-2">
								<Col>
									<ViewDetails
										default={t("NOT_ANSWERED")}
										obj={{
											TERMINATION_DATE: employee?.termination_date
												? moment.utc(employee.termination_date).format('ddd MMM DD YYYY')
												: t("N/A"),
										}}
									/>
								</Col>
							</Row>
						)}
					</div>

					{/* Contact Information & License in Cards */}
					<Row>
						<Col lg={6}>
							<div className="bg-white p-4 rounded mb-3">
								<h5 className="mb-3 font-weight-bold">{t('Contact Information')}</h5>
								<ViewDetails
									default={t("NOT_ANSWERED")}
									obj={{
										PHONE: employee.phone,
										EMAIL: employee.email,
										ADDRESS_LINE_1: employee.address_1,
										ADDRESS_LINE_2: employee.address_2,
										CITY: employee.city,
										STATE_AND_ZIP: `${employee?.state || ""} ${employee?.zip_code || ""}`.trim(),
									}}
								/>
							</div>
						</Col>
						<Col lg={6}>
							<div className="bg-white p-4 rounded mb-3">
								<h5 className="mb-3 font-weight-bold">{t('License Information')}</h5>
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
									}}
								/>
							</div>
						</Col>
					</Row>

					{/* Additional Details Card */}
					<div className="bg-white p-4 rounded mb-3">
						<h5 className="mb-3 font-weight-bold">{t('Additional Information')}</h5>
						<Row>
							<Col md={6}>
								<ViewDetails
									default={t("NOT_ANSWERED")}
									obj={{
										BIRTHDATE: employee?.birthdate
											? moment.utc(employee.birthdate).format('ddd MMM DD YYYY')
											: t("N/A"),
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
							<Col md={6}>
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
									}}
								/>
							</Col>
						</Row>
					</div>

					{/* Emergency Contact Card */}
					<div className="bg-white p-4 rounded mb-3">
						<h5 className="mb-3 font-weight-bold">{t('Emergency Contact')}</h5>
						<ViewDetails
							default={t("NOT_ANSWERED")}
							obj={{
								emergency_contact: employee.emergency_contact_name,
								phone: employee.emergency_contact_number,
								relationship: employee.emergency_contact_relationship,
							}}
						/>
					</div>

					{/* HR Notes Card */}
					<div className="bg-white p-4 rounded mb-3">
						<h5 className="mb-3 font-weight-bold">{t('HR Notes')}</h5>
						<div style={{
							minHeight: '100px',
							padding: '0.75rem',
							backgroundColor: '#f8f9fa',
							borderRadius: '0.25rem',
							border: '1px solid #dee2e6'
						}}>
							{employee.hr_notes ? (
								<p style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{employee.hr_notes}</p>
							) : (
								<p style={{ margin: 0, color: '#6c757d', fontStyle: 'italic' }}>{t('NO_HR_NOTES')}</p>
							)}
						</div>
					</div>

					{/* Equipment Experience Card */}
					<div className="bg-white p-4 rounded mb-3">
						<Row>
							<Col md="6">
								<h5 className="mb-3 font-weight-bold">{t('Equipment Experience')}</h5>
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
									<>
										<h5 className="mb-3 font-weight-bold">{t('Equipment Owned')}</h5>
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
									</>
								)}
							</Col>
						</Row>
					</div>

					{/* View Applicant Profile Button */}
					<div className="text-center mt-4">
						<Button
							disabled={!Boolean(employee?.applicant)}
							onClick={onViewProfileCLick}
							variant="outline-primary"
							size="lg"
						>
							{
								Boolean(employee?.applicant) ? (
									<>
										{t(`view_applicant_profile`)}
									</>
								) : (
									<>
										{t(`NO_APPLICANT_PROFILE_FOUND`)}
									</>
								)
							}
						</Button>
					</div>
				</>
			)}

		</div>
	)
}
