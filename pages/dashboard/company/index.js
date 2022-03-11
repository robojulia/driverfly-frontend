import LogoutButton from '../../../components/buttons/Logout';
import FullLayout from "../../../components/dashboard/layouts/Layout/FullLayout";
import { Col, Row } from "reactstrap";
import useAuth from '../../../hooks/useAuth';
import { useRouter } from 'next/router'




export default function Dashboard() {

    const { isDriver } = useAuth();

    const router = useRouter()

    if (!isDriver()) {
        // router.push('/')
    }

    return (
        <>

            <div>
                {/***Top Cards***/}
                <Row>
                    <h1>Company Profile Dashboard</h1>
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
