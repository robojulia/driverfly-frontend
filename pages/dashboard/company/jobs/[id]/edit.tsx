import { toast } from 'react-toastify';

import { useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../../../../hooks/use-auth';
import { useTranslation } from '../../../../../hooks/use-translation';
import { useEffectAsync } from '../../../../../utils/react';

import FullLayout from '../../../../../components/dashboard/layouts/layout/full-layout';
import ChildPageLayout from '../../../../../components/layouts/page/child-page-layout';
import { JobForm } from '../../../../../components/forms/company/job-form';

import JobApi from '../../../../api/job';
import { JobEntity } from '../../../../../models/job/job.entity';

export default function EditJob({ id }) {
  const router = useRouter();
  const { t } = useTranslation();

  const { user } = useAuth();

  const backPath = `/dashboard/company/jobs`; ///${id}`;

  const goBack = () => window.setTimeout(() => router.push(backPath), 2000);

  const [job, setJob] = useState(new JobEntity());

  useEffectAsync(async () => {
    if (!user) return;
    if (id) {
      const api = new JobApi();

      const entity = await api.getById(+id);

      entity.required_skills.forEach((skill) => {
        if (!Number.isInteger(skill.years)) {
          skill.months = Math.round((skill.years % 1) * 12);
          skill.years = Math.floor(skill.years);
        }
      });

      entity.min_experience_in_months = null;
      entity.min_experience_in_years = null;
      if (entity.min_years_experience) {
        entity.min_experience_in_months = Math.round((entity.min_years_experience % 1) * 12);
        entity.min_experience_in_years = Math.floor(entity.min_years_experience);
      }

      if (entity && entity.company.id == user.company?.id) setJob(entity);
      else {
        toast.error(t('UNABLE_TO_FIND_{name}', { name: 'JOB' }, { translateProps: true }));
        goBack();
      }
    } else {
      toast.error(t('UNABLE_TO_FIND_{name}', { name: 'JOB' }, { translateProps: true }));
      goBack();
    }
  }, [user, id]);

  return (
    <ChildPageLayout
      title={t('EDIT_{name}', { name: 'JOB' }, { translateProps: true })}
      backPath={backPath}
    >
      <JobForm entity={job} onSaveComplete={goBack} type="edit" />
    </ChildPageLayout>
  );
}

EditJob.getLayout = function getLayout(page) {
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
    console.error('EditJob error:', error);
    return { props: { id: null } };
  }
}
