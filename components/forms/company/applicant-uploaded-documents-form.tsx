import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { Button, Col, Form, Row, Table } from "react-bootstrap";
import { Eye, Trash, CloudDownload } from 'react-bootstrap-icons';
import {
    DashCircle,
    PlusCircle
} from "react-bootstrap-icons";
import { toast } from "react-toastify";

import { ApplicantDocumentType } from "../../../enums/applicants/applicant-document-type.enum";
import { ApplicantType } from "../../../enums/applicants/applicant-type.enum";
import { useTranslation } from "../../../hooks/use-translation";
import { ApplicantEntity } from "../../../models/applicant/applicant.entity";
import { DocumentEntity } from "../../../models/documents/document.entity";
import ApplicantApi from "../../../pages/api/applicant";
import { globalAjaxExceptionHandler } from "../../../utils/ajax";
import { focusOnErrorField } from "../../../utils/form-error";
import { useEffectAsync } from "../../../utils/react";
import { formFailed, formSuccess } from "../../../utils/toast";
import Section from "../../view-details/section";
import BaseInput from "../base-input";
import FileInput from "../file-input";
import { BaseFormProps } from "./base-form-props";
import { ApplicantOnBoardingChecklist } from "../../../enums/applicants/applicant-onboarding-checklist.enum";
import { getBase64 } from "../../../utils/file";
import ShowFormattedDate from "../../jobs/show-formatted-date";
import ViewPdf from "../../view-details/view-pdf";
import { handleViewDocument } from "../../../utils/documents/button-actions";

export interface ApplicantUploadedDocumentsFormProps extends BaseFormProps<ApplicantEntity> {
    isSubmitting: boolean;
    setIsSubmitting(value: boolean): void;
    hideActions?: boolean;
    wrapInSection?: boolean; // when false, render as a subsection without outer Section/Card
}

