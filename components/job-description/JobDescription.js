import { useTranslation } from "../../hooks/useTranslation";

export default function JobDescription({ job }) {
    const { t } = useTranslation();

    return (
        <>
            <div className="job-deatails-inner">
                <h3>{t('job_description')}</h3>
                <p>{job.description_short}</p>
                <p>{job.description}</p>
            </div>

        </>
    )
}