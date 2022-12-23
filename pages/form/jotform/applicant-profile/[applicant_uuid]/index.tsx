import { useEffect, useState } from "react";
import { Container, Row } from "react-bootstrap";
import ApplicantSafetyBackground from "../../../../../components/applicants/applicant-safety-background";
import ViewApplicantDetail from "../../../../../components/applicants/applicant-view-details";
import ApplicantExtrasDetails from "../../../../../components/applicants/jotform/applicant-profile";
import PageLayout from "../../../../../components/layouts/page/page-layout";
import { useTranslation } from "../../../../../hooks/use-translation";
import { ApplicantEntity } from "../../../../../models/applicant";
import ApplicantApi from "../../../../api/applicant";
import DocumentApi from "../../../../api/document";

export interface LongFormProps {
	entity: ApplicantEntity;
}

export default function Dashboard({ entity }: LongFormProps) {
	const { t } = useTranslation();
	const [pdf, setPdf] = useState({});
	const viewDocumentClick = async (id, name) => {
		const api = new DocumentApi();

		const document = await api.getSignedUrl(entity.id);

		if (document) {
			setPdf({
				name: `${t(name)} (${document.name})`,
				url: document.path,
			});
		}
	};
	useEffect(() => {
		console.log("applicant values", entity);
	}, []);
	return (
		<div className="pt-4 ">
			<PageLayout>
				<Container fluid>
					<Row className="text-center">
						<h1 className="pb-3">{t("APPLICANT_PROFILE")}</h1>
					</Row>
					<ViewApplicantDetail applicant={entity} hideAssignTo={true} />
					<ApplicantSafetyBackground applicant={entity} />
					<ApplicantExtrasDetails applicant={entity} />
				</Container>
			</PageLayout>
		</div>
	);
}

export async function getServerSideProps({ query }) {
	try {
		const { applicant_uuid } = query || {};

		if (!!!applicant_uuid) return { notFound: true };

		const applicantApi = new ApplicantApi();
		const entity: ApplicantEntity = await applicantApi.getByUuidToken(
			applicant_uuid
		);

		if (!!!entity) return { notFound: true };

		return { props: { entity } };
	} catch (error) {
		return { notFound: true };
	}
}
