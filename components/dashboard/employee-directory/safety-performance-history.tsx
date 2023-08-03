import { Button } from "react-bootstrap";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import { useState } from "react";
import { useTranslation } from "../../../hooks/use-translation";
import { globalAjaxExceptionHandler } from "../../../utils/ajax";
import ViewPdf from "../../view-details/view-pdf";
import ViewModal from "../../view-details/view-modal";
import ViewDataTable from "../../view-details/view-data-table";
import ViewDocumentHistory from "../../documents/view-history";
import { AddDocumentButton, DeleteDocumentButton, DownloadDocumentButton, ViewDocumentButton } from "../../documents/buttons";
import { DocumentableType } from "../../../enums/documents/documentable-type.enum";
import { handleDownloadDocument, handleViewDocument } from "../../../utils/documents/button-actions";
import FileInput from "../../forms/file-input";
import OverlyPopover from '../../popover/overly-popover'
import { EmployeeSafetyPerformanceHistoryProps } from "../../../types/employee/employee-safety-performnance-history-props.type";
import EmployeeApi from "../../../pages/api/employee";
import { EmployeeEmployerDocumentDto } from "../../../models/employee/employee-employer-document-dto";
import { EmployeeDocumentType } from "../../../enums/employee/employee-document-types.enum";
import { EmployeeEmployerEntity } from "../../../models/employee/employee-employer.entity";


export default function SafetyPerformanceHistory({
    buttonClass,
    employee,
    canEditSafetyPerformance,
    showHistory,
    showResendButton
}: EmployeeSafetyPerformanceHistoryProps) {

    const { t } = useTranslation();
    const employeeApi = new EmployeeApi();

    const [pdf, setPdf] = useState({});

    const [employers, setEmployers] = useState<EmployeeEmployerEntity[]>([])
    const resetEmployers = () => setEmployers([])

    const [isLoading, setIsLoading] = useState<{
        action: "DELETE",
    }>(null)
    const resetIsLoading = (): void => setIsLoading(null);

    const form = useFormik({
        initialValues: new EmployeeEmployerDocumentDto(),
        validationSchema: EmployeeEmployerDocumentDto.yupSchema(),
        onSubmit: async ({ document, employer }, { resetForm }) => {
            try {
                const doc = await employeeApi.employer.documents.create(employee.id, employer.id, document)

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
        const data = await employeeApi.employer.list(employee.id)
        setEmployers(data)
        if (!Boolean(data.length)) alert(t('NO_RECORDS_FOUND'))
    }

    /**
     * It deletes a document from the employee's profile.
     * @param {EmployeeDocumentType | string} docType - The type of document you want to
     * delete.
     */
    const handleDeleteDocument = async (
        employer: EmployeeEmployerEntity,
        docType: EmployeeDocumentType | string
    ): Promise<void> => {
        setIsLoading({ action: "DELETE" })
        await employeeApi.employer.documents.delete(employee?.id, employer?.id, docType)

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
     * @param {EmployeeDocumentType} type - EmployeeDocumentType - this is the type of document that is being uploaded.
     * @param {number} [documentId] - The id of the document to be updated.
     */
    const handleUpdateDocument = async (type: EmployeeDocumentType, documentId?: number, employer?: EmployeeEmployerEntity): Promise<void> => {
        form?.setFieldValue("employer", employer)
        form?.setFieldValue("document", { type, id: documentId ?? null })
    }

    const resendVoeRequest = async (employerId: number) => {
        try {
            const response: EmployeeEmployerEntity = await employeeApi.employer.sendVoeRequest(employee?.id, employerId)
            setEmployers([...(employers.filter(v => v.id != response.id)), { ...response }])
            toast.success(t("RESEND_VOE_SUCCESSFULL"))
        } catch (error) {
            toast.error(t("ERROR_MESSAGE_DEFAULT"))
        }
    }

    const ButtonList = ({ employer, document, type }) => (
        <>
            {(!form?.values?.document?.type)
                && (<div className="d-flex w-100 mt-2">
                    <ViewDocumentButton
                        document={document}
                        onClick={() => handleViewDocument(document.id, setPdf)}
                    />
                    {Boolean(canEditSafetyPerformance)
                        && <AddDocumentButton
                            document={document}
                            type={type}
                            t={t}
                            onClick={() => handleUpdateDocument(type, document?.id, employer)}
                        />
                    }
                    <DownloadDocumentButton
                        document={document}
                        onClick={() => handleDownloadDocument(document.id)}
                    />
                    {Boolean(canEditSafetyPerformance)
                        && <DeleteDocumentButton
                            document={document}
                            isLoading={isLoading?.action == "DELETE"}
                            onClick={() => handleDeleteDocument(employer, type)}
                        />
                    }
                    {Boolean(showHistory)
                        && <ViewDocumentHistory
                            document={document}
                            type={type}
                            documentable_id={employee.id}
                            documentable_type={DocumentableType.EMPLOYEE_EMPLOYERS}
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
                onCloseClick={() => {
                    resetEmployers()
                    form.resetForm()
                }}
                closeText="CANCEL"
                title="PAST_EMPLOYER"
            >
                <ViewDataTable<EmployeeEmployerEntity>
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
                            width: '20%',
                        },
                        {
                            name: "EMAIL",
                            selector: emp => emp.email,
                            hidable: false,
                            width: '20%',
                        },
                        {
                            name: "VOE_ATTEMPT_COUNT",
                            selector: emp => emp.voe_attempts ?? 0,
                            hidable: false,
                            width: '10%',
                        },
                        {
                            width: '50%',
                            cell: emp => {
                                const doc = emp.documents?.find(v => v.type == EmployeeDocumentType.SAFETY_PERFORMANCE_HISTORY)
                                return (<>
                                    <ButtonList employer={emp} type={EmployeeDocumentType.SAFETY_PERFORMANCE_HISTORY} document={doc} />
                                    {(form?.values?.document?.type)
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
                                                >{t(`SAVE`)}</Button>
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

