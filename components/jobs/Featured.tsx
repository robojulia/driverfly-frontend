import { Row, Col, Table, Card, CardTitle, CardBody } from "reactstrap";
import { toast } from "react-toastify";
import { globalAjaxExceptionHandler } from "../../utils/ajax";
import { buildAddress } from "../../utils/common";
import CompanyPhoto from '../jobs/company-photo'
import { useState } from "react"
import { useTranslation } from "../../hooks/useTranslation";
import { useEffectAsync } from "../../utils/react";

import JobApi from "../../pages/api/job";

import { JobEntity } from "../../models/job/job.entity";
import Link from "next/link";

export default function FeaturedJobs() {
    const { t } = useTranslation();
    const [jobs, setJobs] = useState<JobEntity[]>([]);
    useEffectAsync(async () => {
        const api = new JobApi();

        try {
            const { items } = await api.search({ take: 6 });
            setJobs(items);
        }
        catch (e) {
            globalAjaxExceptionHandler(e, { t: t, toast: toast });
        }
    }, []);

    return (
        <>
            <section className="tab-sec">
                <div className="container">
                    <div className="bs-example">
                        <div className="tab-content">
                            <div className="tab-pane fade show active" id="home">
                                <div className="row">
                                    {jobs.length > 0 && jobs.map((job, index) => (
                                        <div key={job.id} className="col-md-6">
                                            <div className="media align-items-center ">
                                                <CompanyPhoto className="d-flex mr-4 truck-img border-0" job={job} company={job.company} />
                                                <div className="media-body">
                                                    <span className="urgent">{t("URGENT")}</span>
                                                    <h6>{t("FEATURED_JOBS")}</h6>
                                                    <Link href={`/jobs/${job.id}/${job.slug}`}>
                                                        <a className='text-decoration-none '>
                                                            <h4 className="mt-0">{job.title}<span className="d-block" data-toggle="tooltip"
                                                                data-placement="top" title="Tooltip on top"> <i className="fa fa-star" aria-hidden="true"></i> </span></h4>
                                                        </a>
                                                    </Link>
                                                    <div className="job-metas">
                                                        <div className="job-location">
                                                            <strong>{buildAddress(job.location)}</strong>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}