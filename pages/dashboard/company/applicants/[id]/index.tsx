import { toast } from 'react-toastify';

import { Button, Col, OverlayTrigger, Row, Tooltip } from 'react-bootstrap';
import { Pencil, PlusLg, Trash } from 'react-bootstrap-icons';

import FullLayout from '../../../../../components/dashboard/layouts/layout/full-layout';

import { useFormik } from 'formik';
import { useRouter } from 'next/router';
import { useState } from 'react';
import BaseTextArea from '../../../../../components/forms/base-text-area';
import ViewCard from '../../../../../components/view-details/view-card';
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

import ApplicantConsiderFor from '../../../../../components/applicants/applicant-consider-for';
import ApplicantJobsApplied from '../../../../../components/applicants/applicant-jobs-applied';
import ApplicantSafetyBackground from '../../../../../components/applicants/applicant-safety-background';
import ViewApplicantDetail from '../../../../../components/applicants/applicant-view-details';
import ApplicantWorkHistory from '../../../../../components/applicants/applicant-work-history';
import { ApplicantDocumentType } from '../../../../../enums/applicants/applicant-document-type.enum';
import CompanyApi from '../../../../api/company';
import { ApplicantExtras as ApplicantExtrasEnum } from '../../../../../enums/applicants/applicant-extras.enum';
import { useFeatureFlag } from '../../../../../context/feature-flag-context';

