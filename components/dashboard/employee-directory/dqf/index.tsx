import { useFormik } from "formik";
import { useState } from "react";
import { Button, Col, Form, Row, Table } from "react-bootstrap";
import { ThreeCircles } from 'react-loader-spinner';
import { toast } from "react-toastify";
import { DocumentableType } from "../../../../enums/documents/documentable-type.enum";
import { EmployeeDqf } from "../../../../enums/employee/employee-dqf.enum";
import { useAuth } from "../../../../hooks/use-auth";
import { useTranslation } from "../../../../hooks/use-translation";
import { DocumentEntity } from "../../../../models/documents/document.entity";
import { EmployeeDocumentDto } from "../../../../models/employee/employee-document-dto";
import { EmployeeEntity } from "../../../../models/employee/employee.entity";
import EmployeeApi from "../../../../pages/api/employee";
import { ViewEmployeeDqfProps } from "../../../../types/employee/view-employee-dqf-props.type";
import { globalAjaxExceptionHandler } from "../../../../utils/ajax";
import { handleDownloadDocument, handleViewDocument } from "../../../../utils/documents/button-actions";
import { useEffectAsync } from "../../../../utils/react";
import { AddDocumentButton, DeleteDocumentButton, DownloadDocumentButton, ViewDocumentButton } from "../../../documents/buttons";
import ViewDocumentHistory from "../../../documents/view-history";
import FileInput from '../../../forms/file-input';
import ShowFormattedDate from "../../../jobs/show-formatted-date";
import { LoaderIcon } from "../../../loading/loader-icon";
import ViewCard from "../../../view-details/view-card";
import ViewPdf from "../../../view-details/view-pdf";
import SafetyPerformanceHistory from "../safety-performance-history";

