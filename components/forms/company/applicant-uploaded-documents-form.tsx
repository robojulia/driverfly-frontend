import { useFormik } from "formik";
import { useEffect } from "react";
import { Button, Col, Form, Row, Table } from "react-bootstrap";
import {
    DashCircle,
    PlusCircle
} from "react-bootstrap-icons";
import { toast } from "react-toastify";

import { ApplicantDocumentType } from "../../../enums/applicants/applicant-document-type.enum";
import { ApplicantExtras } from "../../../enums/applicants/applicant-extras.enum";
import { ApplicantType } from "../../../enums/applicants/applicant-type.enum";
import { useTranslation } from "../../../hooks/use-translation";
import { ApplicantExtrasEntity } from "../../../models/applicant";
import { ApplicantEntity } from "../../../models/applicant/applicant.entity";
import { DocumentEntity } from "../../../models/documents/document.entity";
import ApplicantApi from "../../../pages/api/applicant";
import { globalAjaxExceptionHandler } from "../../../utils/ajax";
import { focusOnErrorField } from "../../../utils/form-error";
import { useEffectAsync } from "../../../utils/react";
import { formFailed, formSuccess } from "../../../utils/toast";
import ViewCard from "../../view-details/view-card";
import BaseSelect from "../base-select";
import FileInput from "../file-input";
import { BaseFormProps } from "./base-form-props";

export interface ApplicantFormProps extends BaseFormProps<ApplicantEntity> { }

