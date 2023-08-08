import { Button } from "react-bootstrap";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import { useState } from "react";
import { ApplicantEmployerEntity } from "../../models/applicant";
import { useTranslation } from "../../hooks/use-translation";
import ApplicantApi from "../../pages/api/applicant";
import { ApplicantDqf } from "../../enums/applicants/applicant-dqf-types.enum";
import { globalAjaxExceptionHandler } from "../../utils/ajax";
import ViewPdf from "../view-details/view-pdf";
import ViewModal from "../view-details/view-modal";
import ViewDataTable from "../view-details/view-data-table";
import ViewDocumentHistory from "../documents/view-history";
import { AddDocumentButton, DeleteDocumentButton, DownloadDocumentButton, ViewDocumentButton } from "../documents/buttons";
import { DocumentableType } from "../../enums/documents/documentable-type.enum";
import { SafetyPerformanceHistoryProps } from "../../types/applicant/safety-performnance-history-props.type";
import { handleDownloadDocument, handleViewDocument } from "../../utils/documents/button-actions";
import FileInput from "../forms/file-input";
import OverlyPopover from '../popover/overly-popover'
import { ApplicantEmployerDocumentDto } from "../../models/applicant/applicant-employer-document-dto";
import { LoaderIcon } from "../loading/loader-icon";

