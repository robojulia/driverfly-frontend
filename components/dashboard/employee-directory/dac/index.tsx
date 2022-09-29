
import { Button, Form, Table } from "react-bootstrap";
import { useTranslation } from "../../../../hooks/useTranslation";
import { ApplicantDac } from "../../../../enums/applicants/applicant-dac.enum";
import ViewCard from "../../../viewDetails/viewCard";
import { ViewApplicantDetailProps } from "../../../../types/applicant/view-application-detail-props.type";
import { useFormik } from "formik";
import { ApplicantDacEntity } from "../../../../models/applicant/applicant-dac.entity";
import ApplicantApi from "../../../../pages/api/applicant";
import { globalAjaxExceptionHandler } from "../../../../utils/ajax";
import { toast } from "react-toastify";
import { useState } from "react";
import { Pen } from "react-bootstrap-icons";

export interface DacTabProps extends ViewApplicantDetailProps { }

const DAC = ({ applicant }: DacTabProps) => {
    const { t } = useTranslation();
    const applicantApi = new ApplicantApi();
    const [disableInput, setDisableInput] = useState<boolean>(true)
    const form = useFormik({
        initialValues: new ApplicantDacEntity(),
        validationSchema: ApplicantDacEntity.yupSchema(),
        onSubmit: async ({ applicant }, { resetForm }) => {

            try {
                // const applicantDocumentUpload = await applicantApi.dac.create(applicant.id)
                console.log("form valuesss", applicant.id, form.values)
                // if (document.id) {
                //     applicantUser.documents = applicantUser.documents.filter(v => (v.id !== applicantDocumentUpload.id))
                // }
                // applicantUser.documents.push(applicantDocumentUpload)
                // toast.success(t('DOCUMENT_UPLOAD_SUCCESS_MESSAGE'))
                // resetForm()
            }
            catch (e) {
                globalAjaxExceptionHandler(e, { formik: form, toast: toast, t: t });
            }
        }
    });
    const handleUpdateDocument = async (type: any, documentId?: number) => {
        form.setFieldValue("document", { type: type, id: documentId || null })
    }
    return (
        <>
            <div className="employee_directory_tabs">

                <ViewCard title={`${applicant?.first_name} ${applicant?.last_name}`}>

                    <Table striped>
                        <tbody>
                            {
                                Object.values(ApplicantDac).map((value: ApplicantDac, i) => {
                                    return (
                                        <tr key={i}>
                                            <td> {t(`ApplicantDac.${value}`)}</td>
                                            <td>
                                                <div className="w-100">
                                                    {
                                                        (!form.values.type || form.values.type !== value) &&
                                                        <div className="d-flex">
                                                            <Button className="mr-2 w-100" onClick={() => { handleUpdateDocument(value) }}>
                                                                {form.values.id ? <Pen /> : t('ADD')}
                                                            </Button>
                                                        </div>
                                                    }

                                                    {
                                                        (form.values.type && form.values.type === value) &&
                                                        <Form onSubmit={form.handleSubmit} >
                                                            <input
                                                                name={`document`}
                                                                accept="application/pdf"
                                                                // formik={form}
                                                            />
                                                            <div className="mt-2 d-flex w-100 ">
                                                                <Button className="mr-2 w-50 theme-primary-btn" type="submit">
                                                                    {t(`SAVE`)}
                                                                </Button>
                                                                <Button type="button" className="mr-2 w-50 bg-danger" onClick={() => { form.resetForm() }}                                                            >
                                                                    {t(`CANCEL`)}
                                                                </Button>
                                                            </div>
                                                        </Form>
                                                    }
                                                </div>
                                            </td>

                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </Table>
                </ViewCard>
            </div>
        </>
    );
};

export default DAC;