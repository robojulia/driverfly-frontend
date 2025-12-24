import { useFormik } from "formik";
import { useMemo, useState } from "react";
import { Button, Form, Table } from "react-bootstrap";
import { Eye, Pencil, CloudDownload, Trash, ClockHistory } from 'react-bootstrap-icons';
import { ThreeCircles } from "react-loader-spinner";
import { toast } from "react-toastify";
import { useAuth } from "../../../hooks/use-auth";
import { useTranslation } from "../../../hooks/use-translation";
import { ApplicantDocumentDto } from "../../../models/applicant/applicant-document-dto";
import { ApplicantEntity } from "../../../models/applicant/applicant.entity";
import ApplicantApi from "../../../pages/api/applicant";
import { globalAjaxExceptionHandler } from "../../../utils/ajax";
import { useEffectAsync } from "../../../utils/react";
import { enableAllDocumentsManually } from "../../../utils/company-preferences-utils";
import FileInput from "../../forms/file-input";
import ShowFormattedDate from "../../jobs/show-formatted-date";
import ViewCard from "../../view-details/view-card";
import Section from "../../view-details/section";
import ViewPdf from "../../view-details/view-pdf";

import { ApplicantOnBoardingChecklist } from "../../../enums/applicants/applicant-onboarding-checklist.enum";
import { CompanyPreferenceCategory } from "../../../enums/company/company-preference-category.enum";
import { CompanyPreferenceOnboardingChecklistLabel } from "../../../enums/company/company-preferences-onboarding-checklist-label.enum";
import { DocumentableType } from "../../../enums/documents/documentable-type.enum";
import { BooleanType } from "../../../enums/jotform/boolean-type.enum";
import { ApplicantDacEntity } from "../../../models/applicant";
import { CompanyPreferenceEntity } from "../../../models/company/company-preferences.entity";
import { DocumentEntity } from "../../../models/documents/document.entity";
import CompanyApi from "../../../pages/api/company";
import { ViewApplicantOnboardingChecklistProps } from "../../../types/applicant/view-application-onboarding-checklist-props.type";
import {
  handleDownloadDocument,
  handleViewDocument,
} from "../../../utils/documents/button-actions";
import {
  AddDocumentButton,
  DeleteDocumentButton,
  DownloadDocumentButton,
  ViewDocumentButton,
} from "../../documents/buttons";
import BaseCheck from "../../forms/base-check";
import BaseInput from "../../forms/base-input";
import BaseRadio from "../../forms/base-radio";
import { CompanyPreferencesDacForm } from "../../forms/company/company-preferences-dac-form";
import { CompanyPreferencesOnboardingChecklistForm } from "../../forms/company/company-preferences-onboarding-checklist-form";
import { LoaderIcon } from "../../loading/loader-icon";
import SafetyPerformanceHistory from "../safety-performance-history";
import { ApplicantUploadedDocumentsForm } from "../../forms/company/applicant-uploaded-documents-form";

function DacItemEditor({ dacForm, companyDacItemType }) {
  const { t } = useTranslation();
  return (
    <Form onSubmit={dacForm.handleSubmit}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <BaseRadio
          name={`value`}
          className="float-left ml-2 my-2 w-40"
          label={companyDacItemType}
          labelPrefix="BooleanType"
          enumType={BooleanType}
          required
          value={dacForm.values.value ? BooleanType.YES : BooleanType.NO}
          onChange={({ target: { value } }) => {
            dacForm.setFieldValue("value", value == BooleanType.YES ? true : false);
          }}
        />
        <BaseInput
          name={"details"}
          className=" d-flex justify-content-center align-items-end float-left ml-2 my-1 w-40"
          label={"DETAILS"}
          placeholder=""
          formik={dacForm}
        />
      </div>
      <div className="d-flex justify-content-end w-100 mt-2">
        <Button
          disabled={
            dacForm.isSubmitting || !dacForm.isValid || dacForm.isValidating
          }
          className=" theme-primary-btn w-50"
          type="submit"
        >
          {t(`SAVE`)} <LoaderIcon isLoading={dacForm.isSubmitting} />
        </Button>
        <Button
          type="button"
          className="ml-2 bg-danger w-50"
          onClick={() => {
            dacForm.resetForm();
          }}
        >
          {t(`CANCEL`)}
        </Button>
      </div>
    </Form>
  );
}

