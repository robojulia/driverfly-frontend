import { useTranslation } from '../../hooks/use-translation';
import React from 'react';
import Link from 'next/link';
import { ViewApplicantDetailProps } from '../../types/applicant/view-application-detail-props.type';
import { ApplicantSuggestedJobEntity } from '../../models/applicant/applicant-suggested-job.entity';
import Section from '../view-details/section';
import { Row, Col } from 'react-bootstrap';

interface ApplicantConsiderForProps extends ViewApplicantDetailProps {
  applicantSuggestedJobs?: ApplicantSuggestedJobEntity[];
}

export default function ApplicantConsiderFor({
  applicant,
  applicantSuggestedJobs,
}: ApplicantConsiderForProps) {
  const { t } = useTranslation();
  const items = applicantSuggestedJobs || [];
  return (
    <Row>
      <Col md="12" className="p-0 px-lg-2">
        <Section title={t('CONSIDER_{name}_FOR', { name: applicant?.first_name })}>
          {items.length === 0 ? (
            <div className="text-muted">{t('NONE')}</div>
          ) : (
            <div>
              {items.map((sJob, idx) => (
                <div key={idx} className="py-2 border-bottom">
                  <Link href={`/jobs/${sJob.job.id}/${sJob.job.title}`}>{sJob.job.title}</Link>
                </div>
              ))}
            </div>
          )}
        </Section>
      </Col>
    </Row>
  );
}
