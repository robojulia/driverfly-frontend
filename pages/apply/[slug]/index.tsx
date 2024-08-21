import { NextPageContext } from "next";
import { useEffect, useState } from "react";
import "react-toastify/dist/ReactToastify.css";

import styles from "../../../styles/digitalhiringapp.module.css";
import { getFullFormStyle, getFullFormPages } from "../../../components/forms/jotform/jotform-pages";
import JotformContext from "../../../context/jotform-context";
import { Status } from "../../../enums/status.enum";
import { ApplicantEntity, ApplicantExtrasEntity } from "../../../models/applicant";
import { UtmReferral } from "../../../models/auth/utm-referral.interface";
import { CompanyPreferenceEntity } from "../../../models/company/company-preferences.entity";
import { CompanyEntity } from "../../../models/company/company.entity";
import { JobEntity } from "../../../models/job/job.entity";
import CompanyApi from "../../api/company";


export interface FullFormProps {
	employer: CompanyEntity;
	preferences: CompanyPreferenceEntity[];
	utm?: UtmReferral;
}
export default function FullForm({ employer, preferences, utm }: FullFormProps) {

	const [jobs, setJobs] = useState<JobEntity[]>([]);
	const [applicant, setApplicant] = useState<ApplicantEntity>(new ApplicantEntity());
	const [applicantExtras, setApplicantExtras] = useState<ApplicantExtrasEntity[]>([]);
	const updateApplicantExtras = (applicantExtrasEntity: ApplicantExtrasEntity) =>
		setApplicantExtras((oldApx) => {
			oldApx = oldApx?.filter((v) => (v.type != applicantExtrasEntity?.type));
			return !!oldApx
				? [...oldApx, { ...applicantExtrasEntity }]
				: [{ ...applicantExtrasEntity }];
		});

	const [steps, setSteps] = useState<number>(0);
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
					steps,
					utm,
					company: employer
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
		let slug = String(query?.slug); // { companyId } = query || {};

		const utm: UtmReferral = {
			utm_source: query?.utm_source as string ?? null,
			utm_medium: query?.utm_medium as string ?? null,
			utm_campaign: query?.utm_campaign as string ?? null,
			utm_content: query?.utm_content as string ?? null,
			referral_name: query?.referral_name as string ?? null,
		};

		if (!slug) {
			console.error(`form/jotform: Unable to fetch details for companyId: ${query?.slug}`);
			return { notFound: true }
		}

		const companyApi = new CompanyApi();
		const employer: CompanyEntity = await companyApi.employer.getBySlug(slug);
		const preferences: CompanyPreferenceEntity[] = await companyApi.preferences.list(employer.id)

		if (employer?.status != Status.ACTIVE) {
			if (employer == null) {
				console.error(`form/jotform: Employer ${query?.slug} not found - does not exist`);
			} else {
				console.error(`form/jotform: Employer ${query?.slug} found, but status is not ACTIVE (status = ${employer?.status})`);
			}
			return { notFound: true };
		}

		return { props: { employer, preferences, utm } }
	} catch (error) {
		console.error(`form/jotform: Exception when attempting to fetch details for companyId: ${query?.companyId}`, error.message);
		return { notFound: true }
	}
}
