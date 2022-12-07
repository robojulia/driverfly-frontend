import { useEffect, useState } from "react";
import styles from "../../../styles/jotform.module.css";
import "react-toastify/dist/ReactToastify.css";
import { ApplicantEntity, ApplicantExtrasEntity } from "../../../models/applicant";
import JotformContext from "../../../context/jotform-context";
import { getFullFormPages, getFullFormStyle } from "../../../components/forms/jotform/jotform-pages";
import CompanyApi from "../../api/company";
import { Status } from "../../../enums/status.enum";
import { CompanyEntity } from "../../../models/company/company.entity";

export interface FullFormProps {
	employer: CompanyEntity
}
export default function FullForm({ employer }: FullFormProps) {

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
		setApplicant(oldValues => ({ ...oldValues, company: employer }))
	}, [employer]);

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

export async function getServerSideProps({ query }) {
	try {
		const { companyId } = query || {};

		if (!!!companyId || isNaN(companyId)) return { notFound: true }

		const companyApi = new CompanyApi()
		const employer: CompanyEntity = await companyApi.employer.getById(parseInt(companyId as string))

		if (employer?.status !== Status.ACTIVE) return { notFound: true }

		return { props: { employer } }
	} catch (error) {
		return { notFound: true }
	}
}
