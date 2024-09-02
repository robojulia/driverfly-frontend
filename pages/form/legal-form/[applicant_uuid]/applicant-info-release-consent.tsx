import "react-toastify/dist/ReactToastify.css";
import ApplicantInfoReleaseConsent from "../../../../components/forms/jotform/voe-forms/legal-attachments/applicant-info-release-consent";
import { ApplicantEntity } from "../../../../models/applicant/applicant.entity";
import ApplicantApi from "../../../api/applicant";
import styles from "../../../../styles/digitalhiringapp.module.css";

export interface ApplicantInfoReleaseConsentPageProps {
	applicant: ApplicantEntity
}

export default function ApplicantInfoReleaseConsentPage({ applicant }: ApplicantInfoReleaseConsentPageProps) {
	return (
		<div>
			<div className={styles.main}>
				<div style={{ padding: '30px' }}>
					<ApplicantInfoReleaseConsent applicant={applicant} />
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
		const applicant: ApplicantEntity = await applicantApi.fetchByUuidToken(
			applicant_uuid,
			{
				withRelations: [
					"extras",
					"company",
				]
			}
		);

		if (!!!applicant) return { notFound: true };

		return { props: { applicant } };
	} catch (error) {
		return { notFound: true };
	}
}
