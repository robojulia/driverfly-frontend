import React, { useEffect, useState } from "react";
import styles from "../../../../../styles/jotform.module.css";
import { ApplicantEntity } from "../../../../../models/applicant/applicant.entity";
import "react-toastify/dist/ReactToastify.css";
import jotformContext from "../../../../../context/jotform-context";
import { ApplicantExtrasEntity } from "../../../../../models/applicant/applicant-extras.entity";
import ApplicantApi from "../../../../api/applicant";
import { VerificationOfEmploymentSection1 } from "../../../../../components/forms/jotform/voe-forms/legal-attachments/voe-attachments/section-1";
import { ApplicantEmployerEntity, ApplicantVoeFormEntity } from "../../../../../models/applicant";

export interface LegalFormProps {
	applicant: ApplicantEntity,
	employer: ApplicantEmployerEntity
}

export default function VerificationOfEmploymentSection1Page({ applicant, employer }: LegalFormProps) {

	// useEffect(() => {
	// 	console.log("from index", employer);
	// }, [employer]);

	useEffect(() => {
		applicant.company.users = applicant?.company?.users?.filter(user => (!!!user?.createdBy))
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
		const applicant: ApplicantEntity = await applicantApi.getByUuidToken(applicant_uuid);
		const employer: ApplicantEmployerEntity = await applicantApi.employer.getByUuidToken(employer_uuid)

		if (!!!applicant || !!!employer || applicant.id !== employer?.applicant?.id) return { notFound: true }

		return { props: { applicant, employer } }
	} catch (error) {
		return { notFound: true };
	}
}
