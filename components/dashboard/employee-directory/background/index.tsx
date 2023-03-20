import { Button, Col, Row } from 'react-bootstrap';
import { useTranslation } from '../../../../hooks/use-translation';
import React from 'react';
import { useRouter } from 'next/router';
import ViewApplicantDetail from '../../../applicants/applicant-view-details';
import { ViewApplicantBackgroundProps } from '../../../../types/applicant/view-application-background-props.type';


export default function Background({ applicant, applicantJob }: ViewApplicantBackgroundProps) {

	const router = useRouter()
	const { t } = useTranslation();

	const onViewProfileCLick = () => router.push(`/dashboard/company/applicants/${applicant?.id}`)
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
								{t("{rank}_position", { rank: applicantJob?.status ? `ApplicantStatus.${applicantJob?.status}` : "N/A" }, { translateProps: true })}
							</p>
							<p className="ml-4">
								{t("{terminal}_terimanl", { terminal: applicantJob?.job?.location?.city }, { translateProps: true })}
							</p>
							<p className="ml-4">
								{t("{name}_manager", { name: applicantJob?.manager?.name }, { translateProps: true })}
							</p>
						</div>
						<div className="my-2 d-flex">
							<p>
								{t("{date}_hireDate", { date: applicantJob?.hired_at ? new Date(applicantJob?.hired_at).toDateString() : "N/A" }, { translateProps: true })}
							</p>
							<p className="ml-4">
								{t("{date}_birthdate", { date: applicant?.birthdate ? new Date(applicant?.birthdate).toDateString() : "N/A" }, { translateProps: true })}
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
