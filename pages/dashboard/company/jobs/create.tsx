import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
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
  const jobApi = new JobApi();

  const fetchJobToClone = async () => {
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
  };

  useEffect(() => {
    fetchJobToClone();
  }, [router.query]);

  const handleJobSaveComplete = (savedJob: JobEntity) => {
    router.push(`/dashboard/company/jobs/${savedJob.id}`);
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
