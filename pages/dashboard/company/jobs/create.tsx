import { useRouter } from 'next/router';
import { useEffect, useState, useCallback, useMemo } from 'react';
import FullLayout from '../../../../components/dashboard/layouts/layout/full-layout';
import { JobForm } from '../../../../components/forms/company/job-form';
import ChildPageLayout from '../../../../components/layouts/page/child-page-layout';
import { useTranslation } from '../../../../hooks/use-translation';
import { JobEntity } from '../../../../models/job/job.entity';
import JobApi from '../../../api/job';

export default function CreateJob() {
  const [cloneJob, setCloneJob] = useState<JobEntity>(null);

  const { t } = useTranslation();
  const router = useRouter();
  const jobApi = useMemo(() => new JobApi(), []);

  const fetchJobToClone = useCallback(async () => {
    const { clone } = router.query;
    if (clone) {
      try {
        const jobData = await jobApi.getById(+clone);

        const cleanedJob = {
          ...jobData,
          id: undefined,
          applicantsCount: undefined,
        };

        setCloneJob(cleanedJob);
      } catch (error) {
        console.error('Error fetching job to clone:', error);
      }
    }
  }, [router.query, jobApi]);

  useEffect(() => {
    fetchJobToClone();
  }, [fetchJobToClone]);

  const handleJobSaveComplete = (savedJob: JobEntity) => {
    router.push('/dashboard/company/jobs?success=true');
  };

  return (
    <ChildPageLayout title={t('CREATE_{name}', { name: 'JOB' }, { translateProps: true })}>
      <JobForm onSaveComplete={handleJobSaveComplete} entity={cloneJob} />
    </ChildPageLayout>
  );
}

CreateJob.getLayout = function getLayout(page) {
  return <FullLayout>{page}</FullLayout>;
};
