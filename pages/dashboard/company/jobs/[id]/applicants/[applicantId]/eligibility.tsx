import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import {
  ArrowLeft,
  PersonFill,
  TrophyFill,
  CheckCircleFill,
  XCircleFill,
  InfoCircleFill,
} from 'react-bootstrap-icons';
import { toast } from 'react-toastify';
import Link from 'next/link';
import { Container, Row, Col, Card, Badge, Button, Alert, ProgressBar } from 'react-bootstrap';
import FullLayout from '../../../../../../../components/dashboard/layouts/layout/full-layout';
import ChildPageLayout from '../../../../../../../components/layouts/page/child-page-layout';
import { useAuth } from '../../../../../../../hooks/use-auth';
import { useTranslation } from '../../../../../../../hooks/use-translation';
import EligibilityApi, { DetailedEligibilityResponse } from '../../../../../../api/eligibility';
import { JobEntity } from '../../../../../../../models/job/job.entity';
import { globalAjaxExceptionHandler } from '../../../../../../../utils/ajax';
import JobApi from '../../../../../../api/job';
import styles from '../../../../../../../styles/eligibility.module.css';

interface ApplicantEligibilityDetailProps {
  jobId: number;
  applicantId: number;
}

export default function ApplicantEligibilityDetail({
  jobId,
  applicantId,
}: ApplicantEligibilityDetailProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const { hasPermission, company } = useAuth();
  const [job, setJob] = useState<JobEntity>(new JobEntity());
  const [eligibilityData, setEligibilityData] = useState<DetailedEligibilityResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const backPath = `/dashboard/company/jobs/${jobId}/applicants/eligibility`;

  useEffect(() => {
    const loadData = async () => {
      if (!jobId || !applicantId) {
        toast.error('Invalid job or applicant ID');
        router.push('/dashboard/company/jobs');
        return;
      }

      try {
        setLoading(true);

        // Load job data
        const jobApi = new JobApi();
        const jobData = await jobApi.getById(+jobId);

        if (!jobData || jobData.company.id !== company?.id) {
          toast.error('Job not found or access denied');
          router.push('/dashboard/company/jobs');
          return;
        }

        setJob(jobData);

        // Load eligibility data
        const eligibilityApi = new EligibilityApi();
        const eligibilityResult = await eligibilityApi.getApplicantJobEligibility(
          +jobId,
          +applicantId
        );
        setEligibilityData(eligibilityResult);
      } catch (error) {
        globalAjaxExceptionHandler(error, {
          toast: toast,
          t: t,
          defaultMessage: 'Failed to load eligibility data',
        });
        router.push(backPath);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [jobId, applicantId, company]);

  if (loading) {
    return (
      <ChildPageLayout backPath={backPath} title="Loading...">
        <div className={`${styles.eligibilityContainer}`}>
          <div className={styles.loading}>
            <div className={styles.loadingSpinner}></div>
            <span>Loading eligibility analysis...</span>
          </div>
        </div>
      </ChildPageLayout>
    );
  }

  if (!eligibilityData) {
    return (
      <ChildPageLayout backPath={backPath} title="Error">
        <div className={`${styles.eligibilityContainer}`}>
          <div className={styles.emptyState}>
            <div className={styles.emptyStateTitle}>Unable to Load Data</div>
            <p className={styles.emptyStateText}>
              Failed to load eligibility data. Please try again.
            </p>
          </div>
        </div>
      </ChildPageLayout>
    );
  }

  const {
    applicant,
    score,
    eligibilityStatus,
    scoringDetails,
    detailedBreakdown,
    recommendations,
  } = eligibilityData;

  const getScoreColor = (score: number): string => {
    if (score >= 90) return 'success';
    if (score >= 80) return 'primary';
    if (score >= 60) return 'warning';
    return 'danger';
  };

  const getScoreBadgeClass = (score: number): string => {
    if (score >= 90) return styles.excellent;
    if (score >= 80) return styles.good;
    if (score >= 60) return styles.fair;
    return styles.poor;
  };

  const getStatusVariant = (status: string): string => {
    switch (status) {
      case 'ELIGIBLE':
        return 'success';
      case 'PARTIALLY_ELIGIBLE':
        return 'warning';
      case 'NOT_ELIGIBLE':
        return 'danger';
      default:
        return 'secondary';
    }
  };

  const formatStatus = (status: string): string => {
    switch (status) {
      case 'ELIGIBLE':
        return 'Eligible';
      case 'PARTIALLY_ELIGIBLE':
        return 'Partially Eligible';
      case 'NOT_ELIGIBLE':
        return 'Not Eligible';
      default:
        return status;
    }
  };

  const renderScoreBreakdown = (breakdown: any) => {
    return Object.entries(breakdown).map(([key, data]: [string, any]) => {
      const percentage = data.maxPoints > 0 ? (data.points / data.maxPoints) * 100 : 0;
      const variant =
        data.status === 'PASS' ? 'success' : data.status === 'PARTIAL' ? 'warning' : 'danger';

      return (
        <Card key={key} className="mb-3 border-0 shadow-sm">
          <Card.Body>
            <div className="d-flex justify-content-between align-items-start mb-2">
              <h6 className="mb-0">{data.category}</h6>
              <Badge bg={variant}>
                {data.points}/{data.maxPoints} pts
              </Badge>
            </div>
            <ProgressBar
              variant={variant}
              now={percentage}
              className="mb-2"
              style={{ height: '8px' }}
            />
            <small className="text-muted">{data.details}</small>
          </Card.Body>
        </Card>
      );
    });
  };

  const title = `${applicant.firstName} ${applicant.lastName} - Eligibility Analysis`;

  return (
    <ChildPageLayout backPath={backPath} title={title}>
      <Container fluid>
        <Row>
          <Col lg={8}>
            {/* Applicant Header */}
            <Card className="mb-4 border-0 shadow-sm">
              <Card.Body>
                <Row>
                  <Col md={8}>
                    <div className="d-flex align-items-center mb-3">
                      <div
                        className={`${styles.scoreBadge} ${getScoreBadgeClass(score)} me-3`}
                        style={{ width: '60px', height: '60px', fontSize: '1.1rem' }}
                      >
                        {Math.round(score)}
                      </div>
                      <div>
                        <h4 className="mb-1">
                          <PersonFill className="me-2" />
                          {applicant.firstName} {applicant.lastName}
                        </h4>
                        <p className="mb-1 text-muted">
                          {applicant.licenseType} • {applicant.yearsExperience} years experience
                        </p>
                        <p className="mb-0 text-muted">
                          📍 {applicant.location} • 📞 {applicant.phone}
                        </p>
                      </div>
                    </div>

                    <Badge
                      bg={getStatusVariant(eligibilityStatus)}
                      className="me-2"
                      style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}
                    >
                      {formatStatus(eligibilityStatus)}
                    </Badge>

                    {applicant.hasApplied && (
                      <Badge bg="info" style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}>
                        Applied to this job
                      </Badge>
                    )}
                  </Col>
                  <Col md={4} className="text-end">
                    <Link href={`/dashboard/company/applicants/${applicant.id}`}>
                      <a>
                        <Button variant="outline-primary">View Full Profile</Button>
                      </a>
                    </Link>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            {/* Detailed Score Breakdown */}
            <Card className="mb-4 border-0 shadow-sm">
              <Card.Header className="bg-white border-bottom">
                <h5 className="mb-0">
                  <TrophyFill className="me-2 text-warning" />
                  Detailed Score Breakdown
                </h5>
              </Card.Header>
              <Card.Body>{renderScoreBreakdown(detailedBreakdown)}</Card.Body>
            </Card>

            {/* Scoring Details */}
            <Row>
              <Col md={6}>
                <Card className="mb-4 border-0 shadow-sm h-100">
                  <Card.Header className="bg-success text-white">
                    <CheckCircleFill className="me-2" />
                    Requirements Met
                  </Card.Header>
                  <Card.Body>
                    {scoringDetails.requirementsMet.length > 0 ? (
                      <ul className="list-unstyled mb-0">
                        {scoringDetails.requirementsMet.map((item, index) => (
                          <li key={index} className="mb-2">
                            <CheckCircleFill className="text-success me-2" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-muted mb-0">No specific requirements met</p>
                    )}
                  </Card.Body>
                </Card>
              </Col>

              <Col md={6}>
                <Card className="mb-4 border-0 shadow-sm h-100">
                  <Card.Header className="bg-danger text-white">
                    <XCircleFill className="me-2" />
                    Requirements Failed
                  </Card.Header>
                  <Card.Body>
                    {scoringDetails.requirementsFailed.length > 0 ? (
                      <ul className="list-unstyled mb-0">
                        {scoringDetails.requirementsFailed.map((item, index) => (
                          <li key={index} className="mb-2">
                            <XCircleFill className="text-danger me-2" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-muted mb-0">No requirements failed</p>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            {(scoringDetails.bonusPoints.length > 0 || scoringDetails.deductions.length > 0) && (
              <Row>
                {scoringDetails.bonusPoints.length > 0 && (
                  <Col md={6}>
                    <Card className="mb-4 border-0 shadow-sm h-100">
                      <Card.Header className="bg-warning text-dark">
                        <TrophyFill className="me-2" />
                        Bonus Points
                      </Card.Header>
                      <Card.Body>
                        <ul className="list-unstyled mb-0">
                          {scoringDetails.bonusPoints.map((item, index) => (
                            <li key={index} className="mb-2">
                              <TrophyFill className="text-warning me-2" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </Card.Body>
                    </Card>
                  </Col>
                )}

                {scoringDetails.deductions.length > 0 && (
                  <Col md={6}>
                    <Card className="mb-4 border-0 shadow-sm h-100">
                      <Card.Header className="bg-secondary text-white">
                        <InfoCircleFill className="me-2" />
                        Deductions
                      </Card.Header>
                      <Card.Body>
                        <ul className="list-unstyled mb-0">
                          {scoringDetails.deductions.map((item, index) => (
                            <li key={index} className="mb-2">
                              <InfoCircleFill className="text-secondary me-2" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </Card.Body>
                    </Card>
                  </Col>
                )}
              </Row>
            )}
          </Col>

          <Col lg={4}>
            {/* Job Info Sidebar */}
            <Card className="mb-4 border-0 shadow-sm position-sticky" style={{ top: '20px' }}>
              <Card.Header className="bg-primary text-white">
                <h6 className="mb-0">Job: {job.title}</h6>
              </Card.Header>
              <Card.Body>
                <p className="mb-2">
                  <strong>Location:</strong> {job.location?.city}, {job.location?.state}
                </p>
                <p className="mb-2">
                  <strong>CDL Required:</strong> {job.cdl_class || 'None'}
                </p>
                <p className="mb-2">
                  <strong>Experience:</strong> {job.min_years_experience || 0}+ years
                </p>
                <p className="mb-0">
                  <strong>Pay:</strong> ${job.min_weekly_pay} - ${job.max_weekly_pay}/week
                </p>
              </Card.Body>
            </Card>

            {/* Recommendations */}
            {recommendations.length > 0 && (
              <Card className="mb-4 border-0 shadow-sm">
                <Card.Header className="bg-info text-white">
                  <InfoCircleFill className="me-2" />
                  Recommendations
                </Card.Header>
                <Card.Body>
                  <ul className="list-unstyled mb-0">
                    {recommendations.map((recommendation, index) => (
                      <li key={index} className="mb-2">
                        <InfoCircleFill className="text-info me-2" />
                        {recommendation}
                      </li>
                    ))}
                  </ul>
                </Card.Body>
              </Card>
            )}

            {/* Actions */}
            <Card className="border-0 shadow-sm">
              <Card.Body className="text-center">
                <h6 className="mb-3">Next Steps</h6>
                <div className="d-grid gap-2">
                  <Link href={`/dashboard/company/applicants/${applicant.id}`}>
                    <a>
                      <Button variant="primary" size="lg" className="w-100">
                        View Full Profile
                      </Button>
                    </a>
                  </Link>
                  <Link href={`/dashboard/company/jobs/${jobId}/applicants/eligibility`}>
                    <a>
                      <Button variant="outline-secondary" className="w-100">
                        <ArrowLeft className="me-2" />
                        Back to All Applicants
                      </Button>
                    </a>
                  </Link>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </ChildPageLayout>
  );
}

ApplicantEligibilityDetail.getLayout = function getLayout(page) {
  return <FullLayout>{page}</FullLayout>;
};

export async function getServerSideProps(context) {
  try {
    const jobId = +context.params?.id;
    const applicantId = +context.params?.applicantId;

    if (!jobId || !applicantId) {
      return { notFound: true };
    }

    return {
      props: { jobId, applicantId },
    };
  } catch (error) {
    console.error('ApplicantEligibilityDetail error:', error);
    return { props: { jobId: null, applicantId: null } };
  }
}
