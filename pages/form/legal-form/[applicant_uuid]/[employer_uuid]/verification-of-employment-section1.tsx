import React, { useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";
import styles from "../../../../../styles/digitalhiringapp.module.css";
import { ApplicantEntity } from "../../../../../models/applicant/applicant.entity";
import ApplicantApi from "../../../../api/applicant";
import { VerificationOfEmploymentSection1 } from "../../../../../components/forms/jotform/voe-forms/legal-attachments/voe-attachments/section-1";
import { ApplicantEmployerEntity } from "../../../../../models/applicant";

export interface VerificationOfEmploymentSection1PageProps {
	applicant: ApplicantEntity,
	employer: ApplicantEmployerEntity
}

export default function VerificationOfEmploymentSection1Page({ applicant, employer }: VerificationOfEmploymentSection1PageProps) {
	useEffect(() => {
		if (applicant?.company?.users) applicant.company.users = applicant?.company?.users?.filter(user => (!!!user?.createdBy))
	}, [applicant])

	return (
		<div>
			<div className={styles.main}>
				<div style={{ padding: '30px' }}>
					<VerificationOfEmploymentSection1
						employer={employer}
						applicant={applicant}
					/>
				</div>
			</div>
		</div>
	);
}

export async function getServerSideProps({ query }) {
	try {
		const { applicant_uuid, employer_uuid } = query || {};

		if (!!!applicant_uuid || !!!employer_uuid) return { notFound: true };

		const applicantApi = new ApplicantApi();
		const applicant: ApplicantEntity = await applicantApi.fetchByUuidToken(
			applicant_uuid,
			{
				withRelations: [
					"employers",
					"employers.voeData",
				]
			});
		const employer: ApplicantEmployerEntity = applicant.employers?.find(({ uuid_token }) => (uuid_token == employer_uuid));

		if (!!!applicant || !!!employer || applicant.id != employer?.applicant?.id) return { notFound: true }

		return { props: { applicant, employer } }
	} catch (error) {
		return { notFound: true };
	}
}
