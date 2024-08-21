import { useState } from "react";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getLongFormStyle, getMissingDocumentsPages } from "../../../../components/forms/jotform/jotform-pages";
import JotformContext from "../../../../context/jotform-context";
import { ApplicantEntity, ApplicantExtrasEntity } from "../../../../models/applicant";
import ApplicantApi from "../../../api/applicant";
import styles from "../../../../styles/digitalhiringapp.module.css";

export interface MissingDocumentsProps {
	entity: ApplicantEntity;
}

export default function MissingDocuments({ entity }: MissingDocumentsProps) {
	const [applicant, setApplicant] = useState<ApplicantEntity>(entity);
	const [applicantExtras, setApplicantExtras] = useState<
		ApplicantExtrasEntity[]
	>(entity?.extras);
	const updateApplicantExtras = (
		applicantExtrasEntity: ApplicantExtrasEntity
	) =>
		setApplicantExtras((oldApx) => {
			oldApx = oldApx?.filter((v) => v?.type != applicantExtrasEntity?.type);
			return !!oldApx
				? [...oldApx, { ...applicantExtrasEntity }]
				: [{ ...applicantExtrasEntity }];
		});


	const [steps, setSteps] = useState<number>(0);
	const stepNext = (): void => setSteps(steps + 1);
	const stepBack = (): void => setSteps(steps - 1);

	return (
		<JotformContext.Provider
			value={{
				state: {
					applicant,
					applicantExtras,
					steps,
				},
				method: {
					setApplicant,
					updateApplicantExtras,
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
		const entity: ApplicantEntity = await applicantApi.getByUuidToken(applicant_uuid);

		if (!!!entity) return { notFound: true };

		return { props: { entity } };
	} catch (error) {
		return { notFound: true };
	}
}
