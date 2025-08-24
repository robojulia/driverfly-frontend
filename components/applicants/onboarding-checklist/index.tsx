import { useFormik } from "formik";
import { useMemo, useState } from "react";
import { Button, Form, Table } from "react-bootstrap";
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
import ViewDocumentHistory from "../../documents/view-history";
import BaseCheck from "../../forms/base-check";
import BaseInput from "../../forms/base-input";
import BaseRadio from "../../forms/base-radio";
import { CompanyPreferencesDacForm } from "../../forms/company/company-preferences-dac-form";
import { CompanyPreferencesOnboardingChecklistForm } from "../../forms/company/company-preferences-onboarding-checklist-form";
import { LoaderIcon } from "../../loading/loader-icon";
import SafetyPerformanceHistory from "../safety-performance-history";

export default function OnboardingChecklist(
  props: ViewApplicantOnboardingChecklistProps
) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const applicantApi = new ApplicantApi();
  const companyApi = new CompanyApi();

  const [editList, setEditList] = useState<boolean>(false);
  const [companyOnboardingPreferences, setCompanyOnboardingPreferences] =
    useState<CompanyPreferenceEntity[]>();
  const [pdf, setPdf] = useState({});
  const [applicant, setApplicant] = useState<ApplicantEntity>(null);
  const [isEnablingAllDocuments, setIsEnablingAllDocuments] = useState<boolean>(false);

  useEffectAsync(async () => {
    try {
      if (props.applicant?.id) {
        const v = await applicantApi.getById(props.applicant?.id);
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
    [companyOnboardingPreferences, user]
  );

  const companyDaclist = useMemo(
    () =>
      companyOnboardingPreferences?.find(
        ({ label }) =>
          label == CompanyPreferenceOnboardingChecklistLabel.APPLICANT_DAC
      ),
    [companyOnboardingPreferences, user]
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
    type: ApplicantOnBoardingChecklist,
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

  const ButtonList = ({ document, type }) => (
    <>
      {(!form.values.document?.type || form.values.document?.type != type) && (
        <div className="d-flex">
          {!document?.name?.includes(".doc") && (
            <ViewDocumentButton
              document={document}
              onClick={() => handleViewDocument(document.id, setPdf)}
            />
          )}
          {Boolean(props.canEdit) && (
            <AddDocumentButton
              document={document}
              type={type}
              t={t}
              onClick={() => handleUpdateDocument(type, document?.id)}
            />
          )}
          <DownloadDocumentButton
            document={document}
            onClick={() => handleDownloadDocument(document.id)}
          />
          {Boolean(props.canEdit) && (
            <DeleteDocumentButton
              document={document}
              onClick={() => handleDeleteDocument(type)}
            />
          )}
          {type == ApplicantOnBoardingChecklist.SAFETY_PERFORMANCE_HISTORY && (
            <SafetyPerformanceHistory
              buttonClass="mr-2 w-100"
              applicant={applicant}
              canEditSafetyPerformance={props.canEditSafetyPerformance}
              showHistory={props.showHistory}
              showResendButton={props.showResendButton}
            />
          )}
          {Boolean(props.showHistory) && (
            <ViewDocumentHistory
              canDelete={!applicant.is_hired}
              typePrefix="ApplicantOnBoardingChecklist"
              document={document}
              type={type}
              documentable_id={applicant.id}
              documentable_type={DocumentableType.APPLICANTS}
            />
          )}
        </div>
      )}
    </>
  );

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
              const document: DocumentEntity = applicant?.documents?.find(
                (v) => v.type == type && (isCompleted ? !!v.path : !v.path)
              );
              
              if (isCompleted ? !document : document) return null;

              return (
                <tr key={i}>
                  <td colSpan={2}>
                    {t(`ApplicantOnBoardingChecklist.${type}`)}
                  </td>
                  {isCompleted && (
                    <td colSpan={2}>
                      <UpdatedAt document={document} t={t} />
                    </td>
                  )}
                  <td colSpan={1} className="border border-2 w-50">
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
                            className="mr-2 w-50 theme-primary-btn"
                            type="submit"
                          >
                            {t(`SAVE`)}
                          </Button>
                          <Button
                            type="button"
                            className="mr-2 w-50 bg-danger"
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

  function ChecklistItems() {
    // Separate vehicle documents from other documents
    const otherDocumentTypes = companyOnboardingChecklist?.value?.filter((type: ApplicantOnBoardingChecklist) => 
      !vehicleDocumentTypes.includes(type)
    ) || [];

    return (
      <>
        <h6 className="mt-2">{t("COMPLETED")}</h6>
        
        {/* Regular Documents */}
        {renderDocumentTable(otherDocumentTypes, true)}
        
        {/* Vehicle Documents Section */}
        {renderDocumentTable(vehicleDocumentTypes, true, t("VEHICLE_DOCUMENTS"))}

        <h6 className="mt-5">{t("UPLOAD_FILES")}</h6>
        
        {/* Regular Documents Upload */}
        {renderDocumentTable(otherDocumentTypes, false)}
        
        {/* Vehicle Documents Upload Section */}
        {renderDocumentTable(vehicleDocumentTypes, false, t("VEHICLE_DOCUMENTS"))}
        <h6 className="mt-5">{t("CHECKLIST_ITEMS")}</h6>
        <Table striped>
          <thead>
            <tr>
              <th colSpan={2}>{t("TYPE")}</th>
              {Boolean(props.showCompleted) && (
                <th colSpan={1} className="text-center"></th>
              )}
              <th colSpan={1} className="text-center">
                {t("DATE")}
              </th>
              <th colSpan={1} className="text-center">
                {t("DETAILS")}
              </th>
              <th colSpan={1}></th>
            </tr>
          </thead>
          <tbody>
            {companyDaclist?.value?.map((companyDacItemType: string, i) => {
              const applicatDacItem: ApplicantDacEntity = applicant?.dac?.find(
                (v) => v.type == companyDacItemType
              );
              return (
                <tr key={i}>
                  <td colSpan={2}> {companyDacItemType}</td>
                  {Boolean(props.showCompleted) && (
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
                      <ShowFormattedDate
                        date={applicatDacItem?.last_updated_at}
                      />
                    ) : (
                      <span className="text-danger font-italic">
                        {t(`NOT_AVAILABLE`)}
                      </span>
                    )}
                  </td>
                  <td colSpan={1} className="text-center">
                    {applicatDacItem?.details ? (
                      applicatDacItem?.details
                    ) : (
                      <span className="text-danger font-italic">
                        {t(`NOT_AVAILABLE`)}
                      </span>
                    )}
                  </td>
                  <td colSpan={1}>
                    <div className="w-100">
                      {dacForm?.values?.type != companyDacItemType ? (
                        <div className="d-flex justify-content-between">
                          <Button
                            className="ml- w-100"
                            disabled={
                              form.isSubmitting ||
                              !form.isValid ||
                              form.isValidating
                            }
                            onClick={() => {
                              handleDacChangeClick(
                                companyDacItemType,
                                applicatDacItem
                              );
                            }}
                          >
                            {t("CHANGE")}
                          </Button>
                        </div>
                      ) : (
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
                              value={
                                dacForm.values.value
                                  ? BooleanType.YES
                                  : BooleanType.NO
                              }
                              onChange={({ target: { value } }) => {
                                dacForm.setFieldValue(
                                  "value",
                                  value == BooleanType.YES ? true : false
                                );
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
                                dacForm.isSubmitting ||
                                !dacForm.isValid ||
                                dacForm.isValidating
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

  return (
    <ViewCard
      title={props.title ?? "DOCUMENTS"}
      actions={
        <>
                     <Button 
             size="sm" 
             className="me-2"
             disabled={isEnablingAllDocuments}
             onClick={handleEnableAllDocuments}
           >
             {isEnablingAllDocuments ? t("ENABLING...") : t("ENABLE_ALL_DOCUMENTS")}
           </Button>
          <Button size="sm" onClick={() => setEditList(!editList)}>
            {editList ? t("CANCEL") : t("EDIT_LIST")}
          </Button>
        </>
      }
    >
      {editList ? (
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
            }}
          />
          <hr/>
          <CompanyPreferencesDacForm
            className="m-5"
            companyDaclist={companyDaclist}
            onSaveComplete={(newDac: CompanyPreferenceEntity) => {
              setCompanyOnboardingPreferences([
                ...companyOnboardingPreferences?.filter(
                  (v) =>
                    v.label !==
                    CompanyPreferenceOnboardingChecklistLabel.APPLICANT_DAC
                ),
                newDac,
              ]);
            }}
          />
        </>
      ) : (
        <ChecklistItems />
      )}
    </ViewCard>
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
