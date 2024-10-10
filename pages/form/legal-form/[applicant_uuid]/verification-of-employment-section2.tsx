import "react-toastify/dist/ReactToastify.css";
import { VerificationOfEmploymentSection2 } from "../../../../components/forms/jotform/voe-forms/legal-attachments/voe-attachments/section-2";
import { ApplicantEntity } from "../../../../models/applicant/applicant.entity";
import ApplicantApi from "../../../api/applicant";
import styles from "../../../../styles/digitalhiringapp.module.css";

export interface VerificationOfEmploymentSection2PageProps {
	entity: ApplicantEntity
}

// maybe it'll be used in future
export default function VerificationOfEmploymentSection2Page({ entity }: VerificationOfEmploymentSection2PageProps) {

	return (
		<div>
			<div className={styles.main}>
				<div style={{ padding: '30px' }}>
					<VerificationOfEmploymentSection2 />
				</div>
			</div>
		</div>
	);
}
function t(arg0: string): import("react-toastify").ToastContent {
	throw new Error("Function not implemented.");
}


export async function getServerSideProps({ query }) {
	try {
		const { applicant_uuid } = query || {};

		if (!!!applicant_uuid) return { notFound: true };

		const applicantApi = new ApplicantApi();
		const entity: ApplicantEntity = await applicantApi.fetchByUuidToken(
			applicant_uuid,
			{
				withRelations: [
					"extras",
					"company",
				]
			}
		);

		if (!!!entity) return { notFound: true };

		return { props: { entity } };
	} catch (error) {
		return { notFound: true };
	}
}
