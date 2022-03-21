
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
                console.log("handle success", data.data)
                setJobs(data.data)
            })
            .catch(function (error) {
                console.log("handle error success", error.response)
            }).then(function () {
                console.log("always executed")
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
                        <Card>
                            <CardBody className={JobList.jobtable}>
                                <div className="table-responsive">
                                    <Table striped>
                                        <thead>
                                            <tr>
                                                <th>Title</th>
                                                <th>Post Date</th>
                                                <th>Job Type</th>
                                                <th>Applied</th>
                                                <th>Approved</th>
                                                <th>Hired</th>
                                                <th className={JobList.display}>
                                                    <span className={JobList.tag}>  </span>
                                                </th>

                                            </tr>
                                        </thead>
                                        <tbody>
                                            {jobs.length > 0 && jobs.map((job, index) => (

                                                <tr>
                                                    <td>
                                                        {job.title}
                                                    </td>
                                                    <td>
                                                        {new Date(job.created_at).toDateString()}
                                                    </td>
                                                    <td>
                                                        {job.job_type}
                                                    </td>
                                                    <td>
                                                        <span className={JobList.applied}>
                                                            6
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <span className={JobList.approved}>
                                                            4
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <span className={JobList.hired}>
                                                            1
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <span className={JobList.tags}>
                                                            {job.employment_type}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}


                                        </tbody>
                                    </Table>
                                </div>
                                <Row className="py-4">
                                    {/* <Col sm="6" lg="10">
                                        <nav aria-label="Page navigation example p-0">
                                            <ul className="pagination p-0">
                                                <li className="page-item"><a className="page-link" href="#">Previous</a></li>
                                                <li className="page-item"><a className="page-link" href="#">1</a></li>
                                                <li className="page-item"><a className="page-link" href="#">2</a></li>
                                                <li className="page-item"><a className="page-link" href="#">3</a></li>
                                                <li className="page-item"><a className="page-link" href="#">Next</a></li>
                                            </ul>
                                        </nav>
                                    </Col> */}
                                    <Col sm="6" lg="2" >
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
                {/* <div className={JobList.job__overview}>
                    <Row>

                        <Col className="p-0" lg="2">
                            <div className={JobList.job__overview__header}>
                                <h3>Job Summary</h3>
                            </div>
                            <div className={JobList.job__overview__body}>
                                <p className="p-3">Hi we’re a general freight hauler looking for a dedicated OTR CDL Class A Driver. We offer great pay with flexible dispatch and home time. Reach out to us today if you’re interested in hauling across the country on good loads that pay well.</p>
                                <div className="space_6"></div>
                                <input className={JobList.edit__btn}
                                    type="button"
                                    value="Edit"></input>

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
                                    <Row className="p-3 ">
                                        <Col><input className={JobList.edit__btn}
                                            type="button"
                                            value="Edit"></input></Col>
                                    </Row>

                                </div>
                            </div>
                        </Col>

                        <Col className="p-0" lg="2">
                            <div className={JobList.job__overview__header}>
                                <h3>Job Summary</h3>
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
    )
};

JobListing.getLayout = function getLayout(page) {
    return (
        <FullLayout>
            {page}
        </FullLayout>
    )
}
