import { useState } from "react";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import { ThreeCircles } from 'react-loader-spinner';
import { Button, Col, Form, Row, Table } from "react-bootstrap";
import { useAuth } from "../../../hooks/use-auth";
import { useEffectAsync } from "../../../utils/react";
import { useTranslation } from "../../../hooks/use-translation";
import ApplicantApi from "../../../pages/api/applicant";
import ViewCard from "../../view-details/view-card";
import FileInput from '../../forms/file-input';
import { globalAjaxExceptionHandler } from "../../../utils/ajax";
import ShowFormattedDate from "../../jobs/show-formatted-date";
import { ApplicantDocumentDto } from "../../../models/applicant/applicant-document-dto";
import { ApplicantEntity } from "../../../models/applicant/applicant.entity";
import ViewPdf from "../../view-details/view-pdf";
import { ApplicantDqf } from "../../../enums/applicants/applicant-dqf-types.enum";
import { DocumentableType } from "../../../enums/documents/documentable-type.enum";
import { DocumentEntity } from "../../../models/documents/document.entity";
import { ViewApplicantDqfProps } from "../../../types/applicant/view-application-dqf-props.type";
import SafetyPerformanceHistory from "../../applicants/safety-performance-history";
import ViewDocumentHistory from "../../documents/view-history";
import { ApplicantOnBoardingChecklist } from "../../../enums/applicants/applicant-onboarding-checklist.enum";
import { AddDocumentButton, DeleteDocumentButton, DownloadDocumentButton, ViewDocumentButton } from "../../documents/buttons";
import { handleDownloadDocument, handleViewDocument } from "../../../utils/documents/button-actions";

