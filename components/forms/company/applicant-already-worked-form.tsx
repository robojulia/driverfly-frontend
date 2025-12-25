import { useFormik } from "formik";
import { useEffect, useRef } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { toast } from "react-toastify";

import { ApplicantType } from "../../../enums/applicants/applicant-type.enum";
import { useTranslation } from "../../../hooks/use-translation";
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

export interface ApplicantAlreadyWorkedFormProps extends BaseFormProps<ApplicantEntity> {
    isSubmitting: boolean;
    setIsSubmitting(value: boolean): void;
    hideActions?: boolean;
}

export function ApplicantAlreadyWorkedForm(props: ApplicantAlreadyWorkedFormProps) {
    let { className, entity, setEntity, isSubmitting, setIsSubmitting, hideActions } = props;
    const { t } = useTranslation();
    const applicantApi = new ApplicantApi();

    const form = useFormik({
        initialValues: new ApplicantEntity(),
        validationSchema: ApplicantEntity.yupSchemaForApplicantAlreadyWorkedForm(),
        onSubmit: async (values) => {
            setIsSubmitting(true)
            try {
                if (entity?.id) {
                    values = await applicantApi.update(entity.id, {
                        ...values
                    })
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
            form.resetForm({
                values: {
                    ...entity,
                }
            });
        } else {
            await form.resetForm({
                values: {
                    ...new ApplicantEntity(),
                    type: ApplicantType.COMPANY,
                }
            });
        }

    }, [entity]);

    useEffect(() => focusOnErrorField(form), [form.submitCount])

    // Keep a ref to always have the latest form instance
    const formRef = useRef(form);
    formRef.current = form;

    // Register getter function that returns CURRENT form values when called
    useEffect(() => {
        if (typeof window !== 'undefined') {
            // Register validation function
            (window as any).__applicantFormValidation = (window as any).__applicantFormValidation || {};
            (window as any).__applicantFormValidation['already-worked'] = () => {
                // Return current validation errors from formik
                return formRef.current.errors;
            };

            // Register dirty state function
            (window as any).__applicantFormDirty = (window as any).__applicantFormDirty || {};
            (window as any).__applicantFormDirty['already-worked'] = () => {
                return formRef.current.dirty;
            };

            // Register reset dirty function
            (window as any).__applicantFormResetDirty = (window as any).__applicantFormResetDirty || {};
            (window as any).__applicantFormResetDirty['already-worked'] = () => {
                formRef.current.resetForm({ values: formRef.current.values });
            };

            (window as any).__applicantFormRegistry = (window as any).__applicantFormRegistry || {};
            (window as any).__applicantFormRegistry['already-worked'] = () => ({
                already_applied_to_company: formRef.current.values.already_applied_to_company,
                already_worked_to_company: formRef.current.values.already_worked_to_company,
                already_worked_start_date: formRef.current.values.already_worked_start_date,
                already_worked_end_date: formRef.current.values.already_worked_end_date,
            });
        }

        // Cleanup function to prevent memory leaks
        return () => {
            if (typeof window !== 'undefined') {
                delete (window as any).__applicantFormValidation?.['already-worked'];
                delete (window as any).__applicantFormDirty?.['already-worked'];
                delete (window as any).__applicantFormResetDirty?.['already-worked'];
                delete (window as any).__applicantFormRegistry?.['already-worked'];
            }
        };
    }, []);

    return (
        <Form
            onSubmit={form.handleSubmit}
            className={className}
        >
            <Row>
                <Col md="12" className="p-0 px-lg-2">
                    <ViewCard title="ALREADY_WORKED_TO_COMPANY">
                        <Row>
                            <Col md="6">
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
                            {Boolean(form.values?.already_applied_to_company) && (
                                <Col md="6">
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
                            )}
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
                        {!hideActions && (
                            <div style={{ display: "flex", justifyContent: "right" }}>
                                <Button disabled={form.isSubmitting || isSubmitting} type="submit" className="theme-secondary-btn">
                                    {t("UPDATE")}
                                </Button>
                            </div>
                        )}
                    </ViewCard>
                </Col>
            </Row>

        </Form>
    );
}
