import { useRouter } from "next/router";
import { useState } from "react";
import { Button, Col, Form, Row, Table } from "react-bootstrap";
import { useAuth } from "../../../../hooks/useAuth";
import { JobEntity } from "../../../../models/job/job.entity";
import JobApi from "../../../../pages/api/job";
import { useEffectAsync } from "../../../../utils/react";
import { useTranslation } from "../../../../hooks/useTranslation";
import { ViewApplicantDetailProps } from "../../../../types/applicant/view-application-detail-props.type";
import { Formik, useFormik } from "formik";
import { ApplicantEntity } from "../../../../models/applicant/applicant.entity";
import { DocumentEntity } from "../../../../models/documents/document.entity";
import ApplicantApi from "../../../../pages/api/applicant";
import ViewCard from "../../../viewDetails/viewCard";
import { DashCircle, PlusCircle } from "react-bootstrap-icons";
import BaseSelect from '../../../forms/BaseSelect';
import FileInput from '../../../forms/FileInput';
import { ApplicantDocumentType } from '../../../../enums/applicants/applicant-document-type.enum';
import { toast } from "react-toastify";
import { globalAjaxExceptionHandler } from "../../../../utils/ajax";
import { ApplicantJobsByStatusDto } from "../../../../models/job/applicant-jobs-by-status.dto";
import ShowFormattedDate from "../../../jobs/show-formatted-date";
import { DocumentableType } from "../../../../enums/documents/documentable-type.enum";
import EntityForm from "../../../layouts/page/EntityForm";


export interface DqfTabProps extends ViewApplicantDetailProps { }

