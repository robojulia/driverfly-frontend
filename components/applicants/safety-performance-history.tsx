import { Button } from "react-bootstrap";
import { Form, useFormik } from "formik";
import { toast } from "react-toastify";
import { Eye } from "react-bootstrap-icons";
import { useState } from "react";
import { ApplicantDocumentDto, ApplicantEmployerEntity, ApplicantEntity } from "../../models/applicant";
import { useTranslation } from "../../hooks/use-translation";
import ApplicantApi from "../../pages/api/applicant";
import DocumentApi from "../../pages/api/document";
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


export default function SafetyPerformanceHistory({ buttonClass, applicant, canEditSafetyPerformance, showHistory, showResendButton }: SafetyPerformanceHistoryProps) {

    const { t } = useTranslation();
    const applicantApi = new ApplicantApi();
    const api = new DocumentApi();

    const [pdf, setPdf] = useState({});

    const [employers, setEmployers] = useState<ApplicantEmployerEntity[]>([])
    const resetEmployers = () => setEmployers([])

    const form = useFormik({
        initialValues: new ApplicantDocumentDto(),
        validationSchema: ApplicantDocumentDto.yupSchema(),
        onSubmit: async ({ document }, { resetForm }) => {
            try {
                const applicantDocumentUpload = await applicantApi.employer.documents.create(applicant.id, document.documentable_id, document)

                if (document.id) {
                    applicant.documents = applicant.documents.filter(v => (v.id !== applicantDocumentUpload.id))
                }
                applicant.documents.push(applicantDocumentUpload)
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
    }


    /**
     * It deletes a document from the applicant's profile.
     * @param {ApplicantDqf | string} docType - The type of document you want to
     * delete.
     */
    const handleDeleteDocument = async (employer: ApplicantEmployerEntity, docType: ApplicantDqf | string): Promise<void> => {
        const applicantApi = new ApplicantApi()
        await applicantApi.employer.documents.delete(applicant?.id, employer?.id, docType)

        setEmployers([
            ...employers.filter(v => v.id == employer.id),
            {
                ...employer,
                documents: employer.documents?.filter(v => v.type == docType)
            }
        ])
    }


    /**
     * It takes a type and an optional documentId, and sets the form's document field to an object with the
     * type and id
     * @param {ApplicantDqf} type - ApplicantDqf - this is the type of document that is being uploaded.
     * @param {number} [documentId] - The id of the document to be updated.
     */
    const handleUpdateDocument = async (type: ApplicantDqf, documentId?: number, employerId?: number): Promise<void> => {
        // form?.resetForm()
        // console.log("{ type, id: documentId ?? null, documentable_id: employerId }", { type, id: documentId ?? null, documentable_id: employerId });

        form?.setFieldValue("document", { type, id: documentId ?? null, documentable_id: employerId })
    }

    const resendVoeRequest = async (employerId: number) => {
        try {
            const applicantApi = new ApplicantApi()
            await applicantApi.employer.sendVoeRequest(applicant?.id, employerId)
            toast.success(t("RESEND_VOE_SUCCESSFULL"))
        } catch (error) {
            toast.error(t("ERROR_MESSAGE_DEFAULT"))
        }
    }

    const ButtonList = ({ employer, document, type }) => (
        <>
            {(!form?.values?.document?.type || form?.values?.document?.type !== type)
                && (<div className="d-flex w-100">
                    <ViewDocumentButton
                        document={document}
                        onClick={() => handleViewDocument(document.id, setPdf)}
                    />
                    {Boolean(canEditSafetyPerformance)
                        && <AddDocumentButton
                            document={document}
                            type={type}
                            t={t}
                            onClick={() => handleUpdateDocument(type, document?.id, employer.id)}
                        />
                    }
                    <DownloadDocumentButton
                        document={document}
                        onClick={() => handleDownloadDocument(document.id)}
                    />
                    {Boolean(canEditSafetyPerformance)
                        && <DeleteDocumentButton
                            document={document}
                            onClick={() => handleDeleteDocument(employer, type)}
                        />
                    }
                    {Boolean(showHistory)
                        && <ViewDocumentHistory
                            document={document}
                            type={type}
                            documentable_id={applicant.id}
                            documentable_type={DocumentableType.APPLICANT_EMPLOYERS}
                        />
                    }
                    {(Boolean(showResendButton)
                        &&
                        <Button
                            className="mr-2 w-100"
                            disabled={!Boolean(employer.can_contact && employer?.is_subject_to_fmcsrs)}
                            onClick={() => resendVoeRequest(employer.id)}
                        >
                            <OverlyPopover str={!Boolean(employer.can_contact) ? "NOT_AUTHORIZED_TO_COMMUNICATE" : "RESEND_VOE"}>
                                {t('RESEND')}
                            </OverlyPopover>
                        </Button>
                    )}
                </div>)
            }
        </>
    )


    return (
        <>
            <Button
                className={buttonClass ?? "w-100"}
                title={t("VIEW")}
                onClick={() => handleClick()}
            >{t("VIEW")}</Button>

            <ViewModal
                show={Boolean(employers.length)}
                onCloseClick={resetEmployers}
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
                            hidable: false,
                            width: '30%',
                        },
                        {
                            name: "EMAIL",
                            selector: emp => emp.email,
                            hidable: false,
                            width: '30%',
                        },
                        {
                            width: '40%',
                            cell: emp => {
                                const doc = emp.documents?.find(v => v.type == ApplicantDqf.SAFETY_PERFORMANCE_HISTORY)
                                return (<>
                                    <ButtonList employer={emp} type={ApplicantDqf.SAFETY_PERFORMANCE_HISTORY} document={doc} />
                                    {/* {(form?.values?.document?.type && form?.values?.document?.documentable_id == emp.id)
                                        && <Form onSubmit={form?.handleSubmit} >
                                            <FileInput
                                                name={`document`}
                                                accept="application/pdf"
                                                // formik={form}
                                                allowedSizeInByte={3145728}
                                            />
                                            <div className="mt-2 d-flex w-100 ">
                                                <Button
                                                    // disabled={form?.isSubmitting || !form?.isValid || form?.isValidating}
                                                    className="mr-2 w-50 theme-primary-btn"
                                                    type="submit"
                                                >{t(`SAVE`)}</Button>
                                                <Button
                                                    type="button"
                                                    className="mr-2 w-50 bg-danger"
                                                // onClick={() => { form?.resetForm() }}
                                                >{t(`CANCEL`)}</Button>
                                            </div>
                                        </Form>
                                    } */}
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

