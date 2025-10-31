import { toast } from 'react-toastify';

import { Button, Col, OverlayTrigger, Row, Tooltip } from 'react-bootstrap';
import { Pencil, PlusLg, Trash } from 'react-bootstrap-icons';

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

import ApplicantConsiderFor from '../../../../../components/applicants/applicant-consider-for';
import ApplicantJobsApplied from '../../../../../components/applicants/applicant-jobs-applied';
import ApplicantSafetyBackground from '../../../../../components/applicants/applicant-safety-background';
import ViewApplicantDetail from '../../../../../components/applicants/applicant-view-details';
import ApplicantWorkHistory from '../../../../../components/applicants/applicant-work-history';
import { ApplicantDocumentType } from '../../../../../enums/applicants/applicant-document-type.enum';
import { ApplicantOnBoardingChecklist } from '../../../../../enums/applicants/applicant-onboarding-checklist.enum';
import CompanyApi from '../../../../api/company';
import { ApplicantExtras as ApplicantExtrasEnum } from '../../../../../enums/applicants/applicant-extras.enum';
import { useFeatureFlag } from '../../../../../context/feature-flag-context';
import { ApplicantBasicDetailsFormNew } from '../../../../../components/forms/company/applicant-basic-details-form-new';
import { ApplicantLicensingForm } from '../../../../../components/forms/company/applicant-licensing-form';
import { ApplicantWorkHistoryForm } from '../../../../../components/forms/company/applicant-work-history-form';
import { ApplicantEquipmentExperienceForm } from '../../../../../components/forms/company/applicant-equipment-experience-form';
import { ApplicantSafetyBackgroundForm } from '../../../../../components/forms/company/applicant-safety-background-form';
import { ApplicantUploadedDocumentsForm } from '../../../../../components/forms/company/applicant-uploaded-documents-form';
import { ApplicantSignedAgreementsForm } from '../../../../../components/forms/company/applicant-signed-agreements-form';
import OnboardingChecklist from '../../../../../components/applicants/onboarding-checklist';
import { ApplicantApplicationChecklistForm } from '../../../../../components/forms/company/applicant-application-checklist-form';
import { ApplicantNotesForm } from '../../../../../components/forms/company/applicant-notes-form';
import { ApplicantEmergencyContactForm } from '../../../../../components/forms/company/applicant-emergency-contact-form';
import { ApplicantPreferencesForm } from '../../../../../components/forms/company/applicant-preferences-form';

