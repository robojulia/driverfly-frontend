import { Button, Col, Row } from 'react-bootstrap';
import { useTranslation } from '../../../../hooks/use-translation';
import React from 'react';
import { useRouter } from 'next/router';
import ViewApplicantDetail from '../../../applicants/applicant-view-details';
import { ViewApplicantBackgroundProps } from '../../../../types/applicant/view-application-background-props.type';
import ViewDetails from '../../../view-details/view-details';
import ViewEmployeeDetails from '../../../employee/view-employee-detail';


export default function Background({ employee }: ViewApplicantBackgroundProps) {

	const router = useRouter()
	const { t } = useTranslation();

	const onViewProfileCLick = () => router.push(`/dashboard/company/applicants/${employee?.applicant?.id}`)
	const onEditClick = () => router.push(`/dashboard/company/compliance/employee-directory/${employee?.id}/edit`)


	return (
		<div className="employee_directory_tabs">
			{employee && (
				<>
					<Row className="my-2">
						<Col>
							<strong><h5>{t(`${employee?.first_name} ${employee?.last_name}`)}</h5></strong>
						</Col>
						<Col>
							<Button onClick={onEditClick} className="float-right">{t("EDIT")}</Button>
						</Col>
					</Row>
					<Row>
						<Col>
							<ViewDetails
								default={t("NOT_ANSWERED")}
								obj={{
									POSITION: employee?.job?.title,
									TERMINAL: employee?.job?.location?.city,
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
								}}
							/>
						</Col>
					</Row>


					<ViewEmployeeDetails employee={employee} />
					<Button onClick={onViewProfileCLick}>{t(`view_applicant_profile`)}</Button>
				</>
			)}

		</div>
	)
}
