import { useFormik } from "formik";
import { useEffect } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { toast } from "react-toastify";

import { ApplicantDocumentType } from "../../../enums/applicants/applicant-document-type.enum";
import { ApplicantExtras } from "../../../enums/applicants/applicant-extras.enum";
import { ApplicantType } from "../../../enums/applicants/applicant-type.enum";
import { useTranslation } from "../../../hooks/use-translation";
import { ApplicantExtrasEntity } from "../../../models/applicant";
import { ApplicantEntity } from "../../../models/applicant/applicant.entity";
import ApplicantApi from "../../../pages/api/applicant";
import { globalAjaxExceptionHandler } from "../../../utils/ajax";
import { focusOnErrorField } from "../../../utils/form-error";
import { useEffectAsync } from "../../../utils/react";
import { formFailed, formSuccess } from "../../../utils/toast";
import ViewCard from "../../view-details/view-card";
import BaseCheck from "../base-check";
import BaseInput from "../base-input";
import { BaseFormProps } from "./base-form-props";

export interface ApplicantFormProps extends BaseFormProps<ApplicantEntity> { }

export function ApplicantAlreadyWorkedForm(props: any) {
    let { className, entity, onSaveComplete, onSaveError } = props?.props;
    const { t } = useTranslation();
    const applicantApi = new ApplicantApi();

    const form = useFormik({
        initialValues: new ApplicantEntity(),
        validationSchema: ApplicantEntity.yupSchemaForApplicantAlreadyWorkedForm(),
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
                    <ViewCard title="ALREADY_WORKED_TO_COMPANY">
                        <Row>
                            <Col>
                                <BaseCheck
                                    disabled={Boolean(entity?.is_hired)}
                                    className="my-3 col float-left p-0"
                                    name={`already_applied_to_company`}
                                    label="APPLIED_HERE_BEFORE"
                                    onChange={({ target: { value } }) => {
                                        form.setFieldValue(
                                            `already_applied_to_company`,
                                            value
                                        );
                                        if (!value) {
                                            form.setFieldValue(`already_worked_to_company`, false);
                                            form.setFieldValue(`already_worked_start_date`, null);
                                            form.setFieldValue(`already_worked_end_date`, null);
                                        };
                                    }}
                                    formik={form}
                                />
                            </Col>
                        </Row>

                        {Boolean(form.values?.already_applied_to_company) && (
                            <>
                                <Row>
                                    <Col>
                                        <BaseCheck
                                            formik={form}
                                            disabled={Boolean(entity?.is_hired)}
                                            className="my-3 col float-left p-0"
                                            name="already_worked_to_company"
                                            label="WORKED_HERE_BEFORE"
                                            onChange={({ target: { value } }) => {
                                                form.setFieldValue(`already_worked_to_company`, value);
                                                if (!value) {
                                                    form.setFieldValue(`already_worked_start_date`, null);
                                                    form.setFieldValue(`already_worked_end_date`, null);
                                                }
                                            }}
                                        />
                                    </Col>
                                </Row>
                                {form.values.already_worked_to_company && (
                                    <Row>
                                        <BaseInput
                                            readOnly={Boolean(entity?.is_hired)}
                                            className="col-md-6 my-3 font-weight-bold"
                                            type="date"
                                            name={`already_worked_start_date`}
                                            placeholder="DATE"
                                            label="FROM"
                                            max={
                                                new Date(
                                                    new Date().getFullYear(),
                                                    new Date().getMonth(),
                                                    new Date().getDate()
                                                )
                                                    .toISOString()
                                                    .split("T")[0]
                                            }
                                            formik={form}
                                        />
                                        <BaseInput
                                            readOnly={Boolean(entity?.is_hired)}
                                            className="col-md-6 my-3 font-weight-bold"
                                            type="date"
                                            name={`already_worked_end_date`}
                                            placeholder="DATE"
                                            label="TO"
                                            max={
                                                new Date(
                                                    new Date().getFullYear(),
                                                    new Date().getMonth(),
                                                    new Date().getDate()
                                                )
                                                    .toISOString()
                                                    .split("T")[0]
                                            }
                                            formik={form}
                                        />
                                    </Row>
                                )}
                            </>
                        )}
                        <Button disabled={form.isSubmitting} type="submit" className="theme-secondary-btn">
                            {t("UPDATE")}
                        </Button>
                    </ViewCard>
                </Col>
            </Row>

        </Form>
    );
}
