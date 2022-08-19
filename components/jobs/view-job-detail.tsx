import Link from 'next/link'
import { Col, Container, Row } from 'react-bootstrap';
import { ArrowRight, CurrencyDollar } from "react-bootstrap-icons"
import { useTranslation } from '../../hooks/useTranslation';
import { JobEntity } from "../../models/job/job.entity";
import { buildAddress } from '../../utils/common';
import timeSince from '../../utils/timeSince';
import JobApply from '../apply';
import SaveJob from '../dashboard/driver/save-job';
import JobDescription from '../job-description/JobDescription';
import JonInformation from '../job-information-sidebar/JobInformation';
import RelatedJobs from '../related-jobs/Related-Jobs';
import SocilShare from '../share-link/ShareLink';
import CompanyPhoto from './company-photo';
import JobVehicles from './job-vehicles';

export interface ViewJobDetailProps {
    job: JobEntity;
    relatedJobs?: JobEntity[];
    canApply?: boolean | (() => boolean);
    canSave?: boolean | (() => boolean);
    hideVehicles?: boolean | (() => boolean);
    hideCompanyName?: boolean | (() => boolean);
    viewAllJobsLink?: string;
}


export default function ViewJobDetail({ job, relatedJobs, canApply, canSave, hideVehicles, viewAllJobsLink, hideCompanyName }: ViewJobDetailProps) {

    const { t } = useTranslation();
    console.log(job);

    return (
        <section className="top-links-sec ort-general">
            <Container>
                <Row>
                    <Col md={9}>
                        <div className="ort-inner">
                            <div className="media align-items-center bg-transparent border-0 p-0">
                                <span className="text-dark text-center text-decoration-none">
                                    <CompanyPhoto className="d-flex mr-4 truck-img mb-3" company={job.company} />
                                    {viewAllJobsLink &&
                                        <Link href={viewAllJobsLink}>
                                            <a style={{ color: "black" }}>
                                                {t('view_all_jobs')} <ArrowRight className="pl-1" />
                                            </a>
                                        </Link>
                                    }
                                </span>
                                <div className="media-body">
                                    <h4 className="mt-0">
                                        {job.title}
                                    </h4>
                                    <div className="job-date-author">
                                        {
                                            job.created_at && <span>{t('POSTED')} {timeSince(job.created_at)} {t('AGO')}</span>
                                        } {
                                            (!!!hideCompanyName && job.company?.name) &&
                                            <>
                                                {t('BY')} <Link href={`/employer/${job.company?.id}`}>
                                                    <span role="button" className="employer text-theme">{job.company?.name}</span>
                                                </Link>
                                            </>
                                        }
                                    </div>
                                    <div className="job-metas">
                                        <div className="job-location d-flex align-items-center">
                                            <p className="pr-4">{buildAddress(job.location)}</p>
                                        </div>
                                        <div >
                                            <p><CurrencyDollar />{job.min_weekly_pay || 0} - {job.max_weekly_pay || 0} {t('PER_WEEK')}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Col>
                    <Col md={3}>
                        {canApply && <JobApply job={job} />}
                        {canSave && <SaveJob job={job} />}
                    </Col>
                </Row>
            </Container>

            <div className="job-deatails-sec">
                <Container>
                    <Row>
                        <Col lg={8}>
                            < JobDescription job={job} />
                            {!!!hideVehicles && < JobVehicles job={job} />}
                            < SocilShare />
                            {relatedJobs && < RelatedJobs jobs={relatedJobs} />}
                        </Col>
                        <Col lg={4}>
                            < JonInformation job={job} />
                        </Col>
                    </Row>
                </Container>
            </div>
        </section>
    )
}
