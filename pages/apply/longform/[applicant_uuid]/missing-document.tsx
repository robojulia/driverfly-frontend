import { useState } from "react";
import { ToastContainer } from 'react-toastify';
import { getLongFormStyle, getMissingDocumentsPages } from "../../../../components/forms/jotform/jotform-pages";
import JotformContext from "../../../../context/jotform-context";
import { ApplicantEntity } from "../../../../models/applicant";
import ApplicantApi from "../../../api/applicant";
import styles from "../../../../styles/digitalhiringapp.module.css";
import 'react-toastify/dist/ReactToastify.css';

export interface MissingDocumentsProps {
	entity: ApplicantEntity;
}

export default function MissingDocuments({ entity }: MissingDocumentsProps) {
	const [applicant, setApplicant] = useState<ApplicantEntity>(entity);

	const [steps, setSteps] = useState<number>(0);
	const stepNext = (): void => setSteps(steps + 1);
	const stepBack = (): void => setSteps(steps - 1);

	return (
		<JotformContext.Provider
			value={{
				state: {
					applicant,
					steps,
				},
				method: {
					setApplicant,
					stepNext,
					stepBack,
				},
			}}
		>
			<ToastContainer />
			<div className={styles.container}>
				<div className={styles.main}>
					<div className={styles.main_form} style={getLongFormStyle(steps)}>
						{getMissingDocumentsPages(steps)}
					</div>
				</div>
			</div>
		</JotformContext.Provider>
	);
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
					'documents',
				]
			}
		);

		if (!!!entity) return { notFound: true };

		return { props: { entity } };
	} catch (error) {
		return { notFound: true };
	}
}
