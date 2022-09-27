import { useRouter } from "next/router";
import { useState } from "react";
import { Button, Col, Row, Table } from "react-bootstrap";
import { useAuth } from "../../../../hooks/useAuth";
import { JobEntity } from "../../../../models/job/job.entity";
import JobApi from "../../../../pages/api/job";
import { useEffectAsync } from "../../../../utils/react";
import { useTranslation } from "../../../../hooks/useTranslation";
import { ViewApplicantDetailProps } from "../../../../types/applicant/view-application-detail-props.type";
import { useFormik } from "formik";
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


export interface DqfTabProps extends ViewApplicantDetailProps { }

const DqfTab = ({ applicant }: DqfTabProps) => {
    const { t } = useTranslation();
    const { user } = useAuth();
    const router = useRouter()
    const [jobs, setJobs] = useState<JobEntity[]>([])
    const jobApi = new JobApi();
    const applicantApi = new ApplicantApi();

    const form = useFormik({
        initialValues: new ApplicantEntity(),
        validationSchema: ApplicantEntity.yupSchema(),
        onSubmit: async (dto, { resetForm }) => {
            // try {
            //     const applicantDocumentUpload = await jobApi.apply(job.id, dto);

            //     toast.success(t('job_applied_success_message'))
            //     resetForm()
            // }
            // catch (e) {
            //     globalAjaxExceptionHandler(e, { formik: form, toast: toast, t: t });
            //     // if (e.response?.data?.message == "ApplicantJobService.APPLICANT_ALREADY_APPLIED") setViewForm(false)
            // }
            console.log("clickeeeeeeeeeeeeddddddddd", dto)
        }
    });
    const updateDocument = async (docIndex: number) => {
        // const upload = await applicantApi.documents.create(applicant.id, dto) 
        console.log("document Indexxxxx", docIndex, "applicant Id", applicant.id, "dto")
    }
    useEffectAsync(async () => {
        const v = await applicantApi.getById(applicant.id)
        applicant.documents = v.documents
        form.setValues({ ...applicant })
    }, [user], () => {
        console.log("unloading page...")
    });
    return (
        <>
            <div className="employee_directory_tabs">
                <Row className="mt-3">
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
                        <Button className="button_upload_document w-100 bg-success p-2" onClick={() => form.handleSubmit()}>{t("submit")}</Button>

                    </Col>
                </Row>
            </div>
        </>
    );
};

export default DqfTab;