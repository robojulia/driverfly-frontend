import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { EmployeeStatus } from '../../../../enums/applicants/employee-status.enum';
import { useAuth } from '../../../../hooks/use-auth';
import { useTranslation } from '../../../../hooks/use-translation';
import { ViewApplicantBackgroundProps } from '../../../../types/applicant/view-application-background-props.type';
import ViewEmployeeDetails from '../../../employee/view-employee-detail';
import ViewDetails from '../../../view-details/view-details';


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
					<Row className="my-2">
						{/* <Col>
							<strong><h5>{t(`${employee?.first_name} ${employee?.last_name}`)}</h5></strong>
						</Col> */}
						{
							!!!(employee.status == EmployeeStatus.FIRED || employee.status == EmployeeStatus.QUIT) ? <Col>
								<Button onClick={onEditClick} className="float-right">
									{t("EDIT")}
								</Button>
							</Col> : null
						}

					</Row>
					<Row>
						<Col>
							<ViewDetails
								default={t("NOT_ANSWERED")}
								obj={{
									POSITION: employee?.job?.title,
									TERMINAL: `${employee?.job?.location?.street ?? ""}, ${employee?.job?.location?.city ?? ""},  ${employee?.job?.location?.state ?? ""}, ${employee?.job?.location?.zip_code ?? ""}`,
									MANAGER: employee?.manager?.name ? employee?.manager?.name : t('NO_MANAGER_ASSIGNED'),
								}}
							/>
						</Col>
						<Col>
							<ViewDetails
								default={t("NOT_ANSWERED")}
								obj={{
									// DATE_HIRED: job?.hired_at ? new Date(job?.hired_at).toDateString() : t("N/A"),
									BIRTHDATE: employee?.birthdate ? new Date(employee?.birthdate).toDateString() : t("N/A"),
									HIRE_DATE: employee?.hire_date ? new Date(employee?.hire_date).toDateString() : t("N/A"),
								}}
							/>
						</Col>
					</Row>


					<ViewEmployeeDetails employee={employee} noTitle />
					<Button disabled={!Boolean(employee?.applicant)} onClick={onViewProfileCLick}>
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
				</>
			)}

		</div>
	)
}
