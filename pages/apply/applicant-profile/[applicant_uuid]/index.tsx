import { useState } from "react";
import { Row } from "react-bootstrap";
import ApplicantSafetyBackground from "../../../../components/applicants/applicant-safety-background";
import ViewApplicantDetail from "../../../../components/applicants/applicant-view-details";
import ApplicantExtrasDetails from "../../../../components/applicants/jotform/applicant-profile";
import BaseRecaptcha from "../../../../components/forms/base-recaptcha";
import PageLayout from "../../../../components/layouts/page/page-layout";
import { useTranslation } from "../../../../hooks/use-translation";
import { ApplicantEntity } from "../../../../models/applicant";
import ApplicantApi from "../../../api/applicant";

export interface LongFormProps {
	entity: ApplicantEntity;
	no_bot?: boolean
}

export default function ApplicantProfile({ entity, no_bot }: LongFormProps) {

	const [recaptchaToken, setRecaptchaToken] = useState<string>(null);

	const onChange = (value) => setRecaptchaToken(value)

	const { t } = useTranslation();

	return (
		<>
			{
				(!!!no_bot) &&
				<BaseRecaptcha
					className='col-12 my-4'
					name='recaptchaValue'
					onChange={onChange}
				/>
			}

			{
				(!!recaptchaToken || !!no_bot) &&
				<div className="pt-4 ">
					<PageLayout>
						<Row className="text-center">
							<h1>{t("APPLICANT_PROFILE")}</h1>
						</Row>
						<Row>
							<ViewApplicantDetail applicant={entity} hideAssignTo={true} />
						</Row>
						<Row className="p-0">
							<ApplicantSafetyBackground applicant={entity} />
						</Row>
						<Row>
							<ApplicantExtrasDetails applicant={entity} />
						</Row>
					</PageLayout>
				</div>
			}

		</>

	);
}

export async function getServerSideProps({ query }) {
	try {
		const { applicant_uuid, no_bot } = query || {};

		if (!!!applicant_uuid) return { notFound: true };

		const applicantApi = new ApplicantApi();
		const entity: ApplicantEntity = await applicantApi.fetchByUuidToken(
			applicant_uuid,
			{
				withRelations: [
					'extras',
					'equipment_experience',
					'equipment_owned',
					'employers',
				]
			}
		);

		if (!!!entity) return { notFound: true };

		return { props: { entity, no_bot: no_bot == 1 } };
	} catch (error) {
		return { notFound: true };
	}
}