export default function ViewApplicant({ id }) {
  const router = useRouter();

  const { t } = useTranslation();

  const { hasPermission } = useAuth();
  const showDotVerification = useFeatureFlag('dotVerificationResults');

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

      const data = await api.getById(+id);

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

  const title = t('VIEW_{name}', { name: 'APPLICANT' }, { translateProps: true });

  const tooltip = <Tooltip id="my-tooltip">{t('APPLICANT_ALREADY_HIRED')}</Tooltip>;
  const canEditTooltip = <Tooltip id="my-tooltip">{t('EDIT_APPLICANT_PROFILE')}</Tooltip>;
  return (
    <ChildPageLayout backPath={backPath} title={title}>
      {Boolean(applicant.id) && (
        <>
          {canEdit && (
            <Row>
              <Col>
                {!!!Object.values(applicant?.jobs).length && (
                  <strong>
                    <em>
                      <p className="text-danger">{t('NO_JOB_TIED_WITH_APPLICANT')}</p>
                    </em>
                  </strong>
                )}
              </Col>
              <Col>
                <div style={{ float: 'right', marginBottom: '10px' }} className="assign_unassign">
                  <OverlayTrigger
                    trigger={['hover', 'focus']}
                    delay={{ show: 0, hide: 0 }}
                    overlay={Boolean(applicant?.is_hired) ? tooltip : canEditTooltip}
                  >
                    <div className="float-right mr-2">
                      <Button
                        type="button"
                        onClick={onEditClick}
                        disabled={Boolean(applicant?.is_hired)}
                      >
                        <Pencil /> {t('EDIT')}
                      </Button>
                    </div>
                  </OverlayTrigger>

                  {/* <ButtonGroup size="sm"> */}
                  {/* {applicant?.assignedUser ? (
                    <Button
                      type="button"
                      variant="danger"
                      onClick={onUnassignClick}
                    >
                      <BookmarkDash /> {t("UNASSIGN")}
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      className="theme-general-btn"
                      variant=""
                      onClick={onAssignClick}
                    >
                      <BookmarkCheck /> {t("ASSIGN_TO_ME")}
                    </Button>
                  )} */}
                  {/* <Button type="button" onClick={onEditClick}>
                    <Pencil /> {t("EDIT")}
                  </Button> */}
                  {/* </ButtonGroup> */}
                </div>
              </Col>
            </Row>
          )}
          <FlagApplicant applicantId={id} />
          <Row>
            <Col>
              <ViewApplicantDetail applicant={applicant} protectedFields={protectedFields} />
            </Col>
          </Row>
          {/* DOT Verification Results (Owner Operator only) */}
          {applicant?.is_owner_operator && showDotVerification && (
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
                            // Update in-place so UI reflects immediately; persistence happens when editing applicant
                            const others = (applicant?.extras || []).filter((e) => e.type !== ApplicantExtrasEnum.DOT_VERIFICATION_RESULTS);
                            const updated = {
                              type: ApplicantExtrasEnum.DOT_VERIFICATION_RESULTS,
                              value: newTokens,
                            } as any;
                            const newExtras = [...others, updated];
                            // Persist to backend so results are saved and summary stays updated
                            const saved = await applicantApi.update(
                              applicant.id,
                              {
                                first_name: applicant?.first_name,
                                last_name: applicant?.last_name,
                                extras: newExtras,
                              } as any,
                            );
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
          <Row>
            <Col lg={6}>
              <ApplicantWorkHistory applicant={applicant} />
            </Col>
            <Col lg={6}>
              {/* < ViewApplicantDAC applicant={applicant} /> */}
              {/* <ViewApplicantDqf applicant={applicant} /> */}
            </Col>
          </Row>
          <Row>
            <Col>
              <ApplicantSafetyBackground applicant={applicant} />
            </Col>
          </Row>
          <Row>
            <Col md="6">
              <ApplicantJobsApplied applicant={applicant} />
            </Col>
            {applicantSuggestedJobs && (
              <Col md="6">
                <ApplicantConsiderFor
                  applicant={applicant}
                  applicantSuggestedJobs={applicantSuggestedJobs}
                />
              </Col>
            )}
          </Row>
          <Row>
            <Col md="12">
              <ViewCard title="UPLOADED_DOCUMENTS">
                <ViewTable
                  type="DOCUMENTS"
                  headers={{
                    type: 'TYPE',
                    document: 'DOCUMENT',
                    date_added: 'DATE_ADDED',
                  }}
                  items={applicant?.documents
                    ?.filter((v) =>
                      Object.values(ApplicantDocumentType).includes(v.type as ApplicantDocumentType)
                    )
                    ?.map((document) => ({
                      type: t(`ApplicantDocumentType.${document.type}`),
                      document: (
                        <a onClick={() => viewDocumentClick(document.id, document.name)} href="#">
                          {document.name}
                        </a>
                      ),
                      date_added: new Date(document.created_at).toDateString(),
                    }))}
                />
              </ViewCard>
            </Col>
            <Col md="12">
              <ViewCard title="NOTES">
                <ViewTable
                  type="NOTES"
                  headers={{
                    notes: 'NOTES',
                    user: 'USER',
                    date: 'DATE',
                    action: (
                      <a
                        className="font-weight-bold"
                        role="button"
                        onClick={handleNoteModalShow}
                        hidden={Boolean(applicant?.is_hired)}
                      >
                        <PlusLg />
                      </a>
                    ),
                  }}
                  items={applicant?.notes?.map((v) => ({
                    notes: v.text,
                    user: `${v.user.first_name} ${v.user.last_name}`,
                    date: new Date(v.created_at).toDateString(),
                    action: (
                      <>
                        <a
                          className="mr-2 font-weight-bold"
                          role="button"
                          onClick={() => {
                            editNoteClick(v.id);
                          }}
                        >
                          <Pencil />
                        </a>
                        <a
                          className="mr-2font-weight-bold"
                          role="button"
                          onClick={() => {
                            deleteNoteClick(v.id);
                          }}
                        >
                          <Trash />
                        </a>
                      </>
                    ),
                  }))}
                />
              </ViewCard>
            </Col>
          </Row>
          <ViewPdf {...pdf} onCloseClick={() => setPdf({})} />
          <ViewModal
            title={t(addNoteForm.values?.id ? 'EDIT_{name}' : 'ADD_{name}', {
              name: t('NOTE'),
            })}
            show={addNoteVisible}
            onCloseClick={handleNoteModalClose}
          >
            <form onSubmit={addNoteForm.handleSubmit}>
              <Row>
                <Col>
                  <BaseTextArea
                    label={t('NOTE')}
                    name="text"
                    placeholder={t('NOTES')}
                    required
                    formik={addNoteForm}
                  />
                </Col>
              </Row>
              <Row className="mt-1">
                <Col xs="2" className="">
                  <Button type="submit">{t('SAVE')}</Button>
                </Col>
              </Row>
            </form>
          </ViewModal>
          <ViewModal
            title="CONFIRMATION"
            show={showConfirmationModal}
            onCloseClick={() => setShowConfirmationModal(false)}
            footer={
              <button
                type="button"
                className="btn btn-primary w-100 p-lg-3 p-5 mx-2"
                onClick={handleConfirmClick}
              >
                {t('CONFIRM')}
              </button>
            }
          >
            <p className="m-3">{t('NOTE_DELETION_CONFIRMATION')}</p>
          </ViewModal>
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