export default function ViewApplicant({ id }) {
  const router = useRouter();

  const { t } = useTranslation();

  const { hasPermission } = useAuth();
  const showDotVerification = useFeatureFlag('DOT_VERIFICATION_RESULTS');

  const protectedFields = {
    license_number: hasPermission('CanViewApplicant.license_number'),
    social_security_number: hasPermission('CanViewApplicant.social_security_number'),
  };

  const [applicant, setApplicant] = useState<ApplicantEntity>(new ApplicantEntity());
  const [applicantSuggestedJobs, setApplicantSuggestedJobs] = useState<
    ApplicantSuggestedJobEntity[]
  >([]);
  const [dotVerifyRaw, setDotVerifyRaw] = useState<any>(null);

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
          {/* New read-only layout mirroring the edit page */}
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
          {/* Previous Employment */}
          <Row className="px-2">
            <ApplicantWorkHistoryForm
              entity={{ ...applicant, is_hired: true }}
              setEntity={() => {}}
              isSubmitting={true}
              setIsSubmitting={() => {}}
              hideActions
            />
          </Row>
          
          
          {/* Licensing & Certification */}
          <ApplicantLicensingForm
            entity={{ ...applicant, is_hired: true }}
            setEntity={() => {}}
          />

          {/* DOT Verification (shown only if DOT number is saved) */}
          {(() => {
            const dot_number = applicant?.extras?.find((e: any) => e.type === ApplicantExtrasEnum.DOT_NUMBER)?.value;
            if (!dot_number) return null;
            return (
              <Row className="px-2 mt-2">
                <Col md="12" className="p-0 px-lg-2">
                    <Section title="DOT Lookup Results">
                      <div className="d-flex justify-content-between align-items-start flex-wrap">
                        {(() => {
                          const tokens: string[] =
                            (applicant?.extras?.find((e: any) => e.type === ApplicantExtrasEnum.DOT_VERIFICATION_RESULTS)?.value as string[]) || [];
                          if (!tokens.length) return null;
                          const checks = [
                            { key: 'EMAIL', label: 'Email' },
                            { key: 'PHONE', label: 'Phone' },
                            { key: 'STREET_ADDRESS', label: 'Street address' },
                            { key: 'CITY', label: 'City' },
                            { key: 'STATE', label: 'State' },
                            { key: 'ZIP_CODE', label: 'ZIP code' },
                          ];
                          const getStatus = (k: string): boolean | null => {
                            if (tokens.includes(`${k}_SUCCESS`)) return true;
                            if (tokens.includes(`${k}_FAIL`)) return false;
                            return null;
                          };
                          return (
                            <div className="mb-2" style={{ minWidth: 240 }}>
                              {checks.map(({ key, label }) => {
                                const status = getStatus(key);
                                return (
                                  <div key={key} className="d-flex align-items-center mb-1">
                                    <div style={{ width: 140 }}>{label}</div>
                                    {status === true && <span className="badge bg-success">Match</span>}
                                    {status === false && <span className="badge bg-danger">No match</span>}
                                    {status === null && <span className="badge bg-secondary">Unknown</span>}
                                  </div>
                                );
                              })}
                            </div>
                          );
                        })()}
                        <div style={{ flex: 1, minWidth: 280 }} className="text-start">
                          <div>
                            {(() => {
                              if (!dotVerifyRaw) return null;
                              const data: any = (dotVerifyRaw as any)?.records ?? dotVerifyRaw;
                              const records: any[] = Array.isArray(data) ? data : [data];
                              const join = (parts: Array<string | undefined | null>, sep: string) =>
                                parts.filter((p) => Boolean(p && String(p).trim().length)).map((p) => String(p)).join(sep);
                              const toTitleCase = (value?: string) => {
                                if (!value) return value;
                                const cased = String(value)
                                  .toLowerCase()
                                  .replace(/\b([a-z])(\w*)/g, (_: any, a: string, b: string) => a.toUpperCase() + b);
                                return cased.replace(/ Llc\b/g, ' LLC');
                              };
                              const formatCountry = (value?: string) => {
                                if (!value) return value;
                                const raw = String(value).trim();
                                const normalized = raw.toUpperCase().replace(/\./g, '');
                                if (
                                  normalized === 'US' ||
                                  normalized === 'USA' ||
                                  normalized === 'UNITED STATES' ||
                                  normalized === 'UNITED STATES OF AMERICA'
                                ) {
                                  return 'United States of America';
                                }
                                return raw.toUpperCase();
                              };
                              const formatPhone = (value?: string) => {
                                if (!value) return value;
                                const raw = String(value);
                                const digitsOnly = raw.replace(/\D/g, '');
                                const normalized = digitsOnly.length === 11 && digitsOnly.startsWith('1') ? digitsOnly.slice(1) : digitsOnly;
                                if (normalized.length === 10) {
                                  const area = normalized.slice(0, 3);
                                  const exchange = normalized.slice(3, 6);
                                  const line = normalized.slice(6);
                                  return `(${area}) ${exchange}-${line}`;
                                }
                                if (normalized.length === 7) {
                                  return `${normalized.slice(0, 3)}-${normalized.slice(3)}`;
                                }
                                return raw;
                              };
                              return (
                                <div>
                                  {records.map((rec: any, idx: number) => {
                                  const join = (parts: Array<string | undefined | null>, sep: string) =>
                                    parts.filter((p) => Boolean(p && String(p).trim().length)).map((p) => String(p)).join(sep);
                                  const toTitleCase = (value?: string) => {
                                    if (!value) return value;
                                    const cased = String(value)
                                      .toLowerCase()
                                      .replace(/\b([a-z])(\w*)/g, (_: any, a: string, b: string) => a.toUpperCase() + b);
                                    return cased.replace(/ Llc\b/g, ' LLC');
                                  };
                                    const phyCityStateZip = join([
                                      toTitleCase(rec?.phy_city),
                                      join([String(rec?.phy_state || '').toUpperCase(), rec?.phy_zip], ' '),
                                    ], ', ');
                                    const mailingCityStateZip = join([
                                      toTitleCase(rec?.carrier_mailing_city),
                                      join([String(rec?.carrier_mailing_state || '').toUpperCase(), rec?.carrier_mailing_zip], ' '),
                                    ], ', ');
                                    const phyStreet = toTitleCase(rec?.phy_street);
                                    const phyCountryDisplay = formatCountry(rec?.phy_country);
                                    const addressString = join([
                                      phyStreet,
                                      phyCityStateZip,
                                      phyCountryDisplay,
                                    ], ', ');
                                    const mailingStreet = toTitleCase(rec?.carrier_mailing_street);
                                    const mailingCountryDisplay = formatCountry(rec?.carrier_mailing_country);
                                    const mailingAddressString = join([
                                      mailingStreet,
                                      mailingCityStateZip,
                                      mailingCountryDisplay,
                                    ], ', ');
                                    const areAddressesIdentical = Boolean(addressString) && Boolean(mailingAddressString) && addressString === mailingAddressString;
                                    return (
                                      <div key={idx} className="mb-2">
                                        <div className="fw-semibold">Company Name</div>
                                        <div className="mb-1">{toTitleCase(rec?.legal_name) ?? ''}</div>
                                        <div className="fw-semibold">Address</div>
                                        <div className="mb-1">
                                          {phyStreet && <div>{phyStreet}</div>}
                                          {phyCityStateZip && <div>{phyCityStateZip}</div>}
                                          {phyCountryDisplay && <div>{phyCountryDisplay}</div>}
                                        </div>
                                        {!areAddressesIdentical && mailingAddressString && (
                                          <>
                                            <div className="fw-semibold">Mailing Address</div>
                                            <div className="mb-1">
                                              {mailingStreet && <div>{mailingStreet}</div>}
                                              {mailingCityStateZip && <div>{mailingCityStateZip}</div>}
                                              {mailingCountryDisplay && <div>{mailingCountryDisplay}</div>}
                                            </div>
                                          </>
                                        )}
                                        <div className="fw-semibold">Phone</div>
                                        <div className="mb-1">{formatPhone(rec?.phone) ?? ''}</div>
                                        <div className="fw-semibold">Email Address</div>
                                        <div>{rec?.email_address ?? ''}</div>
                                        {idx < records.length - 1 && <hr className="my-2" />}
                                      </div>
                                    );
                                  })}
                                </div>
                              );
                            })()}
                          </div>
                        </div>
                      {/* Lookup button intentionally hidden on view page */}
                      </div>
                    </Section>
                </Col>
          </Row>
            );
          })()}

          {/* Equipment Experience */}
          <Row className="px-2">
            <ApplicantEquipmentExperienceForm
              entity={{ ...applicant, is_hired: true }}
              setEntity={() => {}}
              isSubmitting={true}
              setIsSubmitting={() => {}}
              hideActions
            />
          </Row>

          {/* Safety Background */}
          <Row className="px-2">
            <ApplicantSafetyBackgroundForm
              entity={{ ...applicant, is_hired: true }}
              setEntity={() => {}}
              isSubmitting={true}
              setIsSubmitting={() => {}}
              hideActions
            />
          </Row>

          {/* Consider Applicant For */}
              <ApplicantConsiderFor
                applicant={applicant}
                applicantSuggestedJobs={applicantSuggestedJobs || []}
              />

          {/* Uploaded Documents */}
          <Row className="px-2">
            <ApplicantUploadedDocumentsForm
              entity={{ ...applicant, is_hired: true }}
              setEntity={() => {}}
              isSubmitting={true}
              setIsSubmitting={() => {}}
              hideActions
            />
          </Row>

          {/* Onboarding Documents */}
          {applicant?.id && (
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
          )}

          {/* Application Checklist */}
          <ApplicantApplicationChecklistForm
              entity={{ ...applicant, is_hired: true }}
              setEntity={() => {}}
            />

          {/* Notes */}
          <ApplicantNotesForm entity={{ ...applicant, is_hired: true }} setEntity={() => {}} />

          {/* Emergency Contact Information */}
          <ApplicantEmergencyContactForm entity={{ ...applicant, is_hired: true }} setEntity={() => {}} />

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


