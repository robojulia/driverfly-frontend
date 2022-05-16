import timeSince from "../../utils/timeSince"
import Link from "next/link"
import { useTranslation } from "../../hooks/useTranslation"
import CompanyPhoto from "../jobs/company-photo";
import { GeoAltFill, CurrencyDollar, Star } from 'react-bootstrap-icons';


export default function RelatedJobs({ jobs }) {
    const { t } = useTranslation();

    return (
        <>
            <div className="related-job-sec">
                <h3>{t('related_jobs')}</h3>
                <div className="row mt-3">
                    <div className="col-md-12">
                        {
                            jobs &&
                            jobs.map((job, index) => {
                                return <div key={index} className="media align-items-center ">
                                    <CompanyPhoto className="d-flex mr-4 truck-img" company={job.company} />
                                    <div className="media-body">
                                        <h4 className="mt-0">
                                            {job.title}<span className="d-block mt-2" data-toggle="tooltip"
                                                data-placement="top" title="Tooltip on top">
                                            </span></h4>
                                        <div className="job-date-author">
                                            {
                                                job.created_at &&
                                                <>
                                                    {t('posted')} {timeSince(job.created_at)} {t('ago')}
                                                </>
                                            } {
                                                job?.company?.name &&
                                                <>
                                                    {t('by')} <span role="button" className="employer text-theme">{job.company?.name}</span>
                                                </>
                                            }
                                        </div>
                                        <div className="job-metas">
                                            <div className="job-location d-flex align-items-center">
                                                {
                                                    job.location &&
                                                    <p className="pr-4">
                                                       <GeoAltFill className="mr-1" />
                                                        <>
                                                            {job.location.street || t('no_street')}, {job.location.city || t('no_city')}, {job.location.state || t('no_state')}, {job.location.zip_code || t('no_zip')}
                                                        </>
                                                    </p>
                                                }
                                            </div>
                                            <p>< CurrencyDollar className="mr-1"/>{job.min_weekly_pay ? job.min_weekly_pay : 0} - {job.max_weekly_pay ? job.max_weekly_pay : 0} {t('per week')}</p>
                                        </div>
                                        <div className="job-metas">
                                            <div className="job-location">
                                                < Star className="mr-1"/><strong>
                                                    {job.description_short}
                                                </strong>
                                            </div>
                                        </div>

                                    </div>
                                    <Link href={`/jobs/${job.id}`}>
                                        <button type="button" className="btn btn-primary btn-sm">{t('browse_job')}</button>
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