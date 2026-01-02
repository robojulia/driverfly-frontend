import { toast } from 'react-toastify';

import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Button, Container, Card } from 'react-bootstrap';
import { XCircleFill, ShieldFillX, ArrowLeft } from 'react-bootstrap-icons';
import { useAuth } from '../../../../../hooks/use-auth';
import { useTranslation } from '../../../../../hooks/use-translation';
import { useEffectAsync } from '../../../../../utils/react';
import { globalAjaxExceptionHandler } from '../../../../../utils/ajax';

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
  const [error, setError] = useState<{ status: number; message: string } | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffectAsync(async () => {
    if (!user) return;
    if (id) {
      try {
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

        if (entity && entity.company.id == user.company?.id) {
          setJob(entity);
          setLoading(false);
        } else {
          setError({
            status: 404,
            message: t('UNABLE_TO_FIND_{name}', { name: 'JOB' }, { translateProps: true })
          });
          setLoading(false);
        }
      } catch (error: any) {
        console.error('Error loading job:', error);

        // Handle 403 Forbidden and 404 Not Found the same way (don't reveal if resource exists)
        if (error?.response?.status === 403 || error?.response?.status === 404) {
          setError({
            status: 404,
            message: t('UNABLE_TO_FIND_{name}', { name: 'JOB' }, { translateProps: true })
          });
          setLoading(false);
          return;
        }

        // For other errors, set generic error message
        setError({
          status: error?.response?.status || 500,
          message: t('ERROR_MESSAGE_DEFAULT')
        });
        setLoading(false);
      }
    } else {
      setError({
        status: 404,
        message: t('UNABLE_TO_FIND_{name}', { name: 'JOB' }, { translateProps: true })
      });
      setLoading(false);
    }
  }, [user, id]);

  // Show nothing while loading (prevents flash of default content)
  if (loading && !error) {
    return null;
  }

  // If error exists, show full-page error instead of normal content
  if (error) {
    return (
      <ChildPageLayout
        backPath={backPath}
        title={t('JOB_NOT_FOUND')}
      >
        <Container className="py-5">
          <Card className="border-0 shadow-sm">
            <Card.Body className="text-center py-5">
              <div className="mb-4">
                <XCircleFill size={64} className="text-danger mb-3" />
                <h4 className="mb-3">{t('JOB_NOT_FOUND')}</h4>
                <p className="text-muted mb-4">{error.message}</p>
                <Link href={backPath}>
                  <Button variant="primary">
                    <ArrowLeft className="me-2" />
                    {t('BACK_TO_JOBS')}
                  </Button>
                </Link>
              </div>
            </Card.Body>
          </Card>
        </Container>
      </ChildPageLayout>
    );
  }

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
