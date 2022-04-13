
import { Row, Col, Table, Card, CardTitle, CardBody } from "reactstrap";
import LogoutButton from '../../../components/buttons/Logout';
import FullLayout from "../../../components/dashboard/layouts/Layout/FullLayout";
// import SalesChart from "../../components/dashboard/components/dashboard/SalesChart";
import Feeds from "../../../components/dashboard/components/dashboard/Feeds";
import ProjectTables from "../../../components/dashboard/components/dashboard/ProjectTable";
import TopCards from "../../../components/dashboard/components/dashboard/TopCards";
import Blog from "../../../components/dashboard/components/dashboard/Blog";
import bg1 from "../../../public/dashboard/assets/images/bg/bg1.jpg";
import bg2 from "../../../public/dashboard/assets/images/bg/bg2.jpg";
import bg3 from "../../../public/dashboard/assets/images/bg/bg3.jpg";
import bg4 from "../../../public/dashboard/assets/images/bg/bg4.jpg";
import JobList from "../../../public/dashboard/styles/css/JobList.module.css"
import Link from "next/link";
import useRedirect from '../../../hooks/useRedirect';
import { useEffect } from "react";
import useAuth from "../../../hooks/useAuth";
import { useState } from "react";
import axios from "axios";
import React from "react";
import { Chart } from "react-google-charts";
import LogoDark from "../../../public/dashboard/assets/images/bg/CTR-logo-cartoon_88.png";
import Image from "next/image";
import CompanyApi from "../../api/company";
import { useTranslation } from "react-i18next";
import { DriverLicenseType } from "../../../enums/drivers/driver-license-type.enum";
import { JobGeography } from "../../../enums/jobs/job-geography.enum";
import { JobSchedule } from "../../../enums/jobs/job-schedule.enum";
import { JobEmploymentType } from "../../../enums/jobs/job-employment-type.enum";
import { JobEquipmentType } from "../../../enums/jobs/job-equipment-type.enum";
import { JobDeliveryType } from "../../../enums/jobs/job-delivery-type.enum";
import { JobTeamDriver } from "../../../enums/jobs/job-team-driver.enum";
import { JobPayMethod } from "../../../enums/jobs/job-pay-method.enum";
import { JobBenefits } from "../../../enums/jobs/job-benefits.enum";
import { useRouter } from "next/router";

export const data = [
    [
        "Month",
        "Bolivia",
        "Ecuador",
        "Madagascar",
        "Papua New Guinea",
        "Rwanda",
        "Average",
    ],
    ["0", 165, 938, 522, 998, 450, 614.6],
    ["2", 135, 1120, 599, 1268, 288, 682],

];

export const options = {
    title: "",
    vAxis: { title: "" },
    hAxis: { title: "Applied Hired" },
    seriesType: "bars",
    series: { 5: { type: "line" } },
};

