import { NextPageContext } from "next";
import { useEffect, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import styles from "../../../../styles/digitalhiringapp.module.css";
import { ApplicantEntity, ApplicantExtrasEntity } from "../../../../models/applicant";
import JotformContext from "../../../../context/jotform-context";
import { getFullFormPages, getFullFormStyle } from "../../../../components/forms/jotform/jotform-pages";
import CompanyApi from "../../../api/company";
import { Status } from "../../../../enums/status.enum";
import { CompanyEntity } from "../../../../models/company/company.entity";
import BaseInput from "../../../../components/forms/base-input";
import { JobEntity } from "../../../../models/job/job.entity";
import { CompanyPreferenceEntity } from "../../../../models/company/company-preferences.entity";

export interface FullFormProps {
	employer: CompanyEntity;
	preferences: CompanyPreferenceEntity[];
}
export default function FullForm({ employer, preferences }: FullFormProps) {
	console.log("preferences", preferences);


	const [jobs, setJobs] = useState<JobEntity[]>([]);
	const [applicant, setApplicant] = useState<ApplicantEntity>(new ApplicantEntity());
	const [applicantExtras, setApplicantExtras] = useState<ApplicantExtrasEntity[]>([]);
	const updateApplicantExtras = (applicantExtrasEntity: ApplicantExtrasEntity) =>
		setApplicantExtras((oldApx) => {
			oldApx = oldApx?.filter((v) => (v.type !== applicantExtrasEntity?.type));
			return !!oldApx
				? [...oldApx, { ...applicantExtrasEntity }]
				: [{ ...applicantExtrasEntity }];
		});

	const [steps, setSteps] = useState<number>(28);
	const stepNext = (): void => setSteps(steps + 1);
	const stepBack = (): void => setSteps(steps - 1);

	useEffect(() => {
		setApplicant(oldValues => ({ ...oldValues, company: employer }))
	}, [employer]);

	return (
		<JotformContext.Provider
			value={{
				state: {
					applicant,
					jobs,
					applicantExtras,
					companyPreferences: preferences,
					steps
				},
				method: {
					setApplicant,
					setJobs,
					updateApplicantExtras,
					setApplicantExtras,
					stepNext,
					stepBack
				}
			}}
		>
			<div className={styles.container}>
				<div className={styles.main}>
					<div
						className={styles.main_form}
						style={getFullFormStyle(steps)}
					>
						{/* uncomment this during development */}
						{/* <BaseInput
							value={steps}
							min={0}
							max={26}
							type="number"
							onChange={({ target: { value } }) => setSteps(parseInt(value))} /> */}
						{getFullFormPages(steps)}
					</div>
				</div>
			</div>
		</JotformContext.Provider>
	);
}

export async function getServerSideProps({ query }: NextPageContext) {
	try {
		let companyId = +(query?.companyId); // { companyId } = query || {};

		if (!companyId) {
			console.error(`form/jotform: Unable to fetch details for companyId: ${query?.companyId}`);
			return { notFound: true }
		}

		const companyApi = new CompanyApi();
		const employer: CompanyEntity = await companyApi.employer.getById(companyId);
		const preferences: CompanyPreferenceEntity[] = await companyApi.preferences.list(companyId)

		if (employer?.status !== Status.ACTIVE) {
			if (employer == null) {
				console.error(`form/jotform: Employer ${query?.companyId} not found - does not exist`);
			} else {
				console.error(`form/jotform: Employer ${query?.companyId} found, but status is not ACTIVE (status = ${employer?.status})`);
			}
			return { notFound: true };
		}

		return { props: { employer, preferences } }
	} catch (error) {
		console.error(`form/jotform: Exception when attempting to fetch details for companyId: ${query?.companyId}`, error);
		return { notFound: true }
	}
}
