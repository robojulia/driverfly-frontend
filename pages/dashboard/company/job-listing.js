
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

    const [jobs, setJobs] = useState([])

    const fetchJobs = () => {

        const headers = {
            'Authorization': `Bearer ${user.token}`,
        };

        axios.get(
            `${process.env.BASE_URL_API}/jobs/`,
            { headers: headers }
        )
            .then(data => {
                setJobs(data.data)
            })
            .catch(function (error) {
            }).then(function () {
            })
    }

    useEffect(() => {
        fetchJobs()
    }, []);


    return (
        <>
            <div className={JobList.joblisting}>

                <Row className={JobList.link}>
                    <Col sm="6" lg="8"> <h2>Job Listings</h2></Col>

                </Row>
                <Row className="mt-5">
                    <Col lg="12 ">
                        <Card className="job_listing">
                            <h3 className="mb-4">Basic</h3>
                            <CardBody className={JobList.jobtable}>
                                <div className="table-responsive">
                                    <Table striped>
                                        <thead className="listing_head">
                                            <tr>
                                                <th>Job Title</th>
                                                <th>City</th>
                                                <th>State</th>
                                                <th>Zip</th>
                                                <th># of drivers needed:</th>
                                                <th>Job Expiration Date:</th>
                                                <th>Geography:</th>
                                                <th>Schedule:</th>
                                                <th>Employment Type:</th>
                                                <th>Equipment Type:</th>
                                                <th>Type of Delivery:</th>
                                                <th>Team Drivers:</th>
                                                <th>Job Description:</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>
                                                    Class A CDL – Texas –NE OTR
                                                </td>
                                                <td>
                                                    California
                                                </td>
                                                <td>
                                                    California
                                                </td>
                                                <td>
                                                    54000
                                                </td>
                                                <td>
                                                    Leave
                                                </td>
                                                <td>
                                                    Dec 2, 2022

                                                </td>
                                                <td>
                                                    Geography
                                                </td>
                                                <td>
                                                    Schedule
                                                </td>
                                                <td>
                                                    Salaried (W2)
                                                </td>
                                                <td>
                                                    1999
                                                </td>
                                                <td>
                                                    Tractor
                                                </td>
                                                <td>
                                                    Team Drivers
                                                </td>
                                                <td>
                                                    Job Description
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    Class A CDL – Texas –NE OTR
                                                </td>
                                                <td>
                                                    California
                                                </td>
                                                <td>
                                                    California
                                                </td>
                                                <td>
                                                    54000
                                                </td>
                                                <td>
                                                    Leave
                                                </td>
                                                <td>
                                                    Dec 2, 2022

                                                </td>
                                                <td>
                                                    Geography
                                                </td>
                                                <td>
                                                    Schedule
                                                </td>
                                                <td>
                                                    Salaried (W2)
                                                </td>
                                                <td>
                                                    1999
                                                </td>
                                                <td>
                                                    Tractor
                                                </td>
                                                <td>
                                                    Team Drivers
                                                </td>
                                                <td>
                                                    Job Description
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    Class A CDL – Texas –NE OTR
                                                </td>
                                                <td>
                                                    California
                                                </td>
                                                <td>
                                                    California
                                                </td>
                                                <td>
                                                    54000
                                                </td>
                                                <td>
                                                    Leave
                                                </td>
                                                <td>
                                                    Dec 2, 2022

                                                </td>
                                                <td>
                                                    Geography
                                                </td>
                                                <td>
                                                    Schedule
                                                </td>
                                                <td>
                                                    Salaried (W2)
                                                </td>
                                                <td>
                                                    1999
                                                </td>
                                                <td>
                                                    Tractor
                                                </td>
                                                <td>
                                                    Team Drivers
                                                </td>
                                                <td>
                                                    Job Description
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
            </div>




            <div className={JobList.joblisting}>
                <Row className="mt-5">
                    <Col lg="12 ">
                        <Card className="job_listing">
                            <h3 className="mb-4">Benefits</h3>
                            <CardBody className={JobList.jobtable}>
                                <div className="table-responsive">
                                    <Table striped>
                                        <thead className="listing_head">
                                            <tr>
                                                <th>Pay Method</th>
                                                <th>Range</th>
                                                <th>Miles Per Week:</th>
                                                <th>Weekly Pay Range*:</th>
                                                <th>Benefits</th>
                                                <th>Additional Benefits:</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>
                                                    Rate Per Month
                                                </td>
                                                <td>
                                                    $0.43 to $0.65
                                                </td>
                                                <td>
                                                    2300 to 3000
                                                </td>
                                                <td>
                                                    $989 t0 $1200
                                                </td>
                                                <td>
                                                    Doubles
                                                </td>
                                                <td>
                                                    Free netflix accounts, access to our gym membership program, direct deposit, be part of an amazing team!!
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    Rate Per Month
                                                </td>
                                                <td>
                                                    $0.43 to $0.65
                                                </td>
                                                <td>
                                                    2300 to 3000
                                                </td>
                                                <td>
                                                    $989 t0 $1200
                                                </td>
                                                <td>
                                                    Doubles
                                                </td>
                                                <td>
                                                    Free netflix accounts, access to our gym membership program, direct deposit, be part of an amazing team!!
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    Rate Per Month
                                                </td>
                                                <td>
                                                    $0.43 to $0.65
                                                </td>
                                                <td>
                                                    2300 to 3000
                                                </td>
                                                <td>
                                                    $989 t0 $1200
                                                </td>
                                                <td>
                                                    Doubles
                                                </td>
                                                <td>
                                                    Free netflix accounts, access to our gym membership program, direct deposit, be part of an amazing team!!
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
            </div>

            <div className={JobList.joblisting}>
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
            </div>


            <div className={JobList.joblisting}>
                <Row className="mt-5">
                    <Col lg="12 ">
                        <Card className="job_listing">
                            <h3 className="mb-4">Requirements</h3>
                            <CardBody className={JobList.jobtable}>
                                <div className="table-responsive">
                                    <Table striped className={JobList.req_table}>
                                        <thead className="listing_head">
                                            <tr>
                                                <th>CDL Class</th>
                                                <th>Minimum Years of Experience</th>
                                                <th>Minimum Degree</th>
                                                <th>Required Skills</th>
                                                <th>Other Skills Required</th>
                                                <th>Equipment Requirements (for owner operators)</th>
                                                <th>Endorsements</th>
                                                <th>Transmission Type Experience:</th>
                                                <th>Driver Radius</th>
                                                <th>Must Pass Drug Test?</th>
                                                <th>MVR Requirements</th>
                                                <th>Accepting SAP Graduates?</th>
                                                <th>Criminal History in last 3 years?</th>
                                                <th>Accidents within the last 5 years:</th>
                                                {/* <th>Other Safety Requirements:</th> */}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td> Class A</td>
                                                <td>2</td>
                                                <td>N/A </td>
                                                <td> Flatbed  <span className={JobList.td__sty}>2</span></td>
                                                <td>Driver must be willing to lift at least 50 lbs, must be customer friendly</td>
                                                <td>Tractor (1) <span className={JobList.td__sty}>Dry Van (1)</span> </td>
                                                <td>Doubles<span className={JobList.td__sty}>Preferred</span> </td>
                                                <td> Manual</td>
                                                <td>5Km</td>
                                                <td>Yes</td>
                                                <td>Non-at fault accident okay</td>
                                                <td>2018 <span className={JobList.td__sty}>2018</span></td>
                                                <td>misdemeanor</td>
                                                <td>2</td>
                                                {/* <td>No prior convictions within 10 years.</td> */}
                                            </tr>
                                            <tr>
                                            <td> Class A</td>
                                                <td>2</td>
                                                <td>N/A </td>
                                                <td> Flatbed  <span className={JobList.td__sty}>2</span></td>
                                                <td>Driver must be willing to lift at least 50 lbs, must be customer friendly</td>
                                                <td>Tractor (1) <span className={JobList.td__sty}>Dry Van (1)</span> </td>
                                                <td>Doubles<span className={JobList.td__sty}>Preferred</span> </td>
                                                <td> Manual</td>
                                                <td>5Km</td>
                                                <td>Yes</td>
                                                <td>Non-at fault accident okay</td>
                                                <td>2018 <span className={JobList.td__sty}>2018</span></td>
                                                <td>misdemeanor</td>
                                                <td>2</td>
                                                {/* <td>No prior convictions within 10 years.</td> */}
                                            </tr>
                                            <tr>
                                            <td> Class A</td>
                                                <td>2</td>
                                                <td>N/A </td>
                                                <td> Flatbed  <span className={JobList.td__sty}>2</span></td>
                                                <td>Driver must be willing to lift at least 50 lbs, must be customer friendly</td>
                                                <td>Tractor (1) <span className={JobList.td__sty}>Dry Van (1)</span> </td>
                                                <td>Doubles<span className={JobList.td__sty}>Preferred</span> </td>
                                                <td> Manual</td>
                                                <td>5Km</td>
                                                <td>Yes</td>
                                                <td>Non-at fault accident okay</td>
                                                <td>2018 <span className={JobList.td__sty}>2018</span></td>
                                                <td>misdemeanor</td>
                                                <td>2</td>
                                                {/* <td>No prior convictions within 10 years.</td> */}
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
                <div className={JobList.job__overview}>
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
                </div>
            </div>

        </>
    )

    // return (
    //     <>
    //         <div className={JobList.joblisting}>

    //             <Row className={JobList.link}>
    //                 <Col sm="6" lg="8"> <h2>Job Listings</h2></Col>

    //             </Row>
    //             <Row className="mt-5">
    //                 <Col lg="12 ">
    //                     <Card className="job_listing">
    //                         <CardBody className={JobList.jobtable}>
    //                             <div className="table-responsive">
    //                                 <Table striped>
    //                                     <thead className="listing_head">
    //                                         <tr>
    //                                             <th>File Name</th>
    //                                             <th>Post Date</th>
    //                                             <th>Expiration Date</th>
    //                                             <th>Status</th>
    //                                             <th>Applied</th>
    //                                             <th>Approved</th>
    //                                             <th>Hired</th>
    //                                             <th>Tags</th>
    //                                             <th>Platforms deployed on</th>
    //                                             {/* <th className={JobList.display}>
    //                                                 <span className={JobList.tag}>  </span>
    //                                             </th> */}

    //                                         </tr>
    //                                     </thead>
    //                                     <tbody>
    //                                         {/* {jobs.length > 0 && jobs.map((job, index) => ( */}
    //                                         <tr>
    //                                             <td>
    //                                                 {/* {job.title} */}
    //                                                 Class A CDL – Texas –NE OTR
    //                                             </td>
    //                                             <td>
    //                                                 {/* {new Date(job.created_at).toDateString()} */}
    //                                                 November 12, 2021
    //                                             </td>
    //                                             <td>
    //                                                 Dec 12, 2021
    //                                             </td>
    //                                             <td>
    //                                                 Expired
    //                                             </td>
    //                                             <td>
    //                                                 <span className={JobList.applied}>
    //                                                     6
    //                                                 </span>
    //                                             </td>
    //                                             <td>
    //                                                 <span className={JobList.approved}>
    //                                                     4
    //                                                 </span>
    //                                             </td>
    //                                             <td>
    //                                                 <span className={JobList.hired}>
    //                                                     1
    //                                                 </span>
    //                                             </td>
    //                                             <td>
    //                                                 <span className={JobList.tags}>
    //                                                     {/* {job.employment_type} */}
    //                                                     1099
    //                                                 </span>
    //                                                 <span className={JobList.repost}>
    //                                                     Repost
    //                                                 </span>
    //                                             </td>
    //                                             <td>
    //                                                 <span className={JobList.bg_light}>
    //                                                     DriverFly Job Board
    //                                                 </span>
    //                                                 <span className={JobList.bg_light}>
    //                                                     Facebook
    //                                                 </span>
    //                                             </td>

    //                                         </tr>
    //                                         <tr>
    //                                             <td>
    //                                                 {/* {job.title} */}
    //                                                 Class A CDL – Texas –NE OTR
    //                                             </td>
    //                                             <td>
    //                                                 {/* {new Date(job.created_at).toDateString()} */}
    //                                                 November 12, 2021
    //                                             </td>
    //                                             <td>
    //                                                 Dec 12, 2021
    //                                             </td>
    //                                             <td>
    //                                                 Expired
    //                                             </td>
    //                                             <td>
    //                                                 <span className={JobList.applied}>
    //                                                     6
    //                                                 </span>
    //                                             </td>
    //                                             <td>
    //                                                 <span className={JobList.approved}>
    //                                                     4
    //                                                 </span>
    //                                             </td>
    //                                             <td>
    //                                                 <span className={JobList.hired}>
    //                                                     1
    //                                                 </span>
    //                                             </td>
    //                                             <td>
    //                                                 <span className={JobList.tags}>
    //                                                     {/* {job.employment_type} */}
    //                                                     OTR
    //                                                 </span>
    //                                                 <span className={JobList.bg_light_report}>
    //                                                     Repost
    //                                                 </span>
    //                                             </td>
    //                                             <td>
    //                                                 <span className={JobList.hired}>
    //                                                     DriverFly Job Board
    //                                                 </span>
    //                                                 <span className={JobList.hired}>
    //                                                     Facebook
    //                                                 </span>
    //                                             </td>
    //                                         </tr>
    //                                         <tr>
    //                                             <td>
    //                                                 {/* {job.title} */}
    //                                                 Class A CDL – Texas –NE OTR
    //                                             </td>
    //                                             <td>
    //                                                 {/* {new Date(job.created_at).toDateString()} */}
    //                                                 November 12, 2021
    //                                             </td>
    //                                             <td>
    //                                                 Dec 12, 2021
    //                                             </td>
    //                                             <td>
    //                                                 Expired
    //                                             </td>
    //                                             <td>
    //                                                 <span className={JobList.applied}>
    //                                                     6
    //                                                 </span>
    //                                             </td>
    //                                             <td>
    //                                                 <span className={JobList.approved}>
    //                                                     4
    //                                                 </span>
    //                                             </td>
    //                                             <td>
    //                                                 <span className={JobList.hired}>
    //                                                     1
    //                                                 </span>
    //                                             </td>
    //                                             <td>
    //                                                 <span className={JobList.tags}>
    //                                                     {/* {job.employment_type} */}
    //                                                     1099
    //                                                 </span>
    //                                                 <span className={JobList.repost}>
    //                                                     Repost
    //                                                 </span>
    //                                             </td>
    //                                             <td>
    //                                                 <span className={JobList.bg_light}>
    //                                                     DriverFly Job Board
    //                                                 </span>
    //                                                 <span className={JobList.bg_light}>
    //                                                     Facebook
    //                                                 </span>
    //                                             </td>

    //                                         </tr>
    //                                         <tr>
    //                                             <td>
    //                                                 {/* {job.title} */}
    //                                                 Class A CDL – Texas –NE OTR
    //                                             </td>
    //                                             <td>
    //                                                 {/* {new Date(job.created_at).toDateString()} */}
    //                                                 November 12, 2021
    //                                             </td>
    //                                             <td>
    //                                                 Dec 12, 2021
    //                                             </td>
    //                                             <td>
    //                                                 Expired
    //                                             </td>
    //                                             <td>
    //                                                 <span className={JobList.applied}>
    //                                                     6
    //                                                 </span>
    //                                             </td>
    //                                             <td>
    //                                                 <span className={JobList.approved}>
    //                                                     4
    //                                                 </span>
    //                                             </td>
    //                                             <td>
    //                                                 <span className={JobList.hired}>
    //                                                     1
    //                                                 </span>
    //                                             </td>
    //                                             <td>
    //                                                 <span className={JobList.tags}>
    //                                                     {/* {job.employment_type} */}
    //                                                     OTR
    //                                                 </span>
    //                                                 <span className={JobList.bg_light_report}>
    //                                                     Repost
    //                                                 </span>
    //                                             </td>
    //                                             <td>
    //                                                 <span className={JobList.hired}>
    //                                                     DriverFly Job Board
    //                                                 </span>
    //                                                 <span className={JobList.hired}>
    //                                                     Facebook
    //                                                 </span>
    //                                             </td>
    //                                         </tr>
    //                                         {/* ))} */}


    //                                     </tbody>
    //                                 </Table>
    //                             </div>
    //                             <Row className="py-4">
    //                                 <Col sm="6" lg="9">
    //                                     <nav aria-label="Page navigation example p-0">
    //                                         <ul className="pagination p-0">
    //                                             <li className="page-item"><a className="page-link" href="#">Page 1</a></li>
    //                                         </ul>
    //                                     </nav>
    //                                 </Col>
    //                                 <Col sm="6" lg="3" className="mt-4 text-center" >
    //                                     <Link href="/dashboard/company/new-job">
    //                                         <a className={JobList.repost}>
    //                                             + New Job
    //                                         </a>
    //                                     </Link>
    //                                 </Col>
    //                             </Row>
    //                         </CardBody>

    //                     </Card>
    //                 </Col>
    //             </Row>
    //             <div className={JobList.job__overview}>
    //                 <Row>

    //                     <Col className="p-0" lg="2">
    //                         <div className={JobList.job__overview__header}>
    //                             <h3>Job Summary</h3>
    //                         </div>
    //                         <div className={JobList.job__overview__body}>
    //                             <p className="p-3">Hi we’re a general freight hauler looking for a dedicated OTR CDL Class A Driver. We offer great pay with flexible dispatch and home time. Reach out to us today if you’re interested in hauling across the country on good loads that pay well.</p>
    //                             <div className="space_6"></div>
    //                             <Row className="">
    //                                 <Col className="text-end"><input className={JobList.edit__btn}
    //                                     type="button"
    //                                     value="Edit"></input></Col>
    //                             </Row>

    //                         </div>

    //                     </Col>

    //                     <Col className="p-0" lg="4">
    //                         <div className={JobList.job__overview__detail}>
    //                             <div className={JobList.job__overview__header}>
    //                                 <h3>Detail</h3>
    //                             </div>
    //                             <div className={JobList.job__body}>
    //                                 <Row className="p-3">
    //                                     <Col >
    //                                         <p>CD Type Position</p>
    //                                     </Col>
    //                                     <Col>
    //                                         <p>Class A</p>
    //                                     </Col>
    //                                     <Col>
    //                                         <p>MVR:</p>

    //                                     </Col>
    //                                     <Col>
    //                                         <p>Clean MVR:</p>

    //                                     </Col>

    //                                 </Row>
    //                             </div>
    //                             <div className={JobList.job__body}>
    //                                 <Row className="p-3">
    //                                     <Col>

    //                                         <p>:</p>
    //                                     </Col>
    //                                     <Col>
    //                                         <p>Solo</p>
    //                                     </Col>
    //                                     <Col>
    //                                         <p>State(s):</p>

    //                                     </Col>
    //                                     <Col>
    //                                         <p>Georgia</p>

    //                                     </Col>
    //                                 </Row>
    //                             </div>
    //                             <div className={JobList.job__body}>
    //                                 <Row className="p-3">
    //                                     <Col>

    //                                         <p>Statis</p>
    //                                     </Col>
    //                                     <Col>
    //                                         <p>Solo</p>
    //                                     </Col>
    //                                     <Col>
    //                                         <p>State(s):</p>

    //                                     </Col>
    //                                     <Col>
    //                                         <p>Georgia</p>

    //                                     </Col>
    //                                 </Row>
    //                             </div>
    //                             <div className={JobList.job__body}>
    //                                 <Row className="p-3">
    //                                     <Col>

    //                                         <p>Geography</p>
    //                                     </Col>
    //                                     <Col>
    //                                         <p>Solo</p>
    //                                     </Col>
    //                                     <Col>
    //                                         <p>State(s):</p>

    //                                     </Col>
    //                                     <Col>
    //                                         <p>Georgia</p>

    //                                     </Col>
    //                                 </Row>
    //                                 <Row className="spacer">
    //                                     <Col className="text-end"><input className={JobList.edit__btn}
    //                                         type="button"
    //                                         value="Edit"></input></Col>
    //                                 </Row>

    //                             </div>
    //                         </div>
    //                     </Col>

    //                     <Col className="p-0" lg="2">
    //                         <div className={JobList.job__overview__header}>
    //                             <h3 >Total Hires</h3>
    //                         </div>
    //                         <div className={JobList.job__overview__body}>
    //                             <p className="p-3">Days active:  12</p>
    //                             <p className="p-3">Days active:  12</p>
    //                             <p className="p-3">Days active:  12</p>
    //                             <p className="p-3">Days active:  12</p>
    //                             <div className="space_35"></div>
    //                         </div>
    //                     </Col>
    //                     <Col className="p-0" lg="2">
    //                         <div className={JobList.job__overview__header}>
    //                             <h3>Historical</h3>

    //                         </div>
    //                         <Chart
    //                             chartType="ComboChart"
    //                             width="100%"
    //                             height="350px"
    //                             data={data}
    //                             options={options}
    //                         />
    //                     </Col>
    //                     <Col className="p-0" lg="2">
    //                         <div className={JobList.job__overview__header}>
    //                             <h3>Analyze Performance</h3>
    //                         </div>
    //                         <div className={JobList.status_job__body}>
    //                             <Col sm="6" lg="2">
    //                                 <input className={JobList.status__btn}
    //                                     type="button"
    //                                     value="View Stats "></input>
    //                             </Col>
    //                         </div>
    //                     </Col>

    //                 </Row>
    //                 <Row>
    //                     <Col className="text-center mt-5">
    //                         <input className={JobList.status__btn}
    //                             type="button"
    //                             value="View Public Posting
    //                             "></input>
    //                     </Col>
    //                 </Row>
    //             </div>
    //         </div>
    //     </>
    // )
};

JobListing.getLayout = function getLayout(page) {
    return (
        <FullLayout>
            {page}
        </FullLayout>
    )
}
