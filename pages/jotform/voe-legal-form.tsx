import React, { useEffect, useState } from "react";
import styles from "../../styles/jotform.module.css";
import { ApplicantEntity } from "../../models/applicant/applicant.entity";
import "react-toastify/dist/ReactToastify.css";
import jotformContext from "../../context/jotform-context";
import { PageProps } from "../../types/jotform/page-props.type";
import { ApplicantExtrasEntity } from "../../models/applicant/applicant-extras.entity";
import { BackgroundInfoAttachment } from "../../components/forms/jotform/voe-forms/legal-attachments/background-info-attachement";
import DisclosureAttachment from "../../components/forms/jotform/voe-forms/legal-attachments/disclosure-attachment";
import ConsentAlcoholDrug from "../../components/forms/jotform/voe-forms/legal-attachments/consent-alcohol-drug";
import BackgroundReportsPsp from "../../components/forms/jotform/voe-forms/legal-attachments/background-reports-psp";
import AuthBackgroundInvestigation from "../../components/forms/jotform/voe-forms/legal-attachments/auth-background-investigation";

export default function jotFormLongForm() {

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

	const shortFormDataSent: PageProps["shortFormDataSent"] = async (
		params: any
	) => {

		// try {
		// const applicantApi = new ApplicantApi();
		//   const response = await api.create(applicant);

		//   if (response) setApplicant(response);
		//   setApplicant(response);
		//   onNextClick(applicant);
		//   //   toast.success(t("SUCCESS"));
		// } catch (error) {
		//   toast("kkkk");

		//   console.log(error);
		// }
	};
	const getPageAccordingToStep = (step: number) => {
		return {
			0: pageOne(),
		}[step];
	};

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
					setSteps,
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
	// return <BackgroundInfoAttachment />;
    // return <DisclosureAttachment/>
	return <ConsentAlcoholDrug/>
	// return <BackgroundReportsPsp/>
	// return <AuthBackgroundInvestigation/>
};
function t(arg0: string): import("react-toastify").ToastContent {
	throw new Error("Function not implemented.");
}
