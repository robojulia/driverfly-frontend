import { useRouter } from 'next/router';
import { useState } from 'react';
import { toast } from 'react-toastify';
import FullLayout from '../../../../../components/dashboard/layouts/layout/full-layout';
import ChildPageLayout from '../../../../../components/layouts/page/child-page-layout';
import { JobDashboard } from '../../../../../components/job-dashboard/JobDashboard';
import { useAuth } from '../../../../../hooks/use-auth';
import { useTranslation } from '../../../../../hooks/use-translation';
import { useEffectAsync } from '../../../../../utils/react';
import { JobEntity } from '../../../../../models/job/job.entity';
import { globalAjaxExceptionHandler } from '../../../../../utils/ajax';
import JobApi from '../../../../api/job';

export default function ViewJob({ id }) {
  const router = useRouter();
  const { t } = useTranslation();
  const { company } = useAuth();
  const [job, setJob] = useState<JobEntity>(new JobEntity());
  const [loading, setLoading] = useState(true);

  const backPath = '/dashboard/company/jobs';
  const goBack = () => window.setTimeout(() => router.push(backPath), 2000);

  useEffectAsync(async () => {
    if (id) {
      try {
        setLoading(true);
        const api = new JobApi();
        const data = await api.getById(+id);

        if (!data || data.company.id != company?.id) {
          toast.error(t('UNABLE_TO_FIND_{name}', { name: t('JOB') }));
          goBack();
          return;
        }

        setJob(data);
      } catch (error) {
        toast.error(t('UNABLE_TO_FIND_{name}', { name: 'JOB' }, { translateProps: true }));
        goBack();
      } finally {
        setLoading(false);
      }
    } else {
      toast.error(t('UNABLE_TO_FIND_{name}', { name: 'JOB' }, { translateProps: true }));
      goBack();
    }
  }, [id, company]);

  async function onJobDelete() {
    try {
      const api = new JobApi();
      await api.remove(+id);
      toast.success(
        t(
          'Forms.SUCCESS_{action}_{name}',
          { action: 'Forms.Deleted', name: 'JOB' },
          { translateProps: true }
        )
      );
      goBack();
    } catch (e) {
      globalAjaxExceptionHandler(e, { toast: toast, t: t, defaultMessage: 'UNABLE_TO_DELETE' });
    }
  }

  function onJobUpdate(updatedJob: JobEntity) {
    setJob(updatedJob);
  }

  if (loading) {
    return (
      <ChildPageLayout
        backPath={backPath}
        title={t('VIEW_{name}', { name: 'JOB' }, { translateProps: true })}
      >
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ minHeight: '400px' }}
        >
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </ChildPageLayout>
    );
  }

  return (
    <ChildPageLayout backPath={backPath} title={`Job Dashboard: ${job.title || 'Loading...'}`}>
      {job.id && <JobDashboard job={job} onJobUpdate={onJobUpdate} onJobDelete={onJobDelete} />}
    </ChildPageLayout>
  );
}

ViewJob.getLayout = function getLayout(page) {
  return <FullLayout>{page}</FullLayout>;
};

export async function getServerSideProps(context) {
  try {
    const id = +context.params?.id;
    if (!id) return { notFound: true };

    return {
      props: { id: id },
    };
  } catch (error) {
    console.error('ViewApplicant error:', error);
    return { props: { id: null } };
  }
}
