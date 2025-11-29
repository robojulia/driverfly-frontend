import { toast } from 'react-toastify';

import { Button, Col, OverlayTrigger, Row, Tooltip } from 'react-bootstrap';
import { Pencil, PlusLg, Trash, ChatDots } from 'react-bootstrap-icons';

import FullLayout from '../../../../../components/dashboard/layouts/layout/full-layout';

import { useFormik } from 'formik';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useState } from 'react';
import BaseTextArea from '../../../../../components/forms/base-text-area';
import Section from '../../../../../components/view-details/section';
import ViewModal from '../../../../../components/view-details/view-modal';
import ViewPdf from '../../../../../components/view-details/view-pdf';
import ViewTable from '../../../../../components/view-details/view-table';
import { useAuth } from '../../../../../hooks/use-auth';
import { useTranslation } from '../../../../../hooks/use-translation';
import { useEffectAsync } from '../../../../../utils/react';

import { ApplicantNoteEntity } from '../../../../../models/applicant/applicant-note.entity';
import { ApplicantEntity } from '../../../../../models/applicant/applicant.entity';

import FlagApplicant from '../../../../../components/flag/flag-a-applicant';
import ChildPageLayout from '../../../../../components/layouts/page/child-page-layout';
import { ApplicantSuggestedJobEntity } from '../../../../../models/applicant/applicant-suggested-job.entity';
import { globalAjaxExceptionHandler } from '../../../../../utils/ajax';
import ApplicantApi from '../../../../api/applicant';
import DocumentApi from '../../../../api/document';

import ApplicantJobsAppliedTo from '../../../../../components/applicants/applicant-jobs-applied-to';
import ApplicantJobsApplied from '../../../../../components/applicants/applicant-jobs-applied';
import ApplicantSafetyBackground from '../../../../../components/applicants/applicant-safety-background';
import ViewApplicantDetail from '../../../../../components/applicants/applicant-view-details';
import ApplicantWorkHistory from '../../../../../components/applicants/applicant-work-history';
import { ApplicantMessages } from '../../../../../components/applicants/applicant-messages';
import { ApplicantDocumentType } from '../../../../../enums/applicants/applicant-document-type.enum';
import { ApplicantOnBoardingChecklist } from '../../../../../enums/applicants/applicant-onboarding-checklist.enum';
import CompanyApi from '../../../../api/company';
import { ApplicantBasicDetailsFormNew } from '../../../../../components/forms/company/applicant-basic-details-form-new';
import { ApplicantLicensingForm } from '../../../../../components/forms/company/applicant-licensing-form';
import { ApplicantWorkHistoryForm } from '../../../../../components/forms/company/applicant-work-history-form';
import { ApplicantEquipmentExperienceForm } from '../../../../../components/forms/company/applicant-equipment-experience-form';
import { ApplicantEquipmentOwnForm } from '../../../../../components/forms/company/applicant-equipment-own-form';
import { ApplicantSafetyBackgroundForm } from '../../../../../components/forms/company/applicant-safety-background-form';
import { ApplicantSignedAgreementsForm } from '../../../../../components/forms/company/applicant-signed-agreements-form';
import { ApplicantAlreadyWorkedForm } from '../../../../../components/forms/company/applicant-already-worked-form';
import OnboardingChecklist from '../../../../../components/applicants/onboarding-checklist';
import { ApplicantApplicationChecklistForm } from '../../../../../components/forms/company/applicant-application-checklist-form';
import { ApplicantNotesForm } from '../../../../../components/forms/company/applicant-notes-form';
import { ApplicantEmergencyContactForm } from '../../../../../components/forms/company/applicant-emergency-contact-form';
import { ApplicantPreferencesForm } from '../../../../../components/forms/company/applicant-preferences-form';