export default function SafetyPerformanceHistory({
    buttonClass,
    applicant,
    canEditSafetyPerformance,
    showHistory,
    showResendButton
}: SafetyPerformanceHistoryProps) {

    const { t } = useTranslation();
    const applicantApi = new ApplicantApi();

    const [pdf, setPdf] = useState({});

    const [employers, setEmployers] = useState<ApplicantEmployerEntity[]>([])
    const resetEmployers = () => setEmployers([])

    const [isLoading, setIsLoading] = useState<{
        id: number,
        action: "DELETE" | "RESEND",
    }>(null)
    const resetIsLoading = (): void => setIsLoading(null);

    const form = useFormik({
        initialValues: new ApplicantEmployerDocumentDto(),
        validationSchema: ApplicantEmployerDocumentDto.yupSchema(),
        onSubmit: async ({ document, employer }, { resetForm }) => {
            try {
                const doc = await applicantApi.employer.documents.create(applicant.id, employer.id, document)

                if (document.id) {
                    employer.documents = employer.documents?.filter(v => v.id != document.id)
                }
                employer.documents?.push(doc)

                toast.success(t('DOCUMENT_UPLOAD_SUCCESS_MESSAGE'))
                resetForm()
            }
            catch (e) {
                globalAjaxExceptionHandler(e, { formik: form, toast: toast, t: t });
            }
        }
    });

    const handleClick = async () => {
        const data = await applicantApi.employer.list(applicant.id)
        setEmployers(data)
        if (!Boolean(data.length)) alert(t('NO_RECORDS_FOUND'))
    }

    /**
     * It deletes a document from the applicant's profile.
     * @param {ApplicantDqf | string} docType - The type of document you want to
     * delete.
     */
    const handleDeleteDocument = async (
        employer: ApplicantEmployerEntity,
        docType: ApplicantDqf | string
    ): Promise<void> => {
        setIsLoading({ action: "DELETE", id: employer?.id })

        await applicantApi.employer.documents.delete(applicant?.id, employer?.id, docType)

        setEmployers([
            ...employers.filter(v => v.id != employer.id),
            {
                ...employer,
                documents: employer.documents?.filter(v => v.type != docType)
            }
        ])
        resetIsLoading()
    }

    /**
     * It takes a type and an optional documentId, and sets the form's document field to an object with the
     * type and id
     * @param {ApplicantDqf} type - ApplicantDqf - this is the type of document that is being uploaded.
     * @param {number} [documentId] - The id of the document to be updated.
     */
    const handleUpdateDocument = async (type: ApplicantDqf, documentId?: number, employer?: ApplicantEmployerEntity): Promise<void> => {
        console.log("type", type, documentId, employer);

        form?.setFieldValue("employer", employer)
        form?.setFieldValue("document", { type, id: documentId ?? null })
    }

    const resendVoeRequest = async (employerId: number) => {
        try {
            setIsLoading({ action: "RESEND", id: employerId })
            const applicantApi = new ApplicantApi()
            const response: ApplicantEmployerEntity = await applicantApi.employer.sendVoeRequest(applicant?.id, employerId)

            const updatedEmployers: ApplicantEmployerEntity[] = [
                ...employers.filter((v) => v.id !== employerId),
                {
                    ...employers.find((v) => v.id === employerId), // Find the employer to update
                    voe_attempts: response.voe_attempts, // Update the 'voe_attempts' property
                },
            ];
            setEmployers(updatedEmployers.slice().sort((a, b) => a.id - b.id))

            resetIsLoading()
            toast.success(t("RESEND_VOE_SUCCESSFULL"))
        } catch (error) {
            toast.error(t("ERROR_MESSAGE_DEFAULT"))
        }
    }

    const ButtonList = ({ employer, document, type }) => (
        <>
            {form?.values?.employer?.id != employer?.id && (
                <div className="d-flex w-100 mt-2">
                    <ViewDocumentButton
                        document={document}
                        onClick={() => handleViewDocument(document.id, setPdf)}
                    />
                    {Boolean(canEditSafetyPerformance) && (
                        <AddDocumentButton
                            document={document}
                            type={type}
                            t={t}
                            onClick={() =>
                                handleUpdateDocument(type, document?.id, employer)
                            }
                        />
                    )}
                    <DownloadDocumentButton
                        document={document}
                        onClick={() => handleDownloadDocument(document.id)}
                    />
                    {Boolean(canEditSafetyPerformance) && (
                        <DeleteDocumentButton
                            isLoading={isLoading?.action == "DELETE" && isLoading.id == document?.id}
                            document={document}
                            onClick={() => handleDeleteDocument(employer, type)}
                        />
                    )}
                    {Boolean(showHistory) && (
                        <ViewDocumentHistory
                            typePrefix="ApplicantDqf"
                            document={document}
                            type={type}
                            documentable_id={applicant.id}
                            documentable_type={DocumentableType.APPLICANT_EMPLOYERS}
                        />
                    )}
                    {Boolean(showResendButton) &&
                        Boolean(employer?.email) &&
                        Boolean(employer?.can_contact) &&
                        Boolean(employer?.is_subject_to_fmcsrs) && (
                            <Button
                                className="mr-2 w-100"
                                onClick={() => resendVoeRequest(employer.id)}
                            >
                                <OverlyPopover
                                    str={
                                        !Boolean(employer.can_contact)
                                            ? "NOT_AUTHORIZED_TO_COMMUNICATE"
                                            : "RESEND_VOE"
                                    }
                                >
                                    <>
                                        {t("RESEND")}
                                        <LoaderIcon isLoading={Boolean(isLoading?.action == "RESEND" && isLoading.id == employer?.id)} />
                                    </>
                                </OverlyPopover>
                            </Button>
                        )}
                </div>
            )}
        </>
    );

    return (
        <>
            <Button
                className={buttonClass ?? "w-100"}
                title={t("VIEW")}
                onClick={() => handleClick()}
            >{t("VIEW")}</Button>

            <ViewModal
                show={Boolean(employers.length)}
                onCloseClick={() => {
                    resetEmployers()
                    form.resetForm()
                }}
                closeText="CANCEL"
                title="PAST_EMPLOYER"
            >
                <ViewDataTable<ApplicantEmployerEntity>
                    customStyles={{
                        headRow: {
                            style: {
                                background: "linear-gradient(to bottom right, #2ec8c4, #1b4454ba)",
                                color: "white"
                            },
                        },
                    }}
                    columns={[
                        {
                            name: "NAME",
                            selector: emp => emp.name,
                            cell: emp => <OverlyPopover slice_at={5} str={emp.name} />,
                            width: '10%',
                        },
                        {
                            name: "EMAIL",
                            selector: emp => emp.email,
                            cell: emp => <OverlyPopover slice_at={5} str={emp.email} />,
                            width: '10%',
                        },
                        {
                            name: "VOE_ATTEMPT_COUNT",
                            selector: emp => emp.voe_attempts ?? 0,
                            width: '10%',
                        },
                        {
                            name: "AUTHORIZED_TO_COMMUNICATE",
                            selector: emp => t(`BooleanType.${emp.can_contact ? "YES" : "NO"}`),
                            width: '10%',
                        },
                        {
                            name: "SUBJECT_TO_FMCR",
                            selector: emp => t(`BooleanType.${emp?.is_subject_to_fmcsrs ? "YES" : "NO"}`),
                            width: '10%',
                        },
                        {
                            width: '50%',
                            cell: emp => {
                                const doc = emp.documents?.find(v => v.type == ApplicantDqf.SAFETY_PERFORMANCE_HISTORY)
                                return (<>
                                    <ButtonList employer={emp} type={ApplicantDqf.SAFETY_PERFORMANCE_HISTORY} document={doc} />
                                    {(form?.values?.employer?.id == emp.id)
                                        && <form className="mt-2 mr-2" onSubmit={form?.handleSubmit} >
                                            <FileInput
                                                name={`document`}
                                                accept="application/pdf"
                                                formik={form}
                                                allowedSizeInByte={3145728}
                                            />
                                            <div className="mt-2 d-flex w-100 ">
                                                <Button
                                                    disabled={form?.isSubmitting || !form?.isValid || form?.isValidating}
                                                    className="mr-2 w-50 theme-primary-btn"
                                                    type="submit"
                                                >{t(`SAVE`)} <LoaderIcon isLoading={form?.isSubmitting} /></Button>
                                                <Button
                                                    type="button"
                                                    className="w-50 bg-danger"
                                                    onClick={() => { form?.resetForm() }}
                                                >{t(`CANCEL`)}</Button>
                                            </div>
                                        </form>
                                    }
                                </>)
                            },
                            hidable: false
                        },
                    ]}
                    items={employers}
                />
            </ViewModal >
            <ViewPdf {...pdf} onCloseClick={() => setPdf({})} />
        </>
    );
};

