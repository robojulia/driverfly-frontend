import React, { useEffect, useState } from "react";
import styles from "../../../styles/jotform.module.css";
import { IntroPage } from "../../../components/forms/jotform/voe-forms/voe-intro-page";
import { EmployedByUs } from "../../../components/forms/jotform/voe-forms/employed-by-us";
import { AccidentHistory } from "../../../components/forms/jotform/voe-forms/accident-history";
import { SubmissionDetails } from "../../../components/forms/jotform/voe-forms/submission-details";
import { ApplicantVoeFormEntity } from "../../../models/applicant/applicant-voe-form.entity";
import voeFormContextType from "../../../context/voeform-context";
import { useRouter } from "next/router";
const pages = [IntroPage, EmployedByUs, AccidentHistory, SubmissionDetails];

export default function voeForm({ slug }) {
	const router = useRouter();
	const [applicantVoe, setApplicantVoe] = useState<ApplicantVoeFormEntity[]>(
		[]
	);
	const [uuidVoeToken, setUuidVoeToken] = useState<any>("");

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
	const updateUuidVoeToken = (slugKey: any) => {
		let key = slugKey;
		setUuidVoeToken(key);
	};

	useEffect(() => {
		let key = router.query.slug;
		updateUuidVoeToken(key);
		console.log("from index", key);
	});
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
						<PageControl steps={steps} />
					</div>
				</div>
			</div>
		</voeFormContextType.Provider>
	);
}

function PageControl({ steps }: { steps: number }): JSX.Element {
	const CurrentPage = pages[steps];
	return <CurrentPage />;
}
