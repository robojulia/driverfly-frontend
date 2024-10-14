import { FormikErrors, useFormik } from "formik";
import { useEffect, useState } from "react";
import { Button, Col, Form, Row, Table } from "react-bootstrap";
import { ThreeCircles } from "react-loader-spinner";
import { toast } from "react-toastify";
import { useAuth } from "../../../../hooks/use-auth";
import { useTranslation } from "../../../../hooks/use-translation";
import { EmployeeDocumentDto } from "../../../../models/employee/employee-document-dto";
import { EmployeeEntity } from "../../../../models/employee/employee.entity";
import EmployeeApi from "../../../../pages/api/employee";
import { EmployeeAdditionalFilesProps } from "../../../../types/employee/employee-additional-files-props.type";
import { globalAjaxExceptionHandler } from "../../../../utils/ajax";
import { useEffectAsync } from "../../../../utils/react";
import FileInput from "../../../forms/file-input";
import ShowFormattedDate from "../../../jobs/show-formatted-date";
import ViewCard from "../../../view-details/view-card";
import ViewPdf from "../../../view-details/view-pdf";

import { DocumentableType } from "../../../../enums/documents/documentable-type.enum";
import { EmployeeAdditionalFilesEnum } from "../../../../enums/employee/employee-additional-files.enum";
import {
    handleDownloadDocument,
    handleViewDocument,
} from "../../../../utils/documents/button-actions";
import {
    AddDocumentButton,
    DeleteDocumentButton,
    DownloadDocumentButton,
    ViewDocumentButton,
} from "../../../documents/buttons";
import ViewDocumentHistory from "../../../documents/view-history";
import { LoaderIcon } from "../../../loading/loader-icon";
import { DashCircle, PlusCircle } from "react-bootstrap-icons";
import { DocumentEntity } from "../../../../models/documents/document.entity";
import { EmployeeDqf } from "../../../../enums/employee/employee-dqf.enum";
import BaseInput from "../../../forms/base-input";

