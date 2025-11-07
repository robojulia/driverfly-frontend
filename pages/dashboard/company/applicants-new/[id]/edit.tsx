import { useRouter } from 'next/router';
import Link from 'next/link';
import { useCallback, useMemo, useState } from 'react';
import { Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import FullLayout from '../../../../../components/dashboard/layouts/layout/full-layout';
import { EditApplicantFormNew } from '../../../../../components/forms/company/edit-applicant-form-new';
import ChildPageLayout from '../../../../../components/layouts/page/child-page-layout';
import { useTranslation } from '../../../../../hooks/use-translation';
import { ApplicantEntity } from '../../../../../models/applicant/applicant.entity';
import { ApplicantSuggestedJobEntity } from '../../../../../models/applicant/applicant-suggested-job.entity';
import { useEffectAsync } from '../../../../../utils/react';
import ApplicantApi from '../../../../api/applicant';
import { HireApplicantForm } from '../../../../../components/forms/company/hire-applicant-form';
// DOT verification panel is now rendered inside EditApplicantForm

export default function EditApplicant({ id }) {
  const router = useRouter();
  const { t } = useTranslation();

  const backPath = '/dashboard/company/applicants';

  const goBack = () => window.setTimeout(() => router.back(), 2000);

  const [applicant, setApplicant] = useState(new ApplicantEntity());
  const [eligibility, setEligibility] = useState<any>(null);
  const [refetchApplicant, setRefetchApplicant] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [applicantSuggestedJobs, setApplicantSuggestedJobs] = useState<ApplicantSuggestedJobEntity[]>([]);

  useEffectAsync(async () => {
    if (id) {
      const api = new ApplicantApi();

      const entity = await api.getById(+id, true, ['documents', 'notes', 'jobs', 'extras', 'dac', 'employers', 'accident_history', 'moving_violation_history', 'equipment_experience', 'equipment_owned']);
      const suggestedJobs = await api.suggestedJobs.get(id);
      setApplicantSuggestedJobs(suggestedJobs || []);

      if (entity) {
        setApplicant(entity);
        // Extract eligibility from the response if it exists
        if ((entity as any).eligibility) {
          setEligibility((entity as any).eligibility);
        }
      } else {
        toast.error(t('UNABLE_TO_FIND_{name}', { name: 'APPLICANT' }, { translateProps: true }));
        goBack();
      }
    } else {
      toast.error(t('UNABLE_TO_FIND_{name}', { name: 'APPLICANT' }, { translateProps: true }));
      goBack();
    }
  }, [id, refetchApplicant]);

  // No page refresh after save; forms show their own success/failure notifications

  return (
    <ChildPageLayout
      title={t('EDIT_{name}', { name: 'APPLICANT' }, { translateProps: true })}
      backPath={backPath}
      actions={(
        <div className="d-flex align-items-center" style={{ gap: 8 }}>
          <HireApplicantForm entity={applicant} />
          <Button
            type="button"
            className={`btn btn-light`}
            onClick={() => router.push(backPath)}
          >
            {t('BACK')}
          </Button>
        </div>
      )}
    >
      <nav aria-label="breadcrumb" className="px-2 mb-2">
        <div className="d-flex align-items-center small text-muted">
          <Link href="/dashboard"><a className="text-muted text-decoration-none">Dashboard</a></Link>
          <span className="mx-2">&gt;</span>
          <Link href="/dashboard/company/applicants"><a className="text-muted text-decoration-none">Applicants</a></Link>
          <span className="mx-2">&gt;</span>
          <strong className="text-dark">Edit Applicant</strong>
        </div>
      </nav>
      {/* Identity summary and sticky sub-nav removed per design direction */}

      <EditApplicantFormNew
        entity={applicant}
        setEntity={setApplicant}
        isSubmitting={isSubmitting}
        setIsSubmitting={setIsSubmitting}
        applicantSuggestedJobs={applicantSuggestedJobs}
        hideHeaderActions
      />
    </ChildPageLayout>
  );
}

EditApplicant.getLayout = function getLayout(page) {
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
    console.error('EditApplicant error:', error);
    return { props: { id: null } };
  }
}


