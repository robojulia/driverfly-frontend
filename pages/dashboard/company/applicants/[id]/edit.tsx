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
import CompanyApi from '../../../../api/company';
import ViewCard from '../../../../../components/view-details/view-card';
import { ApplicantExtras as ApplicantExtrasEnum } from '../../../../../enums/applicants/applicant-extras.enum';

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

      {/* DOT Verification Results (Owner Operator only) */}
      {applicant?.is_owner_operator && (
        <Row className="mt-3">
          <Col>
            <ViewCard title="DOT Verification Results">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <div>
                  {(applicant?.extras?.find((e) => e.type === ApplicantExtrasEnum.DOT_VERIFICATION_RESULTS)?.value || [])
                    .map((token: string, idx: number) => (
                      <div key={idx} className="text-monospace">{token}</div>
                    ))}
                  {!(applicant?.extras?.find((e) => e.type === ApplicantExtrasEnum.DOT_VERIFICATION_RESULTS)?.value || []).length && (
                    <div className="text-muted">No results found</div>
                  )}
                </div>
                <div>
                  <Button
                    type="button"
                    onClick={async () => {
                      try {
                        const companyApi = new CompanyApi();
                        const applicantApi = new ApplicantApi();
                        const dot_number = applicant?.extras?.find((e) => e.type === ApplicantExtrasEnum.DOT_NUMBER)?.value;
                        const business_name = applicant?.extras?.find((e) => e.type === ApplicantExtrasEnum.BUSINESS_NAME)?.value;
                        if (!dot_number) return toast.error('DOT number not found');
                        const tokens = await companyApi.dotVerify({
                          dot_number,
                          email: applicant?.email,
                          phone: applicant?.phone,
                          address_1: applicant?.address_1 || applicant?.street,
                          city: applicant?.city,
                          state: applicant?.state,
                          zip_code: applicant?.zip_code,
                          business_name,
                        });
                        const newTokens = Array.isArray(tokens) && tokens.length ? tokens[0] : [];
                        const others = (applicant?.extras || []).filter((e) => e.type !== ApplicantExtrasEnum.DOT_VERIFICATION_RESULTS);
                        const updated = {
                          type: ApplicantExtrasEnum.DOT_VERIFICATION_RESULTS,
                          value: newTokens,
                        } as any;
                        const newExtras = [...others, updated];
                        const saved = await applicantApi.update(applicant.id, { extras: newExtras } as any);
                        setApplicant({ ...saved });
                        toast.success('DOT verification refreshed');
                      } catch (e) {
                        toast.error('Failed to refresh DOT verification');
                      }
                    }}
                  >
                    Refresh
                  </Button>
                </div>
              </div>
            </ViewCard>
          </Col>
        </Row>
      )}

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
