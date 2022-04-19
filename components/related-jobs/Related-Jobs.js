import timeSince from "../../utils/timeSince"
import Link from "next/link"

export default function RelatedJobs({ jobs }) {

    return (
        <>
            <div className="related-job-sec">
                <h3>Related Jobs</h3>
                <div className="row mt-3">
                    <div className="col-md-12">
                        {
                            jobs &&
                            jobs.map((job, index) => {
                                return <div key={index} className="media align-items-center ">
                                    <img className="d-flex mr-4 truck-img" src="/driverfly-logo-square.png" alt="" />
                                    <div className="media-body">
                                        <h4 className="mt-0">
                                            {job.title}<span className="d-block mt-2" data-toggle="tooltip"
                                                data-placement="top" title="Tooltip on top">
                                            </span></h4>
                                        <div className="job-date-author">
                                            posted {timeSince(job.created_at)} ago
                                            by <a href="" className="employer text-theme">
                                                {job.company?.name}
                                            </a>
                                        </div>
                                        <div className="job-metas">
                                            <div className="job-location">
                                                <i className="fa fa-star-o" aria-hidden="true"></i><strong>
                                                    {job.description_short}
                                                </strong>
                                            </div>
                                        </div>

                                    </div>
                                    <Link href={`/jobs/${job.id}`}>
                                        <button type="button" className="btn btn-primary btn-sm">Browse Job</button>
                                    </Link>

                                </div>
                            })
                        }
                    </div>
                </div>
            </div>
        </>
    )
}