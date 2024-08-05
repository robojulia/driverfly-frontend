import { useState } from "react";
import styles from "../../../../../styles/digitalhiringapp.module.css";
import {
	ApplicantEntity,
} from "../../../../../models/applicant";
import ApplicantApi from "../../../../api/applicant";
import { Col, Row } from "react-bootstrap";
import { useTranslation } from "../../../../../hooks/use-translation";
import { ViewDocumentButton } from "../../../../../components/documents/buttons";
import { ApplicantDocumentType } from "../../../../../enums/applicants/applicant-document-type.enum";
import ViewPdf from "../../../../../components/view-details/view-pdf";

export interface DocumentsProps {
	entity: ApplicantEntity;
}

export default function Documents({ entity }: DocumentsProps) {
	const { t } = useTranslation();

	const [pdf, setPdf] = useState({});

	return (
		<div className={styles.container}>
			<div className={styles.main}>
				<div className={styles.main_form}>
					{entity?.documents
						?.filter((document) =>
							[
								ApplicantDocumentType.DRIVER_LICENSE,
								ApplicantDocumentType.MEDICAL_EXAMINER_CERTIFICATE_MEDICAL_CARD,
							]?.includes(document.type as ApplicantDocumentType)
						)
						?.map((document) => (
							<Row className="mb-5">
								<Col>
									<h3>{t(`ApplicantDocumentType.${document.type}`)}</h3>
								</Col>
								<Col>
									<ViewDocumentButton
										document={document}
										onClick={() => setPdf({
											name: document.name,
											url: document.path
										})}
									/>
								</Col>
							</Row>
						))}

					<ViewPdf {...pdf} onCloseClick={() => setPdf({})} />
				</div>
			</div>
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
