import { Button, Col, Row } from 'react-bootstrap';
import { useTranslation } from '../../../../hooks/use-translation';
import React from 'react';
import { useRouter } from 'next/router';
import ViewApplicantDetail from '../../../applicants/applicant-view-details';
import { ViewApplicantBackgroundProps } from '../../../../types/applicant/view-application-background-props.type';
import ViewDetails from '../../../view-details/view-details';


export default function Background({ applicant, applicantJob }: ViewApplicantBackgroundProps) {

	const router = useRouter()
	const { t } = useTranslation();

	const onViewProfileCLick = () => router.push(`/dashboard/company/applicants/${applicant?.id}`)
	const onEditClick = () => router.push(`/dashboard/company/applicants/${applicant?.id}/edit`)


	return (
		<div className="employee_directory_tabs">
			{applicant && (
				<>
					<Row className="my-2">
						<Col>
							<strong><h5>{t(`${applicant.first_name} ${applicant.last_name}`)}</h5></strong>
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
									POSITION: applicantJob?.job?.title,
									TERMINAL: applicantJob?.job?.location?.city,
									MANAGER: applicantJob?.manager?.name ? applicantJob?.manager?.name : t('NO_MANAGER_ASSIGNED'),
								}}
							/>
						</Col>
						<Col>
							<ViewDetails
								default={t("NOT_ANSWERED")}
								obj={{
									DATE_HIRED: applicantJob?.hired_at ? new Date(applicantJob?.hired_at).toDateString() : t("N/A"),
									BIRTHDATE: applicant?.birthdate ? new Date(applicant?.birthdate).toDateString() : t("N/A"),
								}}
							/>
						</Col>
					</Row>


					<ViewApplicantDetail applicant={applicant} />
					<Button onClick={onViewProfileCLick}>{t(`view_applicant_profile`)}</Button>
				</>
			)}

		</div>
	)
}
