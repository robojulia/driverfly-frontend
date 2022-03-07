import LogoutButton from '../../components/buttons/Logout';
import FullLayout from "../../components/dashboard/layouts/FullLayout";
import { Col, Row } from "reactstrap";
// import SalesChart from "../../components/dashboard/components/dashboard/SalesChart";
import Feeds from "../../components/dashboard/components/dashboard/Feeds";
import ProjectTables from "../../components/dashboard/components/dashboard/ProjectTable";
import TopCards from "../../components/dashboard/components/dashboard/TopCards";
import Blog from "../../components/dashboard/components/dashboard/Blog";
import bg1 from "../../public/dashboard/assets/images/bg/bg1.jpg";
import bg2 from "../../public/dashboard/assets/images/bg/bg2.jpg";
import bg3 from "../../public/dashboard/assets/images/bg/bg3.jpg";
import bg4 from "../../public/dashboard/assets/images/bg/bg4.jpg";

export default function Dashboard() {
  return (
    <>

      <div>

        <Row>
          <h1>Jobs</h1>
        </Row>
        <Row>
          <Col lg="6" xxl="8" sm="12">
            <ProjectTables />
          </Col>
          <Col sm="12" lg="6" xl="5" xxl="4">
            <Feeds />
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
