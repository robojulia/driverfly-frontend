import FullLayout from "../../../components/dashboard/layouts/FullLayout";
import { useAuth } from '../../../hooks/useAuth';
import { useState } from "react"
import { Row, Col, Table, Card, CardTitle, CardBody } from "reactstrap";
import ApplicantApi from '../../api/applicant';
import { globalAjaxExceptionHandler } from '../../../utils/ajax';
import { toast } from 'react-toastify';
import { useTranslation } from '../../../hooks/useTranslation';
import { useEffectAsync } from "../../../utils/react";

export default function SuggestedJobs() {

  const api = new ApplicantApi();

  const { user } = useAuth();

  const { t } = useTranslation();

  const [jobs, setJobs] = useState([])

  useEffectAsync(async () => {
    try {
      const suggestedJobs = await api.me.suggestedJobs();
      setJobs(suggestedJobs);
    } catch (e) {
      globalAjaxExceptionHandler(e, { toast: toast, t: t })
    }
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
                        <td scope="row">{index + 1}</td>
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