function ChecklistItems({
  showCompleted,
  companyOnboardingChecklist,
  vehicleDocumentTypes,
  renderDocumentTable,
  companyDaclist,
  applicant,
  dacForm,
  handleDacChangeClick,
  pdf,
  setPdf,
}) {
  const { t } = useTranslation();

  // Separate vehicle documents from other documents
  const otherDocumentTypes =
    companyOnboardingChecklist?.value?.filter(
      (type: ApplicantOnBoardingChecklist) => !vehicleDocumentTypes.includes(type)
    ) || [];

  return (
    <>
      <h6 className="mt-2">{t("COMPLETED")}</h6>

      {renderDocumentTable(otherDocumentTypes, true)}
      {renderDocumentTable(vehicleDocumentTypes, true, t("VEHICLE_DOCUMENTS"))}

      <h6 className="mt-5">{t("UPLOAD_FILES")}</h6>

      {renderDocumentTable(otherDocumentTypes, false)}
      {renderDocumentTable(vehicleDocumentTypes, false, t("VEHICLE_DOCUMENTS"))}

      <h6 className="mt-5">{t("CHECKLIST_ITEMS")}</h6>
      <Table striped>
        <thead>
          <tr>
            <th colSpan={2}>{t("TYPE")}</th>
            {Boolean(showCompleted) && <th colSpan={1} className="text-center"></th>}
            <th colSpan={1} className="text-center">{t("DATE")}</th>
            <th colSpan={1} className="text-center">{t("DETAILS")}</th>
            <th colSpan={1}></th>
          </tr>
        </thead>
        <tbody>
          {companyDaclist?.value?.map((companyDacItemType: string) => {
            const applicatDacItem: ApplicantDacEntity = applicant?.dac?.find(
              (v) => v.type == companyDacItemType
            );
            return (
              <tr key={companyDacItemType}>
                <td colSpan={2}> {companyDacItemType}</td>
                {Boolean(showCompleted) && (
                  <td colSpan={1} className="text-center">
                    <BaseCheck
                      className=""
                      disabled
                      checked={
                        applicatDacItem?.type &&
                        applicatDacItem?.type == companyDacItemType &&
                        applicatDacItem?.value
                      }
                    />
                  </td>
                )}
                <td colSpan={1} className="text-center">
                  {applicatDacItem?.last_updated_at ? (
                    <ShowFormattedDate date={applicatDacItem?.last_updated_at} />
                  ) : (
                    <span className="text-danger font-italic">{t(`NOT_AVAILABLE`)}</span>
                  )}
                </td>
                <td colSpan={1} className="text-center">
                  {applicatDacItem?.details ? (
                    applicatDacItem?.details
                  ) : (
                    <span className="text-danger font-italic">{t(`NOT_AVAILABLE`)}</span>
                  )}
                </td>
                <td colSpan={1}>
                  <div className="w-100">
                    {dacForm?.values?.type != companyDacItemType ? (
                      <div className="d-flex justify-content-between">
                        <Button
                          className="ml- w-100"
                          disabled={
                            dacForm.isSubmitting || !dacForm.isValid || dacForm.isValidating
                          }
                          onClick={() => {
                            handleDacChangeClick(companyDacItemType, applicatDacItem);
                          }}
                        >
                          {t("CHANGE")}
                        </Button>
                      </div>
                    ) : (
                      <DacItemEditor dacForm={dacForm} companyDacItemType={companyDacItemType} />
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
      <ViewPdf {...pdf} onCloseClick={() => setPdf({})} />
    </>
  );
}

export default function OnboardingChecklist(
  props: ViewApplicantOnboardingChecklistProps
) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const applicantApi = new ApplicantApi();
  const companyApi = new CompanyApi();

  const [editList, setEditList] = useState<boolean>(false);
  const [editChecklistItems, setEditChecklistItems] = useState<boolean>(false);
  const [companyOnboardingPreferences, setCompanyOnboardingPreferences] =
    useState<CompanyPreferenceEntity[]>();
  const [pdf, setPdf] = useState({});
  const [applicant, setApplicant] = useState<ApplicantEntity>(null);
  const [isEnablingAllDocuments, setIsEnablingAllDocuments] = useState<boolean>(false);

  useEffectAsync(async () => {
    try {
      if (props.applicant?.id) {
        const v = await applicantApi.getById(props.applicant?.id, false, ['documents', 'dac', 'extras']);
        setApplicant(v);
      }
      if (user?.company) {
        const preferences = await companyApi.preferences.list(user.company.id, {
          category: CompanyPreferenceCategory.ONBOARDING_CHECKLIST,
        });
        setCompanyOnboardingPreferences(preferences);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, [user]);

  const companyOnboardingChecklist = useMemo(
    () =>
      companyOnboardingPreferences?.find(
        ({ label }) =>
          label == CompanyPreferenceOnboardingChecklistLabel.APPLICANT_DOCUMETS
      ),
    [companyOnboardingPreferences]
  );

  const companyDaclist = useMemo(
    () =>
      companyOnboardingPreferences?.find(
        ({ label }) =>
          label == CompanyPreferenceOnboardingChecklistLabel.APPLICANT_DAC
      ),
    [companyOnboardingPreferences]
  );

  const form = useFormik({
    initialValues: new ApplicantDocumentDto(),
    validationSchema: ApplicantDocumentDto.yupSchema(),
    onSubmit: async ({ document }, { resetForm }) => {
      try {
        const applicantDocumentUpload = await applicantApi.documents.create(
          applicant.id,
          document
        );

        if (document.id) {
          applicant.documents = applicant.documents.filter(
            (v) => v.id != applicantDocumentUpload.id
          );
        }
        applicant.documents.push(applicantDocumentUpload);
        toast.success(t("DOCUMENT_UPLOAD_SUCCESS_MESSAGE"));
        resetForm();
        if (props.onUpdateDocument)
          props.onUpdateDocument(applicantDocumentUpload);
      } catch (e) {
        globalAjaxExceptionHandler(e, { formik: form, toast: toast, t: t });
      }
    },
  });

  const dacForm = useFormik({
    initialValues: new ApplicantDacEntity(),
    validationSchema: ApplicantDacEntity.yupSchema(),
    onSubmit: async (values, { resetForm }) => {
      try {
        let dac: ApplicantDacEntity;
        values.value = !!values.value;
        if (values.id) {
          dac = await applicantApi.dac.update(applicant.id, values.id, values);
          applicant.dac = applicant.dac.filter((v) => v.id != dac.id);
        } else {
          dac = await applicantApi.dac.create(applicant.id, values);
        }

        applicant.dac.push(dac);
        toast.success(t("SUCCESSFULLY_UPDATED_DAC"));
        resetForm();
      } catch (e) {
        globalAjaxExceptionHandler(e, { formik: form, toast: toast, t: t });
      }
    },
  });

  const handleDacChangeClick = async (
    type: string,
    applicatDacItem?: ApplicantDacEntity
  ) => {
    const data: ApplicantDacEntity = { type };
    if (applicatDacItem) {
      data.id = applicatDacItem.id;
      data.value = !!applicatDacItem.value;
      data.details = applicatDacItem.details;
    }
    dacForm.setValues(data);
  };

  /**
   * It deletes a document from the applicant's profile.
   * @param {string} docType - The type of document you want to
   * delete.
   */
  const handleDeleteDocument = async (docType: string): Promise<void> => {
    const applicantApi = new ApplicantApi();
    await applicantApi.documents.delete(applicant?.id, docType);
    setApplicant({
      ...applicant,
      documents: applicant?.documents?.filter((v) => v.type != docType),
    });
    if (props.onDeleteDocument)
      props.onDeleteDocument(
        applicant?.documents?.find((v) => v.type == docType)
      );
  };

  /**
   * It takes a type and an optional documentId, and sets the form's document field to an object with the
   * type and id
   * @param {ApplicantOnBoardingChecklist} type - ApplicantOnBoardingChecklist - this is the type of document that is being uploaded.
   * @param {number} [documentId] - The id of the document to be updated.
   */
  const handleUpdateDocument = async (
    type: ApplicantOnBoardingChecklist | string,
    documentId?: number
  ): Promise<void> => {
    form.setFieldValue("document", { type, id: documentId ?? null });
  };

  /**
   * Enables all documents for the company by creating/updating the onboarding checklist preferences
   */
  const handleEnableAllDocuments = async (): Promise<void> => {
    if (!user?.company?.id) {
      toast.error(t("COMPANY_NOT_FOUND"));
      return;
    }

    setIsEnablingAllDocuments(true);
    try {
      await enableAllDocumentsManually(user.company.id);
      
      // Refresh the preferences to show the updated list
      const preferences = await companyApi.preferences.list(user.company.id, {
        category: CompanyPreferenceCategory.ONBOARDING_CHECKLIST,
      });
      setCompanyOnboardingPreferences(preferences);
      
      toast.success(t("ALL_DOCUMENTS_ENABLED_SUCCESSFULLY"));
    } catch (error) {
      console.error("Error enabling all documents:", error);
      toast.error(t("ERROR_ENABLING_ALL_DOCUMENTS"));
    } finally {
      setIsEnablingAllDocuments(false);
    }
  };

  /**
   * Generates the Record of Attempts document from employer VOE attempt data
   */
  const handleGenerateRecordOfAttempts = async (): Promise<void> => {
    try {
      // Fetch employers with VOE attempt data
      const employers = await applicantApi.employer.list(applicant.id);

      if (!employers || employers.length === 0) {
        toast.warning(t('NO_EMPLOYER_DATA_AVAILABLE_FOR_RECORD_OF_ATTEMPTS'));
        return;
      }

      // Check if any employer has VOE attempts
      const hasAttempts = employers.some(emp => emp.voe_attempts && emp.voe_attempts.length > 0);

      if (!hasAttempts) {
        toast.warning(t('NO_VOE_ATTEMPTS_RECORDED'));
        return;
      }

      // Generate a simple text-based document with the attempts data
      // In a real implementation, this would call a backend API to generate a proper PDF
      let documentContent = `Record of Attempts - Safety Performance History\n`;
      documentContent += `Applicant: ${applicant.first_name} ${applicant.last_name}\n`;
      documentContent += `Date Generated: ${new Date().toLocaleDateString()}\n\n`;

      employers.forEach((employer, index) => {
        documentContent += `\n${index + 1}. ${employer.name}\n`;
        documentContent += `   Manager: ${employer.manager_name || 'N/A'}\n`;
        documentContent += `   Email: ${employer.email || 'N/A'}\n`;
        documentContent += `   Can Contact: ${employer.can_contact ? 'Yes' : 'No'}\n`;
        documentContent += `   Subject to FMCSRs: ${employer.is_subject_to_fmcsrs ? 'Yes' : 'No'}\n`;

        if (employer.voe_attempts && employer.voe_attempts.length > 0) {
          documentContent += `   VOE Attempts:\n`;
          employer.voe_attempts.forEach((attempt: string, attemptIndex: number) => {
            documentContent += `      ${attemptIndex + 1}. ${new Date(attempt).toLocaleString()}\n`;
          });
        } else {
          documentContent += `   VOE Attempts: None\n`;
        }
      });

      // Create a blob and trigger download
      const blob = new Blob([documentContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Record_of_Attempts_${applicant.first_name}_${applicant.last_name}_${new Date().toISOString().split('T')[0]}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success(t('RECORD_OF_ATTEMPTS_GENERATED'));
    } catch (error) {
      console.error('Error generating Record of Attempts:', error);
      toast.error(t('ERROR_GENERATING_RECORD_OF_ATTEMPTS'));
    }
  };

  const ButtonList = ({ document, type }) => {
    // Special handling for Record of Attempts document type
    const isRecordOfAttempts = type === ApplicantOnBoardingChecklist.RECORD_OF_ATTEMPTS_SAFETY_PERFORMANCE_HISTORY;

    return (
      <>
        {(!form.values.document?.type || form.values.document?.type != type) && (
          <div className="d-flex align-items-center justify-content-end w-100" style={{ gap: 10 }}>
            {/* For Record of Attempts, show a "Generate" button instead of upload */}
            {isRecordOfAttempts && (
              <Button variant="link" className="p-0"
                onClick={handleGenerateRecordOfAttempts}>
                {t('Generate Document')}
              </Button>
            )}

            {/* For Safety Performance History, show the VOE list button */}
            {type === ApplicantOnBoardingChecklist.SAFETY_PERFORMANCE_HISTORY && (
              <SafetyPerformanceHistory
                buttonClass="btn btn-link p-0"
                applicant={applicant}
                canEditSafetyPerformance={props.canEditSafetyPerformance}
                showHistory={props.showHistory}
                showResendButton={props.showResendButton}
              />
            )}

            {document && !document?.name?.includes('.doc') && !isRecordOfAttempts && (
              <Button variant="link" className="p-0"
                onClick={async () => {
                  try {
                    await handleViewDocument(document.id, setPdf, undefined, document);
                  } catch (error: any) {
                    console.error('Error viewing document:', error);
                    const message = error?.message || t('ERROR_VIEWING_DOCUMENT');
                    toast.error(message);
                  }
                }}>
                {t('View')}
              </Button>
            )}
            {document && !isRecordOfAttempts && (
              <Button variant="link" className="p-0"
                onClick={async () => {
                  try {
                    await handleDownloadDocument(document.id);
                  } catch (error) {
                    console.error('Error downloading document:', error);
                    toast.error(t('ERROR_DOWNLOADING_DOCUMENT'));
                  }
                }}>
                {t('Download')}
              </Button>
            )}
            {Boolean(props.canEdit) && !isRecordOfAttempts && (
              <Button variant="link" className="p-0"
                onClick={() => handleUpdateDocument(type, document?.id)}>
                {document ? t('Replace') : t('Upload')}
              </Button>
            )}
            {Boolean(props.canEdit) && document && !isRecordOfAttempts && (
              <Button variant="link" className="p-0 text-danger"
                onClick={() => handleDeleteDocument(type)}>
                {t('Remove')}
              </Button>
            )}
          </div>
        )}
      </>
    );
  };

  // Define vehicle document types
  const vehicleDocumentTypes = [
    ApplicantOnBoardingChecklist.PROOF_OF_INSURANCE,
    ApplicantOnBoardingChecklist.VEHICLE_TITLE,
    ApplicantOnBoardingChecklist.EQUIPMENT_LEASE,
  ];

  // Helper function to render a document table section
  const renderDocumentTable = (documentTypes: ApplicantOnBoardingChecklist[], isCompleted: boolean, sectionTitle?: string) => {
    const filteredTypes = companyOnboardingChecklist?.value?.filter((type: ApplicantOnBoardingChecklist) => 
      documentTypes.includes(type)
    ) || [];

    if (filteredTypes.length === 0) return null;

    return (
      <>
        {sectionTitle && <h6 className="mt-4 mb-3" style={{ color: '#666', fontSize: '0.95rem', fontWeight: '600' }}>{sectionTitle}</h6>}
        <Table striped>
          <thead>
            <tr>
              <th colSpan={2}>{t("DOCUMENT_NAME")}</th>
              {isCompleted && <th colSpan={2}>{t("UPDATED_AT")}</th>}
              <th colSpan={1}></th>
            </tr>
          </thead>
          <tbody>
            {filteredTypes.map((type: ApplicantOnBoardingChecklist, i) => {
              const completedDoc: DocumentEntity | undefined = applicant?.documents?.find((v) => v.type === type && !!v.path);
              const pendingDoc: DocumentEntity | undefined = applicant?.documents?.find((v) => v.type === type && !v.path);

              // For the Completed table, only render when a completed document exists
              if (isCompleted) {
                if (!completedDoc) return null;
              } else {
                // For the Upload Files table, hide rows when a completed document already exists
                if (completedDoc) return null;
              }

              const document: DocumentEntity | undefined = isCompleted ? completedDoc : pendingDoc;

              return (
                <tr key={type}>
                  <td colSpan={2}>
                    {t(`ApplicantOnBoardingChecklist.${type}`)}
                  </td>
                  {isCompleted && (
                    <td colSpan={2}>
                      <UpdatedAt document={document} t={t} />
                    </td>
                  )}
                  <td colSpan={1}>
                    <ButtonList document={document} type={type} />
                    {form.values?.document?.type == type && (
                      <Form onSubmit={form.handleSubmit}>
                        <FileInput
                          name={`document`}
                          accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/*"
                          formik={form}
                          allowedSizeInByte={3145728}
                        />
                        <div className="mt-2 d-flex w-100 ">
                          <Button
                            disabled={
                              form.isSubmitting ||
                              !form.isValid ||
                              form.isValidating
                            }
                            className="mr-2 w-50 theme-secondary-btn"
                            type="submit"
                          >
                            {t(`SAVE`)}
                          </Button>
                          <Button
                            type="button"
                            className="mr-2 w-50 btn-outline-danger"
                            onClick={() => {
                              form.resetForm();
                            }}
                          >
                            {t(`CANCEL`)}
                          </Button>
                        </div>
                      </Form>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </>
    );
  };

  // removed nested ChecklistItems definition to prevent remounting and focus loss

  // useEffect(() => {
  //   console.log("dacForm.values", dacForm.values);
  //   console.log("dacForm.errors", dacForm.errors);
  // }, [dacForm.errors, dacForm.values]);

  if (!applicant?.id)
    return (
      <div className="d-flex justify-content-center align-items-center">
        <ThreeCircles
          height={50}
          width={50}
          color="#5bb0b9"
          ariaLabel="ball-triangle-loading"
          visible={true}
        />
      </div>
    );

  const title = props.title ?? "DOCUMENTS";
  const actions = (
    <>
      <Button variant="link" className="p-0 me-3"
        size="sm"
        disabled={isEnablingAllDocuments}
        onClick={handleEnableAllDocuments}
      >
        {isEnablingAllDocuments ? t("Enabling...") : t("Enable All Documents")}
      </Button>
      <Button variant="link" className="p-0" size="sm" onClick={() => {
        setEditList(!editList);
        if (editChecklistItems) setEditChecklistItems(false);
      }}>
        {editList ? t("Cancel") : t("Edit Document List")}
      </Button>
    </>
  );

  const body = editList ? (
    <>
      <CompanyPreferencesOnboardingChecklistForm
        className="m-5"
        companyOnboardingChecklist={companyOnboardingChecklist}
        onSaveComplete={(newChecklist: CompanyPreferenceEntity) => {
          setCompanyOnboardingPreferences([
            ...companyOnboardingPreferences?.filter(
              (v) =>
                v.label !==
                CompanyPreferenceOnboardingChecklistLabel.APPLICANT_DOCUMETS
            ),
            newChecklist,
          ]);
          setEditList(false);
        }}
      />
    </>
  ) : (
    <>
      {/* Unified checklist view */}
      <div className="d-flex flex-column" style={{ gap: 12 }}>
        {(() => {
          // Get union of global template types and types that have documents for this applicant
          // This ensures historical documents are preserved even if removed from global template
          const globalTypes = companyOnboardingChecklist?.value || [];
          const applicantDocumentTypes = (applicant?.documents || [])
            .filter(d => d.type && d.path) // Only include completed documents
            .map(d => d.type);
          const allTypes = [...new Set([...globalTypes, ...applicantDocumentTypes])];

          return allTypes.map((type: string) => {
            const completedDoc: DocumentEntity | undefined = applicant?.documents?.find((v) => v.type === type && !!v.path);
            const pendingDoc: DocumentEntity | undefined = applicant?.documents?.find((v) => v.type === type && !v.path);
            const document = completedDoc || pendingDoc;

            // Special handling for Record of Attempts - check if there's employer VOE attempt data
            const isRecordOfAttempts = type === ApplicantOnBoardingChecklist.RECORD_OF_ATTEMPTS_SAFETY_PERFORMANCE_HISTORY;
            const hasEmployerData = applicant?.employers && applicant.employers.length > 0;
            const hasVoeAttempts = hasEmployerData && applicant.employers.some((emp: any) => emp.voe_attempts && emp.voe_attempts.length > 0);

            // For Record of Attempts, consider it "completed" if there's VOE attempt data available
            const isCompleted = isRecordOfAttempts ? hasVoeAttempts : Boolean(completedDoc);
            const isHistorical = !globalTypes.includes(type);
            const isEnumValue = Object.values(ApplicantOnBoardingChecklist).includes(type as ApplicantOnBoardingChecklist);
            const displayName = isEnumValue ? t(`ApplicantOnBoardingChecklist.${type}`) : type;

            return (
              <div key={type} className="p-3 border rounded" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', ...(isHistorical ? { backgroundColor: '#fff3cd' } : {}) }}>
                {/* Left: status + name */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <div style={{ width: 16, height: 16, borderRadius: 4, border: '1px solid #0f5257', background: isCompleted ? '#0f5257' : 'transparent', flexShrink: 0 }} />
                  <span style={{ fontWeight: 600, lineHeight: 1 }}>
                    {displayName}
                    {isHistorical && (
                      <span className="badge bg-warning text-dark ms-2" title={t("This document type was removed from the global template but data is preserved")}>
                        {t("Historical")}
                      </span>
                    )}
                  </span>
                </div>
              {/* Right: uploaded at + actions */}
              <div className="d-flex align-items-center" style={{ gap: 12 }}>
                <div className="text-muted small" style={{ minWidth: 160, textAlign: 'right' }}>
                  {isCompleted && !isRecordOfAttempts ? (
                    <>
                      {t('Uploaded')} <UpdatedAt document={document} t={t} />
                    </>
                  ) : null}
                </div>
                {/* Actions */}
                <div className="d-flex align-items-center" style={{ gap: 10 }}>
                  {/* Special handling for Record of Attempts - show Generate button */}
                  {isRecordOfAttempts && (
                    <Button
                      variant="primary"
                      size="sm"
                      title={t('Generate Document')}
                      onClick={handleGenerateRecordOfAttempts}
                    >
                      {t('Generate')}
                    </Button>
                  )}

                  {/* Special handling for Safety Performance History - show VOE list button */}
                  {type === ApplicantOnBoardingChecklist.SAFETY_PERFORMANCE_HISTORY && (
                    <SafetyPerformanceHistory
                      buttonClass="btn btn-sm btn-info"
                      applicant={applicant}
                      canEditSafetyPerformance={props.canEditSafetyPerformance}
                      showHistory={props.showHistory}
                      showResendButton={props.showResendButton}
                    />
                  )}

                  {/* View */}
                  {document && completedDoc && !document?.name?.includes('.doc') && !isRecordOfAttempts && (
                    <Button variant="success" size="sm" style={{ width: '38px', height: '38px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }} title={t('View')} onClick={async () => {
                      try {
                        await handleViewDocument(document.id, setPdf, undefined, document);
                      } catch (error: any) {
                        console.error('Error viewing document:', error);
                        const message = error?.message || t('ERROR_VIEWING_DOCUMENT');
                        toast.error(message);
                      }
                    }}>
                      <Eye />
                    </Button>
                  )}
                  {/* Replace / Upload */}
                  {Boolean(props.canEdit) && !isRecordOfAttempts && type !== ApplicantOnBoardingChecklist.SAFETY_PERFORMANCE_HISTORY && (
                    <Button
                      variant="info"
                      size="sm"
                      style={{ width: '38px', height: '38px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      title={completedDoc ? t('Replace') : t('Upload')}
                      onClick={() => handleUpdateDocument(type, document?.id)}
                    >
                      <Pencil />
                    </Button>
                  )}
                  {/* Download */}
                  {document && completedDoc && !isRecordOfAttempts && (
                    <Button variant="dark" size="sm" style={{ width: '38px', height: '38px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }} title={t('Download')} onClick={async () => {
                      try {
                        await handleDownloadDocument(document.id);
                      } catch (error) {
                        console.error('Error downloading document:', error);
                        toast.error(t('ERROR_DOWNLOADING_DOCUMENT'));
                      }
                    }}>
                      <CloudDownload />
                    </Button>
                  )}
                  {/* Remove */}
                  {Boolean(props.canEdit) && completedDoc && !isRecordOfAttempts && (
                    <Button variant="danger" size="sm" style={{ width: '38px', height: '38px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }} title={t('Remove')} onClick={() => handleDeleteDocument(type)}>
                      <Trash />
                    </Button>
                  )}
                </div>
              </div>
              {/* Inline uploader */}
              {form.values?.document?.type == type && (
                <div className="w-100 mt-3">
                  <Form onSubmit={form.handleSubmit}>
                    <FileInput
                      name={`document`}
                      accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/*"
                      formik={form}
                      allowedSizeInByte={3145728}
                    />
                    <div className="mt-2 d-flex" style={{ gap: 8 }}>
                      <Button
                        disabled={form.isSubmitting || !form.isValid || form.isValidating}
                        className="theme-secondary-btn"
                        type="submit"
                      >
                        {t('SAVE')}
                      </Button>
                      <Button
                        type="button"
                        className="btn-outline-danger"
                        onClick={() => form.resetForm()}
                      >
                        {t('CANCEL')}
                      </Button>
                    </div>
                  </Form>
                </div>
              )}
            </div>
          );
        });
      })()}
      </div>

      {/* Uploaded Documents as a subsection inside the Onboarding Documents card (bottom) */}
      <div className="mt-4">
        <h3 className="mb-3">{t('UPLOADED_DOCUMENTS')}</h3>
        <ApplicantUploadedDocumentsForm
          entity={applicant as any}
          setEntity={setApplicant as any}
          isSubmitting={false}
          setIsSubmitting={() => {}}
          hideActions={!props.canEdit}
          wrapInSection={false}
        />
      </div>
    </>
  );

  if (props.useSectionContainer) {
    return (
      <>
        <Section title={title} actions={actions}>
          {body}
        </Section>
        <ViewPdf {...pdf} onCloseClick={() => setPdf({})} />
      </>
    );
  }

  return (
    <>
      <ViewCard title={title} actions={actions}>
        {body}
      </ViewCard>
      <ViewPdf {...pdf} onCloseClick={() => setPdf({})} />
    </>
  );
}

const UpdatedAt = ({ document, t }) => {
  return (
    <>
      {document ? (
        <ShowFormattedDate date={document.last_updated_at} />
      ) : (
        <span className="text-danger font-italic">{t(`NOT_AVAILABLE`)}</span>
      )}
    </>
  );
};
