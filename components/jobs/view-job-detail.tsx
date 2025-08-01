import Link from 'next/link';
import React from 'react';
import { Button, Col, Container, Row } from 'react-bootstrap';
import { ArrowRight, CurrencyDollar } from 'react-bootstrap-icons';
import { useAuth } from '../../hooks/use-auth';
import { useTranslation } from '../../hooks/use-translation';
import { useJobAnalytics } from '../../hooks/use-job-analytics';
import { ViewJobDetailProps } from '../../types/job/view-job-detail-props.type';
import { buildAddress } from '../../utils/common';
import { EnhancedJobApply } from '../apply/enhanced-job-apply';
import SaveJob from '../dashboard/driver/save-job';
import FlagJob from '../flag/flag-a-job';
import JobDescription from '../job-description/job-description';
import JonInformation from '../job-information-sidebar/job-information';
import ViewModal from '../view-details/view-modal';
import CompanyPhoto from './company-photo';
import JobVehicles from './job-vehicles';
import ShowFormattedDate from './show-formatted-date';
import { isExpired } from '../../utils/date';
import { ShowUsFormattedDateTime } from '../../utils/show-us-formatted-date-time';
import JobApply from '../apply';

export default function ViewJobDetail(props: ViewJobDetailProps) {
  const {
    className,
    job,
    relatedJobs,
    canApply,
    canSave,
    hideVehicles,
    viewAllJobsLink,
    hideCompanyName,
    hideSocialLinks,
    quick_apply,
  } = props;

  const { t } = useTranslation();
  const [encourageModal, setEncourageModal] = React.useState(false);
  const { user, company } = useAuth();
  const { trackJobClick, trackApplicationStart } = useJobAnalytics();

  // Create click handlers for analytics
  const handleQuickApplyClick = () => {
    trackJobClick(job.id, job.company?.id, 'apply-button');
    trackApplicationStart(job.id, job.company?.id);
  };

  const handleApplyNowClick = () => {
    trackJobClick(job.id, job.company?.id, 'apply-button');
    trackApplicationStart(job.id, job.company?.id);
  };

  const handleCompanyClick = () => {
    trackJobClick(job.id, job.company?.id, 'company-name');
  };

  return (
    <section className="top-links-sec ort-general p-3 vehicle-img">
      <FlagJob jobId={job.id} />

      <Container className="p-0">
        <Row>
          <Col md={9}>
            <div className="ort-inner ">
              <div className=" company_photo media align-items-center bg-transparent border-0 p-0">
                <span className="text-dark text-center text-decoration-none">
                  <CompanyPhoto className="d-flex mr-4 truck-img mb-3" company={job.company} />
                  {viewAllJobsLink && (
                    <Link href={viewAllJobsLink}>
                      <a style={{ color: 'black' }}>
                        {t('view_all_jobs')} <ArrowRight className="pl-1" />
                      </a>
                    </Link>
                  )}
                </span>
                <div className="media-body">
                  <h4 className="mt-0">
                    {job.title}{' '}
                    {isExpired(job.expiry_date) && (
                      <span className="text-danger">({t('EXPIRED')})</span>
                    )}
                  </h4>
                  <div className="job-date-author">
                    <ShowFormattedDate
                      date={job.created_at}
                      showTimeSince
                      labelPrefix="POSTED"
                      labelPostfix="AGO"
                    />
                    {!!!hideCompanyName && job.company?.name && (
                      <>
                        {t('BY')}{' '}
                        <Link href={`/employer/${job?.company?.slug}`}>
                          <span
                            role="button"
                            className="employer text-theme"
                            onClick={handleCompanyClick}
                          >
                            {job?.company?.name}
                          </span>
                        </Link>
                      </>
                    )}
                  </div>
                  <div className="job-metas">
                    <div className="job-location d-flex align-items-center">
                      <p className="pr-4 m-0">{buildAddress(job.location)}</p>
                    </div>
                    <div>
                      <p>
                        <CurrencyDollar />
                        {job.min_weekly_pay || 0} - {job.max_weekly_pay || 0} {t('PER_WEEK')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Col>
          <Col md={3}>
            {!!quick_apply ? (
              /* Quick Apply - Special scenario for suggested jobs */
              <div className="ort-btn mt-lg-4 mt-0">
                <Link href={`/apply/suggested-job/${quick_apply}/${job.id}`}>
                  <button
                    type="button"
                    className="btn theme-primary-btn"
                    onClick={handleQuickApplyClick}
                  >
                    {' '}
                    {t('QUICK_APPLY')}
                    <ArrowRight />
                  </button>
                </Link>
              </div>
            ) : canApply ? (
              /* Enhanced apply for all users who can apply */
              <EnhancedJobApply setEncourageModal={setEncourageModal} job={job} />
            ) : (
              /* Fallback for users who cannot apply */
              <JobApply job={job} setEncourageModal={setEncourageModal} />
            )}

            {!company?.id && canSave && <SaveJob job={job} />}
          </Col>
        </Row>
      </Container>

      <div className="job-deatails-sec">
        <Container className="p-0">
          <Row>
            <Col lg={8}>
              <JobDescription job={job} />
              {!!!hideVehicles && <JobVehicles job={job} />}
              {/* {!!!hideSocialLinks && < SocilShare />} */}
              {relatedJobs || <></>}
            </Col>
            <Col lg={4}>
              <JonInformation job={job} />
            </Col>
          </Row>
        </Container>
      </div>
    </section>
  );
}
