import { useTranslation } from "react-i18next";

export default function JobDescription({ job }) {
    const { t } = useTranslation();

    return (
        <>
            <div className="job-deatails-inner">
                <h3>Job Description</h3>
                {/* <figure>
                    <img src={job.truck_image} alt="Trulli" className="img-fluid" />
                    <figcaption className="my-3 text-center">{job.title}</figcaption>
                </figure> */}

                <p>{job.description_short}</p>
                <p>{job.description}</p>
            </div>

        </>
    )
}