import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { Button, Col, Row } from "react-bootstrap";
import { Send } from "react-bootstrap-icons";
import { toast } from "react-toastify";
import { ApplicantOnBoardingChecklist } from "../../enums/applicants/applicant-onboarding-checklist.enum";
import { DocumentableType } from "../../enums/documents/documentable-type.enum";
import { useTranslation } from "../../hooks/use-translation";
import { ApplicantEmployerEntity } from "../../models/applicant";
import { ApplicantEmployerDocumentDto } from "../../models/applicant/applicant-employer-document-dto";
import ApplicantApi from "../../pages/api/applicant";
import { SafetyPerformanceHistoryProps } from "../../types/applicant/safety-performnance-history-props.type";
import { globalAjaxExceptionHandler } from "../../utils/ajax";
import {
  handleDownloadDocument,
  handleViewDocument,
} from "../../utils/documents/button-actions";
import { useEffectAsync } from "../../utils/react";
import {
  AddDocumentButton,
  DeleteDocumentButton,
  DownloadDocumentButton,
  ViewDocumentButton,
} from "../documents/buttons";
import ViewDocumentHistory from "../documents/view-history";
import FileInput from "../forms/file-input";
import ShowFormattedDate from "../jobs/show-formatted-date";
import { LoaderIcon } from "../loading/loader-icon";
import OverlyPopover from "../popover/overly-popover";
import ViewDataTable from "../view-details/view-data-table";
import ViewDetails from "../view-details/view-details";
import ViewModal from "../view-details/view-modal";
import ViewPdf from "../view-details/view-pdf";

