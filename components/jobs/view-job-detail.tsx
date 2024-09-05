import Link from 'next/link';
import React from 'react';
import { Button, Col, Container, Row } from 'react-bootstrap';
import { ArrowRight, CurrencyDollar } from "react-bootstrap-icons";
import { useAuth } from '../../hooks/use-auth';
import { useTranslation } from '../../hooks/use-translation';
import { ViewJobDetailProps } from '../../types/job/view-job-detail-props.type';
import { buildAddress } from '../../utils/common';
import JobApply from '../apply';
import SaveJob from '../dashboard/driver/save-job';
import FlagJob from '../flag/flag-a-job';
import JobDescription from '../job-description/job-description';
import JonInformation from '../job-information-sidebar/job-information';
import ViewModal from '../view-details/view-modal';
import CompanyPhoto from './company-photo';
import JobVehicles from './job-vehicles';
import ShowFormattedDate from './show-formatted-date';

export default function ViewJobDetail(props: ViewJobDetailProps) {

    const {
        className,
        job,
        relatedJobs,
        canApply,
        canSave,
        hideVehicles,
        viewAllJobsLink,
        hideCompanyName,
        hideSocialLinks,
        quick_apply
    } = props

    const { t } = useTranslation();
    const [encourageModal, setEncourageModal] = React.useState(false)
    const { user, company } = useAuth();

    return (
        <section className="top-links-sec ort-general p-3 vehicle-img">

            <FlagJob jobId={job.id} />

            <Container className='p-0'>
                <Row>
                    <Col md={9}>
                        <div className="ort-inner ">
                            <div className=" company_photo media align-items-center bg-transparent border-0 p-0">
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
                                        <ShowFormattedDate
                                            date={job.created_at}
                                            showTimeSince
                                            labelPrefix="POSTED"
                                            labelPostfix='AGO'
                                        />
                                        {
                                            (!!!hideCompanyName && job.company?.name) &&
                                            <>
                                                {t('BY')} <Link href={`/employer/${job?.company?.slug}`}>
                                                    <span role="button" className="employer text-theme">{job?.company?.name}</span>
                                                </Link>
                                            </>
                                        }
                                    </div>
                                    <div className="job-metas">
                                        <div className="job-location d-flex align-items-center">
                                            <p className="pr-4 m-0">{buildAddress(job.location)}</p>
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
                        {!!quick_apply
                            ? <div className="ort-btn mt-lg-4 mt-0">
                                <Link href={`/apply/suggested-job/${quick_apply}/${job.id}`}>
                                    <button type="button" className="btn theme-primary-btn" > {t('QUICK_APPLY')}<ArrowRight /></button>
                                </Link>
                            </div>
                            : !company?.id && canApply && <JobApply setEncourageModal={setEncourageModal} job={job} />
                        }
                        {!company?.id && canSave && <SaveJob job={job} />}
                    </Col>
                </Row>
            </Container>

            <div className="job-deatails-sec">
                <Container className='p-0'>
                    <Row>
                        <Col lg={8}>
                            < JobDescription job={job} />
                            {!!!hideVehicles && < JobVehicles job={job} />}
                            {/* {!!!hideSocialLinks && < SocilShare />} */}
                            {relatedJobs || <></>}
                        </Col>
                        <Col lg={4}>
                            < JonInformation job={job} />
                        </Col>
                    </Row>
                </Container>
            </div>
            <ViewModal
                show={user == null && encourageModal == true}
                closeText="CANCEL"
            >
                <>
                    <Row >
                        <p className='d-flex justify-content-center align-items-center text-green-500' style={{ color: "green" }}>
                            <b>
                                {t('CONGRATS_ON_APPLYING')}
                            </b>
                        </p>
                    </Row>
                    <Row >
                        <div className='mb-2 d-flex justify-content-center align-items-center'>
                            <Button href='/signup'>
                                {t('PLEASE_PROCEED_WITH_REGISTRATION')}
                            </Button>
                        </div>
                    </Row>
                    <Row>
                        <div className='mt-2 d-flex justify-content-center align-items-center'>
                            <p>
                                <b>
                                    {t('GET_REGISTERED_MESSAGE_QUICK_APPLY')}
                                </b>
                            </p>
                        </div>
                    </Row>
                </>
            </ViewModal>
        </section>
    )
}
