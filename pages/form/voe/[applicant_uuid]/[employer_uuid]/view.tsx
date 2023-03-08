import styles from "../../../../../styles/voe.module.css";
import ApplicantApi from "../../../../api/applicant";
import { ApplicantEmployerEntity, ApplicantEntity, ApplicantVoeFormEntity } from "../../../../../models/applicant";
import { ViewVoeDetails } from "../../../../../components/forms/jotform/voe-forms/view-voe-details";

export interface VoeFormProps {
    applicant: ApplicantEntity;
    employer: ApplicantEmployerEntity
}

export default function ViewVoeForm({ applicant, employer }: VoeFormProps) {

    return (
        <div className={styles.container}>
            <div className={styles.main}>
                <div className={styles.main__voe_form}>
                    <ViewVoeDetails
                        applicant={applicant}
                        employer={employer}
                        applicantVoe={(applicant.voeData.filter(val => val?.employerId === employer?.id))}
                    />
                </div>
            </div>
        </div>
    );
}

export async function getServerSideProps({ query }) {
    try {
        const { applicant_uuid, employer_uuid } = query || {};

        if (!!!applicant_uuid || !!!employer_uuid) return { notFound: true }

        const applicantApi = new ApplicantApi()

        const applicant: ApplicantEntity = await applicantApi.getByUuidToken(applicant_uuid)
        const employer: ApplicantEmployerEntity = await applicantApi.employer.getByUuidToken(employer_uuid)

        if (!!!applicant || !!!employer || applicant.id !== employer.applicant.id) return { notFound: true }

        return { props: { applicant, employer } }
    } catch (error) {
        return { notFound: true }
    }
}
