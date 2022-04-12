import { MvrType } from "../../enums/drivers/mvr-type.enum"
import { useTranslation } from "react-i18next";

export default function JobDescription({ job }) {
    const { t } = useTranslation();

    return (
        <>
            <div className="job-deatails-inner">
                <h3>Job Description</h3>
                <figure>
                    {/* <img src={job.truck_image} alt="Trulli" className="img-fluid" /> */}
                    <figcaption className="my-3 text-center">{job.title}</figcaption>
                </figure>

                <p>Looking for OTR drivers for a company in Dallas, TX</p>
                <p>{job.description}</p>

                <p>
                    <strong>Requirements:</strong>
                    {job.mvr_requirements &&
                        job.mvr_requirements.map(item => {
                            return <>
                                <div className="row">
                                    <div className="col-md-6">
                                        {t(MvrType[item.type].toLowerCase())}
                                    </div>
                                    <div className="col-md-3">
                                        {`${t("max_count")} ${item.max_count} `}
                                    </div>
                                    <div className="col-md-3">
                                        {`${t("max_years")} ${item.max_years} `}
                                    </div>
                                </div>
                            </>
                        })
                    }
                </p>
            </div>

        </>
    )
}