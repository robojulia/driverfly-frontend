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
import useAuth from '../../../hooks/useAuth';





export default function Application() {

    const { authDriver } = useRedirect();

    authDriver()

    const { authCheck } = useAuth();

    const user = authCheck();

    const [applications, setApplications] = useState([])

    const fetchApplications = () => {

        const headers = {
            'Authorization': `Bearer ${user.token}`,
        };

        axios.get(
            `${process.env.BASE_URL_API}/jobs/applications/user`,
            { headers: headers }
        )
            .then(data => {
                console.log("handle success", data.data)
                setApplications(data.data)
            })
            .catch(function (error) {
                console.log("handle error success", error.response)
            }).then(function () {
                console.log("always executed")
            })
    }

    useEffect(() => {
        fetchApplications()
    }, []);


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
                                        <th>Job Title</th>
                                        <th>Job Type</th>
                                        <th>Company</th>
                                        <th>Post Date</th>
                                        <th>Applied Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {applications.length > 0 && applications.map((application, index) => (
                                        <tr>
                                            <th scope="row">{index + 1}</th>
                                            <td>{application.job.title}</td>
                                            <td>{application.job.job_type}</td>
                                            <td>{application.job.company}</td>
                                            <td>{timeSince(application.job.created_at)}</td>
                                            <td>{timeSince(application.created_at)}</td>
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


Application.getLayout = function getLayout(page) {
    return (
        <FullLayout>
            {page}
        </FullLayout>
    )
}
