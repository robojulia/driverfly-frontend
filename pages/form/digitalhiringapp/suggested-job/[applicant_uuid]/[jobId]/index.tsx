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

export interface LongFormProps {
    entity: ApplicantEntity;
    jobId: number;
}

export default function LongForm({ entity, jobId }: LongFormProps) {

    console.log("job id====", jobId)
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
                        {getSuggestedJobPages(steps)}
                    </div>
                </div>
            </div>
        </JotformContext.Provider>
    );
}

export async function getServerSideProps({ query }) {
    try {
        const { applicant_uuid, jobId } = query || {};

        if (!!!applicant_uuid) return { notFound: true };

        const applicantApi = new ApplicantApi();
        const entity: ApplicantEntity = await applicantApi.getByUuidToken(
            applicant_uuid
        );

        if (!!!entity) return { notFound: true };

        return { props: { entity, jobId } };
    } catch (error) {
        return { notFound: true };
    }
}
