import { Button, Col, Form, Row, Table } from "react-bootstrap";

import { useFormik } from "formik";

import { toast } from "react-toastify";

import { CloudArrowDown, Pen, Eye, Trash } from "react-bootstrap-icons";

import { useState } from "react";
import { ThreeCircles } from 'react-loader-spinner';
import { ViewApplicantDetailProps } from "../../types/applicant/view-application-detail-props.type";
import { ApplicantDocumentDto, ApplicantEntity } from "../../models/applicant";
import { useTranslation } from "../../hooks/use-translation";
import { useAuth } from "../../hooks/use-auth";
import ApplicantApi from "../../pages/api/applicant";
import DocumentApi from "../../pages/api/document";
import { ApplicantDqf } from "../../enums/applicants/applicant-dqf-types.enum";
import { useEffectAsync } from "../../utils/react";
import { globalAjaxExceptionHandler } from "../../utils/ajax";
import ShowFormattedDate from "../jobs/show-formatted-date";
import FileInput from "../forms/file-input";
import ViewCard from "../view-details/view-card";
import ViewPdf from "../view-details/view-pdf";
import BaseCheck from "../forms/base-check";
import { ApplicantOnBoardingChecklist } from "../../enums/applicants/applicant-onboarding-checklist.enum";


export interface DqfTabProps extends ViewApplicantDetailProps {
    canEdit?: boolean;
}

const ViewApplicantDqf = ({ applicant, canEdit }: DqfTabProps) => {

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
    const handleUpdateDocument = async (type: ApplicantDqf | ApplicantOnBoardingChecklist, documentId?: number) => {
        form.setFieldValue("document", { type: type, id: documentId || null })
    }

    useEffectAsync(async () => {
        if (applicant.id
        ) {
            const v = await applicantApi.getById(applicant.id)
            setApplicantUser(v)
        }
    }, [user, applicant], () => {
        form.resetForm()
    });
    const deleteDocument = async (docType: ApplicantDqf | ApplicantOnBoardingChecklist | string): Promise<void> => {
        const applicantApi = new ApplicantApi()
        await applicantApi.documents.delete(applicant?.id, docType)
        setApplicantUser({
            ...applicantUser,
            documents: applicantUser?.documents?.filter(v => (v.type != docType))
        })
    }

    return (
        <Row>
            <Col>
                {!!applicantUser ? (
                    <ViewCard title="ONBOARDING_CHECKLIST">

                        <Table striped>
                            <thead>
                                <tr>
                                    <th colSpan={2}>{t("TYPE")}</th>
                                    <th colSpan={2}>{t("COMPLETED?")}</th>
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
                                                <td colSpan={1} className="text-center">
                                                    <input className="form-check-input" type="radio" disabled checked={Boolean(document?.id)} />
                                                </td>
                                                <td colSpan={2}>
                                                    {document ? <ShowFormattedDate date={document.last_updated_at} /> : <span className="text-danger font-italic">{t(`NOT_AVAILABLE`)}</span>}
                                                </td>

                                                <td colSpan={1} className="border border-2 w-50">
                                                    {
                                                        (!form.values.document?.type || form.values.document?.type !== value)
                                                        && (
                                                            <div className="d-flex">

                                                                {/* It is checking
                                                                if the document exists. If it does,
                                                                it will display view the button. If it
                                                                doesn't, it will display nothing. */}
                                                                {document
                                                                    ? <a
                                                                        onClick={() => viewDocumentClick(document.id, document?.name)}
                                                                        href='#'
                                                                        role="button"
                                                                        className="btn btn-success p-0 pt-1 mr-2 w-100"
                                                                    ><Eye /></a>
                                                                    : null}

                                                                {/* A button that will either update or
                                                                add a document. */}
                                                                {Boolean(canEdit) && <Button
                                                                    className="mr-2 w-100"
                                                                    onClick={() => { handleUpdateDocument(value, document?.id) }}
                                                                >{document ? <Pen /> : t('ADD')}</Button>

                                                                }
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
                                                                {!!document && !!canEdit
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

                                                            </div>

                                                        )
                                                    }

                                                    {(form.values?.document?.type === value)
                                                        && <Form onSubmit={form.handleSubmit} >
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
                                {
                                    Object.values(ApplicantOnBoardingChecklist).map((value: ApplicantOnBoardingChecklist, i) => {

                                        const document: any = applicantUser?.documents?.find(v => (v.type === value))
                                        return (
                                            <tr key={i}>
                                                <td colSpan={2}>
                                                    {t(`ApplicantOnBoardingChecklist.${value}`)}
                                                </td>
                                                <td colSpan={1} className="text-center">
                                                    <input className="form-check-input" type="radio" disabled checked={Boolean(document?.id)} />
                                                </td>
                                                <td colSpan={2}>
                                                    {document ? <ShowFormattedDate date={document.last_updated_at} /> : <span className="text-danger font-italic">{t(`NOT_AVAILABLE`)}</span>}
                                                </td>
                                                {/* <td colSpan={1} className="dw-25">
                                                    {
                                                        (!form.values.document?.type || form.values.document?.type !== value) &&
                                                        <div className="d-flex">
                                                            {document ? <a onClick={() => viewDocumentClick(document.id, document.name)} href='#' role="button" className="btn theme-primary-btn pt-2 mr-2"><Eye /></a> : null}

                                                            {document ? <a href={document?.path} download className="btn theme-primary-btn pt-2  mr-2 "><CloudArrowDown /></a> : null}

                                                            {
                                                                canEdit ? (document ? <a onClick={() => deleteDocument(document.type)} className="btn btn-danger pt-2  mr-2 "><Trash /></a> : null) : ""
                                                            }

                                                        </div>
                                                    }

                                                    {
                                                        (form.values?.document?.type === value) &&
                                                        <Form onSubmit={form.handleSubmit} >
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

                                                </td> */}
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
                                                                    onClick={() => viewDocumentClick(document.id, document?.name)}
                                                                    href='#'
                                                                    role="button"
                                                                    className="btn btn-success p-0 pt-1 mr-2 w-100"
                                                                ><Eye /></a>
                                                                : null}

                                                            {/* A button that will either update or
                                                                add a document. */}
                                                            {Boolean(canEdit) && <Button
                                                                className="mr-2 w-100"
                                                                onClick={() => { handleUpdateDocument(value, document?.id) }}
                                                            >{document ? <Pen /> : t('ADD')}</Button>

                                                            }

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
                                                            {!!document && !!canEdit
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

                                                        </div>)
                                                    }

                                                    {(form.values?.document?.type === value)
                                                        && <Form onSubmit={form.handleSubmit} >
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
    );
};

export default ViewApplicantDqf;