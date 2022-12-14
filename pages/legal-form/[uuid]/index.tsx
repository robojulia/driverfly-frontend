import React, { useEffect, useState } from "react";
import styles from "../../../styles/jotform.module.css";
import { ApplicantEntity } from "../../../models/applicant/applicant.entity";
import "react-toastify/dist/ReactToastify.css";
import jotformContext from "../../../context/jotform-context";
import { ApplicantExtrasEntity } from "../../../models/applicant/applicant-extras.entity";
import AuthBackgroundInvestigation from "../../../components/forms/jotform/voe-forms/legal-attachments/auth-background-investigation";
import { BackgroundInfoAttachment } from "../../../components/forms/jotform/voe-forms/legal-attachments/background-info-attachement";
import ApplicantApi from "../../api/applicant";
import DisclosureAttachment from "../../../components/forms/jotform/voe-forms/legal-attachments/disclosure-attachment";
import ConsentAlcoholDrug from "../../../components/forms/jotform/voe-forms/legal-attachments/consent-alcohol-drug";
import BackgroundReportsPsp from "../../../components/forms/jotform/voe-forms/legal-attachments/background-reports-psp";
import { VerificationOfEmploymentSection1 } from "../../../components/forms/jotform/voe-forms/legal-attachments/voe-attachments/section-1";
import { VerificationOfEmploymentSection2 } from "../../../components/forms/jotform/voe-forms/legal-attachments/voe-attachments/section-2";


export interface LegalFormProps {
	entity: ApplicantEntity
}


export default function jotFormLongForm({ entity }: LegalFormProps) {

	const [applicant, setApplicant] = useState<ApplicantEntity>(new ApplicantEntity());
	const [applicantExtras, setApplicantExtras] = useState<ApplicantExtrasEntity[]>([]);
	const updateApplicantExtras = (applicantExtrasEntity: ApplicantExtrasEntity) =>
		setApplicantExtras((oldApx) => {
			oldApx = oldApx?.filter(v => v.type !== applicantExtrasEntity.type)
			return !!oldApx ? [...oldApx, { ...applicantExtrasEntity }] : [{ ...applicantExtrasEntity }]
		})

	const [steps, setSteps] = useState<number>(0);
	const stepNext = (): void => setSteps(steps + 1)
	const stepBack = (): void => setSteps(steps - 1)

	useEffect(() => {
		console.log("applicantextrasvalues", applicantExtras);
	}, []);

	const getPageAccordingToStep = (step: number) => {
		return {
			0: pageOne(),
		}[step];
	};
	useEffect(() => {
		console.log("applicant from server side props", entity)
		setApplicant(entity)
	},[])
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
			<div className={styles.container}>
				<div className={styles.main}>
					<div className={styles.main_form}>
						{getPageAccordingToStep(steps)}
					</div>
				</div>
			</div>
		</jotformContext.Provider>
	);
}

const pageOne = () => {
	// return <BackgroundInfoAttachment />; No need as per Talha
	// return <DisclosureAttachment/>
	// return <ConsentAlcoholDrug/>
	return <VerificationOfEmploymentSection1/>
	// return <VerificationOfEmploymentSection2/>
	// return <BackgroundReportsPsp/> Duplicated page
	// return <AuthBackgroundInvestigation /> 
};
function t(arg0: string): import("react-toastify").ToastContent {
	throw new Error("Function not implemented.");
}


export async function getServerSideProps({ query }) {
	try {
		const { uuid } = query || {};

		if (!!!uuid) return { notFound: true };

		const applicantApi = new ApplicantApi();
		const entity: ApplicantEntity = await applicantApi.getByUuidToken(
			uuid
		);

		if (!!!entity) return { notFound: true };

		return { props: { entity } };
	} catch (error) {
		return { notFound: true };
	}
}
