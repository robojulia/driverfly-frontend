import { useEffect, useState } from "react";
import styles from "../../../../../../styles/digitalhiringapp.module.css";
import {
    ApplicantEntity,
    ApplicantExtrasEntity,
} from "../../../../../../models/applicant";
import JotformContext from "../../../../../../context/jotform-context";
import {
    getLongFormStyle,
    getSuggestedJobPages,
} from "../../../../../../components/forms/jotform/jotform-pages";
import ApplicantApi from "../../../../../api/applicant";
import { JobEntity } from "../../../../../../models/job/job.entity";
import JobApi from "../../../../../api/job";
import { CompanyEntity } from "../../../../../../models/company/company.entity";
import CompanyApi from "../../../../../api/company";

export interface SuggestedJobsProps {
    entity: ApplicantEntity;
    job: JobEntity;
    company: CompanyEntity;
}

export default function SuggestedJobs({ entity, job, company }: SuggestedJobsProps) {
    console.log("entity", entity);


    const [jobs, setJobs] = useState<JobEntity[]>([job]);
    const [applicant, setApplicant] = useState<ApplicantEntity>(entity);
    const [applicantExtras, setApplicantExtras] = useState<
        ApplicantExtrasEntity[]
    >(entity.extras);

    const updateApplicantExtras = (
        applicantExtrasEntity: ApplicantExtrasEntity
    ) =>
        setApplicantExtras((oldApx) => {
            oldApx = oldApx?.filter((v) => v.type !== applicantExtrasEntity?.type);
            return !!oldApx
                ? [...oldApx, { ...applicantExtrasEntity }]
                : [{ ...applicantExtrasEntity }];
        });

    const [steps, setSteps] = useState<number>(0);
    const stepNext = (): void => setSteps(steps + 1);
    const stepBack = (): void => setSteps(steps - 1);

    return (
        <JotformContext.Provider
            value={{
                state: {
                    applicant,
                    applicantExtras,
                    steps,
                    jobs,
                    company
                },
                method: {
                    setApplicant,
                    updateApplicantExtras,
                    stepNext,
                    stepBack,
                    setJobs
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
                        {getSuggestedJobPages(steps, job.id)}
                    </div>
                </div>
            </div>
        </JotformContext.Provider>
    );
}

export async function getServerSideProps({ query }) {
    try {
        const { applicant_uuid, jobId } = query || {};

        if (!Boolean(applicant_uuid) || !Boolean(jobId)) return { notFound: true };

        const applicantApi = new ApplicantApi();
        const entity: ApplicantEntity = await applicantApi.getByUuidToken(
            applicant_uuid
        );

        const jobApi = new JobApi();
        const job = await jobApi.getById(jobId);

        if (!Boolean(entity) || !Boolean(job)) return { notFound: true };

        const companyApi = new CompanyApi();
        const company: CompanyEntity = await companyApi.employer.getById(job.company?.id);

        delete entity.id
        delete entity.user?.id
        delete entity.company
        delete entity.documents
        delete entity.voeData
        delete entity.uuid_token
        entity.extras = entity.extras?.map(({ type, value }) => ({ type, value }))

        return { props: { entity, job, company } };
    } catch (error) {
        return { notFound: true };
    }
}
