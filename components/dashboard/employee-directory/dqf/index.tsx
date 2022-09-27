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
import { ApplicantDocumentDto } from "../../../../models/applicant/applicant-document-dto";
import Fade from 'react-reveal/Fade';

export interface DqfTabProps extends ViewApplicantDetailProps { }


const DqfTab = ({ applicant }: DqfTabProps) => {

    
    const { t } = useTranslation();
    const { user } = useAuth();
    const applicantApi = new ApplicantApi();

    const form = useFormik({
        initialValues: new ApplicantDocumentDto(),
        validationSchema: ApplicantDocumentDto.yupSchema(),
        onSubmit: async (values, { resetForm }) => {
            console.log("form clickeeeeeeeeeeeeddddddddd", values)
            const { document } = values

            // try {
            // const applicantDocumentUpload = await applicantApi.documents.create(applicant.id, document)

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
        console.log("form document Indexxxxx", documentId, "applicant Id", applicant.id, "dto", type)

        form.setFieldValue("document", { type: type, id: documentId || null })

    }

    useEffectAsync(async () => {
        const v = await applicantApi.getById(applicant.id)
        applicant.documents = v.documents
        // form.setValues({ ...applicant })
    }, [user], () => {
        console.log("unloading page...")
        form.resetForm()
    });

    //  Uncomment this in debugging mode
    // useEffectAsync(async () => {
    //     console.log("form", form.values)
    //     console.log("form", form.errors)
    // }, [form])

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

                                            const document: any = applicant?.documents?.find(v => (v.type === value))

                                            return (<tr key={i} className="testing_tr">
                                                <td>
                                                    {t(`ApplicantDocumentType.${value}`)}
                                                </td>
                                                <td>
                                                    {document ? <ShowFormattedDate date={document.last_updated_at} /> : <span className="text-danger font-italic">{t("NOT_AVAILABLE")}</span>}
                                                </td>
                                                <td>
                                                    {
                                                        (!form.values.document?.type || form.values.document?.type !== value) &&
                                                        <Button className="mr-2 w-100"
                                                            onClick={() => { handleUpdateDocument(value, document?.id) }}
                                                        >
                                                            {t(document ? `EDIT` : `CREATE`)}
                                                        </Button>
                                                    }

                                                    {

                                                        (form.values.document && form.values.document.type === value) &&
                                                        <Fade top>
                                                            <Form onSubmit={form.handleSubmit} >
                                                                <FileInput
                                                                    name={`document`}
                                                                    accept="application/pdf"
                                                                    formik={form}
                                                                />
                                                                <div className="mt-2 d-flex w-100 ">
                                                                    <Button
                                                                        className="mr-2 w-50 bg-success"
                                                                        type="submit"
                                                                    >
                                                                        {t(`SAVE`)}
                                                                    </Button>

                                                                    <Button type="button" className="mr-2 w-50 bg-danger" onClick={() => { form.resetForm() }}                                                            >
                                                                        {t(`CANCEL`)}
                                                                    </Button>

                                                                </div>
                                                            </Form>
                                                        </Fade>
                                                    }

                                                </td>
                                            </tr>)
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