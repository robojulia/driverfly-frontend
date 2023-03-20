import { Button, Col, Row } from 'react-bootstrap';
import { useTranslation } from '../../../../hooks/use-translation';
import React from 'react';
import { ViewApplicantDetailProps } from '../../../../types/applicant/view-application-detail-props.type';
import { useRouter } from 'next/router';
import ViewApplicantDetail from '../../../applicants/applicant-view-details';

export default function Background({ applicant, protectedFields }: ViewApplicantDetailProps) {
	const router = useRouter()
	const { t } = useTranslation();
	const onViewProfileCLick = () => router.push(`/dashboard/company/applicants/${applicant?.id}`)

	const employeePosition = applicant?.jobs?.find(v => v.status)

	const onEditClick = () => router.push(`/dashboard/company/applicants/${applicant?.id}/edit`)


	return (
		<div className="employee_directory_tabs">
			{applicant && (
				<>
					<div>
						<Row className="my-2">
							<Col>
								<strong><h5>{t(`${applicant.first_name} ${applicant.last_name}`)}</h5></strong>
							</Col>
							<Col>
								<Button onClick={onEditClick} className="float-right">{t("EDIT")}</Button>
							</Col>

						</Row>

						<div className="my-2 d-flex">
							<p>
								{t("{rank}_position", { rank: employeePosition?.status ? `ApplicantStatus.${employeePosition?.status}` : "N/A" }, { translateProps: true })}
							</p>
							<p className="ml-4">
								{t("{terminal}_terimanl", { terminal: employeePosition?.job?.location?.city }, { translateProps: true })}
							</p>
							<p className="ml-4">
								{t("{name}_manager", { name: employeePosition?.manager?.name }, { translateProps: true })}
							</p>
						</div>
						<div className="my-2 d-flex">
							<p>
								{t("{date}_hireDate", { date: "N/A" }, { translateProps: true })}
							</p>
							<p className="ml-4">
								{t("{date}_birthdate", { date: applicant?.birthdate }, { translateProps: true })}
							</p>
						</div>
					</div>
					<ViewApplicantDetail applicant={applicant} />
					<Button onClick={onViewProfileCLick}>{t(`view_applicant_profile`)}</Button>
				</>
			)}

		</div>
	)
}
