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

export default function JobsAppliedTo() {

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
                    <Col sm="6" lg="8">
                        <h2 className='mt-3'>Jobs Saved</h2>
                    </Col>
                </Row>
                <Row className="mt-5">
                    <Col lg="12 ">
                        <Card className='applied'>
                            <CardBody className={JobList.jobtable}>
                                <div className="table-responsive">
                                    <Table striped>
                                        <thead className="listing_head">
                                            <tr>
                                                <th>Job Title</th>
                                                <th>Date Applied</th>
                                                <th>Status</th>
                                                <th>Company</th>
                                                <th>Est. Pay Per Week</th>
                                                <th>Pay Method</th>
                                                <th>Geography</th>
                                                <th>Type</th>
                                                <th>Schedule</th>
                                                <th>Equipment</th>
                                                <th>Truck</th>

                                               

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
                                                        Pending Interview
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

                                                        Schedule
                                                       
                                                    </td>
                                                    <td>
                                                        Equipment
                                                        <Link href="#">
                                                            <button className={` mt-3 text-white ${JobList.hired}`}>View More</button>
                                                        </Link>
                                                    </td>
                                                    <td>
                                                        <td>
                                                            Truck
                                                            <Link href="#">
                                                            <button className={` mt-3 text-white ${JobList.approved}`}>Contact Company</button>
                                                        </Link>
                                                        </td>




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

JobsAppliedTo.getLayout = function getLayout(page) {
    return (
        <FullLayout>
            {page}
        </FullLayout>
    )
}
