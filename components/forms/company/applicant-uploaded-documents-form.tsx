import { useFormik } from "formik";
import { useEffect } from "react";
import { Button, Col, Form, Row, Table } from "react-bootstrap";
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
import ViewCard from "../../view-details/view-card";
import BaseInput from "../base-input";
import FileInput from "../file-input";
import { BaseFormProps } from "./base-form-props";
import { ApplicantOnBoardingChecklist } from "../../../enums/applicants/applicant-onboarding-checklist.enum";

export interface ApplicantUploadedDocumentsFormProps extends BaseFormProps<ApplicantEntity> {
    isSubmitting: boolean;
    setIsSubmitting(value: boolean): void;
}

export function ApplicantUploadedDocumentsForm(props: ApplicantUploadedDocumentsFormProps) {
    let { className, entity, setEntity, isSubmitting, setIsSubmitting } = props;
    const { t } = useTranslation();

    const applicantApi = new ApplicantApi();

    const form = useFormik({
        initialValues: new ApplicantEntity(),
        validationSchema: ApplicantEntity.yupSchemaForApplicantDocumentsForm(),
        onSubmit: async (values) => {
            setIsSubmitting(true)
            try {
                if (entity?.id) {
                    values = await applicantApi.update(entity.id, {
                        ...values,
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
                                    // Boolean(
                                    //     form.values?.documents?.length ===
                                    //     Object.keys(ApplicantDocumentType).length
                                    // ) ||
                                    Boolean(entity?.is_hired)
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
                                                <BaseInput
                                                    name={`documents[${i}].type`}
                                                    required
                                                    placeholder="DOCUMENT_TYPE"
                                                    readOnly={
                                                        Boolean(!!entity?.id && !entity?.file_base64) ||
                                                        Boolean(props?.entity?.is_hired)
                                                    }
                                                    formik={form}
                                                />
                                            </td>
                                            <td>
                                                <FileInput
                                                    name={`documents[${i}]`}
                                                    readOnly={Boolean(props?.entity?.is_hired)}
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
                        {!form.values?.documents?.length && <>{t("NONE")}</>}
                        <div style={{ display: "flex", justifyContent: "right" }}>
                            <Button disabled={form.isSubmitting || isSubmitting} style={{ marginTop: "2%" }} type="submit" className="theme-secondary-btn">
                                {t("UPDATE")}
                            </Button>
                        </div>
                    </ViewCard>
                </Col>
            </Row>

        </Form>
    );
}