export function ApplicantUploadedDocumentsForm(props: ApplicantUploadedDocumentsFormProps) {
    let { className, entity, setEntity, isSubmitting, setIsSubmitting } = props;
    const { t } = useTranslation();

    const applicantApi = new ApplicantApi();
    const [pdf, setPdf] = useState<{ name?: string; url?: string } | any>(null as any);

    const form = useFormik({
        initialValues: new ApplicantEntity(),
        validationSchema: ApplicantEntity.yupSchemaForApplicantDocumentsForm(),
        onSubmit: async (values) => {
            setIsSubmitting(true)
            try {
                if (entity?.id) {
                    // Send ONLY documents to avoid overwriting other forms' changes
                    values = await applicantApi.update(entity.id, {
                        documents: [
                            ...values.documents,
                            ...entity.documents?.filter(
                                (v) =>
                                    Object.values(ApplicantDocumentType).includes(
                                        v?.type as ApplicantDocumentType
                                    ) ||
                                    Object.values(ApplicantOnBoardingChecklist).includes(
                                        v?.type as ApplicantOnBoardingChecklist
                                    )
                            ),
                        ]?.filter((v) => !!v),
                    } as ApplicantEntity);
                } else {

                    values = await applicantApi.create(values);
                }
                formSuccess(t, entity?.id ? "update" : "create", "APPLICANT");
                setEntity(values)
                setIsSubmitting(false)
            } catch (e) {
                setIsSubmitting(false)
                if (
                    !globalAjaxExceptionHandler(e, { formik: form, t: t, toast: toast })
                )
                    formFailed(t, entity?.id ? "update" : "create", "APPLICANT");
            }
        },
    });

    useEffectAsync(async () => {
        if (!!entity?.id) {
            form.setValues({
                ...entity,
                documents: entity?.documents?.filter(
                    (v) =>
                        !(
                            Object.values(ApplicantDocumentType).includes(
                                v?.type as ApplicantDocumentType
                            ) ||
                            Object.values(ApplicantOnBoardingChecklist).includes(
                                v?.type as ApplicantOnBoardingChecklist
                            )
                        )
                ),
            });
        } else {
            await form.setValues(
                {
                    ...new ApplicantEntity(),
                    type: ApplicantType.COMPANY,
                });
        }

    }, [entity]);

    useEffect(() => focusOnErrorField(form), [form.submitCount])

    const handleLocalDownload = (doc: any) => {
        try {
            const url = doc?.path || (doc?.file_base64 ? `data:${doc?.mime_type};base64,${doc?.file_base64}` : undefined);
            if (!url) return;
            const a = document.createElement('a');
            a.href = url;
            a.download = doc?.name || 'document';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        } catch {}
    };

    const content = (
        <>
            {!Boolean(entity?.is_hired) && (
                <div
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={async (e) => {
                        e.preventDefault();
                        const files = Array.from(e.dataTransfer.files || []);
                        if (!files.length) return;
                        const newDocs = [] as any[];
                        for (const file of files) {
                            const doc = new DocumentEntity();
                            doc.type = file.name; // use filename as unique key
                            doc.name = file.name;
                            doc.mime_type = file.type;
                            const b64 = await getBase64(file as any);
                            doc.file_base64 = b64;
                            doc.path = `data:${file.type};base64,${b64}`;
                            newDocs.push(doc);
                        }
                        form.setValues({
                            ...form.values,
                            documents: [
                                ...(form.values?.documents || []),
                                ...newDocs,
                            ],
                        });
                    }}
                    style={{
                        border: "2px dashed #d9dee3",
                        borderRadius: 6,
                        padding: 32,
                        textAlign: "center",
                        color: "#6c757d",
                    }}
                    className="mb-3"
                >
                    <div className="mb-2" style={{ fontSize: 14 }}>{t("Drag and drop files or click to browse")}</div>
                    <div className="text-muted small mb-2">
                        <div>{t("FILE_MUST_BE_OF_{types}", { types: "PDF, Word, or Image files" })}</div>
                        <div>{t("MAXIMUM_FILE_SIZE")}: 3MB</div>
                    </div>
                    <label className="btn btn-light border" style={{ cursor: "pointer" }}>
                        {t("Select Files")}
                        <input
                            type="file"
                            multiple
                            accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/*"
                            style={{ display: "none" }}
                            onChange={async (e) => {
                                const files = Array.from(e.target.files || []);
                                if (!files.length) return;
                                const newDocs = [] as any[];
                                for (const file of files) {
                                    const doc = new DocumentEntity();
                                    doc.type = file.name;
                                    doc.name = file.name;
                                    doc.mime_type = file.type;
                                    const b64 = await getBase64(file as any);
                                    doc.file_base64 = b64;
                                    doc.path = `data:${file.type};base64,${b64}`;
                                    newDocs.push(doc);
                                }
                                form.setValues({
                                    ...form.values,
                                    documents: [
                                        ...(form.values?.documents || []),
                                        ...newDocs,
                                    ],
                                });
                            }}
                        />
                    </label>
                </div>
            )}

            {form.values?.documents?.length > 0 ? (
                <div>
                    {form.values?.documents?.map((doc, i) => (
                        <div key={i} className="d-flex align-items-center justify-content-between bg-light rounded mb-2 px-3 py-2">
                            <div className="d-flex align-items-center">
                                <span className="me-2 bi bi-file-earmark" />
                                <span>{doc?.name || doc?.type}</span>
                            </div>
                            <div className="d-flex align-items-center" style={{ gap: 8 }}>
                                <Button
                                    variant="success"
                                    size="sm"
                                    title={t('View')}
                                    onClick={async (e) => {
                                        e.preventDefault();
                                        if (doc?.id) {
                                            await handleViewDocument(doc.id, setPdf, doc?.name);
                                        } else if (doc?.path || doc?.file_base64) {
                                            setPdf({ name: doc?.name, url: doc?.path || `data:${doc?.mime_type};base64,${doc?.file_base64}` });
                                        }
                                    }}
                                >
                                    <Eye />
                                </Button>
                                <Button
                                    variant="dark"
                                    size="sm"
                                    title={t('Download')}
                                    onClick={(e) => { e.preventDefault(); handleLocalDownload(doc); }}
                                >
                                    <CloudDownload />
                                </Button>
                                {!props?.hideActions && !Boolean(entity?.is_hired) && (
                                    <Button
                                        variant="danger"
                                        size="sm"
                                        title={t('Remove')}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            form.setValues({
                                                ...form.values,
                                                documents: form.values?.documents?.filter((_, idx) => idx !== i),
                                            });
                                        }}
                                    >
                                        <Trash />
                                    </Button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-muted">{t("NONE")}</div>
            )}

            {/* Update button intentionally removed; global Save handles submission */}
        </>
    );

    return (
        <Form onSubmit={form.handleSubmit} className={className} data-applicant-edit-form>
            {props?.wrapInSection === false ? (
                <>{content}</>
            ) : (
                <Row>
                    <Col md="12" className="p-0 px-lg-2">
                        <Section title="UPLOADED_DOCUMENTS">
                            {content}
                        </Section>
                    </Col>
                </Row>
            )}
            <ViewPdf name={pdf?.name} url={pdf?.url} onCloseClick={() => setPdf(null)} />
        </Form>
    );
}
