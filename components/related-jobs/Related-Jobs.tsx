import timeSince from "../../utils/timeSince"
import Link from "next/link"
import { useTranslation } from "../../hooks/useTranslation"
import CompanyPhoto from "../jobs/company-photo.js";
import { CurrencyDollar } from 'react-bootstrap-icons';
import { buildAddress } from "../../utils/common";
import { JobEntity } from "../../models/job/job.entity";
import { Col, Row } from "react-bootstrap";
import ShowFormattedDate from "../jobs/show-formatted-date";

export interface RelatedJobsProps {
    jobs: JobEntity[];
    jobLink?: string;
    hideCompanyName?: boolean | (() => boolean);
    jobLinkSlugable?: boolean | (() => boolean);
}

export default function RelatedJobs({ jobs, jobLink, hideCompanyName, jobLinkSlugable }: RelatedJobsProps) {
    const { t } = useTranslation();

    return (
        <div className="related-job-sec">
            <h3>{t('related_jobs')}</h3>

            <Row className="mt-3">
                <Col>
                    {
                        jobs.length > 0 ?
                            jobs.map((job, index) => (
                                <div key={index} className="media align-items-center ">
                                    <CompanyPhoto className="d-flex mr-4 truck-img" company={job.company} />
                                    <div className="media-body">
                                        <Link href={`/${jobLink || 'jobs'}/${job.id}/${jobLinkSlugable ? job.slug : ''}`}>
                                            <a className="text-decoration-none">
                                                <h4 className="mt-0">{job.title}</h4>
                                            </a>
                                        </Link>
                                        <div className="job-date-author">
                                            <ShowFormattedDate
                                                date={job.created_at}
                                                showTimeSince
                                                labelPrefix="POSTED"
                                                labelPostfix='AGO'
                                            />
                                            {
                                                (!!!hideCompanyName && job.company?.name) &&
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
                                                        {buildAddress(job.location)}
                                                    </p>
                                                }
                                            </div>
                                            <p>< CurrencyDollar className="mr-1" />{job.min_weekly_pay ? job.min_weekly_pay : 0} - {job.max_weekly_pay ? job.max_weekly_pay : 0} {t('per week')}</p>
                                        </div>
                                        <div className="job-metas">
                                            <div className="job-location">
                                                <strong>
                                                    {job.description_short}
                                                </strong>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                            :
                            <div className="media align-items-center">
                                {t("NO_RELATED_JOBS_YET")}
                            </div>
                    }
                </Col>
            </Row>
        </div>
    )
}