export default function ViewApplicant({ id }) {
  const router = useRouter();

  const { t } = useTranslation();

  const { hasPermission } = useAuth();

  const protectedFields = {
    license_number: hasPermission('CanViewApplicant.license_number'),
    social_security_number: hasPermission('CanViewApplicant.social_security_number'),
  };

  const [applicant, setApplicant] = useState<ApplicantEntity>(new ApplicantEntity());
  const [applicantSuggestedJobs, setApplicantSuggestedJobs] = useState<
    ApplicantSuggestedJobEntity[]
  >([]);

  const backPath = '/dashboard/company/applicants';

  const goBack = () => window.setTimeout(() => router.push(backPath), 2000);

  useEffectAsync(async () => {
    if (id) {
      const api = new ApplicantApi();

      const data = await api.getById(+id, false, ['documents', 'notes', 'jobs', 'extras', 'dac', 'employers', 'accident_history', 'moving_violation_history', 'equipment_experience', 'equipment_owned', 'assignedUser', 'referralSource']);

      const suggestedJobs = await api.suggestedJobs.get(id);
      setApplicantSuggestedJobs(suggestedJobs);

      if (!data) {
        toast.error(t('UNABLE_TO_FIND_{name}', { name: t('APPLICANT') }));
        goBack();
        return;
      }

      setApplicant({
        ...data,
        notes: data.notes.sort((a, b) => b.id - a.id),
      });
    } else {
      toast.error(t('UNABLE_TO_FIND_{name}', { name: 'APPLICANT' }, { translateProps: true }));
      goBack();
    }
  }, [id]);

  const [pdf, setPdf] = useState({});

  const viewDocumentClick = async (id, name) => {
    const api = new DocumentApi();

    const document = await api.getSignedUrl(id);

    if (document) {
      setPdf({
        name: `${t(name)} (${document.name})`,
        url: document.path,
      });
    }
  };

  const [showConfirmationModal, setShowConfirmationModal] = useState<boolean>(false);

  const addNoteForm = useFormik({
    initialValues: new ApplicantNoteEntity(),
    validationSchema: ApplicantNoteEntity.yupSchema(),
    onSubmit: async (values, { resetForm }) => {
      try {
        const applicantApi = new ApplicantApi();
        let note: ApplicantNoteEntity;
        let notes: ApplicantNoteEntity[] = applicant.notes;

        if (values.id) {
          note = await applicantApi.notes.update(applicant.id, values.id, values);
          notes = applicant.notes.filter((v) => v.id != note.id);
        } else {
          note = await applicantApi.notes.create(applicant.id, values);
        }
        notes.push(note);

        handleNoteModalClose();
        setApplicant({
          ...applicant,
          notes: notes.sort((a, b) => b.id - a.id),
        });
        resetForm();
      } catch (e) {
        globalAjaxExceptionHandler(e, {
          t: t,
          defaultMessage: 'UNABLE_TO_SAVE',
          toast: toast,
        });
      }
    },
  });

  const [addNoteVisible, setAddNoteVisible] = useState(false);
  const showNoteModal = () => setAddNoteVisible(true);
  const hideNoteModal = () => setAddNoteVisible(false);

  const handleNoteModalShow = () => {
    addNoteForm.setValues({ text: null });
    showNoteModal();
  };
  const handleNoteModalClose = () => {
    addNoteForm.setValues({ text: null });
    hideNoteModal();
  };

  const editNoteClick = (noteId: number) => {
    let note = applicant.notes.find((v) => v.id == noteId);
    addNoteForm.setValues({ id: noteId, text: note.text });
    showNoteModal();
  };

  const deleteNoteClick = async (noteId: number) => {
    addNoteForm.setValues({ id: noteId });
    setShowConfirmationModal(true);
  };

  const handleConfirmClick = async () => {
    try {
      const noteId = addNoteForm.values?.id;
      if (!!!noteId) {
        setShowConfirmationModal(false);
        return;
      }

      const applicantApi = new ApplicantApi();
      const response = await applicantApi.notes.remove(applicant.id, noteId);

      if (response.affected) {
        const notes = applicant.notes.filter((v) => v.id != noteId);
        setApplicant({
          ...applicant,
          notes: notes.sort((a, b) => b.id - a.id),
        });
      }

      setShowConfirmationModal(false);
      addNoteForm.resetForm();
    } catch (e) {
      globalAjaxExceptionHandler(e, {
        t: t,
        defaultMessage: 'UNABLE_TO_DELETE',
        toast: toast,
      });
    }
  };

  const onEditClick = async () => {
    await router.push(router.asPath + `/edit`);
  };

  const canEdit = hasPermission('CanUpdateApplicant');

  const scrollToMessages = () => {
    const messagesElement = document.getElementById('messages');
    if (messagesElement) {
      messagesElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const title = t('VIEW_{name}', { name: 'APPLICANT' }, { translateProps: true });

  const tooltip = <Tooltip id="my-tooltip">{t('APPLICANT_ALREADY_HIRED')}</Tooltip>;
  const canEditTooltip = <Tooltip id="my-tooltip">{t('EDIT_APPLICANT_PROFILE')}</Tooltip>;
  const messageTooltip = <Tooltip id="message-tooltip">{t('MESSAGE_APPLICANT')}</Tooltip>;

  return (
    <ChildPageLayout
      backPath={backPath}
      title={title}
      actions={
        <div className="d-flex gap-2">
          <OverlayTrigger
            trigger={["hover", "focus"]}
            delay={{ show: 0, hide: 0 }}
            overlay={messageTooltip}
          >
            <Button type="button" variant="info" onClick={scrollToMessages}>
              <ChatDots /> {t('MESSAGE')}
            </Button>
          </OverlayTrigger>
          {canEdit && (
            <OverlayTrigger
              trigger={["hover", "focus"]}
              delay={{ show: 0, hide: 0 }}
              overlay={Boolean(applicant?.is_hired) ? tooltip : canEditTooltip}
            >
              <div>
                <Button type="button" onClick={onEditClick} disabled={Boolean(applicant?.is_hired)}>
                  <Pencil /> {t('EDIT')}
                </Button>
              </div>
            </OverlayTrigger>
          )}
        </div>
      }
    >
      <nav aria-label="breadcrumb" className="px-2 mb-2">
        <div className="d-flex align-items-center small text-muted">
          <Link href="/dashboard"><a className="text-muted text-decoration-none">Dashboard</a></Link>
          <span className="mx-2">&gt;</span>
          <Link href="/dashboard/company/applicants"><a className="text-muted text-decoration-none">Applicants</a></Link>
          <span className="mx-2">&gt;</span>
          <strong className="text-dark">View Applicant</strong>
        </div>
      </nav>
      {Boolean(applicant.id) && (
        <>
          {/* Identity summary and sticky sub-nav removed per design direction */}
          {/* New read-only layout mirroring the edit page */}
          <div id="basic-info" />
          <Row className="px-2">
            <ApplicantBasicDetailsFormNew
              entity={{ ...applicant, is_hired: true }}
              setEntity={() => {}}
              isSubmitting={true}
              setIsSubmitting={() => {}}
              hideActions
              showLicensing={false}
              showPreferences={false}
            />
          </Row>
          
          {/* CDL Information */}
          <div id="licensing" />
          <ApplicantLicensingForm
            entity={{ ...applicant, is_hired: true }}
            setEntity={() => {}}
          />

          {/* Equipment experience */}
          <div id="equipment" />
          <Row className="px-2">
            <ApplicantEquipmentExperienceForm
              entity={{ ...applicant, is_hired: true }}
              setEntity={() => {}}
              isSubmitting={true}
              setIsSubmitting={() => {}}
              hideActions
              hideAddButton={true}
            />
          </Row>

          {/* Equipment owned (for owner-operators) */}
          <div id="equipment-owned" />
          <Row className="px-2">
            <ApplicantEquipmentOwnForm
              entity={{ ...applicant, is_hired: true }}
              setEntity={() => {}}
              isSubmitting={true}
              setIsSubmitting={() => {}}
            />
          </Row>

          {/* Previous Employment */}
          <div id="work-history" />
          <Row className="px-2">
            <ApplicantWorkHistoryForm
              entity={{ ...applicant, is_hired: true }}
              setEntity={() => {}}
              isSubmitting={true}
              setIsSubmitting={() => {}}
              hideActions
            />
          </Row>

          {/* Safety Background */}
          <div id="safety" />
          <Row className="px-2">
            <ApplicantSafetyBackgroundForm
              entity={{ ...applicant, is_hired: true }}
              setEntity={() => {}}
              isSubmitting={true}
              setIsSubmitting={() => {}}
              hideActions
            />
          </Row>

          {/* Already worked/applied at company */}
          <div id="already-worked" />
          <Row className="px-2">
            <ApplicantAlreadyWorkedForm
              entity={{ ...applicant, is_hired: true }}
              setEntity={() => {}}
              isSubmitting={true}
              setIsSubmitting={() => {}}
            />
          </Row>

          {/* Preferences */}
          <div id="preferences" />
          <ApplicantPreferencesForm entity={{ ...applicant, is_hired: true }} setEntity={() => {}} hideActions />

          {/* Job(s) Applied To */}
          <div id="jobs-applied-to" />
          <ApplicantJobsAppliedTo
            applicant={applicant}
            applicantSuggestedJobs={applicantSuggestedJobs || []}
          />

          {/* Uploaded Documents now shown inside Onboarding Documents card */}
          <div id="uploaded-documents" />

          {/* Onboarding Documents */}
          {applicant?.id && (
            <>
            <div id="onboarding-documents" />
            <Row className="px-2">
              <Col md="12" className="p-0 px-lg-2">
                <OnboardingChecklist
                  showHistory
                  title="ONBOARDING_DOCUMENTS"
                  useSectionContainer
                  applicant={applicant}
                  canEdit={false}
                  showCompleted={true}
                  canEditSafetyPerformance={false}
                  showResendButton={false}
                />
              </Col>
            </Row>
            </>
          )}

          {/* Application Checklist */}
          <div id="application-checklist" />
          <ApplicantApplicationChecklistForm
              entity={{ ...applicant, is_hired: true }}
              setEntity={() => {}}
            />

          {/* Notes */}
          <div id="notes" />
          <ApplicantNotesForm entity={{ ...applicant, is_hired: true }} setEntity={() => {}} />

          {/* Emergency Contact Information */}
          <div id="emergency-contact" />
          <ApplicantEmergencyContactForm entity={{ ...applicant, is_hired: true }} setEntity={() => {}} />

          {/* Text Messages */}
          <div id="messages" />
          <Row className="px-2">
            <Col md="12" className="p-0 px-lg-2">
              <ApplicantMessages applicant={applicant} />
            </Col>
          </Row>

        </>
      )}
    </ChildPageLayout>
  );
}

ViewApplicant.getLayout = function getLayout(page) {
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
    return { notFound: true };
  }
}


