
import { Row, Col, Table, Card, CardTitle, CardBody } from "reactstrap";
import LogoutButton from '../../../components/buttons/Logout';
import FullLayout from "../../../components/dashboard/layouts/Layout/FullLayout";

export default function NewJobs() {
    return (
        <>

            <div>
                {/***Top Cards***/}
                <Row>
                    <h1>New Jobs</h1>
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

NewJobs.getLayout = function getLayout(page) {
    return (
        <FullLayout>
            {page}
        </FullLayout>
    )
}
