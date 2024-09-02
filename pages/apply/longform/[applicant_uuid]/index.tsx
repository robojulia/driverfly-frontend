import { useEffect, useState } from "react";
import {
	getLongFormPages,
	getLongFormStyle,
} from "../../../../components/forms/jotform/jotform-pages";
import JotformContext from "../../../../context/jotform-context";
import {
	ApplicantEntity,
	ApplicantExtrasEntity,
} from "../../../../models/applicant";
import { CompanyEntity } from "../../../../models/company/company.entity";
import ApplicantApi from "../../../api/applicant";
import CompanyApi from "../../../api/company";
import styles from "../../../../styles/digitalhiringapp.module.css";

export interface LongFormProps {
	entity: ApplicantEntity;
	company: CompanyEntity;
}

export default function LongForm({ entity, company }: LongFormProps) {
	const [applicant, setApplicant] = useState<ApplicantEntity>(entity);
	const [applicantExtras, setApplicantExtras] = useState<
		ApplicantExtrasEntity[]
	>(entity.extras);

	const updateApplicantExtras = (
		applicantExtrasEntity: ApplicantExtrasEntity
	) =>
		setApplicantExtras((oldApx) => {
			oldApx = oldApx?.filter((v) => v.type != applicantExtrasEntity?.type);
			return !!oldApx
				? [...oldApx, { ...applicantExtrasEntity }]
				: [{ ...applicantExtrasEntity }];
		});

	const [steps, setSteps] = useState<number>(0);
	const stepNext = (): void => setSteps(steps + 1);
	const stepBack = (): void => setSteps(steps - 1);

	useEffect(() => {
		console.log("from index applicant", applicant);
		console.log("from index applicantExtras", applicantExtras);
	}, []);

	return (
		<JotformContext.Provider
			value={{
				state: {
					applicant,
					applicantExtras,
					steps,
					company,
				},
				method: {
					setApplicant,
					updateApplicantExtras,
					stepNext,
					stepBack,
				},
			}}
		>
			<div className={styles.container}>
				<div className={styles.main}>
					<div className={styles.main_form} style={getLongFormStyle(steps)}>
						{/* uncomment this during development */}
						{/* <BaseInput
							value={steps}
							min={0}
							max={26}
							type="number"
							onChange={({ target: { value } }) => setSteps(parseInt(value))} /> */}
						{getLongFormPages(steps)}
					</div>
				</div>
			</div>
		</JotformContext.Provider>
	);
}

export async function getServerSideProps({ query }) {
	// try {
	const { applicant_uuid } = query || {};

	if (!!!applicant_uuid) return { notFound: true };

	const applicantApi = new ApplicantApi();
	const params = {
		withRelations: [
			"extras",
			"documents",
			"employers",
			"accident_history",
			"moving_violation_history",
		],
	};
	const entity: ApplicantEntity = await applicantApi.fetchByUuidToken(
		applicant_uuid,
		params
	);
	console.log("applicant", entity);

	if (!!!entity) return { notFound: true };
	const companyApi = new CompanyApi();
	const company: CompanyEntity = await companyApi.employer.getById(
		entity?.company?.id
	);

	return { props: { entity, company } };
	// } catch (error) {
	// 	console.error("error", error.message);

	// 	return { notFound: true };
	// }
}
