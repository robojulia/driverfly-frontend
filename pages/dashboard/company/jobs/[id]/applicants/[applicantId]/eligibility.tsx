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
import { Container, Row, Col, Card, Badge, Button, Alert } from 'react-bootstrap';
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

  const getCompatibilityStatus = (status: string, score: number) => {
    // Map backend status to new compatibility states
    if (status === 'ELIGIBLE' && score >= 85) {
      return {
        status: 'MATCH',
        label: 'Match',
        variant: 'success',
        icon: '✅',
        description: 'Strong match for job requirements',
      };
    } else if (status === 'ELIGIBLE' || status === 'PARTIALLY_ELIGIBLE') {
      return {
        status: 'PARTIALLY_COMPATIBLE',
        label: 'Partially Compatible',
        variant: 'warning',
        icon: '⚠️',
        description: 'Meets some requirements, may need review',
      };
    } else {
      return {
        status: 'INCOMPATIBLE',
        label: 'Incompatible',
        variant: 'danger',
        icon: '❌',
        description: 'Does not meet key job requirements',
      };
    }
  };

  const getRequirementStatus = (data: any) => {
    if (data.status === 'PASS') {
      return { status: 'MATCH', icon: '✅', variant: 'success' };
    } else if (data.status === 'PARTIAL') {
      return { status: 'PARTIALLY_COMPATIBLE', icon: '⚠️', variant: 'warning' };
    } else {
      return { status: 'INCOMPATIBLE', icon: '❌', variant: 'danger' };
    }
  };

  const renderRequirementBreakdown = (breakdown: any) => {
    return Object.entries(breakdown).map(([key, data]: [string, any]) => {
      const reqStatus = getRequirementStatus(data);

      return (
        <Card key={key} className="mb-3 border-0 shadow-sm">
          <Card.Body>
            <div className="d-flex justify-content-between align-items-start mb-2">
              <h6 className="mb-0">{data.category}</h6>
              <div className="d-flex align-items-center">
                <Badge
                  bg={reqStatus.variant}
                  className="text-uppercase"
                  style={{ fontSize: '0.75rem' }}
                >
                  {reqStatus.status.replace('_', ' ')}
                </Badge>
              </div>
            </div>
            <div className="mb-2">
              <div
                className={`w-100 rounded`}
                style={{
                  height: '8px',
                  backgroundColor:
                    reqStatus.variant === 'success'
                      ? '#d4edda'
                      : reqStatus.variant === 'warning'
                      ? '#fff3cd'
                      : '#f8d7da',
                }}
              >
                <div
                  className={`h-100 rounded`}
                  style={{
                    width:
                      reqStatus.variant === 'success'
                        ? '100%'
                        : reqStatus.variant === 'warning'
                        ? '60%'
                        : '0%',
                    backgroundColor:
                      reqStatus.variant === 'success'
                        ? '#28a745'
                        : reqStatus.variant === 'warning'
                        ? '#ffc107'
                        : '#dc3545',
                  }}
                />
              </div>
            </div>
            <small className="text-muted">{data.details}</small>
          </Card.Body>
        </Card>
      );
    });
  };

  const compatibility = getCompatibilityStatus(eligibilityStatus, score);

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
                      <div>
                        <h4 className="mb-1">
                          <PersonFill className="me-2" />
                          {applicant.firstName} {applicant.lastName}
                        </h4>
                        <p className="mb-1 text-muted">
                          {applicant.licenseType} • {applicant.yearsExperience} years experience
                        </p>
                        <p className="mb-0 text-muted">
                          {applicant.location} • {applicant.phone}
                        </p>
                      </div>
                    </div>

                    <Badge
                      bg={compatibility.variant}
                      className="me-2"
                      style={{ fontSize: '1rem', padding: '0.6rem 1.2rem' }}
                    >
                      {compatibility.label}
                    </Badge>

                    {applicant.hasApplied && (
                      <Badge bg="info" style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}>
                        Applied to this job
                      </Badge>
                    )}

                    <div className="mt-2">
                      <small className="text-muted">{compatibility.description}</small>
                    </div>
                  </Col>
                  <Col md={4} className="text-end">
                    <Link href={`/dashboard/company/applicants/${applicant.id}/edit`}>
                      <a>
                        <Button variant="outline-primary">View Full Profile</Button>
                      </a>
                    </Link>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            {/* Detailed Requirement Analysis */}
            <Card className="mb-4 border-0 shadow-sm">
              <Card.Header className="bg-white border-bottom">
                <h5 className="mb-0">
                  <TrophyFill className="me-2 text-warning" />
                  Job Requirement Analysis
                </h5>
              </Card.Header>
              <Card.Body>{renderRequirementBreakdown(detailedBreakdown)}</Card.Body>
            </Card>

            {/* Analysis Details */}
            <Row>
              <Col md={6}>
                <Card className="mb-4 border-0 shadow-sm h-100">
                  <Card.Header className="bg-success text-white">
                    <CheckCircleFill className="me-2" />
                    Strong Matches
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
                      <p className="text-muted mb-0">No strong matches identified</p>
                    )}
                  </Card.Body>
                </Card>
              </Col>

              <Col md={6}>
                <Card className="mb-4 border-0 shadow-sm h-100">
                  <Card.Header className="bg-danger text-white">
                    <XCircleFill className="me-2" />
                    Missing Requirements
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
                      <p className="text-muted mb-0">No missing requirements</p>
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
                        Additional Strengths
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
                        Areas of Concern
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
