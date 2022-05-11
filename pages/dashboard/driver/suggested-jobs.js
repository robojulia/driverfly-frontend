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
import useRedirect from '../../../hooks/useRedirect';
import { useEffect, useState } from "react"
import { Row, Col, Table, Card, CardTitle, CardBody } from "reactstrap";
import axios from "axios"
import timeSince from '../../../utils/timeSince';

export default function SuggestedJobes() {

  const { authDriver } = useRedirect();

  authDriver()


  const [jobs, setJobs] = useState([])

  const fetchjobs = () => {

    const headers = {
    };

    axios.get(
      `${process.env.BASE_URL_API}/jobs/`,
      { headers: headers }
    )
      .then(data => {
        console.log("handle success", data.data)
        setJobs(data.data)
      })
      .catch(function (error) {
        console.log("handle error success", error.response)
      }).then(function () {
        console.log("always executed")
      })
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
                      <th>Job Type</th>
                      <th>Company</th>
                      <th>Post Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {jobs.length > 0 && jobs.map((job, index) => (
                      <tr>
                        <th scope="row">{index + 1}</th>
                        <td>{job.title}</td>
                        <td>{job.job_type}</td>
                        <td>{job.company}</td>
                        <td>{timeSince(job.created_at)}</td>
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

SuggestedJobes.getLayout = function getLayout(page) {
  return (
    <FullLayout>
      {page}
    </FullLayout>
  )
}
