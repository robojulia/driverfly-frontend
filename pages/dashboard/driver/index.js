import LogoutButton from '../../../components/buttons/Logout';
import FullLayout from "../../../components/dashboard/layouts/FullLayout";
import { Col, Row } from "reactstrap";
import useRedirect from '../../../hooks/useRedirect';


export default function Dashboard() {

    const { authDriver } = useRedirect();

    authDriver()

    return (
        <>

            <div>
                {/***Top Cards***/}
                <Row>
                    <h1>Dashboard</h1>
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
