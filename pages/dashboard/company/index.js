import LogoutButton from '../../../components/buttons/Logout';
import FullLayout from "../../../components/dashboard/layouts/Layout/FullLayout";
import { Col, Row } from "reactstrap";


  
  
  export default function Dashboard() {
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
