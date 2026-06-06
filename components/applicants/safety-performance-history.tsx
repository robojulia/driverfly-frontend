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
import FileInput from "../forms/file-input";
import ShowFormattedDate from "../jobs/show-formatted-date";
import { LoaderIcon } from "../loading/loader-icon";
import OverlyPopover from "../popover/overly-popover";
import ViewDataTable from "../view-details/view-data-table";
import ViewDetails from "../view-details/view-details";
import ViewModal from "../view-details/view-modal";
import ViewPdf from "../view-details/view-pdf";
import { VoeAuthorizationActions, hasVoeSignature } from "../pdf/voe-authorization";
import { formatDate } from "../jobs/show-formatted-date";

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

  const [sentEmployerId, setSentEmployerId] = useState<number | null>(null);

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
      setSentEmployerId(employerId);
      toast.success(t("RESEND_VOE_SUCCESSFULL"));

      // Reset sent status after 3 seconds
      setTimeout(() => {
        setSentEmployerId(null);
      }, 3000);
    } catch (error) {
      resetIsLoading();
      toast.error(t("ERROR_MESSAGE_DEFAULT"));
    }
  };

  // Whether the driver has a VOE authorization signature on file (required to
  // generate the per-employer VOE authorization form).
  const voeSigned = hasVoeSignature(applicant);

  /**
   * Determines whether a VOE request can be pushed to a given past employer,
   * mirroring the backend gating (email + applicant authorization to contact +
   * employer subject to the FMCSRs). When not eligible, `reason` is a
   * translation key explaining exactly which condition blocks the send so it
   * can be surfaced next to the greyed-out button.
   */
  const getVoeSendState = (
    employer: ApplicantEmployerEntity
  ): { eligible: boolean; reason?: string } => {
    if (!Boolean(employer?.email))
      return { eligible: false, reason: "VOE_BLOCKED_NO_EMAIL" };
    if (!Boolean(employer?.can_contact))
      return { eligible: false, reason: "VOE_BLOCKED_NO_CONTACT" };
    if (!Boolean(employer?.is_subject_to_fmcsrs))
      return { eligible: false, reason: "VOE_BLOCKED_NOT_FMCSR" };
    return { eligible: true };
  };

  const ButtonList = ({ employer, document, type }) => (
    <>
      {form?.values?.employer?.id != employer?.id && (
        <div
          className="d-flex w-100 mt-2 justify-content-end align-items-center flex-wrap"
          style={{ gap: 10 }}
        >
          {/* Driver's signed VOE authorization form for this employer:
              viewable / downloadable directly from the popup. */}
          <VoeAuthorizationActions
            applicant={applicant}
            employer={employer}
            disabled={!voeSigned}
            disabledReason={t("NO_VOE_SIGNATURE_ON_FILE")}
          />
          {!document?.name?.includes(".doc") && (
            <ViewDocumentButton
              document={document}
              className="btn btn-success p-0"
              style={{ width: '38px', height: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
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
                className="btn btn-info p-0"
                style={{ width: '38px', height: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
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
            className="btn theme-primary2-btn p-0"
            style={{ width: '38px', height: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            onClick={() => handleDownloadDocument(document.id)}
          />
          {!applicant?.is_hired && (
            <>
              {Boolean(canEditSafetyPerformance) && (
                <DeleteDocumentButton
                  isLoading={
                    isLoading?.action == "DELETE" &&
                    isLoading.id == document?.id
                  }
                  document={document}
                  className="btn btn-danger p-0"
                  style={{ width: '38px', height: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  onClick={() =>
                    deleteEmployerVoeDocumentHandler(employer, type)
                  }
                />
              )}
              {Boolean(showResendButton) &&
                (() => {
                  const sendState = getVoeSendState(employer);
                  const isSending =
                    isLoading?.action == "RESEND" && isLoading.id == employer?.id;
                  const alreadyAttempted = Boolean(employer?.voe_attempts?.length);
                  return (
                    <div className="d-flex align-items-center" style={{ gap: 8 }}>
                      <Button
                        disabled={
                          !sendState.eligible ||
                          isSending ||
                          sentEmployerId === employer?.id
                        }
                        className="mr-0"
                        onClick={() =>
                          sendState.eligible && resendVoeRequest(employer.id)
                        }
                      >
                        {isSending ? (
                          <LoaderIcon isLoading />
                        ) : sentEmployerId === employer?.id ? (
                          t("SENT")
                        ) : (
                          <>
                            {t(alreadyAttempted ? "RESEND" : "SEND_VOE")} <Send />
                          </>
                        )}
                      </Button>
                      {/* When gating blocks the push, explain why next to the
                          greyed-out button. */}
                      {!sendState.eligible && (
                        <span
                          className="text-muted small font-italic"
                          style={{ maxWidth: 240 }}
                        >
                          {t(sendState.reason)}
                        </span>
                      )}
                    </div>
                  );
                })()}
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
        size="xl"
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
              {/* Past employer's VOE response, captured and viewable inline
                  once they complete and submit the request. */}
              <Row className="mb-2">
                <Col>
                  <label className="font-weight-bold">{t("VOE_RESPONSE")}</label>
                  {data?.voeData?.id ? (
                    <ViewDetails
                      default={t("NOT_ANSWERED")}
                      obj={{
                        EMPLOYED_BY_US: Boolean(data.voeData.was_employed)
                          ? t("YES")
                          : t("NO"),
                        POSITION: data.voeData.position || t("N/A"),
                        START_DATE: data.voeData.start_date
                          ? formatDate(data.voeData.start_date, true)
                          : t("N/A"),
                        END_DATE: data.voeData.end_date
                          ? formatDate(data.voeData.end_date, true)
                          : t("N/A"),
                        VOE_DRIVER_QUES: Boolean(data.voeData.drived_vehicle)
                          ? t("YES")
                          : t("NO"),
                        VEHICLE_TYPE: data.voeData.drived_vehicle || t("N/A"),
                        SAFETY_PERFORMANCE_REPORT: Boolean(
                          data.voeData.safety_performance
                        )
                          ? t("YES")
                          : t("NO"),
                        ACCIDENT_REGISTER: Boolean(
                          data.voeData.registered_accidents_details
                        )
                          ? t("YES")
                          : t("NO"),
                        REASON_TO_LEAVE_EMPLOYMENT: data.voeData.reason_to_leave
                          ? t(
                              `ReasonsForLeavingEmployment.${data.voeData.reason_to_leave}`
                            )
                          : t("N/A"),
                        FULL_NAME: data.voeData.focal_person_name || t("N/A"),
                        title: data.voeData.focal_person_title || t("N/A"),
                        phone: data.voeData.focal_person_phone || t("N/A"),
                        email: data.voeData.focal_person_email || t("N/A"),
                        DATE: data.voeData.signed_date
                          ? formatDate(data.voeData.signed_date, true)
                          : t("N/A"),
                      }}
                    />
                  ) : (
                    <p className="text-muted small font-italic mb-0">
                      {t("NO_VOE_RESPONSE_YET")}
                    </p>
                  )}
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
