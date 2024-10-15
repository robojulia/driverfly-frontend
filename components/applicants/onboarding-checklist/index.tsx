import { useFormik } from "formik";
import { useEffect, useState } from "react";
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
import FileInput from "../../forms/file-input";
import ShowFormattedDate from "../../jobs/show-formatted-date";
import ViewCard from "../../view-details/view-card";
import ViewPdf from "../../view-details/view-pdf";

import { ApplicantDac } from "../../../enums/applicants/applicant-dac.enum";
import { ApplicantOnBoardingChecklist } from "../../../enums/applicants/applicant-onboarding-checklist.enum";
import { DocumentableType } from "../../../enums/documents/documentable-type.enum";
import { BooleanType } from "../../../enums/jotform/boolean-type.enum";
import { ApplicantDacEntity } from "../../../models/applicant";
import { DocumentEntity } from "../../../models/documents/document.entity";
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
import BaseRadio from "../../forms/base-radio";
import SafetyPerformanceHistory from "../safety-performance-history";
import { PlusCircle } from "react-bootstrap-icons";
import BaseInput from "../../forms/base-input";
import BaseCheck from "../../forms/base-check";

export default function OnboardingChecklist(
  props: ViewApplicantOnboardingChecklistProps
) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const applicantApi = new ApplicantApi();

  const [pdf, setPdf] = useState({});
  const [applicant, setApplicant] = useState<ApplicantEntity>(null);

  useEffectAsync(async () => {
    if (props.applicant?.id) {
      const v = await applicantApi.getById(props.applicant?.id);
      console.log("applicant", v);

      setApplicant(v);
    }
  }, [user]);

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

  const handleDacChangeClick = async (type: any, dac?: ApplicantDacEntity) => {
    const data: ApplicantDacEntity = { type };
    if (dac) {
      data.id = dac.id;
      data.value = !!dac.value;
      data.details = dac.details;
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

  /* This is a functional component in TypeScript React that renders a list of buttons for a
    given document and type. It conditionally renders the buttons based on whether the document type
    matches the given type and whether the type is SAFETY_PERFORMANCE_HISTORY. The buttons include
    ViewDocumentButton, AddDocumentButton, DownloadDocumentButton, DeleteDocumentButton, and
    ViewDocumentHistory. If the type is SAFETY_PERFORMANCE_HISTORY, it renders the
    SafetyPerformanceHistory component instead of the buttons. */
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

  const UpdatedAt = ({ document, type }) => {
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

  useEffect(() => {
    console.log("dacForm.values", dacForm.values);
    console.log("dacForm.errors", dacForm.errors);
  }, [dacForm.errors, dacForm.values]);
  return (
    <>
      {!!applicant ? (
        <ViewCard
          title={props.title ?? "DOCUMENTS"}
        //   actions={
        //     <Button size="sm" onClick={() => {}}>
        //       {t("EDIT_LIST")}
        //     </Button>
        //   }
        >
          <h4 className="mt-2">{t("COMPLETED")}</h4>
          <Table striped>
            <thead>
              <tr>
                <th colSpan={2}>{t("DOCUMENT_NAME")}</th>
                <th colSpan={2}>{t("UPDATED_AT")}</th>
                {/* <th colSpan={2}>{t("UPLOAD_METHOD")}</th> */}
                <th colSpan={1}></th>
              </tr>
            </thead>
            <tbody>
              {Object.values(ApplicantOnBoardingChecklist).map(
                (type: ApplicantOnBoardingChecklist, i) => {
                  /* Finding the document in the applicant.documents array that has the same type. */
                  const document: DocumentEntity = applicant?.documents?.find(
                    (v) => v.type == type && !!v.path
                  );
                  if (document)
                    return (
                      <tr key={i}>
                        <td colSpan={2}>
                          {t(`ApplicantOnBoardingChecklist.${type}`)}
                        </td>
                        <td colSpan={2}>
                          <UpdatedAt document={document} type={type} />
                        </td>
                        {/* <td colSpan={2}></td> */}
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
                }
              )}
            </tbody>
          </Table>
          <h4 className="mt-5">{t("UPLOAD_FILES")}</h4>
          <Table striped>
            <thead>
              <tr>
                <th colSpan={2}>{t("DOCUMENT_NAME")}</th>
                {/* <th colSpan={2}>{t("AUTO_UPLOAD?")}</th> */}
                <th colSpan={1}></th>
              </tr>
            </thead>
            <tbody>
              {Object.values(ApplicantOnBoardingChecklist).map(
                (type: ApplicantOnBoardingChecklist, i) => {
                  /* Finding the document in the applicant.documents array that has the same type. */
                  const document: DocumentEntity = applicant?.documents?.find(
                    (v) => v.type == type && v.path
                  );
                  if (!document)
                    return (
                      <tr key={i}>
                        <td colSpan={2}>
                          {t(`ApplicantOnBoardingChecklist.${type}`)}
                        </td>
                        {/* <td colSpan={2}></td> */}
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
                }
              )}
            </tbody>
          </Table>
          <h4 className="mt-5">{t("CHECKLIST_ITEMS")}</h4>
          <Table striped>
            <thead>
              <tr>
                <th colSpan={2}>{t("TYPE")}</th>
                {Boolean(props.showCompleted) && (
                  <th colSpan={1} className="text-center"></th>
                )}
                <th colSpan={1} className="text-center">{t("DATE")}</th>
                <th colSpan={1} className="text-center">{t("DETAILS")}</th>
                <th colSpan={1}></th>
              </tr>
            </thead>
            <tbody>
              {Object.values(ApplicantDac).map((value: ApplicantDac, i) => {
                const dac: ApplicantDacEntity = applicant?.dac?.find(
                  (v) => v.type == value
                );
                return (
                  <tr key={i}>
                    <td colSpan={2}> {t(`ApplicantDac.${value}`)}</td>
                    {Boolean(props.showCompleted) && (
                      <td colSpan={1} className="text-center">
                        <BaseCheck
                          className=""
                          disabled
                          checked={Boolean(
                            dac?.type && dac.type == value && dac.value
                          )}
                        />
                      </td>
                    )}
                    <td colSpan={1} className="text-center">
                      {dac?.last_updated_at ? (
                        <ShowFormattedDate date={dac?.last_updated_at} />
                      ) : (
                        <span className="text-danger font-italic">
                          {t(`NOT_AVAILABLE`)}
                        </span>
                      )}
                    </td>
                    <td colSpan={1} className="text-center">
                      {dac?.details ? (
                        dac?.details
                      ) : (
                        <span className="text-danger font-italic">
                          {t(`NOT_AVAILABLE`)}
                        </span>
                      )}
                    </td>
                    <td colSpan={1}>
                      <div className="w-100">
                        {dacForm.values.type != value ? (
                          <div className="d-flex justify-content-between">
                            <Button
                              className="ml- w-100"
                              disabled={
                                form.isSubmitting ||
                                !form.isValid ||
                                form.isValidating
                              }
                              onClick={() => {
                                handleDacChangeClick(value, dac);
                              }}
                            >
                              {t("CHANGE")}
                            </Button>
                          </div>
                        ) : (
                          <Form onSubmit={dacForm.handleSubmit}>
                            <div style={{ display: 'flex', flexDirection: "column", justifyContent: "center" }}>
                              <BaseRadio
                                name={`value`}
                                className="float-left ml-2 my-2 w-40"
                                label={`ApplicantDac.${value}`}
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
                                name={"DETAILS"}
                                className=" d-flex justify-content-center align-items-end float-left ml-2 my-1 w-40"
                                label={"DETAILS"}
                                placeholder=""
                                value={dacForm.values.details}
                                onChange={({ target: { value } }) => {
                                  dacForm.setFieldValue(
                                    "details",
                                    value
                                  );
                                }}
                              />
                            </div>
                            <div className="d-flex justify-content-end w-40">
                              <Button
                                disabled={
                                  dacForm.isSubmitting ||
                                  !dacForm.isValid ||
                                  dacForm.isValidating
                                }
                                className=" theme-primary-btn"
                                type="submit"
                              >
                                {t(`SAVE`)}
                              </Button>
                              <Button
                                type="button"
                                className="ml-2 bg-danger"
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
        </ViewCard>
      ) : (
        <div className="d-flex justify-content-center align-items-center">
          <ThreeCircles
            height={50}
            width={50}
            color="#5bb0b9"
            ariaLabel="ball-triangle-loading"
            visible={true}
          />
        </div>
      )}
    </>
  );
}
