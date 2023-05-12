import { useState } from "react";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import { CloudArrowDown, Pen, Eye, Trash, ClockHistory } from "react-bootstrap-icons";
import { ThreeCircles } from 'react-loader-spinner';
import { Button, Col, Form, Row, Table } from "react-bootstrap";
import { useAuth } from "../../../../hooks/use-auth";
import { useEffectAsync } from "../../../../utils/react";
import { useTranslation } from "../../../../hooks/use-translation";
import { ViewApplicantDetailProps } from "../../../../types/applicant/view-application-detail-props.type";
import ApplicantApi from "../../../../pages/api/applicant";
import ViewCard from "../../../view-details/view-card";
import FileInput from '../../../forms/file-input';
import { globalAjaxExceptionHandler } from "../../../../utils/ajax";
import ShowFormattedDate from "../../../jobs/show-formatted-date";
import { ApplicantDocumentDto } from "../../../../models/applicant/applicant-document-dto";
import { ApplicantEntity } from "../../../../models/applicant/applicant.entity";
import DocumentApi from "../../../../pages/api/document";
import ViewPdf from "../../../view-details/view-pdf";
import { ApplicantDqf } from "../../../../enums/applicants/applicant-dqf-types.enum";
import { DocumentableType } from "../../../../enums/documents/documentable-type.enum";
import ViewModal from "../../../view-details/view-modal";
import { DocumentHistoryEntity } from "../../../../models/documents/document-history.entity";
import ViewDataTable from "../../../view-details/view-data-table";
import { DocumentEntity } from "../../../../models/documents/document.entity";
import { ViewApplicantDqfProps } from "../../../../types/applicant/view-application-dqf-props.type";

