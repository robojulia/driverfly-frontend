import LogoutButton from '../../components/buttons/Logout';
import FullLayout from "../../components/dashboard/layouts/FullLayout";
// import SalesChart from "../../components/dashboard/components/dashboard/SalesChart";
import Feeds from "../../components/dashboard/components/dashboard/Feeds";
import ProjectTables from "../../components/dashboard/components/dashboard/ProjectTable";
import TopCards from "../../components/dashboard/components/dashboard/TopCards";
import Blog from "../../components/dashboard/components/dashboard/Blog";
import bg1 from "../../public/dashboard/assets/images/bg/bg1.jpg";
import bg2 from "../../public/dashboard/assets/images/bg/bg2.jpg";
import bg3 from "../../public/dashboard/assets/images/bg/bg3.jpg";
import bg4 from "../../public/dashboard/assets/images/bg/bg4.jpg";
import {
  Card,
  Row,
  Col,
  CardTitle,
  CardBody,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  FormText,
} from 'reactstrap';

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
  
  
  export default function Profile() {
    return (
        <>
            
            <div>
                {/***Top Cards***/}
                <Row>
                <h1>Profile</h1>
                </Row>

                <Row>
      <Col>
        {/* --------------------------------------------------------------------------------*/}
        {/* Card-1*/}
        {/* --------------------------------------------------------------------------------*/}
        <Card>
          <CardBody>
            <Form>
            <FormGroup>
                <Label for="exampleEmail">Name</Label>
                <Input
                  id="exampleName"
                  name="name"
                  placeholder="Name"
                  type="text"
                />
              </FormGroup>
              <FormGroup>
                <Label for="exampleEmail">Email</Label>
                <Input
                  id="exampleEmail"
                  name="email"
                  placeholder="Email"
                  type="email"
                />
              </FormGroup>
              <FormGroup>
                <Label for="examplePassword">Password</Label>
                <Input
                  id="examplePassword"
                  name="password"
                  placeholder="password"
                  type="password"
                />
              </FormGroup>
              <FormGroup>
                <Label for="examplePassword">Reset Password</Label>
                <Input
                  id="exampleResetPassword"
                  name="resetpassword"
                  placeholder="Reset password"
                  type="password"
                />
              </FormGroup>
              <Button>Submit</Button>
            </Form>
          </CardBody>
        </Card>
      </Col>
    </Row>
             
            </div>
        </>
    )
};

Profile.getLayout = function getLayout(page) {
    return (
        <FullLayout>
            {page}
        </FullLayout>
    )
}
