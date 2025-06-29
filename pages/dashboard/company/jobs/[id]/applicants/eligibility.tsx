import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import FullLayout from '../../../../../../components/dashboard/layouts/layout/full-layout';
import ChildPageLayout from '../../../../../../components/layouts/page/child-page-layout';
import { useAuth } from '../../../../../../hooks/use-auth';
import { useTranslation } from '../../../../../../hooks/use-translation';
import { EligibilityTable } from '../../../../../../components/eligibility';
import { JobEntity } from '../../../../../../models/job/job.entity';
import { globalAjaxExceptionHandler } from '../../../../../../utils/ajax';
import JobApi from '../../../../../api/job';
import styles from '../../../../../../styles/eligibility.module.css';

export default function JobApplicantsEligibility({ id }) {
  const router = useRouter();
  const { t } = useTranslation();
  const { hasPermission, company } = useAuth();
  const [job, setJob] = useState<JobEntity>(new JobEntity());
  const [loading, setLoading] = useState(true);

  const backPath = `/dashboard/company/jobs/${id}`;

  const goBack = () => window.setTimeout(() => router.push(backPath), 2000);

  useEffect(() => {
    const loadJob = async () => {
      if (!id) {
        toast.error(t('UNABLE_TO_FIND_{name}', { name: t('JOB') }));
        goBack();
        return;
      }

      try {
        setLoading(true);
        const api = new JobApi();
        const data = await api.getById(+id);

        if (!data || data.company.id !== company?.id) {
          toast.error(t('UNABLE_TO_FIND_{name}', { name: t('JOB') }));
          goBack();
          return;
        }

        setJob(data);
      } catch (error) {
        globalAjaxExceptionHandler(error, {
          toast: toast,
          t: t,
          defaultMessage: 'UNABLE_TO_LOAD_JOB',
        });
        goBack();
      } finally {
        setLoading(false);
      }
    };

    loadJob();
  }, [id, company]);

  // Check permissions
  const canView = hasPermission('CanViewJob');

  if (!canView) {
    return (
      <ChildPageLayout backPath={backPath} title="Access Denied">
        <div className={styles.eligibilityContainer}>
          <div
            className={`${styles.bgDanger} ${styles.textWhite} ${styles.p3} ${styles.rounded} ${styles.textCenter}`}
          >
            You don't have permission to view job applicants.
          </div>
        </div>
      </ChildPageLayout>
    );
  }

  const title = `Applicant Eligibility Analysis - ${job.title || 'Job'}`;

  return (
    <ChildPageLayout backPath={backPath} title={title}>
      <div className={styles.eligibilityContainer}>
        {/* Header Information */}
        <div className={styles.mb4}>
          <h2
            className={`${styles.text2xl} ${styles.fontSemibold} ${styles.mb2} ${styles.textSecondary}`}
          >
            Eligibility Analysis
          </h2>
          <p className={`${styles.textGray600} ${styles.mb3}`}>
            Discover which applicants are the best fit for <strong>{job.title}</strong>. Our
            AI-powered matching algorithm evaluates candidates based on requirements, experience,
            location, and more.
          </p>
        </div>

        {/* Eligibility Table */}
        {!loading && job.id ? (
          <EligibilityTable jobId={job.id} />
        ) : (
          <div className={`${styles.textCenter} ${styles.p4}`}>
            <div className={styles.loadingSpinner}></div>
            <p className={`${styles.mt2} ${styles.textGray500}`}>Loading job information...</p>
          </div>
        )}
      </div>
    </ChildPageLayout>
  );
}

JobApplicantsEligibility.getLayout = function getLayout(page) {
  return <FullLayout>{page}</FullLayout>;
};

export async function getServerSideProps(context) {
  try {
    const id = +context.params?.id;
    if (!id) {
      return { notFound: true };
    }

    return {
      props: { id: id },
    };
  } catch (error) {
    console.error('JobApplicantsEligibility error:', error);
    return { props: { id: null } };
  }
}
