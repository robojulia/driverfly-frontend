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
	entity: ApplicantEntity,
	employer: ApplicantEmployerEntity
}

export default function VerificationOfEmploymentSection1Page({ entity, employer }: LegalFormProps) {

	const [applicant, setApplicant] = useState<ApplicantEntity>(new ApplicantEntity());
	const [applicantExtras, setApplicantExtras] = useState<ApplicantExtrasEntity[]>([]);
	const [applicantVoe, setApplicantVoe] = useState<ApplicantVoeFormEntity[]>([])

	const updateApplicantExtras = (applicantExtrasEntity: ApplicantExtrasEntity) =>
		setApplicantExtras((oldApx) => {
			oldApx = oldApx?.filter(v => v.type !== applicantExtrasEntity.type)
			return !!oldApx ? [...oldApx, { ...applicantExtrasEntity }] : [{ ...applicantExtrasEntity }]
		})

	const [steps, setSteps] = useState<number>(0);
	const stepNext = (): void => setSteps(steps + 1)
	const stepBack = (): void => setSteps(steps - 1)

	useEffect(() => {
		console.log("from index", employer);

		if (applicant.voeData) setApplicantVoe(applicant.voeData.filter(val => val?.employerId === employer?.id))

	}, [employer]);

	const getPageAccordingToStep = (step: number, employer: ApplicantEmployerEntity) => {
		return {
			0: pageOne({ employer }),
		}[step];
	};
	useEffect(() => {
		console.log("applicant from server side props", entity)
		setApplicant(entity)
	}, [])
	return (
		<jotformContext.Provider
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
					stepBack
				},
			}}
		>
			<div>
				<div className={styles.main}>
					<div style={{ padding: '30px' }}>
						{getPageAccordingToStep(steps, employer)}
					</div>
				</div>
			</div>
		</jotformContext.Provider>
	);
}

const pageOne = ({ employer }) => {
	return <VerificationOfEmploymentSection1 employer={employer} />
};
function t(arg0: string): import("react-toastify").ToastContent {
	throw new Error("Function not implemented.");
}


export async function getServerSideProps({ query }) {
	try {
		const { uuid, employer_uuid } = query || {};

		if (!!!uuid || !!!employer_uuid) return { notFound: true };

		const applicantApi = new ApplicantApi();
		const entity: ApplicantEntity = await applicantApi.getByUuidToken(
			uuid
		);
		const employer: ApplicantEmployerEntity = await applicantApi.employer.getByUuidToken(employer_uuid)

		if (!!!entity || !!!employer || entity.id !== employer?.applicant?.id) return { notFound: true }

		return { props: { entity, employer } }
	} catch (error) {
		return { notFound: true };
	}
}