export default function DQF(props: ViewApplicantDqfProps) {

    const { t } = useTranslation();
    const { user } = useAuth();
    const applicantApi = new ApplicantApi();

    const [pdf, setPdf] = useState({});

    const [applicant, setApplicant] = useState<ApplicantEntity>(null)

    useEffectAsync(async () => {
        if (props.applicant?.id) {
            const v = await applicantApi.getById(props.applicant?.id)
            setApplicant(v)
        }
    }, [user]);

    const form = useFormik({
        initialValues: new ApplicantDocumentDto(),
        validationSchema: ApplicantDocumentDto.yupSchema(),
        onSubmit: async ({ document }, { resetForm }) => {
            try {
                const applicantDocumentUpload = await applicantApi.documents.create(applicant.id, document)

                if (document.id) {
                    applicant.documents = applicant.documents.filter(v => (v.id !== applicantDocumentUpload.id))
                }
                applicant.documents.push(applicantDocumentUpload)
                toast.success(t('DOCUMENT_UPLOAD_SUCCESS_MESSAGE'))
                resetForm()
            }
            catch (e) {
                globalAjaxExceptionHandler(e, { formik: form, toast: toast, t: t });
            }
        }
    });

    /**
     * It deletes a document from the applicant's profile.
     * @param {ApplicantDqf | string} docType - The type of document you want to
     * delete.
     */
    const handleDeleteDocument = async (docType: ApplicantDqf | string): Promise<void> => {
        const applicantApi = new ApplicantApi()
        await applicantApi.documents.delete(applicant?.id, docType)
        setApplicant({
            ...applicant,
            documents: applicant?.documents?.filter(v => (v.type != docType))
        })
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

    /* This is a functional component in TypeScript React that renders a list of buttons for a
    given document and type. It conditionally renders the buttons based on whether the document type
    matches the given type and whether the type is SAFETY_PERFORMANCE_HISTORY. The buttons include
    ViewDocumentButton, AddDocumentButton, DownloadDocumentButton, DeleteDocumentButton, and
    ViewDocumentHistory. If the type is SAFETY_PERFORMANCE_HISTORY, it renders the
    SafetyPerformanceHistory component instead of the buttons. */
    const ButtonList = ({ document, type }) => (
        <>
            {(!form.values.document?.type || form.values.document?.type !== type)
                && (<div className="d-flex">
                    {type != ApplicantDqf.SAFETY_PERFORMANCE_HISTORY
                        ? (<>
                            <ViewDocumentButton
                                document={document}
                                onClick={() => handleViewDocument(document.id, setPdf)}
                            />
                            {Boolean(props.canEdit)
                                && <AddDocumentButton
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
                            {Boolean(props.canEdit)
                                && <DeleteDocumentButton
                                    document={document}
                                    onClick={() => handleDeleteDocument(type)}
                                />
                            }
                            {Boolean(props.showHistory)
                                && <ViewDocumentHistory
                                    typePrefix="ApplicantDqf"
                                    document={document}
                                    type={type}
                                    documentable_id={applicant.id}
                                    documentable_type={DocumentableType.APPLICANTS}
                                />
                            }
                        </>)
                        : (
                            <SafetyPerformanceHistory
                                applicant={applicant}
                                canEditSafetyPerformance={props.canEditSafetyPerformance}
                                showHistory={props.showHistory}
                                showResendButton={props.showResendButton}
                            />
                        )}
                </div>)
            }
        </>
    )

    /**
     * This is a TypeScript React component that displays the last updated date of a document, unless the
     * document type is ApplicantDqf.SAFETY_PERFORMANCE_HISTORY.
     * @param  - The function `UpdatedAt` takes two parameters:
     */
    const UpdatedAt = ({ document, type }) => {
        if (type == ApplicantDqf.SAFETY_PERFORMANCE_HISTORY) return (<></>)

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
                    {!!applicant ? (
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
                                    {Object.values(ApplicantDqf).map((type: ApplicantDqf, i) => {
                                        /* Finding the document in the applicant.documents array that has the same type. */
                                        const document: DocumentEntity = applicant?.documents?.find(v => (v.type === type))
                                        return (
                                            <tr key={i}>
                                                <td colSpan={2}>
                                                    {t(`ApplicantDqf.${type}`)}
                                                </td>
                                                {Boolean(props.showCompleted)
                                                    &&
                                                    <td colSpan={1} className="text-center">
                                                        <input className="form-check-input" type="radio" disabled checked={Boolean(document?.id)} />
                                                    </td>
                                                }
                                                <td colSpan={2}>
                                                    <UpdatedAt document={document} type={type} />
                                                </td>
                                                <td colSpan={1} className="border border-2 w-50">
                                                    <ButtonList document={document} type={type} />
                                                    {(form.values?.document?.type === type)
                                                        && <Form onSubmit={form.handleSubmit} >
                                                            <FileInput
                                                                name={`document`}
                                                                accept="application/pdf"
                                                                formik={form}
                                                                allowedSizeInByte={3145728}
                                                            />
                                                            <div className="mt-2 d-flex w-100 ">
                                                                <Button
                                                                    disabled={form.isSubmitting || !form.isValid || form.isValidating}
                                                                    className="mr-2 w-50 theme-primary-btn"
                                                                    type="submit"
                                                                >{t(`SAVE`)}</Button>
                                                                <Button
                                                                    type="button"
                                                                    className="mr-2 w-50 bg-danger"
                                                                    onClick={() => { form.resetForm() }}
                                                                >{t(`CANCEL`)}</Button>
                                                            </div>
                                                        </Form>
                                                    }
                                                </td>
                                            </tr>
                                        )
                                    })}
                                    {props.showOnboarding
                                        && Object.values(ApplicantOnBoardingChecklist).map((type: ApplicantOnBoardingChecklist, i) => {
                                            /* Finding the document in the applicant.documents array that has the same type. */
                                            const document: DocumentEntity = applicant?.documents?.find(v => (v.type === type))
                                            return (
                                                <tr key={i}>
                                                    <td colSpan={2}>
                                                        {t(`ApplicantOnBoardingChecklist.${type}`)}
                                                    </td>
                                                    {Boolean(props.showCompleted)
                                                        &&
                                                        <td colSpan={1} className="text-center">
                                                            <input className="form-check-input" type="radio" disabled checked={Boolean(document?.id)} />
                                                        </td>
                                                    }
                                                    <td colSpan={2}>
                                                        <UpdatedAt document={document} type={type} />
                                                    </td>
                                                    <td colSpan={1} className="border border-2 w-50">
                                                        <ButtonList document={document} type={type} />
                                                        {(form.values?.document?.type === type)
                                                            && <Form onSubmit={form.handleSubmit} >
                                                                <FileInput
                                                                    name={`document`}
                                                                    accept="application/pdf"
                                                                    formik={form}
                                                                    allowedSizeInByte={3145728}
                                                                />
                                                                <div className="mt-2 d-flex w-100 ">
                                                                    <Button
                                                                        disabled={form.isSubmitting || !form.isValid || form.isValidating}
                                                                        className="mr-2 w-50 theme-primary-btn"
                                                                        type="submit"
                                                                    >{t(`SAVE`)}</Button>
                                                                    <Button
                                                                        type="button"
                                                                        className="mr-2 w-50 bg-danger"
                                                                        onClick={() => { form.resetForm() }}
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