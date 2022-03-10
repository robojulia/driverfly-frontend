import LogoutButton from '../../../components/buttons/Logout';
import FullLayout from "../../../components/dashboard/layouts/FullLayout";
import { Col, Row } from "reactstrap";
import useAuth from '../../../hooks/useAuth';

  
  
  export default function Dashboard() {
    const { authCheck } = useAuth();
    console.log('Dashboard  authCheck', authCheck())
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
