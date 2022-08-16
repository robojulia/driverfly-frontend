import timeSince from "../../utils/timeSince"
import Link from "next/link"
import { useTranslation } from "../../hooks/useTranslation"
import CompanyPhoto from "../jobs/company-photo";
import { GeoAltFill, CurrencyDollar, Star } from 'react-bootstrap-icons';
import { buildAddress } from "../../utils/common";
import { JobEntity } from "../../models/job/job.entity";
import { Col, Row } from "react-bootstrap";

export interface RelatedJobsProps {
    jobs: JobEntity[];
}

export default function RelatedJobs({ jobs }: RelatedJobsProps) {
    const { t } = useTranslation();

    return (
        <>
            <div className="related-job-sec">
                <h3>{t('related_jobs')}</h3>

                <Row className="mt-3">
                    <Col>
                        {
                            jobs.length > 0 ?
                                jobs.map((job, index) => {
                                    return <div key={index} className="media align-items-center ">
                                        <CompanyPhoto className="d-flex mr-4 truck-img" company={job.company} />
                                        <div className="media-body">
                                            <Link href={`/jobs/${job.id}/${job.slug}`}>
                                                <a className="text-decoration-none">
                                                    <h4 className="mt-0">{job.title}</h4>
                                                </a>
                                            </Link>
                                            <div className="job-date-author">
                                                {
                                                    job.created_at &&
                                                    <>
                                                        {t('posted')} {timeSince(job.created_at)} {t('ago')}
                                                    </>
                                                } {
                                                    job?.company?.name &&
                                                    <>
                                                        {t('by')} <Link href={`/employer/${job.company?.id}`}>
                                                            <span role="button" className="employer text-theme">{job.company?.name}</span>
                                                        </Link>
                                                    </>
                                                }
                                            </div>
                                            <div className="job-metas">
                                                <div className="job-location d-flex align-items-center">
                                                    {
                                                        job.location &&
                                                        <p className="pr-4">
                                                            {/* <GeoAltFill className="mr-1" /> */}
                                                            {buildAddress(job.location)}
                                                        </p>
                                                    }
                                                </div>
                                                <p>< CurrencyDollar className="mr-1" />{job.min_weekly_pay ? job.min_weekly_pay : 0} - {job.max_weekly_pay ? job.max_weekly_pay : 0} {t('per week')}</p>
                                            </div>
                                            <div className="job-metas">
                                                <div className="job-location">
                                                    < Star className="mr-1" /><strong>
                                                        {job.description_short}
                                                    </strong>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                })
                                :
                                <div className="media align-items-center">
                                    {t("NO_RELATED_JOBS_YET")}
                                </div>
                        }
                    </Col>
                </Row>
            </div>
        </>
    )
}