export default function JobListing() {

    const { authCompany } = useRedirect();

    authCompany()

    const { authCheck } = useAuth();

    const user = authCheck();
    const { t } = useTranslation();
    const router = useRouter()
    const [jobs, setJobs] = useState([])
    const [jobVisible, setJobVisible] = useState(false)

    const enumMap = (str, separator, EnumType) => {
        if (!str) {
            return
        }
        str = `${str}`
        const arr = str.split(separator)
        return arr.map(item => {
            return t(EnumType[item].toLowerCase())
        }).join(', ')
    }

    const fetchJobDetails = async (e) => {
        const jobId = e.target.getAttribute('data-item');
        const companyApi = new CompanyApi(user.company.id);
        let job = await companyApi.jobs.getById(jobId)
        console.log(job);
        setJobVisible(job)
    }

    useEffect(async () => {
        const companyApi = new CompanyApi(user.company.id);
        setJobs(await companyApi.jobs.get());
    }, []);

    useEffect(async () => {
        router.push("/dashboard/company/job-listing#jobDetailSection")
        // console.log(jobs);
        // console.log(jobVisible);
    }, [jobVisible]);

    return (
        <>
            <div className={JobList.joblisting}>

                <Row className={JobList.link}>
                    <Col sm="6" lg="8"> <h2>{t('JOB_LISTINGS')}</h2></Col>

                </Row>
                <Row className="mt-5">
                    <Col lg="12 ">
                        <Card className="job_listing">
                            <h3 className="mb-4">{t('basic')}</h3>
                            <CardBody className={JobList.jobtable}>
                                <div className="table-responsive">
                                    <Table striped>
                                        <thead className="listing_head">
                                            <tr>
                                                <th>{t('job_title')}</th>
                                                <th>{t('drivers_needed')}</th>
                                                <th>{t('expiration_date')}</th>
                                                <th>{t('geography')}</th>
                                                <th>{t('schedule')}</th>
                                                <th>{t('employment_type')}</th>
                                                <th>{t('equipment_type')}</th>
                                                <th>{t('delivery_type')}</th>
                                                <th>{t('team_drivers')}</th>
                                                <th></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                jobs &&
                                                jobs.map((job, index) => {
                                                    return <tr>
                                                        <td>{job.title} </td>
                                                        <td>{job.drivers_needed} </td>
                                                        <td>{job.expiry_date} </td>
                                                        <td>{job.geography && enumMap(job.geography, ",", JobGeography)} </td>
                                                        <td>{job.schedule && enumMap(job.schedule, ",", JobSchedule)}</td>
                                                        <td>{job.employment_type && enumMap(job.employment_type, ",", JobEmploymentType)}</td>
                                                        <td>{job.equipment_type && enumMap(job.equipment_type, ",", JobEquipmentType)}</td>
                                                        <td>{job.delivery_type && enumMap(job.delivery_type, ",", JobDeliveryType)}</td>
                                                        <td>{job.team_drivers && enumMap(job.team_drivers, ",", JobTeamDriver)}</td>
                                                        <td>
                                                            <span
                                                                role="button"
                                                                key={index} data-item={job.id} onClick={fetchJobDetails}
                                                                className="btn btn-link text-muted">
                                                                {t('view')}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                })
                                            }
                                        </tbody>
                                    </Table>
                                </div>
                                <Row className="py-4">
                                    <Col sm="6" lg="9">
                                        <nav aria-label="Page navigation example p-0">
                                            <ul className="pagination p-0">
                                                {/* <li className="page-item"><a className="page-link" href="#">Page 1</a></li> */}
                                            </ul>
                                        </nav>
                                    </Col>
                                    <Col sm="6" lg="3" className="mt-4 text-center" >
                                        <Link href="/dashboard/company/new-job">
                                            <a className={JobList.repost}>
                                                + {t('new_job')}
                                            </a>
                                        </Link>
                                    </Col>
                                </Row>
                            </CardBody>

                        </Card>
                    </Col>
                </Row>
            </div>



            {jobVisible &&
                <>
                    <div className={JobList.joblisting} id="jobDetailSection">
                        <Row className={JobList.link}>
                            <Col sm="6" lg="8"> <h2>{jobVisible.title}</h2></Col>
                        </Row>
                        <Row className="mt-5">
                            <Col lg="12 ">
                                <Card className="job_listing">
                                    <h3 className="mb-4">Benefits</h3>
                                    <CardBody className={JobList.jobtable}>
                                        <div className="table-responsive">
                                            <Table striped>
                                                <thead className="listing_head">
                                                    <tr>
                                                        <th>{t('pay_method')}</th>
                                                        <th>{t('min_pay_per_week')}</th>
                                                        <th>{t('max_pay_per_week')}</th>
                                                        <th>{t('benefits')}</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td>{jobVisible.pay_method && enumMap(jobVisible.pay_method, ",", JobPayMethod)} </td>
                                                        <td>{jobVisible.min_weekly_pay} </td>
                                                        <td>{jobVisible.max_weekly_pay} </td>
                                                        <td>{jobVisible.benefits && enumMap(jobVisible.benefits, ",", JobBenefits)} </td>
                                                    </tr>
                                                </tbody>
                                            </Table>
                                        </div>
                                    </CardBody>

                                </Card>
                            </Col>
                        </Row>
                    </div>

                    {/* <div className={JobList.joblisting}>
                        <Row className="mt-5">
                            <Col lg="12 ">
                                <Card className="job_listing">
                                    <h3 className="mb-4">Vehicle Info</h3>
                                    <CardBody className={JobList.jobtable}>
                                        <div className="table-responsive">
                                            <Table striped>
                                                <thead className="listing_head">
                                                    <tr>
                                                        <th>Vehicle 1</th>
                                                        <th></th>
                                                        <th></th>
                                                        <th></th>
                                                        <th></th>
                                                        <th>Vehicle 2</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td>
                                                            Kenworth
                                                        </td>
                                                        <td>
                                                            Manual
                                                        </td>
                                                        <td>
                                                            Sleeper

                                                        </td>
                                                        <td>
                                                            2019
                                                        </td>
                                                        <td className={JobList.img}>
                                                            <Image src={LogoDark} alt="logo" />
                                                        </td>
                                                        <td>
                                                            Kenworth
                                                        </td>
                                                        <td>
                                                            Automatic
                                                        </td>
                                                        <td>
                                                            Day Cab
                                                        </td>
                                                        <td>
                                                            2018
                                                        </td>
                                                        <td className={JobList.img}>
                                                            <Image src={LogoDark} alt="logo" />
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            Kenworth
                                                        </td>
                                                        <td>
                                                            Manual
                                                        </td>
                                                        <td>
                                                            Sleeper

                                                        </td>
                                                        <td>
                                                            2019
                                                        </td>
                                                        <td className={JobList.img}>
                                                            <Image src={LogoDark} alt="logo" />
                                                        </td>
                                                        <td>
                                                            Kenworth
                                                        </td>
                                                        <td>
                                                            Automatic
                                                        </td>
                                                        <td>
                                                            Day Cab
                                                        </td>
                                                        <td>
                                                            2018
                                                        </td>
                                                        <td className={JobList.img}>
                                                            <Image src={LogoDark} alt="logo" />
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            Kenworth
                                                        </td>
                                                        <td>
                                                            Manual
                                                        </td>
                                                        <td>
                                                            Sleeper

                                                        </td>
                                                        <td>
                                                            2019
                                                        </td>
                                                        <td className={JobList.img}>
                                                            <Image src={LogoDark} alt="logo" />
                                                        </td>
                                                        <td>
                                                            Kenworth
                                                        </td>
                                                        <td>
                                                            Automatic
                                                        </td>
                                                        <td>
                                                            Day Cab
                                                        </td>
                                                        <td>
                                                            2018
                                                        </td>
                                                        <td className={JobList.img}>
                                                            <Image src={LogoDark} alt="logo" />
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </Table>
                                        </div>
                                        <Row className="py-4">
                                            <Col sm="6" lg="9">
                                                <nav aria-label="Page navigation example p-0">
                                                    <ul className="pagination p-0">
                                                        <li className="page-item"><a className="page-link" href="#">Page 1</a></li>
                                                    </ul>
                                                </nav>
                                            </Col>
                                            <Col sm="6" lg="3" className="mt-4 text-center" >
                                                <Link href="/dashboard/company/new-job">
                                                    <a className={JobList.repost}>
                                                        + New Job
                                                    </a>
                                                </Link>
                                            </Col>
                                        </Row>
                                    </CardBody>

                                </Card>
                            </Col>
                        </Row>
                    </div> */}


                    <div className={JobList.joblisting}>
                        <Row className="mt-5">
                            <Col lg="12 ">
                                <Card className="job_listing">
                                    <h3 className="mb-4">{t('requirements')}</h3>
                                    <CardBody className={JobList.jobtable}>
                                        <div className="table-responsive">
                                            <Table striped className={JobList.req_table}>
                                                <thead className="listing_head">
                                                    <tr>
                                                        <th>{t('cdl_class_type')}</th>
                                                        <th>{t('min_years_experience')}</th>
                                                        <th>{t('min_degree')}</th>
                                                        <th>{t('required_skills')}</th>
                                                        {/* <th>Equipment Requirements (for owner operators)</th>
                                                        <th>Endorsements</th>
                                                        <th>Transmission Type Experience:</th>
                                                        <th>Driver Radius</th>
                                                        <th>Must Pass Drug Test?</th>
                                                        <th>MVR Requirements</th>
                                                        <th>Accepting SAP Graduates?</th>
                                                        <th>Criminal History in last 3 years?</th>
                                                        <th>Accidents within the last 5 years:</th> */}
                                                        {/* <th>Other Safety Requirements:</th> */}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td>{jobVisible.cdl_class && enumMap(jobVisible.cdl_class, ",", DriverLicenseType)}</td>
                                                        <td>{jobVisible.min_years_experience} </td>
                                                        <td>{jobVisible.min_degree} </td>
                                                        <td>{jobVisible.required_skills_other} </td>
                                                    </tr>
                                                </tbody>
                                            </Table>
                                        </div>
                                    </CardBody>

                                </Card>
                            </Col>
                        </Row>
                        {/* <div className={JobList.job__overview}>
                            <Row>

                                <Col className="p-0" lg="2">
                                    <div className={JobList.job__overview__header}>
                                        <h3>Job Summary</h3>
                                    </div>
                                    <div className={JobList.job__overview__body}>
                                        <p className="p-3">Hi we’re a general freight hauler looking for a dedicated OTR CDL Class A Driver. We offer great pay with flexible dispatch and home time. Reach out to us today if you’re interested in hauling across the country on good loads that pay well.</p>
                                        <div className="space_6"></div>
                                        <Row className="">
                                            <Col className="text-end"><input className={JobList.edit__btn}
                                                type="button"
                                                value="Edit"></input></Col>
                                        </Row>

                                    </div>

                                </Col>

                                <Col className="p-0" lg="4">
                                    <div className={JobList.job__overview__detail}>
                                        <div className={JobList.job__overview__header}>
                                            <h3>Detail</h3>
                                        </div>
                                        <div className={JobList.job__body}>
                                            <Row className="p-3">
                                                <Col >
                                                    <p>CD Type Position</p>
                                                </Col>
                                                <Col>
                                                    <p>Class A</p>
                                                </Col>
                                                <Col>
                                                    <p>MVR:</p>

                                                </Col>
                                                <Col>
                                                    <p>Clean MVR:</p>

                                                </Col>

                                            </Row>
                                        </div>
                                        <div className={JobList.job__body}>
                                            <Row className="p-3">
                                                <Col>

                                                    <p>:</p>
                                                </Col>
                                                <Col>
                                                    <p>Solo</p>
                                                </Col>
                                                <Col>
                                                    <p>State(s):</p>

                                                </Col>
                                                <Col>
                                                    <p>Georgia</p>

                                                </Col>
                                            </Row>
                                        </div>
                                        <div className={JobList.job__body}>
                                            <Row className="p-3">
                                                <Col>

                                                    <p>Statis</p>
                                                </Col>
                                                <Col>
                                                    <p>Solo</p>
                                                </Col>
                                                <Col>
                                                    <p>State(s):</p>

                                                </Col>
                                                <Col>
                                                    <p>Georgia</p>

                                                </Col>
                                            </Row>
                                        </div>
                                        <div className={JobList.job__body}>
                                            <Row className="p-3">
                                                <Col>

                                                    <p>Geography</p>
                                                </Col>
                                                <Col>
                                                    <p>Solo</p>
                                                </Col>
                                                <Col>
                                                    <p>State(s):</p>

                                                </Col>
                                                <Col>
                                                    <p>Georgia</p>

                                                </Col>
                                            </Row>
                                            <Row className="spacer">
                                                <Col className="text-end"><input className={JobList.edit__btn}
                                                    type="button"
                                                    value="Edit"></input></Col>
                                            </Row>

                                        </div>
                                    </div>
                                </Col>

                                <Col className="p-0" lg="2">
                                    <div className={JobList.job__overview__header}>
                                        <h3 >Total Hires</h3>
                                    </div>
                                    <div className={JobList.job__overview__body}>
                                        <p className="p-3">Days active:  12</p>
                                        <p className="p-3">Days active:  12</p>
                                        <p className="p-3">Days active:  12</p>
                                        <p className="p-3">Days active:  12</p>
                                        <div className="space_35"></div>
                                    </div>
                                </Col>
                                <Col className="p-0" lg="2">
                                    <div className={JobList.job__overview__header}>
                                        <h3>Historical</h3>

                                    </div>
                                    <Chart
                                        chartType="ComboChart"
                                        width="100%"
                                        height="350px"
                                        data={data}
                                        options={options}
                                    />
                                </Col>
                                <Col className="p-0" lg="2">
                                    <div className={JobList.job__overview__header}>
                                        <h3>Analyze Performance</h3>
                                    </div>
                                    <div className={JobList.status_job__body}>
                                        <Col sm="6" lg="2">
                                            <input className={JobList.status__btn}
                                                type="button"
                                                value="View Stats "></input>
                                        </Col>
                                    </div>
                                </Col>

                            </Row>
                            <Row>
                                <Col className="text-center mt-5">
                                    <input className={JobList.status__btn}
                                        type="button"
                                        value="View Public Posting
"></input>
                                </Col>
                            </Row>
                        </div> */}
                    </div>
                </>
            }

        </>
    )

};

JobListing.getLayout = function getLayout(page) {
    return (
        <FullLayout>
            {page}
        </FullLayout>
    )
}
