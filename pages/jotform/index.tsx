import { useEffect, useState } from "react";
import styles from "../../styles/jotform.module.css";
import "react-toastify/dist/ReactToastify.css";
import { ApplicantEntity, ApplicantExtrasEntity } from "../../models/applicant";
import JotformContext from "../../context/jotform-context";
import { getPageAccordingToStep, getStyleAccordingToStep } from "../../components/forms/jotform/jotform-pages";

export default function jotFormLongForm() {
	const [applicant, setApplicant] = useState<ApplicantEntity>(new ApplicantEntity());
	const [applicantExtras, setApplicantExtras] = useState<ApplicantExtrasEntity[]>([]);
	const updateApplicantExtras = (applicantExtrasEntity: ApplicantExtrasEntity) =>
		setApplicantExtras((oldApx) => {
			oldApx = oldApx?.filter((v) => v.type !== applicantExtrasEntity?.type);
			return !!oldApx
				? [...oldApx, { ...applicantExtrasEntity }]
				: [{ ...applicantExtrasEntity }];
		});

	const [steps, setSteps] = useState<number>(0);
	const stepNext = (): void => setSteps(steps + 1);
	const stepBack = (): void => setSteps(steps - 1);

	useEffect(() => {
		console.log("applicantextrasvalues", applicantExtras);
	}, []);

	return (
		<JotformContext.Provider
			value={{
				state: {
					applicant,
					applicantExtras,
					steps
				},
				method: {
					setApplicant,
					updateApplicantExtras,
					stepNext,
					stepBack
				}
			}}
		>
			<div className={styles.container}>
				<div className={styles.main}>
					<div
						className={styles.main_form}
						style={getStyleAccordingToStep(steps)}
					>
						{/* uncomment this during development */}
						{/* <BaseInput
							value={steps}
							min={0}
							max={26}
							type="number"
							onChange={({ target: { value } }) => setSteps(parseInt(value))} /> */}
						{getPageAccordingToStep(steps)}
					</div>
				</div>
			</div>
		</JotformContext.Provider>
	);
}
