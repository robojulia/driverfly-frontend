import { Button, Col, Form, Row, Table } from "react-bootstrap";
import { useAuth } from "../../../../hooks/use-auth";
import { useEffectAsync } from "../../../../utils/react";
import { useTranslation } from "../../../../hooks/use-translation";
import { ViewApplicantDetailProps } from "../../../../types/applicant/view-application-detail-props.type";
import { useFormik } from "formik";
import ApplicantApi from "../../../../pages/api/applicant";
import ViewCard from "../../../view-details/view-card";
import FileInput from '../../../forms/file-input';
import { toast } from "react-toastify";
import { globalAjaxExceptionHandler } from "../../../../utils/ajax";
import ShowFormattedDate from "../../../jobs/show-formatted-date";
import { ApplicantDocumentDto } from "../../../../models/applicant/applicant-document-dto";
import { CloudArrowDown, Pen, Eye, Trash, ClockHistory } from "react-bootstrap-icons";
import { ApplicantEntity } from "../../../../models/applicant/applicant.entity";
import { useState } from "react";
import { ThreeCircles } from 'react-loader-spinner';
import DocumentApi from "../../../../pages/api/document";
import ViewPdf from "../../../view-details/view-pdf";
import { ApplicantDqf } from "../../../../enums/applicants/applicant-dqf-types.enum";
import { DocumentableType } from "../../../../enums/documents/documentable-type.enum";
import ViewModal from "../../../view-details/view-modal";
import { DocumentHistoryEntity } from "../../../../models/documents/document-history.entity";
import ViewDataTable from "../../../view-details/view-data-table";

export interface DqfTabProps extends ViewApplicantDetailProps { }

const DqfTab = ({ applicant }: DqfTabProps) => {

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

    const viewDocumentClick = async (id, name) => {
        const api = new DocumentApi();

        const document = await api.getSignedUrl(id);

        if (document) {
            setPdf({
                name: `${t(name)} (${document.name})`,
                url: document.path
            });
        }
    }
    const handleUpdateDocument = async (type: ApplicantDqf, documentId?: number) => {
        form.setFieldValue("document", { type: type, id: documentId || null })
    }

    useEffectAsync(async () => {
        const v = await applicantApi.getById(applicant.id)
        setApplicantUser(v)
    }, [user], () => {
        form.resetForm()
    });
    const deleteDocument = async (docType) => {
        const applicantApi = new ApplicantApi()
        const deleteDoc = await applicantApi.documents.delete(applicant?.id, docType)
    }

    const [documentHistory, setDocumentHistory] = useState<DocumentHistoryEntity[]>([])
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

                                            const document: any = applicantUser?.documents?.find(v => (v.type === value))
                                            return (
                                                <tr key={i}>
                                                    <td colSpan={2}>
                                                        {t(`ApplicantDqf.${value}`)}
                                                    </td>
                                                    <td colSpan={2}>
                                                        {document ? <ShowFormattedDate date={document.last_updated_at} /> : <span className="text-danger font-italic">{t(`NOT_AVAILABLE`)}</span>}
                                                    </td>
                                                    <td colSpan={1} className="border border-2 w-50">
                                                        {
                                                            (!form.values.document?.type || form.values.document?.type !== value) &&
                                                            <div className="d-flex">
                                                                {document ? <a onClick={() => viewDocumentClick(document.id, document.name)} href='#' role="button" className="btn btn-success p-0 pt-1 mr-2 w-100"><Eye /></a> : null}
                                                                <Button className="mr-2 w-100" onClick={() => { handleUpdateDocument(value, document?.id) }}>
                                                                    {document ? <Pen /> : t('ADD')}
                                                                </Button>
                                                                {document ? <a href={document?.path} download className="btn theme-primary2-btn p-0 pt-1 mr-2"><CloudArrowDown /></a> : null}
                                                                {document ? <a onClick={() => deleteDocument(document.type)} href='#' role="button" className="btn btn-danger  p-0 pt-1 mr-2 w-100"><Trash /></a> : null}

                                                                {/* A button that when clicked will call
                                                                the viewHistory function and pass in
                                                                the value. */}
                                                                <Button
                                                                    title={t("HISTORY")}
                                                                    onClick={() => { viewHistory(value) }}
                                                                ><ClockHistory /></Button>
                                                            </div>
                                                        }

                                                        {
                                                            (form.values?.document?.type === value) &&
                                                            <Form onSubmit={form.handleSubmit} >
                                                                <FileInput
                                                                    name={`document`}
                                                                    accept="application/pdf"
                                                                    formik={form}
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
                title="PAST_EMPLOYEE"
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
                    ]}
                    items={documentHistory}
                />
            </ViewModal>

        </div>
    );
};

export default DqfTab;