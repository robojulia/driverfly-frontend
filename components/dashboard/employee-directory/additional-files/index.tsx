import { Button, Col, Form, Row, Table } from "react-bootstrap";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import { CloudArrowDown, Pen, Eye, Trash } from "react-bootstrap-icons";
import { useState } from "react";
import { ThreeCircles } from 'react-loader-spinner';
import { useAuth } from "../../../../hooks/use-auth";
import { useEffectAsync } from "../../../../utils/react";
import { useTranslation } from "../../../../hooks/use-translation";
import { ViewApplicantDetailProps } from "../../../../types/applicant/view-application-detail-props.type";
import ApplicantApi from "../../../../pages/api/applicant";
import ViewCard from "../../../view-details/view-card";
import FileInput from '../../../forms/file-input';
import { globalAjaxExceptionHandler } from "../../../../utils/ajax";
import ShowFormattedDate from "../../../jobs/show-formatted-date";
import { ApplicantEntity } from "../../../../models/applicant/applicant.entity";
import DocumentApi from "../../../../pages/api/document";
import ViewPdf from "../../../view-details/view-pdf";
import { ApplicantAdditionalFilesDto } from "../../../../models/applicant/additional-files.dto";
import { ApplicantAdditionalFilesEnum } from "../../../../enums/applicants/applicant-additional-files.enum";
import { DocumentEntity } from "../../../../models/documents/document.entity";

export interface AdditionalFilesProps extends ViewApplicantDetailProps { }

const AdditionalFiles = (props: AdditionalFilesProps) => {

    const { t } = useTranslation();
    const { user } = useAuth();
    const applicantApi = new ApplicantApi();

    const [applicant, setApplicant] = useState<ApplicantEntity>(null)

    const form = useFormik({
        initialValues: new ApplicantAdditionalFilesDto(),
        validationSchema: ApplicantAdditionalFilesDto.yupSchema(),
        onSubmit: async ({ document }, { resetForm }) => {
            try {
                const data = await applicantApi.documents.create(applicant.id, document)

                if (document.id) {
                    applicant.documents = applicant.documents.filter(v => (v.id != data.id))
                }
                applicant.documents.push(data)
                toast.success(t('DOCUMENT_UPLOAD_SUCCESS_MESSAGE'))
                resetForm()
            }
            catch (e) {
                globalAjaxExceptionHandler(e, { formik: form, toast: toast, t: t });
            }
        }
    });

    useEffectAsync(async () => {
        const v = await applicantApi.getById(props.applicant.id)
        setApplicant(v)
    }, [user], () => {
        form.resetForm()
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

    const handleUpdateDocument = async (type: ApplicantAdditionalFilesEnum, documentId?: number) => {
        form.setFieldValue("document", { type: type, id: documentId || null })
    }

    const deleteDocument = async (type: ApplicantAdditionalFilesEnum) => {
        await applicantApi.documents.delete(props.applicant?.id, type)
        setApplicant({ ...applicant, documents: applicant.documents.filter(v => (v.type != type)) })
    }

    const downloadDocumentClick = async (id: number): Promise<void> => {

        const api = new DocumentApi();
        const doc: DocumentEntity = await api.getSignedUrl(id);

        // Make a request to get the file data
        const response = await fetch(doc.path);
        const fileBlob = await response.blob();

        // Create a temporary link element
        const link = document.createElement('a');
        link.href = URL.createObjectURL(fileBlob);
        link.download = doc.name;

        document.body.appendChild(link);

        // Simulate a click on the link to trigger the download
        link.click();

        // Clean up the temporary link
        document.body.removeChild(link);
        link.remove();
    }

    return (
        <div className="employee_directory_tabs">
            <Row>
                <Col>
                    {!!applicant ? (
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
                                        Object.values(ApplicantAdditionalFilesEnum).map((value: ApplicantAdditionalFilesEnum, i) => {

                                            const document: any = applicant?.documents?.find(v => (v.type === value))
                                            return (
                                                <tr key={i}>
                                                    <td colSpan={2}>
                                                        {t(`ApplicantAdditionalFilesEnum.${value}`)}
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
                                                                {document ? <a onClick={() => downloadDocumentClick(document.id)} href='#' role="button" className="btn theme-primary2-btn p-0 pt-1 mr-2"><CloudArrowDown /></a> : null}
                                                                {document ? <a onClick={() => deleteDocument(document.type)} href='#' role="button" className="btn btn-danger  p-0 pt-1 mr-2 w-100"><Trash /></a> : null}
                                                            </div>
                                                        }

                                                        {
                                                            (form.values?.document?.type === value) &&
                                                            <Form onSubmit={form.handleSubmit} >
                                                                <FileInput
                                                                    name={`document`}
                                                                    accept="application/pdf"
                                                                    allowedSizeInByte={3145728}
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
        </div>
    );
};

export default AdditionalFiles;