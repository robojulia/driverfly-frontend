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

const BlogData = [
    {
      image: bg1,
      title: "This is simple blog",
      subtitle: "2 comments, 1 Like",
      description:
        "This is a wider card with supporting text below as a natural lead-in to additional content.",
      btnbg: "primary",
    },
    {
      image: bg2,
      title: "Lets be simple blog",
      subtitle: "2 comments, 1 Like",
      description:
        "This is a wider card with supporting text below as a natural lead-in to additional content.",
      btnbg: "primary",
    },
    {
      image: bg3,
      title: "Don't Lamp blog",
      subtitle: "2 comments, 1 Like",
      description:
        "This is a wider card with supporting text below as a natural lead-in to additional content.",
      btnbg: "primary",
    },
    {
      image: bg4,
      title: "Simple is beautiful",
      subtitle: "2 comments, 1 Like",
      description:
        "This is a wider card with supporting text below as a natural lead-in to additional content.",
      btnbg: "primary",
    },
  ];
  
  
  export default function Dashboard() {
    return (
        <>
            <LogoutButton />
            <div>
                {/***Top Cards***/}
                <Row>
                    <Col sm="6" lg="3">
                        <TopCards
                            bg="bg-light-success text-success"
                            title="Profit"
                            subtitle="Yearly Earning"
                            earning="$21k"
                            icon="bi bi-wallet"
                        />
                    </Col>
                    <Col sm="6" lg="3">
                        <TopCards
                            bg="bg-light-danger text-danger"
                            title="Refunds"
                            subtitle="Refund given"
                            earning="$1k"
                            icon="bi bi-coin"
                        />
                    </Col>
                    <Col sm="6" lg="3">
                        <TopCards
                            bg="bg-light-warning text-warning"
                            title="New Project"
                            subtitle="Yearly Project"
                            earning="456"
                            icon="bi bi-basket3"
                        />
                    </Col>
                    <Col sm="6" lg="3">
                        <TopCards
                            bg="bg-light-info text-into"
                            title="Sales"
                            subtitle="Weekly Sales"
                            earning="210"
                            icon="bi bi-bag"
                        />
                    </Col>
                </Row>
                {/***Sales & Feed***/}
                <Row>
                    <Col sm="12" lg="12">
                        {/* <SalesChart /> */}
                    </Col>
                </Row>
                {/***Table ***/}
                <Row>
                    <Col lg="6" xxl="8" sm="12">
                        <ProjectTables />
                    </Col>
                    <Col sm="12" lg="6" xl="5" xxl="4">
                        <Feeds />
                    </Col>
                </Row>
                {/***Blog Cards***/}
                <Row>
                    {BlogData.map((blg) => (
                        <Col sm="6" lg="6" xl="3" key={blg.title}>
                            <Blog
                                image={blg.image}
                                title={blg.title}
                                subtitle={blg.subtitle}
                                text={blg.description}
                                color={blg.btnbg}
                            />
                        </Col>
                    ))}
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
