import { useEffect, useState } from "react";
import { VoeFormPageControl } from "../../../../../components/forms/jotform/voe-form-pages";
import VoeFormContext from "../../../../../context/voeform-context";
import {
	ApplicantEmployerEntity,
	ApplicantEntity,
	ApplicantVoeEntity,
} from "../../../../../models/applicant";
import ApplicantApi from "../../../../api/applicant";
import styles from "../../../../../styles/voe.module.css";

export interface VoeFormProps {
	applicant: ApplicantEntity;
	employer: ApplicantEmployerEntity;
	voeData?: ApplicantVoeEntity;
}

export default function VoeForm({ applicant, employer }: VoeFormProps) {
	const [voe, setVoe] = useState<ApplicantVoeEntity>(employer?.voeData || new ApplicantVoeEntity());

	const updateVoe = (applicantVoeEntity: ApplicantVoeEntity) =>
		setVoe({ ...voe, ...applicantVoeEntity });

	const [steps, setSteps] = useState<number>(0);
	const stepNext = (): void => setSteps(steps + 1);
	const stepBack = (): void => setSteps(steps - 1);
	const jumpToStep = (step: number): void => {
		setSteps(step);
	};

	useEffect(() => {
		console.log("voe", voe);
	}, [voe]);

	return (
		<VoeFormContext.Provider
			value={{
				state: {
					applicant,
					employer,
					voe,
					steps,
				},
				method: {
					updateVoe,
					stepNext,
					stepBack,
					jumpToStep,
				},
			}}
		>
			<div className={styles.container}>
				<div className={styles.main}>
					<div className={styles.main__voe_form}>
						<VoeFormPageControl steps={steps} />
					</div>
				</div>
			</div>
		</VoeFormContext.Provider>
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
					"company",
					"employers",
					"employers.voeData",
				]
			}
		);
		const employer: ApplicantEmployerEntity = applicant.employers.find(({ uuid_token }) => uuid_token == employer_uuid);

		if (!!!applicant || !!!employer || applicant.id != employer.applicant.id)
			return { notFound: true };

		return { props: { applicant, employer } };
	} catch (error) {
		console.log("error", error.message);

		return { notFound: true };
	}
}
