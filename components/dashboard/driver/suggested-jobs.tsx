import FullLayout from '../layouts/full-layout';
import { useAuth } from '../../../hooks/use-auth';
import { useState } from 'react';
import { Row, Col, Table, Card, CardBody } from 'reactstrap';
import ApplicantApi from '../../../pages/api/applicant';
import { globalAjaxExceptionHandler } from '../../../utils/ajax';
import { toast } from 'react-toastify';
import { useTranslation } from '../../../hooks/use-translation';
import { useEffectAsync } from '../../../utils/react';
import Link from 'next/link';

export default function SuggestedJobs() {
  const api = new ApplicantApi();

  const { user } = useAuth();

  const { t } = useTranslation();

  const [jobs, setJobs] = useState([]);

  useEffectAsync(async () => {
    try {
      const suggestedJobs = await api.me.suggestedJobs();
      setJobs(suggestedJobs);
    } catch (e) {
      globalAjaxExceptionHandler(e, { toast: toast, t: t });
    }
  }, []);

  return (
    <div className="pt-5">
      <Row>
        <h2>{t('SUGGESTED_JOBS')}</h2>
      </Row>
      <Row>
        <Col lg="12" className="p-0">
          <Card className="border-0">
            <CardBody>
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
                  {jobs.length > 0 &&
                    jobs.map((job, index) => (
                      <tr key={job.job?.id || index}>
                        <td scope="row">{index + 1}</td>{' '}
                        <td>
                          <Link href={`/dashboard/driver/jobs/${job.job?.id}`}>
                            {job.job?.title}
                          </Link>
                        </td>
                        <td>{t(`JobEmploymentType.${job.job?.employment_type}`)}</td>
                        <td>{job.job?.company?.name}</td>
                        <td>{new Date(job.job?.created_at).toDateString()}</td>
                      </tr>
                    ))}
                </tbody>
              </Table>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

SuggestedJobs.getLayout = function getLayout(page) {
  return <FullLayout>{page}</FullLayout>;
};
