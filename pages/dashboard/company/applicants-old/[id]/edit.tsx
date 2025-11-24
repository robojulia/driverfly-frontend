import { useRouter } from 'next/router';
import { useState } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { toast } from 'react-toastify';
import OnboardingChecklist from '../../../../../components/applicants/onboarding-checklist';
import { ApplicantEligibilityHeader } from '../../../../../components/applicants/applicant-eligibility-header';
import FullLayout from '../../../../../components/dashboard/layouts/layout/full-layout';
import { EditApplicantForm } from '../../../../../components/forms/company/edit-applicant-form';
import ChildPageLayout from '../../../../../components/layouts/page/child-page-layout';
import { useTranslation } from '../../../../../hooks/use-translation';
import { ApplicantEntity } from '../../../../../models/applicant/applicant.entity';
import { useEffectAsync } from '../../../../../utils/react';
import ApplicantApi from '../../../../api/applicant';
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

  useEffectAsync(async () => {
    if (id) {
      const api = new ApplicantApi();

      const entity = await api.getById(+id, true);

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

  const onSaveComplete = () => {
    setRefetchApplicant(!refetchApplicant);
  };

  return (
    <ChildPageLayout
      title={t('EDIT_{name}', { name: 'APPLICANT' }, { translateProps: true })}
      backPath={backPath}
    >
      {/* Company Eligibility Section */}
      <ApplicantEligibilityHeader eligibility={eligibility} />

      {/* DOT Verification panel moved inside EditApplicantForm */}

      <EditApplicantForm
        entity={applicant}
        setEntity={setApplicant}
        isSubmitting={isSubmitting}
        setIsSubmitting={setIsSubmitting}
        onSaveComplete={onSaveComplete}
      />
      {applicant?.id && (
        <Row>
          <Col>
            <OnboardingChecklist
              showHistory
              title="ONBOARDING_DOCUMENTS"
              applicant={applicant}
              canEdit={!Boolean(applicant?.is_hired)}
              showCompleted={true}
              canEditSafetyPerformance={true}
              showResendButton={true}
              onUpdateDocument={(doc) => {
                setApplicant({
                  ...applicant,
                  documents: [...applicant.documents, { ...doc }],
                });
              }}
              onDeleteDocument={(doc) => {
                const updatedDocuments = applicant.documents?.filter((v) => v.id != doc.id);
                setApplicant({
                  ...applicant,
                  documents: [...updatedDocuments],
                });
              }}
            />
            {/* <ViewApplicantDqf canEdit={true} applicant={applicant} /> */}
          </Col>
        </Row>
      )}
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
