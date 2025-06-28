import { useTranslation } from '../../hooks/use-translation';
import React from 'react';
import ViewCard from '../view-details/view-card';
import Link from 'next/link';
import ViewTable from '../view-details/view-table';
import { ViewApplicantDetailProps } from '../../types/applicant/view-application-detail-props.type';
import { ApplicantSuggestedJobEntity } from '../../models/applicant/applicant-suggested-job.entity';

interface ApplicantConsiderForProps extends ViewApplicantDetailProps {
  applicantSuggestedJobs?: ApplicantSuggestedJobEntity[];
}

export default function ApplicantConsiderFor({
  applicant,
  applicantSuggestedJobs,
}: ApplicantConsiderForProps) {
  const { t } = useTranslation();
  return (
    <ViewCard title={t('CONSIDER_{name}_FOR', { name: applicant?.first_name })}>
      <ViewTable
        type="OTHER_ROLES"
        headers={{
          role: 'ROLE',
        }}
        items={applicantSuggestedJobs.map((sJob) => ({
          role: <Link href={`/jobs/${sJob.job.id}/${sJob.job.title}`}>{sJob.job.title}</Link>,
        }))}
      />
    </ViewCard>
  );
}
