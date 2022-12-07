import { useEffect, useState } from "react";
import styles from "../../../styles/voe.module.css";
import VoeFormContext from "../../../context/voeform-context";
import { VoeFormPageControl } from "../../../components/forms/jotform/voe-form-pages";
import ApplicantApi from "../../api/applicant";
import { ApplicantEntity, ApplicantVoeFormEntity } from "../../../models/applicant";

export interface VoeFormProps {
	applicant: ApplicantEntity
}

export default function VoeForm({ applicant }: VoeFormProps) {

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

	useEffect(() => {
		console.log("from index", applicant);
	}, []);

	return (
		<VoeFormContext.Provider
			value={{
				state: {
					applicant,
					applicantVoe,
					steps,
				},
				method: {
					updateApplicantVoe,
					stepNext,
					stepBack,
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
		const { uuid } = query || {};

		if (!!!uuid) return { notFound: true }

		const applicantApi = new ApplicantApi()
		const applicant: ApplicantEntity = await applicantApi.getByUuidToken(uuid)

		if (!!!applicant) return { notFound: true }

		return { props: { applicant } }
	} catch (error) {
		return { notFound: true }
	}
}
