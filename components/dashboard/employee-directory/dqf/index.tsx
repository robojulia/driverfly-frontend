import { Button, Col, Form, Row, Table } from "react-bootstrap";
import { useAuth } from "../../../../hooks/useAuth";
import { useEffectAsync } from "../../../../utils/react";
import { useTranslation } from "../../../../hooks/useTranslation";
import { ViewApplicantDetailProps } from "../../../../types/applicant/view-application-detail-props.type";
import { useFormik } from "formik";
import ApplicantApi from "../../../../pages/api/applicant";
import ViewCard from "../../../viewDetails/viewCard";
import FileInput from '../../../forms/FileInput';
import { ApplicantDocumentType } from '../../../../enums/applicants/applicant-document-type.enum';
import { toast } from "react-toastify";
import { globalAjaxExceptionHandler } from "../../../../utils/ajax";
import ShowFormattedDate from "../../../jobs/show-formatted-date";
import { ApplicantDocumentDto } from "../../../../models/applicant/applicant-document-dto";
import { CloudArrowDown, Pen } from "react-bootstrap-icons";
import { ApplicantEntity } from "../../../../models/applicant/applicant.entity";
import { useState } from "react";
import { ThreeCircles } from 'react-loader-spinner';

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

    const handleUpdateDocument = async (type: ApplicantDocumentType, documentId?: number) => {
        form.setFieldValue("document", { type: type, id: documentId || null })
    }

    useEffectAsync(async () => {
        const v = await applicantApi.getById(applicant.id)
        setApplicantUser(v)
    }, [user], () => {
        form.resetForm()
    });

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
                                        Object.values(ApplicantDocumentType).map((value: ApplicantDocumentType, i) => {

                                            const document: any = applicantUser?.documents?.find(v => (v.type === value))
                                            return (
                                                <tr key={i}>
                                                    <td colSpan={2}>
                                                        {t(`ApplicantDocumentType.${value}`)}
                                                    </td>
                                                    <td colSpan={2}>
                                                        {document ? <ShowFormattedDate date={document.last_updated_at} /> : <span className="text-danger font-italic">{t(`NOT_AVAILABLE`)}</span>}
                                                    </td>
                                                    <td colSpan={1} >
                                                        {
                                                            (!form.values.document?.type || form.values.document?.type !== value) &&
                                                            <div className="d-flex">
                                                                <Button className="mr-2 w-100" onClick={() => { handleUpdateDocument(value, document?.id) }}>
                                                                    {document ? <Pen /> : t('ADD')}
                                                                </Button>
                                                                {document ? <a href={document?.path} role="button" className="btn theme-primary2-btn p-0 pt-1 mr-2" download><CloudArrowDown /></a> : null}
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
                                                                        <Button className="mr-2 w-50 theme-primary-btn" type="submit">
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

export default DqfTab;