const DqfTab = ({ applicant }: DqfTabProps) => {
    const { t } = useTranslation();
    const { user } = useAuth();
    const router = useRouter()
    const [jobs, setJobs] = useState<JobEntity[]>([])
    const jobApi = new JobApi();
    const applicantApi = new ApplicantApi();

    const form = useFormik({
        initialValues: new DocumentEntity(),
        validationSchema: DocumentEntity.yupSchema(),
        onSubmit: async (values, { resetForm }) => {
            debugger
            console.log("clickeeeeeeeeeeeeddddddddd")

            // try {
            // const applicantDocumentUpload = await applicantApi.documents.create(applicant.id, values)

            //     toast.success(t('job_applied_success_message'))
            //     resetForm()
            // }
            // catch (e) {
            //     globalAjaxExceptionHandler(e, { formik: form, toast: toast, t: t });
            //     // if (e.response?.data?.message == "ApplicantJobService.APPLICANT_ALREADY_APPLIED") setViewForm(false)
            // }
        }
    });

    const handleUpdateDocument = async (type: ApplicantDocumentType, documentId?: number) => {
        console.log("document Indexxxxx", document, "applicant Id", applicant.id, "dto", type)

        form.setFieldValue('type', type)
        if (documentId) form.setFieldValue('id', documentId)

    }

    const updateDocument = async (docIndex: number) => {
        // const upload = await applicantApi.documents.create(applicant.id, dto) 
        console.log("document Indexxxxx", docIndex, "applicant Id", applicant.id, "dto")
    }

    useEffectAsync(async () => {
        const v = await applicantApi.getById(applicant.id)
        applicant.documents = v.documents
        // form.setValues({ ...applicant })
    }, [user], () => {
        console.log("unloading page...")
        form.resetForm()
    });
    return (
        <>
            <div className="employee_directory_tabs">
                <Row>
                    <Col>
                        <ViewCard title="DOCUMENTS">

                            <Table striped>
                                <thead>
                                    <tr>
                                        <th>{t("TYPE")}</th>
                                        <th>{t("UPDATED_AT")}</th>
                                        <th></th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {
                                        Object.values(ApplicantDocumentType).map((value: ApplicantDocumentType, i) => {
                                            // debugger
                                            const document: any = applicant?.documents?.filter(v => (v.type === value))
                                            // console.log("document", document[0])

                                            return <tr key={i} className="testing_tr">
                                                <td>
                                                    {t(`ApplicantDocumentType.${value}`)}
                                                </td>
                                                <td>
                                                    {document[0]?.last_updated_at ? <ShowFormattedDate date={document[0]?.last_updated_at} /> : <span className="text-danger font-italic">Not Available</span>}
                                                </td>
                                                <td>
                                                    {
                                                        (!form.values.type || form.values.type !== value) &&
                                                        <Button className="mr-2 w-100"
                                                            onClick={() => { handleUpdateDocument(value, document[0]?.id) }}
                                                        >
                                                            {t(document[0] ? `EDIT` : `CREATE`)}
                                                        </Button>
                                                    }
                                                    {
                                                        (form.values.type && form.values.type === value) && <>
                                                            <Form onSubmit={form.handleSubmit} >
                                                                <FileInput
                                                                    name={`file`}
                                                                    accept="application/pdf"
                                                                    documentType={"PDF"}
                                                                    formik={form}
                                                                />
                                                                <div className="mt-2 d-flex w-100 ">
                                                                    <Button
                                                                        className="mr-2 w-50 bg-success"
                                                                        type="submit"
                                                                    // formik={form}
                                                                    // onClick={() => {form.handleSubmit}}
                                                                    >
                                                                        {t(`SAVE`)}
                                                                    </Button>

                                                                    <Button type="button" className="mr-2 w-50 bg-danger" onClick={() => { form.resetForm() }}                                                            >
                                                                        {t(`CANCEL`)}
                                                                    </Button>
                                                                </div>
                                                            </Form>
                                                        </>
                                                    }

                                                </td>
                                            </tr>
                                        })
                                    }
                                </tbody>
                            </Table>
                        </ViewCard>
                    </Col>
                </Row>
                {/* <Row className="mt-3">
                    <Col>
                        <ViewCard
                            title="DOCUMENTS"
                            actions={
                                <>
                                    <Button size='sm'
                                        disabled={form.values.documents?.length === Object.keys(ApplicantDocumentType).length}
                                        onClick={() => form.setValues({
                                            ...form.values, documents: [...(form.values.documents || []), new DocumentEntity()]
                                        })}>
                                        <PlusCircle />{t("ADD")}
                                    </Button>
                                </>
                            }>
                            {!form.values.documents?.length && t("NONE")}
                            {
                                form.values.documents?.length > 0 &&
                                <Table striped>
                                    <thead>
                                        <tr>
                                            <th>{t("TYPE")}</th>
                                            <th>{t("DOCUMENT")}</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {form.values.documents
                                            .map((entity, i) => (
                                                <tr key={i} className="testing_tr">
                                                    <td>
                                                        <BaseSelect
                                                            name={`documents[${i}].type`}
                                                            required
                                                            placeholder="TYPE"
                                                            labelPrefix="ApplicantDocumentType"
                                                            enumType={ApplicantDocumentType}
                                                            readOnly={!!entity.id && !entity.file_base64}
                                                            formik={form}
                                                        />
                                                    </td>
                                                    <td>
                                                        <FileInput
                                                            name={`documents[${i}]`}
                                                            required
                                                            accept="application/pdf"
                                                            formik={form}
                                                        />
                                                    </td>
                                                    <td>
                                                        <Button onClick={() => updateDocument(i)} >Update</Button>
                                                    </td>
                                                    <td>
                                                        <button onClick={() => form.setValues({ ...form.values, documents: form.values.documents.filter((v, idx) => i != idx) })}><DashCircle color="red" /></button>
                                                    </td>
                                                </tr>
                                            ))}
                                    </tbody>
                                </Table>
                            }
                        </ViewCard>
                        Button className="button_upload_document w-100 bg-success p-2" onClick={() => form.handleSubmit()}>{t("submit")}</Button>

                    </Col>
                </Row> */}

            </div>
        </>
    );
};

export default DqfTab;