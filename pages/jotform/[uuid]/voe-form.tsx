import { useEffect, useState } from "react";
import styles from "../../../styles/jotform.module.css";
import { ApplicantVoeFormEntity } from "../../../models/applicant/applicant-voe-form.entity";
import voeFormContextType from "../../../context/voeform-context";
import { VoeFormPageControl } from "../../../components/forms/jotform/voe-form-pages";

export default function voeForm({ uuid }) {

	const [applicantVoe, setApplicantVoe] = useState<ApplicantVoeFormEntity[]>([])
	const [uuidVoeToken, setUuidVoeToken] = useState<any>(uuid)
	const updateUuidVoeToken = (uuid: any) => setUuidVoeToken(uuid);

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
		console.log("from index", uuidVoeToken);
	}, []);

	return (
		<voeFormContextType.Provider
			value={{
				state: {
					applicantVoe,
					steps,
					uuidVoeToken,
				},
				method: {
					updateApplicantVoe,
					updateUuidVoeToken,
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
		</voeFormContextType.Provider>
	);
}

export async function getServerSideProps({ query }) {
	const { uuid } = query || {};

	if (!!!uuid) return { notFound: true }

	return { props: { uuid } }
}