export default function AdditionalFiles(props: EmployeeAdditionalFilesProps) {
    const { t } = useTranslation();
    const { user } = useAuth();
    const employeeApi = new EmployeeApi();

    const [employee, setEmployee] = useState<EmployeeEntity>(null);
    const [documents, setDocuments] = useState<DocumentEntity[]>([]);

    useEffectAsync(async () => {
        const data = await employeeApi.getById(props?.employee?.id);
        setEmployee(data);
        setDocuments(data.documents?.filter(v => !Object.values(EmployeeDqf).includes(v.type as EmployeeDqf)))
    }, [user]);

    const [pdf, setPdf] = useState({});

    const form = useFormik({
        initialValues: new EmployeeDocumentDto(),
        validationSchema: EmployeeDocumentDto.yupSchema(),
        onSubmit: async ({ document }, { resetForm }) => {
            if (
                (!document.id &&
                    documents.find((v) => v.type == document.type)) ||
                (document.id &&
                    documents.find(
                        (v) => v.type == document.type && v.id != document.id
                    ))
            ) {
                form.setFieldError("document.type", "DOCUMENT_TYPE_UNIQUE");
                return;
            }
            try {
                const uploadedDocument = await employeeApi.documents.create(
                    employee.id,
                    document
                );

                setDocuments([
                    ...(document.id
                        ? documents.filter((v) => v.id != uploadedDocument.id)
                        : documents),
                    uploadedDocument,
                ]);
                toast.success(t("DOCUMENT_UPLOAD_SUCCESS_MESSAGE"));
                resetForm();
            } catch (e) {
                globalAjaxExceptionHandler(e, { formik: form, toast: toast, t: t });
            }
        },
    });

    /**
     * It deletes a document from the employee's profile.
     * @param {EmployeeAdditionalFilesEnum | string} docType - The type of document you want to
     * delete.
     */
    const handleDeleteDocument = async (
        docType: EmployeeAdditionalFilesEnum | string
    ): Promise<void> => {
        await employeeApi.documents.delete(employee?.id, docType);
        setDocuments(documents?.filter((v) => v.type != docType));
    };

    /**
     * It takes a type and an optional documentId, and sets the form's document field to an object with the
     * type and id
     * @param {EmployeeAdditionalFilesEnum} type - EmployeeAdditionalFilesEnum - this is the type of document that is being uploaded.
     * @param {number} [documentId] - The id of the document to be updated.
     */
    const handleUpdateDocument = (
        type: EmployeeAdditionalFilesEnum,
        documentId?: number
    ): Promise<void> | Promise<FormikErrors<EmployeeDocumentDto>> =>
        form.setFieldValue("document", documents?.find(v => v.type == type) || { type });

    const ButtonList = ({ document, type }): JSX.Element =>
    // (!form.values.document?.type || form.values.document?.type != type) &&
    (
        <div className="d-flex">
            <ViewDocumentButton
                document={document}
                onClick={() => handleViewDocument(document.id, setPdf)}
            />
            {props.canEdit &&
                <AddDocumentButton
                    document={document}
                    type={type}
                    t={t}
                    onClick={() => handleUpdateDocument(type, document?.id)}
                />
            }
            <DownloadDocumentButton
                document={document}
                onClick={() => handleDownloadDocument(document.id)}
            />
            {props.canEdit &&
                <DeleteDocumentButton
                    document={document}
                    onClick={() => handleDeleteDocument(type)}
                />
            }
            <ViewDocumentHistory
                document={document}
                type={type}
                documentable_id={employee.id}
                documentable_type={DocumentableType.EMPLOYEE}
            />
        </div>
    );

    const UpdatedAt = ({ document, type }): JSX.Element => (
        <>
            {document ? (
                <ShowFormattedDate date={document.last_updated_at} />
            ) : (
                <span className="text-danger font-italic">{t(`NOT_AVAILABLE`)}</span>
            )}
        </>
    );

    useEffect(() => {
        console.log("forrm.values", form.values)
        console.log("forrm.errors", form.errors)
    }, [form.values, form.errors])
    return (
        <div className="employee_directory_tabs">
            <Row>
                <Col>
                    {!!employee ? (
                        <ViewCard
                            title="UPLOADED_DOCUMENTS"
                            actions={
                                <Button
                                    size="sm"
                                    onClick={() =>
                                        form.setValues({ document: { ...(new DocumentEntity()), documentable_id: employee.id } })
                                    }
                                >
                                    <PlusCircle /> {t("ADD")}
                                </Button>
                            }
                        >
                            {/* {documents?.length && <>{t("NONE")}</>} */}
                            {form.values?.document?.documentable_id && !form.values?.document?.id && (
                                <form onSubmit={form.handleSubmit} onReset={() => form.resetForm()}>
                                    <Table striped>
                                        <thead>
                                            <tr>
                                                <th>{t("TYPE")}</th>
                                                <th>{t("DOCUMENT")}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>
                                                    <BaseInput
                                                        name={`document.type`}
                                                        required
                                                        placeholder="DOCUMENT_TYPE"
                                                        formik={form}
                                                    />
                                                </td>
                                                <td>
                                                    <FileInput
                                                        name={`document`}
                                                        required
                                                        accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/*"
                                                        allowedSizeInByte={3145728}
                                                        formik={form}
                                                    />
                                                </td>
                                            </tr>
                                        </tbody>
                                    </Table>
                                    <div className="d-flex w-100 mb-3">
                                        <Button
                                            type="submit"
                                            className="mr-1 w-50 theme-primary-btn"
                                        >
                                            {t("SAVE")}
                                        </Button>
                                        <Button
                                            type="reset"
                                            className="ml-1 w-50"
                                        >
                                            {t("CANCEL")}
                                        </Button>
                                    </div>
                                </form>
                            )}
                            <Table striped>
                                <thead>
                                    <tr>
                                        <th colSpan={2}>{t("TYPE")}</th>
                                        <th colSpan={2}>{t("UPDATED_AT")}</th>
                                        <th colSpan={2}></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {documents?.map(
                                        (document, i) => {
                                            return (
                                                <tr key={i}>
                                                    <td colSpan={2}>
                                                        {t(`${document.type}`)}
                                                    </td>
                                                    <td colSpan={2} className="w-25">
                                                        <UpdatedAt document={document} type={document.type} />
                                                    </td>
                                                    <td colSpan={2} className="border border-2 w-50">
                                                        {form.values?.document?.id != document.id
                                                            ? <ButtonList document={document} type={document.type} />
                                                            : <Form
                                                                onSubmit={form.handleSubmit}
                                                                onReset={() => form.resetForm()}
                                                            >
                                                                <BaseInput
                                                                    // label="TYPE"
                                                                    name={`document.type`}
                                                                    required
                                                                    placeholder="DOCUMENT_TYPE"
                                                                    formik={form}
                                                                    className="mb-2"
                                                                />
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
                                                                        <LoaderIcon isLoading={!!form.values?.document?.id && form.isSubmitting} />
                                                                    </Button>
                                                                    <Button
                                                                        type="reset"
                                                                        className="mr-2 w-50 bg-danger"
                                                                    >
                                                                        {t(`CANCEL`)}
                                                                    </Button>
                                                                </div>
                                                            </Form>
                                                        }
                                                    </td>
                                                </tr>
                                            );
                                        }
                                    )}
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
        </div>
    );
}
