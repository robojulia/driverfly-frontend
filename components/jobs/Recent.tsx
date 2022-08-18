import { Row, Col, Table, Card, CardTitle, CardBody } from "reactstrap";
import { toast } from "react-toastify";
import { globalAjaxExceptionHandler } from "../../utils/ajax";
import { buildAddress } from "../../utils/common";

import { useState } from "react"
import { useTranslation } from "../../hooks/useTranslation";
import { useEffectAsync } from "../../utils/react";

import JobApi from "../../pages/api/job";

import { JobEntity } from "../../models/job/job.entity";

export default function RecentJobs() {
    const [jobs, setJobs] = useState<JobEntity[]>([]);
    const { t } = useTranslation();

    useEffectAsync(async () => {
        const api = new JobApi();

        try {
            const { items } = await api.search({ take: 5 });
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
                                                <img className="d-flex mr-4 truck-img border-0 " src="img/CTR-logo-cartoon.png" width="100" height="75" alt="" />
                                                <div className="media-body">

                                                    <span className="urgent">URGENT</span>
                                                    <h6>Featured Jobs</h6>
                                                    <h4 className="mt-0">{job.title}<span className="d-block" data-toggle="tooltip"
                                                        data-placement="top" title="Tooltip on top"> <i className="fa fa-star" aria-hidden="true"></i> </span></h4>
                                                    <div className="job-metas">
                                                        <div className="job-location">
                                                            <strong>{buildAddress(job.location)}</strong>
                                                        </div>
                                                    </div>

                                                </div>
                                            </div>


                                        </div>
                                    ))}
                                    <div className="col-md-6">
                                        <div className="media align-items-center ">
                                            <img className="d-flex mr-4 truck-img border-0 " src="img/CTR-logo-cartoon.png" width="100" height="75" alt="" />
                                            <div className="media-body">
                                                <span className="urgent">URGENT</span>
                                                <h6>Solo</h6>
                                                <h4 className="mt-0">Class A CDL OTR Truck Drivers (W-2) <span className="" data-toggle="tooltip"
                                                    data-placement="top" title="Tooltip on top"> <i className="fa fa-star" aria-hidden="true"></i> </span></h4>
                                                <div className="job-metas">
                                                    <div className="job-location">
                                                        <strong>Custom Trucker Recruiting</strong>
                                                    </div>
                                                    <div className="job-location">
                                                        <i className="fa fa-map-marker mr-1" aria-hidden="true"></i>Burnsville, MN
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="media align-items-center ">
                                            <img className="d-flex mr-4 truck-img border-0 " src="img/CTR-logo-cartoon.png" width="100" height="75" alt="" />
                                            <div className="media-body">
                                                <span className="urgent">URGENT</span>
                                                <h6>Solo</h6>
                                                <h4 className="mt-0">OTR General Freight Drivers  <span className="" data-toggle="tooltip"
                                                    data-placement="top" title="Tooltip on top"> <i className="fa fa-star" aria-hidden="true"></i> </span></h4>
                                                <div className="job-metas">
                                                    <div className="job-location">
                                                        <strong>Custom Trucker Recruiting</strong>
                                                    </div>
                                                    <div className="job-location">
                                                        <i className="fa fa-map-marker mr-1" aria-hidden="true"></i>Dallas, TX
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="media align-items-center ">
                                            <img className="d-flex mr-4 truck-img border-0 " src="img/ACWNCW-logo_PNG.jpg" width="100" height="75" alt="" />
                                            <div className="media-body">
                                                <span className="urgent">URGENT</span>
                                                <h6>Solo</h6>
                                                <h4 className="mt-0">CDL-A Home Daily – Roll Off Container Trucks <span className="d-block" data-toggle="tooltip"
                                                    data-placement="top" title="Tooltip on top"> <i className="fa fa-star" aria-hidden="true"></i> </span></h4>
                                                <div className="job-metas">
                                                    <div className="job-location">
                                                        <strong>National Concrete Washout</strong>
                                                    </div>
                                                    <div className="job-location">
                                                        <i className="fa fa-map-marker mr-1" aria-hidden="true"></i>Bloomington, CA and Fort Worth, TX
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="media align-items-center ">
                                            <img className="d-flex mr-4 truck-img border-0 " src="img/CTR-logo-cartoon.png" width="100" height="75" alt="" />
                                            <div className="media-body">
                                                <span className="urgent">URGENT</span>
                                                <h6>Solo</h6>
                                                <h4 className="mt-0">Class A CDL drivers – 1099 OTR position  <span className="" data-toggle="tooltip"
                                                    data-placement="top" title="Tooltip on top"> <i className="fa fa-star" aria-hidden="true"></i> </span></h4>
                                                <div className="job-metas">
                                                    <div className="job-location">
                                                        <strong>Keys Transportation LLC</strong>
                                                    </div>
                                                    <div className="job-location">
                                                        <i className="fa fa-map-marker mr-1" aria-hidden="true"></i>Fontana, CA (LA area), Sumner, WA(Seattle area)
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="media align-items-center ">
                                            <img className="d-flex mr-4 truck-img border-0 " src="img/CTR-logo-cartoon.png" width="100" height="75" alt="" />
                                            <div className="media-body">
                                                <span className="urgent">URGENT</span>
                                                <h6>Solo</h6>
                                                <h4 className="mt-0">CDL-A Semi Truck OTR, No Touch Freight, Live Load/Unload <span className="d-block" data-toggle="tooltip"
                                                    data-placement="top" title="Tooltip on top"> <i className="fa fa-star" aria-hidden="true"></i> </span></h4>
                                                <div className="job-metas">
                                                    <div className="job-location">
                                                        <strong>Custom Trucker Recruiting</strong>
                                                    </div>
                                                    <div className="job-location">
                                                        <i className="fa fa-map-marker mr-1" aria-hidden="true"></i>Atlanta, GA
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                            <div className="tab-pane fade" id="profile">
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="media align-items-center ">
                                            <img className="d-flex mr-4 truck-img border-0 " src="img/CTR-logo-cartoon.png" width="100" height="75" alt="" />
                                            <div className="media-body">
                                                <span className="urgent">URGENT</span>
                                                <h6>Solo</h6>
                                                <h4 className="mt-0">CDL-A Regional/OTR – No Touch Freight, Live Load/Unload<span className="d-block" data-toggle="tooltip"
                                                    data-placement="top" title="Tooltip on top"> <i className="fa fa-star" aria-hidden="true"></i> </span></h4>
                                                <div className="job-metas">
                                                    <div className="job-location">
                                                        <strong>Custom Trucker Recruiting</strong>
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="media align-items-center ">
                                            <img className="d-flex mr-4 truck-img border-0 " src="img/CTR-logo-cartoon.png" width="100" height="75" alt="" />
                                            <div className="media-body">
                                                <span className="urgent">URGENT</span>
                                                <h6>Solo</h6>
                                                <h4 className="mt-0">Class A CDL OTR Truck Drivers (W-2) <span className="" data-toggle="tooltip"
                                                    data-placement="top" title="Tooltip on top"> <i className="fa fa-star" aria-hidden="true"></i> </span></h4>
                                                <div className="job-metas">
                                                    <div className="job-location">
                                                        <strong>Custom Trucker Recruiting</strong>
                                                    </div>
                                                    <div className="job-location">
                                                        <i className="fa fa-map-marker mr-1" aria-hidden="true"></i>Burnsville, MN
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="media align-items-center ">
                                            <img className="d-flex mr-4 truck-img border-0 " src="img/CTR-logo-cartoon.png" width="100" height="75" alt="" />
                                            <div className="media-body">
                                                <span className="urgent">URGENT</span>
                                                <h6>Solo</h6>
                                                <h4 className="mt-0">OTR General Freight Drivers  <span className="" data-toggle="tooltip"
                                                    data-placement="top" title="Tooltip on top"> <i className="fa fa-star" aria-hidden="true"></i> </span></h4>
                                                <div className="job-metas">
                                                    <div className="job-location">
                                                        <strong>Custom Trucker Recruiting</strong>
                                                    </div>
                                                    <div className="job-location">
                                                        <i className="fa fa-map-marker mr-1" aria-hidden="true"></i>Dallas, TX
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="media align-items-center ">
                                            <img className="d-flex mr-4 truck-img border-0 " src="img/ACWNCW-logo_PNG.jpg" width="100" height="75" alt="" />
                                            <div className="media-body">
                                                <span className="urgent">URGENT</span>
                                                <h6>Solo</h6>
                                                <h4 className="mt-0">CDL-A Home Daily – Roll Off Container Trucks <span className="d-block" data-toggle="tooltip"
                                                    data-placement="top" title="Tooltip on top"> <i className="fa fa-star" aria-hidden="true"></i> </span></h4>
                                                <div className="job-metas">
                                                    <div className="job-location">
                                                        <strong>National Concrete Washout</strong>
                                                    </div>
                                                    <div className="job-location">
                                                        <i className="fa fa-map-marker mr-1" aria-hidden="true"></i>Bloomington, CA and Fort Worth, TX
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="media align-items-center ">
                                            <img className="d-flex mr-4 truck-img border-0 " src="img/CTR-logo-cartoon.png" width="100" height="75" alt="" />
                                            <div className="media-body">
                                                <span className="urgent">URGENT</span>
                                                <h6>Solo</h6>
                                                <h4 className="mt-0">Class A CDL drivers – 1099 OTR position  <span className="" data-toggle="tooltip"
                                                    data-placement="top" title="Tooltip on top"> <i className="fa fa-star" aria-hidden="true"></i> </span></h4>
                                                <div className="job-metas">
                                                    <div className="job-location">
                                                        <strong>Keys Transportation LLC</strong>
                                                    </div>
                                                    <div className="job-location">
                                                        <i className="fa fa-map-marker mr-1" aria-hidden="true"></i>Fontana, CA (LA area), Sumner, WA(Seattle area)
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="media align-items-center ">
                                            <img className="d-flex mr-4 truck-img border-0 " src="img/CTR-logo-cartoon.png" width="100" height="75" alt="" />
                                            <div className="media-body">
                                                <span className="urgent">URGENT</span>
                                                <h6>Solo</h6>
                                                <h4 className="mt-0">CDL-A Semi Truck OTR, No Touch Freight, Live Load/Unload <span className="d-block" data-toggle="tooltip"
                                                    data-placement="top" title="Tooltip on top"> <i className="fa fa-star" aria-hidden="true"></i> </span></h4>
                                                <div className="job-metas">
                                                    <div className="job-location">
                                                        <strong>Custom Trucker Recruiting</strong>
                                                    </div>
                                                    <div className="job-location">
                                                        <i className="fa fa-map-marker mr-1" aria-hidden="true"></i>Atlanta, GA
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}