export default function DQF(props: ViewEmployeeDqfProps) {

    const { t } = useTranslation();
    const { user } = useAuth();
    const employeeApi = new EmployeeApi();

    const [pdf, setPdf] = useState({});

    const [employee, setEmployee] = useState<EmployeeEntity>(null)

    useEffectAsync(async () => {
        if (props.employee?.id) setEmployee(props.employee)
    }, [user]);

    const form = useFormik({
        initialValues: new EmployeeDocumentDto(),
        validationSchema: EmployeeDocumentDto.yupSchema(),
        onSubmit: async ({ document }, { resetForm }) => {
            try {
                const employeeDocumentUpload = await employeeApi.documents.create(employee.id, document)

                if (document.id) {
                    employee.documents = employee.documents.filter(v => (v.id != employeeDocumentUpload.id))
                }
                employee.documents.push(employeeDocumentUpload)
                toast.success(t('DOCUMENT_UPLOAD_SUCCESS_MESSAGE'))
                resetForm()
            }
            catch (e) {
                globalAjaxExceptionHandler(e, { formik: form, toast: toast, t: t });
            }
        }
    });

    /**
     * It deletes a document from the employee's profile.
     * @param {EmployeeDqf | string} docType - The type of document you want to
     * delete.
     */
    const handleDeleteDocument = async (docType: EmployeeDqf | string): Promise<void> => {
        await employeeApi.documents.delete(employee?.id, docType)
        setEmployee({
            ...employee,
            documents: employee?.documents?.filter(v => (v.type != docType))
        })
    }

    /**
     * It takes a type and an optional documentId, and sets the form's document field to an object with the
     * type and id
     * @param {EmployeeDqf} type - EmployeeDqf - this is the type of document that is being uploaded.
     * @param {number} [documentId] - The id of the document to be updated.
     */
    const handleUpdateDocument = (
        type: EmployeeDqf,
        documentId?: number
    ): void => {
        form.setFieldValue("document", { type, id: documentId ?? null })
    }

    /* This is a functional component in TypeScript React that renders a list of buttons for a
    given document and type. It conditionally renders the buttons based on whether the document type
    matches the given type and whether the type is SAFETY_PERFORMANCE_HISTORY. The buttons include
    ViewDocumentButton, AddDocumentButton, DownloadDocumentButton, DeleteDocumentButton, and
    ViewDocumentHistory. If the type is SAFETY_PERFORMANCE_HISTORY, it renders the
    SafetyPerformanceHistory component instead of the buttons. */
    const ButtonList = ({ document, type }): JSX.Element =>
        (!form.values.document?.type || form.values.document?.type != type) && (
            <div className="d-flex">
                <ViewDocumentButton
                    document={document}
                    onClick={() => handleViewDocument(document.id, setPdf)}
                />
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
                {type == EmployeeDqf.SAFETY_PERFORMANCE_HISTORY && (
                    <SafetyPerformanceHistory
                        buttonClass="mr-2 w-50"
                        employee={employee}
                        canEditSafetyPerformance={props.canEditSafetyPerformance}
                        showHistory={props.showHistory}
                        showResendButton={props.showResendButton}
                    />
                )}
                {Boolean(props.showHistory) && (
                    <ViewDocumentHistory
                        document={document}
                        type={type}
                        typePrefix="EmployeeDqf"
                        documentable_id={employee.id}
                        documentable_type={DocumentableType.EMPLOYEE}
                    />
                )}
            </div>
        );

    /**
     * This is a TypeScript React component that displays the last updated date of a document, unless the
     * document type is EmployeeDqf.SAFETY_PERFORMANCE_HISTORY.
     * @param  - The function `UpdatedAt` takes two parameters:
     */
    const UpdatedAt = ({ document, type }): JSX.Element => {
        if (type == EmployeeDqf.SAFETY_PERFORMANCE_HISTORY) return (<></>)

        return (<>
            {document
                ? <ShowFormattedDate date={document.last_updated_at} />
                : <span className="text-danger font-italic">{t(`NOT_AVAILABLE`)}</span>}
        </>)
    }

    return (
        <div className="employee_directory_tabs">
            <Row>
                <Col>
                    {!!employee ? (
                        <ViewCard title={props.title ?? "DOCUMENTS"}>
                            <Table striped>
                                <thead>
                                    <tr>
                                        <th colSpan={2}>{t("TYPE")}</th>
                                        {
                                            Boolean(props.showCompleted) && <th colSpan={2}>{t("COMPLETED?")}</th>
                                        }
                                        <th colSpan={2}>{t("UPDATED_AT")}</th>
                                        <th colSpan={1}></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Object.values(EmployeeDqf).map((type: EmployeeDqf, i) => {
                                        /* Finding the document in the employee.documents array that has the same type. */
                                        const document: DocumentEntity = employee?.documents?.find(v => (v.type == type))
                                        return (
                                            <tr key={i}>
                                                <td colSpan={2}>
                                                    {t(`EmployeeDqf.${type}`)}
                                                </td>
                                                {Boolean(props.showCompleted)
                                                    &&
                                                    <td colSpan={1} className="text-center">
                                                        <input className="form-check-input" type="radio" disabled checked={Boolean(document?.id)} />
                                                    </td>
                                                }
                                                <td colSpan={2} className="w-25">
                                                    <UpdatedAt document={document} type={type} />
                                                </td>
                                                <td colSpan={1} className="border border-2 w-50">
                                                    <ButtonList document={document} type={type} />
                                                    {(form.values?.document?.type == type)
                                                        && <Form onSubmit={form.handleSubmit} onReset={() => form.resetForm()}>
                                                            <FileInput
                                                                name={`document`}
                                                                accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/*"
                                                                formik={form}
                                                                allowedSizeInByte={3145728}
                                                            />
                                                            <div className="mt-2 d-flex w-100 ">
                                                                <Button
                                                                    disabled={form.isSubmitting || !form.isValid || form.isValidating}
                                                                    className="mr-2 w-50 theme-primary-btn"
                                                                    type="submit"
                                                                >{t(`SAVE`)} <LoaderIcon isLoading={form.isSubmitting} /></Button>
                                                                <Button
                                                                    type="reset"
                                                                    className="mr-2 w-50 bg-danger"
                                                                >{t(`CANCEL`)}</Button>
                                                            </div>
                                                        </Form>
                                                    }
                                                </td>
                                            </tr>
                                        )
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
                </Col>
            </Row>
        </div >
    );
};