export function ApplicantUploadedDocumentsForm(props: { props: ApplicantFormProps }) {
    let { className, entity, onSaveComplete, onSaveError } = props?.props;
    const { t } = useTranslation();

    const applicantApi = new ApplicantApi();

    const form = useFormik({
        initialValues: new ApplicantEntity(),
        validationSchema: ApplicantEntity.yupSchemaForApplicantDocumentsForm(),
        onSubmit: async (values) => {
            values.extras = values.extras?.filter(
                (v) => v.value != undefined || v.value != null
            );
            const jobs = values.jobs || [];
            if ("jobs" in values) delete values.jobs;
            if (values.accident_count === undefined) {
                values.accident_count = 0
            }

            if (values.moving_violations_count === undefined) {
                values.moving_violations_count = 0
            }

            try {
                if (entity?.id) {
                    values = await applicantApi.update(entity.id, {
                        ...values,
                        documents: [
                            ...values.documents,
                            ...entity.documents?.filter(
                                (v) =>
                                    !Object.values(ApplicantDocumentType).includes(
                                        v.type as ApplicantDocumentType
                                    )
                            ),
                        ]?.filter((v) => !!v),
                    } as ApplicantEntity);
                } else {

                    values = await applicantApi.create(values);
                }

                for (let i = 0; i < entity?.jobs?.length; i++) {
                    let job = entity?.jobs[i];

                    if (!jobs.some((v) => v.job?.id == job.job.id)) {
                        await applicantApi.jobs.remove(values.id, job.job.id);
                    }
                }

                for (let i = 0; i < jobs.length; i++) {
                    let job = jobs[i];

                    if (job.id) {
                        await applicantApi.jobs.update(values.id, job.job.id, job);
                    } else {
                        await applicantApi.jobs.create(values.id, job.job.id, job);
                    }
                }

                formSuccess(t, entity?.id ? "update" : "create", "APPLICANT");
                if (onSaveComplete) onSaveComplete(values);
            } catch (e) {
                console.error("Unable to save applicant info", e);
                if (
                    !globalAjaxExceptionHandler(e, { formik: form, t: t, toast: toast })
                )
                    formFailed(t, entity?.id ? "update" : "create", "APPLICANT");

                if (onSaveError) onSaveError(e);
            }
        },
    });

    useEffectAsync(async () => {
        let extras: ApplicantExtrasEntity[] = entity?.extras || [];

        extras = extras.filter(Boolean);
        if (!extras?.find((v) => v.type == ApplicantExtras.BUSINESS_NAME))
            extras?.push({
                ...new ApplicantExtrasEntity(),
                type: ApplicantExtras.BUSINESS_NAME,
            });
        if (!extras?.find((v) => v.type == ApplicantExtras.DOT_NUMBER))
            extras?.push({
                ...new ApplicantExtrasEntity(),
                type: ApplicantExtras.DOT_NUMBER,
            });
        if (!extras?.find((v) => v.type == ApplicantExtras.CDL_NUMBER))
            extras?.push({
                ...new ApplicantExtrasEntity(),
                type: ApplicantExtras.CDL_NUMBER,
            });

        if (!!entity?.id) {
            form.setValues(
                {
                    ...entity,
                    documents: entity?.documents?.filter((v) =>
                        Object.values(ApplicantDocumentType).includes(
                            v.type as ApplicantDocumentType
                        )
                    ),
                    extras,
                });
        } else {
            await form.setValues(
                {
                    ...new ApplicantEntity(),
                    type: ApplicantType.COMPANY,
                    extras
                });
        }

    }, [entity]);

    useEffect(() => focusOnErrorField(form), [form.submitCount])

    return (
        <Form
            onSubmit={form.handleSubmit}
            className={className}
        >
            <Row>
                <Col md="12" className="p-0 px-lg-2">
                    <ViewCard
                        title="UPLOADED_DOCUMENTS"
                        actions={
                            <Button
                                size="sm"
                                disabled={
                                    Boolean(
                                        form.values?.documents?.length ===
                                        Object.keys(ApplicantDocumentType).length
                                    ) || Boolean(entity?.is_hired)
                                }
                                onClick={() =>
                                    form.setValues({
                                        ...form.values,
                                        documents: [
                                            ...(form.values?.documents || []),
                                            new DocumentEntity(),
                                        ],
                                    })
                                }
                            >
                                <PlusCircle /> {t("ADD")}
                            </Button>
                        }
                    >
                        {form.values?.documents?.length > 0 && (
                            <Table striped>
                                <thead>
                                    <tr>
                                        <th>{t("TYPE")}</th>
                                        <th>{t("DOCUMENT")}</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {form.values?.documents?.map((entity, i) => (
                                        <tr key={i}>
                                            <td>
                                                <BaseSelect
                                                    name={`documents[${i}].type`}
                                                    required
                                                    placeholder="SELECT_DOCUMENT_TYPE"
                                                    labelPrefix="ApplicantDocumentType"
                                                    enumType={ApplicantDocumentType}
                                                    readOnly={
                                                        Boolean(!!entity?.id && !entity?.file_base64) ||
                                                        Boolean(props?.props?.entity?.is_hired)
                                                    }
                                                    formik={form}
                                                />
                                            </td>
                                            <td>
                                                <FileInput
                                                    name={`documents[${i}]`}
                                                    readOnly={Boolean(props?.props?.entity?.is_hired)}
                                                    required
                                                    accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/*"
                                                    allowedSizeInByte={3145728}
                                                    formik={form}
                                                />
                                            </td>
                                            <td>
                                                <a
                                                    href="#"
                                                    onClick={() =>
                                                        form.setValues({
                                                            ...form.values,
                                                            documents: form.values?.documents?.filter(
                                                                (v, idx) => i != idx
                                                            ),
                                                        })
                                                    }
                                                >
                                                    <DashCircle color="red" />
                                                </a>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        )}
                        <div style={{ display: "flex", flexDirection: "row" }}>
                            {!form.values?.documents?.length && <>{t("NONE")}</>}
                            <Button disabled={form.isSubmitting} style={{ marginTop: "2%" }} type="submit" className="theme-secondary-btn">
                                {t("UPDATE")}
                            </Button>
                        </div>
                    </ViewCard>
                </Col>
            </Row>

        </Form>
    );
}
