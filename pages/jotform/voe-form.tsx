import React, { useEffect, useState } from "react";
import styles from "../../styles/jotform.module.css";
import { IntroPage } from "../../components/forms/jotform/voe-forms/voe-intro-page";
import jotformContext from "../../context/jotform-context";
import { ApplicantExtrasEntity } from "../../models/applicant/applicant-extras.entity";
import { ApplicantEntity } from "../../models/applicant/applicant.entity";
import { EmployedByUs } from "../../components/forms/jotform/voe-forms/employed-by-us";
import { AccidentHistory } from "../../components/forms/jotform/voe-forms/accident-history";

export default function voeForm() {
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
        return{
            0: pageOne(),
            1: pageTwo(),
            2: pageThree()
    }[step];
};

return(
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
    return <IntroPage />;
}

const pageTwo = () => {
    return <EmployedByUs />;
}

const pageThree = () => {
    return <AccidentHistory />;
}