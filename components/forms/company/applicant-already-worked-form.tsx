import { useFormik } from "formik";
import { useEffect } from "react";
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
}

export function ApplicantAlreadyWorkedForm(props: ApplicantAlreadyWorkedFormProps) {
    let { className, entity, setEntity, isSubmitting, setIsSubmitting } = props;
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
            form.setValues(
                {
                    ...entity,
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
                        <div style={{ display: "flex", justifyContent: "right" }}>
                            <Button disabled={form.isSubmitting || isSubmitting} type="submit" className="theme-secondary-btn">
                                {t("UPDATE")}
                            </Button>
                        </div>
                    </ViewCard>
                </Col>
            </Row>

        </Form>
    );
}