const DqfTab = ({ applicant }: ViewApplicantDqfProps) => {

    const [applicantUser, setApplicantUser] = useState<ApplicantEntity>(null)

    const { t } = useTranslation();
    const { user } = useAuth();
    const applicantApi = new ApplicantApi();

    const form = useFormik({
        initialValues: new ApplicantDocumentDto(),
        validationSchema: ApplicantDocumentDto.yupSchema(),
        onSubmit: async ({ document }, { resetForm }) => {
            try {
                const applicantDocumentUpload = await applicantApi.documents.create(applicantUser.id, document)

                if (document.id) {
                    applicantUser.documents = applicantUser.documents.filter(v => (v.id !== applicantDocumentUpload.id))
                }
                applicantUser.documents.push(applicantDocumentUpload)
                toast.success(t('DOCUMENT_UPLOAD_SUCCESS_MESSAGE'))
                resetForm()
            }
            catch (e) {
                globalAjaxExceptionHandler(e, { formik: form, toast: toast, t: t });
            }
        }
    });

    const [pdf, setPdf] = useState({});

    /**
     * It gets the signed URL for a document and sets the state of the PDF viewer
     * @param {number} id - The id of the document you want to view
     */
    const viewDocumentClick = async (id: number): Promise<void> => {
        const api = new DocumentApi();

        const document: DocumentEntity = await api.getSignedUrl(id);

        if (document) {
            setPdf({
                name: document.name,
                url: document.path
            });
        }
    }

    /**
     * It takes a type and an optional documentId, and sets the form's document field to an object with the
     * type and id
     * @param {ApplicantDqf} type - ApplicantDqf - this is the type of document that is being uploaded.
     * @param {number} [documentId] - The id of the document to be updated.
     */
    const handleUpdateDocument = async (type: ApplicantDqf, documentId?: number): Promise<void> => {
        form.setFieldValue("document", { type, id: documentId ?? null })
    }

    useEffectAsync(async () => {
        const v = await applicantApi.getById(applicant.id)
        setApplicantUser(v)
    }, [user], () => {
        form.resetForm()
    });

    /**
     * It deletes a document from the applicant's profile.
     * @param {ApplicantDqf | string} docType - The type of document you want to
     * delete.
     */
    const deleteDocument = async (docType: ApplicantDqf | string): Promise<void> => {
        const applicantApi = new ApplicantApi()
        await applicantApi.documents.delete(applicant?.id, docType)
        setApplicantUser({
            ...applicantUser,
            documents: applicantUser?.documents?.filter(v => (v.type != docType))
        })
    }

    const [documentHistory, setDocumentHistory] = useState<DocumentHistoryEntity[]>([])
    /**
     * It sets the document history to an empty array.
     */
    const resetDocumentHistory = () => setDocumentHistory([])

    /**
     * It fetches the document history of an applicant and sets the state of the document history
     * @param {string} type - The type of document you want to view the history of.
     */
    const viewHistory = async (type: string) => {
        const documentApi = new DocumentApi()
        const data = await documentApi.getDocumentHistory({
            type,
            documentable_type: DocumentableType.APPLICANTS as string,
            documentable_id: applicant.id
        })
        if (!data?.length) alert(t('NO_RECORDS_FOUND'))
        setDocumentHistory(data)
    }

    return (
        <div className="employee_directory_tabs">
            <Row>
                <Col>
                    {!!applicantUser ? (
                        <ViewCard title="DOCUMENTS">
                            <Table striped>
                                <thead>
                                    <tr>
                                        <th colSpan={2}>{t("TYPE")}</th>
                                        <th colSpan={2}>{t("UPDATED_AT")}</th>
                                        <th colSpan={1}></th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {
                                        Object.values(ApplicantDqf).map((value: ApplicantDqf, i) => {

                                            /* Finding the document in the applicantUser.documents array that has the same type as the value. */
                                            const document: DocumentEntity = applicantUser?.documents?.find(v => (v.type === value))
                                            return (
                                                <tr key={i}>
                                                    <td colSpan={2}>
                                                        {t(`ApplicantDqf.${value}`)}
                                                    </td>
                                                    <td colSpan={2}>
                                                        {/* Checking if the document is available, if it
                                                        is, it will display the date, if not, it
                                                        will display the text "NOT_AVAILABLE"
                                                        */ }
                                                        {document
                                                            ? <ShowFormattedDate date={document.last_updated_at} />
                                                            : <span className="text-danger font-italic">{t(`NOT_AVAILABLE`)}</span>}
                                                    </td>
                                                    <td colSpan={1} className="border border-2 w-50">
                                                        {
                                                            (!form.values.document?.type || form.values.document?.type !== value)
                                                            && (<div className="d-flex">

                                                                {/* It is checking
                                                                if the document exists. If it does,
                                                                it will display view the button. If it
                                                                doesn't, it will display nothing. */}
                                                                {document
                                                                    ? <a
                                                                        onClick={() => viewDocumentClick(document.id)}
                                                                        href='#'
                                                                        role="button"
                                                                        className="btn btn-success p-0 pt-1 mr-2 w-100"
                                                                    ><Eye /></a>
                                                                    : null}

                                                                {/* A button that will either update or
                                                                add a document. */}
                                                                <Button
                                                                    className="mr-2 w-100"
                                                                    onClick={() => { handleUpdateDocument(value, document?.id) }}
                                                                >{document ? <Pen /> : t('ADD')}</Button>

                                                                {document
                                                                    ? <a
                                                                        href={document?.path}
                                                                        download
                                                                        className="btn theme-primary2-btn p-0 pt-1 mr-2"
                                                                    ><CloudArrowDown /></a>
                                                                    : null}

                                                                {/* A ternary operator. It is checking
                                                                if the document exists. If it does,
                                                                it will render the delete button. If
                                                                it doesn't, it will render nothing. */}
                                                                {document
                                                                    ? <a
                                                                        onClick={() => deleteDocument(document.type)}
                                                                        href='#'
                                                                        role="button"
                                                                        className="btn btn-danger  p-0 pt-1 mr-2 w-100"
                                                                    ><Trash /></a>
                                                                    : null}

                                                                {/* A button that when clicked will call
                                                                the viewHistory function and pass in
                                                                the type. */}
                                                                <Button
                                                                    title={t("HISTORY")}
                                                                    onClick={() => { viewHistory(value) }}
                                                                ><ClockHistory /></Button>
                                                            </div>)
                                                        }

                                                        {(form.values?.document?.type === value)
                                                            && <Form onSubmit={form.handleSubmit} >
                                                                <FileInput
                                                                    name={`document`}
                                                                    accept="application/pdf"
                                                                    formik={form}
                                                                    allowedSizeInByte={3145728}
                                                                />
                                                                <div className="mt-2 d-flex w-100 ">
                                                                    <Button disabled={form.isSubmitting || !form.isValid || form.isValidating} className="mr-2 w-50 theme-primary-btn" type="submit">
                                                                        {t(`SAVE`)}
                                                                    </Button>
                                                                    <Button type="button" className="mr-2 w-50 bg-danger" onClick={() => { form.resetForm() }}                                                            >
                                                                        {t(`CANCEL`)}
                                                                    </Button>
                                                                </div>
                                                            </Form>
                                                        }
                                                    </td>
                                                </tr>
                                            )
                                        })
                                    }
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

            <ViewModal
                show={Boolean(documentHistory?.length)}
                onCloseClick={resetDocumentHistory}
                closeText="CANCEL"
                title="DOCUMENT_HISTORY"
            >
                <ViewDataTable<DocumentHistoryEntity>
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
                            name: "TYPE",
                            selector: doc => t(`ApplicantDqf.${doc.type}`),
                            hidable: false
                        },
                        {
                            name: "NAME",
                            selector: doc => doc.name,
                            hidable: false
                        },
                        {
                            name: "upload_date",
                            selector: doc => doc.created_at,
                            cell: doc => <ShowFormattedDate date={doc.created_at} />,
                            hidable: false
                        },
                        {
                            cell: doc => <Button
                                onClick={() => {
                                    setPdf({
                                        name: `(${doc.name})`,
                                        url: doc.path
                                    })
                                }}
                                className="btn btn-success p-0 py-1 mr-2 w-50"><Eye /></Button>,
                            hidable: false
                        },
                    ]}
                    items={documentHistory}
                />
            </ViewModal>

        </div>
    );
};

export default DqfTab;