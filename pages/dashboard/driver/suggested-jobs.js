import LogoutButton from '../../../components/buttons/Logout';
import FullLayout from "../../../components/dashboard/layouts/FullLayout";
// import SalesChart from "../../../components/dashboard/components/dashboard/SalesChart";
import Feeds from "../../../components/dashboard/components/dashboard/Feeds";
import ProjectTables from "../../../components/dashboard/components/dashboard/ProjectTable";
import TopCards from "../../../components/dashboard/components/dashboard/TopCards";
import Blog from "../../../components/dashboard/components/dashboard/Blog";
import bg1 from "../../../public/dashboard/assets/images/bg/bg1.jpg";
import bg2 from "../../../public/dashboard/assets/images/bg/bg2.jpg";
import bg3 from "../../../public/dashboard/assets/images/bg/bg3.jpg";
import bg4 from "../../../public/dashboard/assets/images/bg/bg4.jpg";
import { useAuth } from '../../../hooks/useAuth';
import { useEffect, useState } from "react"
import { Row, Col, Table, Card, CardTitle, CardBody } from "reactstrap";
import axios from "axios"
import timeSince from '../../../utils/timeSince';
import ApplicantApi from '../../api/applicant';

export default function SuggestedJobs() {

  const api = new ApplicantApi();

  const { user } = useAuth();

  const [jobs, setJobs] = useState([])

  const fetchjobs = async () => {
      await api.me.suggestedJobs()
          .then(data => setJobs(data))
          .catch((error) => {
              console.error(error);
          })
      console.log(jobs)
  }

  useEffect(() => {
    fetchjobs()
  }, []);

  return (
    <>

      <div>

        <Row>
          <h1>Jobs</h1>
        </Row>
        <Row>
          <Col lg="12">
            <Card>
              <CardBody className="">
                <Table bordered striped>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Job Title</th>
                      <th>Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {jobs.length > 0 && jobs.map((job, index) => (
                      <tr>
                        <th scope="row">{index + 1}</th>
                        <td>{job.job?.title}</td>
                        <td>{job.score}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </CardBody>
            </Card>
          </Col>
        </Row>

      </div>
    </>
  )
};

SuggestedJobs.getLayout = function getLayout(page) {
  return (
    <FullLayout>
      {page}
    </FullLayout>
  )
}
