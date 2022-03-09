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
  
  
  export default function AccountSettings() {
    return (
        <>
            
            <div>
                {/***Top Cards***/}
                <Row>
                   
                    <h1>Account Settings</h1>
                   
                 
                </Row>
                
        
                <Row className='text-white'>
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

AccountSettings.getLayout = function getLayout(page) {
    return (
        <FullLayout>
            {page}
        </FullLayout>
    )
}
