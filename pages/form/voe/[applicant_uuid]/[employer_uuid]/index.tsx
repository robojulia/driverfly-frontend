import { useEffect, useState } from "react";
import styles from "../../../../../styles/voe.module.css";
import VoeFormContext from "../../../../../context/voeform-context";
import { VoeFormPageControl } from "../../../../../components/forms/jotform/voe-form-pages";
import ApplicantApi from "../../../../api/applicant";
import { ApplicantEmployerEntity, ApplicantEntity, ApplicantVoeFormEntity } from "../../../../../models/applicant";

export interface VoeFormProps {
	applicant: ApplicantEntity;
	employer: ApplicantEmployerEntity
	
}

export default function VoeForm({ applicant, employer }: VoeFormProps) {

	const [applicantVoe, setApplicantVoe] = useState<ApplicantVoeFormEntity[]>([])

	const updateApplicantVoe = (applicantVoeEntity: ApplicantVoeFormEntity) =>
		setApplicantVoe((oldApx) => {
			oldApx = oldApx?.filter((v) => v.type !== applicantVoeEntity.type);
			return !!oldApx
				? [...oldApx, { ...applicantVoeEntity }]
				: [{ ...applicantVoeEntity }];
		});

	const [steps, setSteps] = useState<number>(0);
	const stepNext = (): void => setSteps(steps + 1);
	const stepBack = (): void => setSteps(steps - 1);
	const jumpToStep = (step: number): void => {
		setSteps(step);
	};
	useEffect(() => {
		console.log("from index", applicant);

		// if (applicant.voeData) setApplicantVoe(applicant.voeData.filter(val => val?.employerId === employer?.id))

	}, [employer]);

	return (
		<VoeFormContext.Provider
			value={{
				state: {
					applicant,
					employer,
					applicantVoe,
					steps,
				},
				method: {
					updateApplicantVoe,
					stepNext,
					stepBack,
					jumpToStep
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

		if (!!!applicant_uuid || !!!employer_uuid) return { notFound: true }

		const applicantApi = new ApplicantApi()

		const applicant: ApplicantEntity = await applicantApi.getByUuidToken(applicant_uuid)
		const employer: ApplicantEmployerEntity = await applicantApi.employer.getByUuidToken(employer_uuid)

		if (!!!applicant || !!!employer || applicant.id !== employer.applicant.id) return { notFound: true }

		return { props: { applicant, employer } }
	} catch (error) {
		return { notFound: true }
	}
}
