import { Row, Col, Container } from "reactstrap";
import { toast } from "react-toastify";
import { globalAjaxExceptionHandler } from "../../utils/ajax";
import { buildAddress } from "../../utils/common";
import CompanyPhoto from './company-photo'
import { useState } from "react"
import { useTranslation } from "../../hooks/use-translation";
import { useEffectAsync } from "../../utils/react";

import JobApi from "../../pages/api/job";
import { JobEntity } from "../../models/job/job.entity";
import Link from "next/link";
import { Pagination } from "../../types/pagination.type";

export default function RecentJobs() {
    const [jobs, setJobs] = useState<JobEntity[]>([]);
    const { t } = useTranslation();

    useEffectAsync(async () => {
        const api = new JobApi();

        try {
            const { items } = await api.search({ take: 6, order_by: "DESC" }) as Pagination<JobEntity>;
            setJobs(items);
        }
        catch (e) {
            globalAjaxExceptionHandler(e, { t: t, toast: toast });
        }
    }, []);


    return (
        <section className="mt-5">
            <Container>
                <div className="bs-example">
                    <div className="tab-content">
                        <div className="tab-pane fade show active" id="home">
                            <Row>
                                {jobs.length > 0 && jobs.map((job, index) => (
                                    <Col md="6" key={job.id}>
                                        <div className="media align-items-center single-job-items ">
                                            <CompanyPhoto className="d-flex mr-4 truck-img border-0" job={job} company={job.company} />
                                            <div className="media-body">
                                                <h6>{t("RECENT_JOBS")}</h6>
                                                <Link href={`/jobs/${job.id}/${job.slug}`}>
                                                    <a className='text-decoration-none '>
                                                        <h4 className="mt-0"> {job.title?.length > 30 ? job.title.slice(0, 30) + '...' : job.title}</h4>
                                                    </a>
                                                </Link>
                                                {job.company?.name && (
                                                    <div className="job-company">
                                                        <span>{job.company.name}</span>
                                                    </div>
                                                )}
                                                <div className="job-metas">
                                                    <div className="job-location">
                                                        <strong>{buildAddress(job.location)}</strong>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Col>
                                ))}
                            </Row>
                        </div>
                    </div>
                </div>
            </Container>
        </section>
    )
}