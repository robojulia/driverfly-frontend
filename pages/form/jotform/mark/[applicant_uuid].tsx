import { useEffect } from "react";
import { useTranslation } from "../../../../hooks/use-translation";
import ApplicantApi from "../../../api/applicant";
import styles from "../../../../styles/jotform.module.css";
import { ApplicantFormStatus } from "../../../../enums/applicants/applicant-form-status.enum";
import { useRouter } from "next/router";

export default function Dashboard({ applicant_uuid }) {

    const { t } = useTranslation();

    const router = useRouter();
    useEffect(() => {
        router.replace(`/form/jotform/mark/${applicant_uuid}`, undefined, { shallow: true });
    }, [])

    return (
        <>
            <div className={styles.container}>
                <div className={styles.main}>
                    <div className={styles.main_form} >
                        <h4 className={styles.Application}>{t("THANK_YOU")}</h4>
                        <h6 className={styles.paragraph}>{t("successfully_saved_information")}</h6>
                    </div>
                </div>
            </div>
        </>
    );
}

export async function getServerSideProps({ query }) {
    try {
        const { applicant_uuid, hired } = query || {};

        if (!!!applicant_uuid) return { notFound: true };

        const applicantApi = new ApplicantApi();

        await applicantApi.jotform.mark(
            applicant_uuid,
            Boolean(hired && hired == 1)
                ? ApplicantFormStatus.HIRED
                : ApplicantFormStatus.REJECTED
        );

        return { props: { applicant_uuid } };
    } catch (error) {
        console.log("error:: ", error.message);
        return { notFound: true };
    }
}

