import LogoutButton from '../../../components/buttons/Logout';
import FullLayout from "../../../components/dashboard/layouts/FullLayout";
import { Col, Row, Card, CardBody, Table } from "reactstrap";
import useRedirect from '../../../hooks/useRedirect';
import { Container } from "react-bootstrap";
import style from '../../../public/dashboard/styles/css/Driver/dashboard.module.css';
import { useEffect } from "react";
import useAuth from "../../../hooks/useAuth";
import { useState } from "react";
import axios from "axios";
import JobList from "../../../public/dashboard/styles/css/JobList.module.css"
import Link from 'next/link';

export default function Dashboard() {

    const { authDriver } = useRedirect();

    authDriver()
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

            <div className="job_info_container">

                <Container fluid className='pt-5'>
                    <Row className='justify-content-center text-center d-block'>
                        <Col lg={3} md={3} col={12} className={`p-5 mr-3 bg_yellow w-24  ${style.job_info_container}`} >
                            <h2 className="text-white font-weight-bolder">12 </h2>
                            <h3 className="font-weight-bolder">Applied Jobs</h3>
                            <Link href="#">
                                <button className={` mt-3 text-white ${style.btn_blue}`}>View</button>
                            </Link>
                        </Col>
                        <Col lg={3} md={3} col={12} className={`p-5 mr-3 bg_green w-24   ${style.job_info_container}`}>
                            <h2 className={`font-weight-bolder  ${style.text_yellow}`}>4 </h2>
                            <h3 className="font-weight-bolder">New Offers</h3>
                            <Link href="#">
                                <button className={` mt-3 text-white ${style.btn_blue}`}>View</button>
                            </Link>
                        </Col>
                        <Col lg={3} md={3} col={12} className={`p-5 mr-3 bg_blue w-24   ${style.job_info_container}`} >
                            <h2 className={`font-weight-bolder  ${style.text_yellow}`}>12 </h2>
                            <h3 className="font-weight-bolder text-white">Saved Jobes</h3>
                            <Link href="#">
                                <button className={` mt-3 text-dark ${style.btn_green}`}>View</button>
                            </Link>
                        </Col>
                        <Col lg={3} md={3} col={12} className={`p-5 mr-3 myrtlegreen w-24   ${style.job_info_container}`}>
                            <h2 className="text-white font-weight-bolder">4 </h2>
                            <h3 className={style.text_yellow}>Past Jobes</h3>
                            <Link href="#">
                                <button className={` mt-3 text-dark ${style.btn_green}`}>View</button>
                            </Link>
                        </Col>
                    </Row>
                </Container>

            </div>

            <div className=''>
                <Row>
                    <Col>
                        <h2 className='font-weight-bold my-3'>Current Job</h2>
                    </Col>
                </Row>
                <div class="table-responsive">
                    <table class="table table-borderless ">
                        <thead>
                            <tr>
                                <th scope="col">Job Title</th>
                                <th scope="col">Company</th>
                                <th scope="col"></th>
                                <th scope="col"></th>
                                <th scope="col"></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Class A CDL – Texas –NE OTR</td>
                                <td>CR England</td>
                                <td>
                                    <Link href="#">
                                        <button className={` mt-3 text-white ${style.btn_blue}`}>Update Status</button>
                                    </Link>
                                </td>
                                <td>
                                    <Link href="#">
                                        <button className={` mt-3 text-white ${style.btn_blue}`}>Transfer Internally</button>
                                    </Link>
                                </td>
                                <td>
                                    <Link href="#">
                                        <button className={` mt-3 text-white ${style.btn_blue}`}>Find Job</button>
                                    </Link>
                                </td>

                            </tr>


                        </tbody>
                    </table>
                </div>
            </div>



            <div className={JobList.joblisting}>
                <Row className={JobList.link}>
                    <Col sm="6" lg="8">
                        <h2 className='mt-3'>Job Listings</h2>
                    </Col>
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
                                                <th>Date Offered</th>
                                                <th>Company</th>
                                                <th>Est. Pay Per Week</th>
                                                <th>Pay Method</th>
                                                <th>Geography</th>
                                                <th>Type</th>
                                                <th>Schedule</th>
                                                <th>Equipment</th>
                                                <th>Truck</th>

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
                                                        Company
                                                    </td>
                                                    <td>
                                                        <span>
                                                            $1,250 - $2,000
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <span >
                                                            Rate Per Mi
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <span >
                                                            OTR
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <span>
                                                            type
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <span>
                                                            Schedule<br></br><br></br>
                                                            <span className={JobList.hired}>
                                                                Review
                                                            </span>
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <span>
                                                            Equipment<br></br><br></br>
                                                            <span className={JobList.approved}>
                                                                Apply
                                                            </span>
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <span>
                                                            Truck<br></br>
                                                        </span><br></br>
                                                        <span className={JobList.hired}>
                                                            Reject
                                                        </span>
                                                        <span className={JobList.applied}>
                                                            Save
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}


                                        </tbody>
                                    </Table>
                                </div>
                            </CardBody>

                        </Card>
                    </Col>
                </Row>
            </div>

        </>
    )
};

Dashboard.getLayout = function getLayout(page) {
    return (
        <FullLayout>
            {page}
        </FullLayout>
    )
}
