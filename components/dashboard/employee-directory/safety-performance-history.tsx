import { useFormik } from "formik";
import { useState } from "react";
import { Button, Col, Row } from "react-bootstrap";
import { toast } from "react-toastify";
import { DocumentableType } from "../../../enums/documents/documentable-type.enum";
import { EmployeeDqf } from "../../../enums/employee/employee-dqf.enum";
import { useTranslation } from "../../../hooks/use-translation";
import { EmployeeEmployerDocumentDto } from "../../../models/employee/employee-employer-document-dto";
import { EmployeeEmployerEntity } from "../../../models/employee/employee-employer.entity";
import EmployeeApi from "../../../pages/api/employee";
import { EmployeeSafetyPerformanceHistoryProps } from "../../../types/employee/employee-safety-performnance-history-props.type";
import { globalAjaxExceptionHandler } from "../../../utils/ajax";
import { handleDownloadDocument, handleViewDocument } from "../../../utils/documents/button-actions";
import { AddDocumentButton, DeleteDocumentButton, DownloadDocumentButton, ViewDocumentButton } from "../../documents/buttons";
import ViewDocumentHistory from "../../documents/view-history";
import FileInput from "../../forms/file-input";
import ShowFormattedDate from "../../jobs/show-formatted-date";
import OverlyPopover from '../../popover/overly-popover';
import ViewDataTable from "../../view-details/view-data-table";
import ViewDetails from "../../view-details/view-details";
import ViewModal from "../../view-details/view-modal";
import ViewPdf from "../../view-details/view-pdf";


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
     * @param {EmployeeDqf | string} docType - The type of document you want to
     * delete.
     */
    const handleDeleteDocument = async (
        employer: EmployeeEmployerEntity,
        docType: EmployeeDqf | string
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
     * @param {EmployeeDqf} type - EmployeeDqf - this is the type of document that is being uploaded.
     * @param {number} [documentId] - The id of the document to be updated.
     */
    const handleUpdateDocument = async (type: EmployeeDqf, documentId?: number, employer?: EmployeeEmployerEntity): Promise<void> => {
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
                        && <OverlyPopover
                            str={
                                Boolean(!employer.can_contact) ?
                                    "REQUESTING_OR_UPLOADING_NOT_AUTHORIZED_TO_COMMUNICATE" : 'ADD_DOCUMENT'
                            }
                            className="popover-class"
                        >
                            <AddDocumentButton
                                disabled={!Boolean(employer?.can_contact)}
                                document={document}
                                type={type}
                                t={t}
                                onClick={() => handleUpdateDocument(type, document?.id, employer)}
                            />
                        </OverlyPopover>
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
                    {/* {(Boolean(showResendButton) || Boolean(employer?.is_subject_to_fmcsrs)
                        &&
                        <OverlyPopover
                            str={
                                Boolean(employer.can_contact)
                                    ? "RESEND_VOE"
                                    : "REQUESTING_OR_UPLOADING_NOT_AUTHORIZED_TO_COMMUNICATE"
                            }
                            className="popover-class"
                        >
                            <Button
                                className="mr-2 w-100"
                                disabled={!Boolean(employer.can_contact)}
                                onClick={() => resendVoeRequest(employer.id)}
                            >
                                <OverlyPopover str={!Boolean(employer.can_contact) ? "NOT_AUTHORIZED_TO_COMMUNICATE" : "RESEND_VOE"}>
                                    {t('RESEND')}
                                </OverlyPopover>
                            </Button>
                        </OverlyPopover>
                    )} */}
                    {Boolean(showHistory)
                        && <ViewDocumentHistory
                            document={document}
                            type={type}
                            typePrefix="EmployeeDqf"
                            documentable_id={employee.id}
                            documentable_type={DocumentableType.EMPLOYEE_EMPLOYERS}
                        />
                    }
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
                            name: "COMPANY_NAME",
                            selector: emp => emp.name,
                            hidable: false,
                            width: '40%',
                        },
                        {
                            width: '55%',
                            cell: emp => {
                                const doc = emp.documents?.find(v => v.type == EmployeeDqf.SAFETY_PERFORMANCE_HISTORY)
                                return (<>
                                    <ButtonList employer={emp} type={EmployeeDqf.SAFETY_PERFORMANCE_HISTORY} document={doc} />
                                    {(form?.values?.document?.type)
                                        && <form className="mt-2 mr-2" onSubmit={form?.handleSubmit} >
                                            <FileInput
                                                name={`document`}
                                                accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/*"
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
                    expandableRowsComponent={({ data }) => (
                        <>
                            <Row className="mt-2">
                                <Col>
                                    <ViewDetails
                                        default={t("NOT_ANSWERED")}
                                        obj={{
                                            APPLICANT_NAME: `${employee.first_name} ${employee.last_name}`,
                                            MANAGER_OR_REPRESENTATIVE: data.manager_name,
                                            EMAIL: data.email,
                                        }}
                                    />
                                </Col>
                                <Col>
                                    <ViewDetails
                                        default={t("NOT_ANSWERED")}
                                        obj={{
                                            VOE_SUBMITTED: data.voe_submitted || Boolean(data?.documents?.length) ? t('YES') : t('NO'),
                                            AUTHORIZED_TO_COMMUNICATE: Boolean(data.can_contact) ? t('YES') : t('NO'),
                                            SUBJECT_TO_FMCR: Boolean(data.is_subject_to_fmcsrs) ? t('YES') : t('NO'),
                                        }}
                                    />
                                </Col>
                            </Row>
                            <Row className="mb-3">
                                <Col md={6}>
                                    <label>{t("VOE_ATTEMPT_COUNT")}</label>
                                    <ol className="list-group">
                                        {data.voe_attempts?.length
                                            ? data.voe_attempts?.map((v, i) => (
                                                <li className="list-group-item">
                                                    <strong>{i + 1}</strong>: <ShowFormattedDate date={v} />
                                                </li>
                                            ))
                                            : <li className="list-group-item">0</li>}
                                    </ol>
                                </Col>
                            </Row>
                        </>
                    )}

                />
            </ViewModal >
            <ViewPdf {...pdf} onCloseClick={() => setPdf({})} />
        </>
    );
};

