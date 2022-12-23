import React, { useEffect, useState } from "react";
import styles from "../../../../styles/jotform.module.css";
import { ApplicantEntity } from "../../../../models/applicant/applicant.entity";
import "react-toastify/dist/ReactToastify.css";
import jotformContext from "../../../../context/jotform-context";
import { ApplicantExtrasEntity } from "../../../../models/applicant/applicant-extras.entity";
import ApplicantApi from "../../../api/applicant";
import ApplicantInfoReleaseConsent from "../../../../components/forms/jotform/voe-forms/legal-attachments/applicant-info-release-consent";

export interface LegalFormProps {
	applicant: ApplicantEntity
}

export default function ApplicantInfoReleaseConsentPage({ applicant }: LegalFormProps) {
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

function t(arg0: string): import("react-toastify").ToastContent {
	throw new Error("Function not implemented.");
}


export async function getServerSideProps({ query }) {
	try {
		const { applicant_uuid } = query || {};

		if (!!!applicant_uuid) return { notFound: true };

		const applicantApi = new ApplicantApi();
		const applicant: ApplicantEntity = await applicantApi.getByUuidToken(
			applicant_uuid
		);

		if (!!!applicant) return { notFound: true };

		return { props: { applicant } };
	} catch (error) {
		return { notFound: true };
	}
}