export default function SafetyPerformanceHistory({
  buttonClass,
  applicant,
  canEditSafetyPerformance,
  showHistory,
  showResendButton,
}: SafetyPerformanceHistoryProps) {
  const { t } = useTranslation();
  const applicantApi = new ApplicantApi();

  const [showModal, setShowModal] = useState<boolean>(false);
  const [pdf, setPdf] = useState({});

  const [employers, setEmployers] = useState<ApplicantEmployerEntity[]>([]);
  const resetEmployers = () => setEmployers([]);

  const [isLoading, setIsLoading] = useState<{
    id: number;
    action: "DELETE" | "RESEND";
  }>(null);
  const resetIsLoading = (): void => setIsLoading(null);

  const form = useFormik({
    initialValues: new ApplicantEmployerDocumentDto(),
    validationSchema: ApplicantEmployerDocumentDto.yupSchema(),
    onSubmit: async ({ document, employer }, { resetForm }) => {
      try {
        const doc = await applicantApi.employer.documents.create(
          applicant.id,
          employer.id,
          document
        );

        if (document.id) {
          employer.documents = employer.documents?.filter(
            (v) => v.id != document.id
          );
        }
        employer.documents?.push(doc);

        toast.success(t("DOCUMENT_UPLOAD_SUCCESS_MESSAGE"));
        resetForm();
      } catch (e) {
        globalAjaxExceptionHandler(e, { formik: form, toast: toast, t: t });
      }
    },
  });

  useEffectAsync(async () => {
    if (!!applicant?.id) {
      const data = await applicantApi.employer.list(applicant.id);
      setEmployers(data);
    }
  }, [applicant?.id]);

  useEffect(() => {
    return () => {
      resetEmployers();
    };
  }, []);

  /**
   * It deletes a document from the applicant's profile.
   * @param {ApplicantOnBoardingChecklist | string} docType - The type of document you want to
   * delete.
   */
  const deleteEmployerVoeDocumentHandler = async (
    employer: ApplicantEmployerEntity,
    docType: ApplicantOnBoardingChecklist | string
  ): Promise<void> => {
    setIsLoading({ action: "DELETE", id: employer?.id });

    await applicantApi.employer.documents.delete(
      applicant?.id,
      employer?.id,
      docType
    );

    const updatedEmployers = [
      ...applicant?.employers?.filter((v) => v.id != employer.id),
      {
        ...employer,
        voe_submitted: false,
        documents: employer.documents?.filter((v) => v.type != docType),
      },
    ];
    await applicantApi.update(applicant.id, {
      ...applicant,
      employers: updatedEmployers,
    });

    setEmployers(updatedEmployers);
    resetIsLoading();
  };

  /**
   * It takes a type and an optional documentId, and sets the form's document field to an object with the
   * type and id
   * @param {ApplicantOnBoardingChecklist} type - ApplicantOnBoardingChecklist - this is the type of document that is being uploaded.
   * @param {number} [documentId] - The id of the document to be updated.
   */
  const handleUpdateDocument = async (
    type: ApplicantOnBoardingChecklist,
    documentId?: number,
    employer?: ApplicantEmployerEntity
  ): Promise<void> => {

    form?.setFieldValue("employer", employer);
    form?.setFieldValue("document", { type, id: documentId ?? null });
  };

  const resendVoeRequest = async (employerId: number) => {
    try {
      setIsLoading({ action: "RESEND", id: employerId });
      const applicantApi = new ApplicantApi();
      const response: ApplicantEmployerEntity =
        await applicantApi.employer.sendVoeRequest(applicant?.id, employerId);

      const updatedEmployers: ApplicantEmployerEntity[] = [
        ...employers.filter((v) => v.id != employerId),
        {
          ...employers.find((v) => v.id == employerId), // Find the employer to update
          voe_attempts: response.voe_attempts, // Update the 'voe_attempts' property
        },
      ];
      setEmployers(updatedEmployers.slice().sort((a, b) => a.id - b.id));

      resetIsLoading();
      toast.success(t("RESEND_VOE_SUCCESSFULL"));
    } catch (error) {
      toast.error(t("ERROR_MESSAGE_DEFAULT"));
    }
  };

  const ButtonList = ({ employer, document, type }) => (
    <>
      {form?.values?.employer?.id != employer?.id && (
        <div className="d-flex w-100 mt-2 justify-content-end">
          {!document?.name?.includes(".doc") && (
            <ViewDocumentButton
              document={document}
              onClick={() => handleViewDocument(document.id, setPdf)}
            />
          )}
          {!applicant?.is_hired && Boolean(canEditSafetyPerformance) && (
            <OverlyPopover
              str={
                Boolean(!employer.can_contact)
                  ? "REQUESTING_OR_UPLOADING_NOT_AUTHORIZED_TO_COMMUNICATE"
                  : "ADD_DOCUMENT"
              }
              className="popover-class"
            >
              <AddDocumentButton
                disabled={!Boolean(employer?.can_contact)}
                document={document}
                type={type}
                t={t}
                onClick={() =>
                  handleUpdateDocument(type, document?.id, employer)
                }
              />
            </OverlyPopover>
          )}
          <DownloadDocumentButton
            document={document}
            onClick={() => handleDownloadDocument(document.id)}
          />
          {Boolean(showHistory) && (
            <ViewDocumentHistory
              buttonClass="btn btn-link p-0 me-3"
              typePrefix="ApplicantOnBoardingChecklist"
              document={document}
              type={type}
              documentable_id={applicant.id}
              documentable_type={DocumentableType.APPLICANT_EMPLOYERS}
            />
          )}
          {!applicant?.is_hired && (
            <>
              {Boolean(canEditSafetyPerformance) && (
                <DeleteDocumentButton
                  isLoading={
                    isLoading?.action == "DELETE" &&
                    isLoading.id == document?.id
                  }
                  document={document}
                  onClick={() =>
                    deleteEmployerVoeDocumentHandler(employer, type)
                  }
                />
              )}
              {Boolean(showResendButton) &&
                Boolean(employer?.email) &&
                Boolean(employer?.is_subject_to_fmcsrs) && (
                  <OverlyPopover
                    str={
                      Boolean(employer.can_contact)
                        ? "RESEND_VOE"
                        : "REQUESTING_OR_UPLOADING_NOT_AUTHORIZED_TO_COMMUNICATE"
                    }
                    className="popover-class"
                  >
                    <Button
                      disabled={!Boolean(employer?.can_contact)}
                      className="mr-2 w-100 "
                      onClick={() =>
                        Boolean(employer?.can_contact) &&
                        resendVoeRequest(employer.id)
                      }
                    >
                      {Boolean(
                        isLoading?.action == "RESEND" &&
                          isLoading.id == employer?.id
                      ) ? (
                        <LoaderIcon isLoading />
                      ) : (
                        <>
                          {t("RESEND")} <Send />
                        </>
                      )}
                    </Button>
                  </OverlyPopover>
                )}
            </>
          )}
          
        </div>
      )}
    </>
  );

  return (
    <>
      <Button
        disabled={!employers.length}
        className={buttonClass ?? "w-100"}
        title={t("PAST_EMP_QDF_DESCRITION")}
        onClick={() => setShowModal(true)}
      >
        {t(!!employers.length ? "VOE_LIST" : "VOE_LIST_NOT_AVAILABLE")}
      </Button>

      <ViewModal
        show={showModal}
        onCloseClick={() => {
          setShowModal(false);
          form.resetForm();
        }}
        closeText="CANCEL"
        title="PAST_EMPLOYER"
      >
        <ViewDataTable<ApplicantEmployerEntity>
          description="PAST_EMP_QDF_DESCRITION"
          columns={[
            {
              name: "COMPANY_NAME",
              selector: (emp) => emp.name,
              // cell: (emp) => <OverlyPopover slice_at={5} str={emp.name} />,
              width: "25%",
            },
            {
              width: "70%",
              cell: (emp) => {
                const doc = emp.documents?.find(
                  (v) =>
                    v.type ==
                    ApplicantOnBoardingChecklist.SAFETY_PERFORMANCE_HISTORY
                );
                return (
                  <>
                    <ButtonList
                      employer={emp}
                      type={
                        ApplicantOnBoardingChecklist.SAFETY_PERFORMANCE_HISTORY
                      }
                      document={doc}
                    />
                    {!applicant?.is_hired &&
                      form?.values?.employer?.id == emp.id && (
                        <form
                          className="mt-2 mr-2 w-100"
                          onSubmit={form?.handleSubmit}
                        >
                          <FileInput
                            name={`document`}
                            accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/*"
                            formik={form}
                            allowedSizeInByte={3145728}
                          />
                          <div className="mt-2 d-flex w-100 ">
                            <Button
                              disabled={
                                form?.isSubmitting ||
                                !form?.isValid ||
                                form?.isValidating
                              }
                              className="mr-2 w-50 theme-primary-btn"
                              type="submit"
                            >
                              {t(`SAVE`)}{" "}
                              <LoaderIcon isLoading={form?.isSubmitting} />
                            </Button>
                            <Button
                              type="button"
                              className="w-50 bg-danger"
                              onClick={() => {
                                form?.resetForm();
                              }}
                            >
                              {t(`CANCEL`)}
                            </Button>
                          </div>
                        </form>
                      )}
                  </>
                );
              },
              hidable: false,
            },
          ]}
          items={employers}
          expandableRowsComponent={({ data }) => (
            <>
              <Row className="mt-2">
                <Col>
                  <ViewDetails
                    default={t("NOT_ANSWERED")}
                    obj={{
                      APPLICANT_NAME: `${applicant.first_name} ${applicant.last_name}`,
                      MANAGER_OR_REPRESENTATIVE: data.manager_name,
                      EMAIL: data.email,
                    }}
                  />
                </Col>
                <Col>
                  <ViewDetails
                    default={t("NOT_ANSWERED")}
                    obj={{
                      VOE_SUBMITTED:
                        data?.voe_submitted || Boolean(data?.documents?.length)
                          ? t("YES")
                          : t("NO"),
                      AUTHORIZED_TO_COMMUNICATE: Boolean(data.can_contact)
                        ? t("YES")
                        : t("NO"),
                      SUBJECT_TO_FMCR: Boolean(data.is_subject_to_fmcsrs)
                        ? t("YES")
                        : t("NO"),
                    }}
                  />
                </Col>
              </Row>
              <Row className="mb-2">
                <Col md={6}>
                  <label>{t("VOE_ATTEMPT_COUNT")}</label>
                  <ol className="list-group">
                    {data.voe_attempts?.length ? (
                      data.voe_attempts.map((v, i) => (
                        <li key={i} className="list-group-item">
                          <strong>{i + 1}</strong>:{" "}
                          <ShowFormattedDate date={v} />
                        </li>
                      ))
                    ) : (
                      <li className="list-group-item">0</li>
                    )}
                  </ol>
                </Col>
              </Row>
            </>
          )}
        />
      </ViewModal>
      <ViewPdf {...pdf} onCloseClick={() => setPdf({})} />
    </>
  );
}
