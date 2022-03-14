import LogoutButton from '../../../components/buttons/Logout';
import FullLayout from "../../../components/dashboard/layouts/FullLayout";
// import SalesChart from "../../components/dashboard/components/dashboard/SalesChart";
import Feeds from "../../../components/dashboard/components/dashboard/Feeds";
import ProjectTables from "../../../components/dashboard/components/dashboard/ProjectTable";
import TopCards from "../../../components/dashboard/components/dashboard/TopCards";
import Blog from "../../../components/dashboard/components/dashboard/Blog";
import bg1 from "../../../public/dashboard/assets/images/bg/bg1.jpg";
import bg2 from "../../../public/dashboard/assets/images/bg/bg2.jpg";
import bg3 from "../../../public/dashboard/assets/images/bg/bg3.jpg";
import bg4 from "../../../public/dashboard/assets/images/bg/bg4.jpg";
import { Row, Col, Table, Card, CardTitle, CardBody } from "reactstrap";
import useRedirect from '../../../hooks/useRedirect';
import { useEffect, useState } from "react"
import axios from "axios"
import timeSince from '../../../utils/timeSince';





export default function Application({ jobs }) {

    const { authDriver } = useRedirect();

    authDriver()


    return (
        <>

            <div>
                {/***Top Cards***/}
                <Row>
                    <h1>Application</h1>
                </Row>
                {/***Sales & Feed***/}

            </div>
            <Row>
                <Col lg="12">
                    <Card>
                        <CardBody className="">
                            <Table bordered striped>
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Title</th>
                                        <th>Post Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {jobs.length > 0 && jobs.map((job, index) => (
                                        <tr>
                                            <th scope="row">{index + 1}</th>
                                            <td>{job.title}</td>
                                            <td>{timeSince(job.created_at)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </>
    )
};

Application.getInitialProps = async () => {

    const res = await fetch(`${process.env.BASE_URL_API}/jobs`)
    const json = await res.json()
    return { jobs: json }
}

Application.getLayout = function getLayout(page) {
    return (
        <FullLayout>
            {page}
        </FullLayout>
    )
}
