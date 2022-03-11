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





export default function Application() {

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
                                        <th>Full Name</th>
                                        <th>Post Date</th>
                                        <th>Expiration Date</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <th scope="row">1</th>
                                        <td>Mark</td>
                                        <td>November 12, 20</td>
                                        <td>Dec 2, 2022</td>
                                        <td>Expired</td>
                                    </tr>
                                    <tr>
                                        <th scope="row">2</th>
                                        <td>Jacob</td>
                                        <td>November 12, 20</td>
                                        <td>Jun 2, 2022</td>
                                        <td>Active</td>
                                    </tr>
                                    <tr>
                                        <th scope="row">3</th>
                                        <td>Larry</td>
                                        <td>Feb 2, 2022</td>
                                        <td>Jun 2, 2022</td>
                                        <td>Active</td>
                                    </tr>
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
