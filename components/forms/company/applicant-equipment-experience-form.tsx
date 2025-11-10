import { useFormik } from "formik";
import { useEffect, useRef, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import {
    DashCircle,
    PlusCircle
} from "react-bootstrap-icons";
import { toast } from "react-toastify";

import { ApplicantType } from "../../../enums/applicants/applicant-type.enum";
import { JobEquipmentType } from "../../../enums/jobs/job-equipment-type.enum";
import { useTranslation } from "../../../hooks/use-translation";
import { ApplicantExperienceEntity } from "../../../models/applicant/applicant-experience.entity";
import { ApplicantEntity } from "../../../models/applicant/applicant.entity";
import ApplicantApi from "../../../pages/api/applicant";
import { globalAjaxExceptionHandler } from "../../../utils/ajax";
import { focusOnErrorField } from "../../../utils/form-error";
import { useEffectAsync } from "../../../utils/react";
import { formFailed, formSuccess } from "../../../utils/toast";
import Section from "../../view-details/section";
import BaseInput from "../base-input";
import BaseSelect from "../base-select";
import { BaseFormProps } from "./base-form-props";

export interface ApplicantEquipmentExperienceFormProps extends BaseFormProps<ApplicantEntity> {
    isSubmitting: boolean;
    setIsSubmitting(value: boolean): void;
    hideActions?: boolean;
    hideAddButton?: boolean;
}

export function ApplicantEquipmentExperienceForm(props: ApplicantEquipmentExperienceFormProps) {
    let { className, entity, setEntity, isSubmitting, setIsSubmitting } = props;

    const { t } = useTranslation();
    const [initialized, setInitialized] = useState(false);

    const applicantApi = new ApplicantApi();

    const form = useFormik({
        initialValues: new ApplicantEntity(),
        enableReinitialize: false,
        validationSchema: ApplicantEntity.yupSchemaApplicantExperienceForm(),
        onSubmit: async (values) => {
            setIsSubmitting(true)
            try {
                // Strip preference fields (handled by preferences form)
                const { routes, preferred_location, current_application_status, ...payload } = values as any;
                const timestamp = new Date().toISOString();
                if (entity?.id) {
                    values = await applicantApi.update(entity.id, payload);
                } else {
                    values = await applicantApi.create(payload);
                }

                // Check if child toasts are suppressed by global save
                if (!(window as any).__SUPPRESS_CHILD_TOASTS__) {
                    formSuccess(t, entity?.id ? "update" : "create", "APPLICANT");
                }
                
                // MERGE saved response with existing entity to preserve fields backend didn't return
                setEntity({ ...entity, ...values });
                setIsSubmitting(false)
            } catch (e) {
                setIsSubmitting(false)
                console.error("Unable to save applicant info", e);
                if (
                    !globalAjaxExceptionHandler(e, { formik: form, t: t, toast: toast })
                )
                    formFailed(t, entity?.id ? "update" : "create", "APPLICANT");
            }
        },
    });

    useEffectAsync(async () => {
        // Only initialize form once to prevent overwriting user changes
        if (initialized && entity?.id) return;
        
        if (!!entity?.id) {
            form.setValues(
                {
                    ...entity,
                });
            setInitialized(true);
        } else {
            await form.setValues(
                {
                    ...new ApplicantEntity(),
                    type: ApplicantType.COMPANY,
                });
        }
    }, [entity?.id, initialized]);

    // Keep a ref to always have the latest form instance
    const formRef = useRef(form);
    formRef.current = form;

    // Register getter function that returns CURRENT form values when called
    useEffect(() => {
        if (typeof window !== 'undefined') {
            (window as any).__applicantFormRegistry = (window as any).__applicantFormRegistry || {};
            (window as any).__applicantFormRegistry['equipment'] = () => {
                console.log('EquipmentForm getter called');
                // Return ONLY equipment-related fields
                return {
                    equipment_experience: formRef.current.values.equipment_experience,
                    equipment_owned: formRef.current.values.equipment_owned,
                };
            };
        }
    }, []);

    useEffect(() => focusOnErrorField(form), [form.submitCount])

    return (
        <Form
            onSubmit={form.handleSubmit}
            className={className}
            data-applicant-edit-form
        >
            <Row>
                <Col md="12" className="p-2 mt-2">
                    <div className="df-modern-section">
                    <Section
                        title="equipment_experience"
                        actions={
                            !props?.hideAddButton && (
                                <Button
                                    disabled={Boolean(entity?.is_hired)}
                                    size="sm"
                                    onClick={() =>
                                        form.setValues({
                                            ...form.values,
                                            equipment_experience: [
                                                ...(form.values?.equipment_experience || []),
                                                new ApplicantExperienceEntity(),
                                            ],
                                        })
                                    }
                                >
                                    <PlusCircle /> {t("ADD_MORE_EXPERIENCE")}
                                </Button>
                            )
                        }
                    >
                        {form.values?.equipment_experience?.length > 0 && (
                            <>
                                {form.values?.equipment_experience?.map((entity, i) => (
                                    <Row key={i}>
                                        <div className="col-md-6 mt-2">
                                            <Col className="p-0  ">
                                                <strong>{t("TYPE")}</strong>
                                                <span className="p-0 text-danger">*</span>
                                            </Col>
                                            <BaseSelect
                                                readOnly={Boolean(props?.entity?.is_hired)}
                                                name={`equipment_experience[${i}].type`}
                                                placeholder="SELECT_EQUIPMENT_TYPE"
                                                required
                                                labelPrefix="JobEquipmentType"
                                                enumType={JobEquipmentType}
                                                formik={form}
                                                onChange={({ target: { value } }) => {
                                                    form.setFieldValue(`equipment_experience[${i}].type`, value)
                                                    if (value == JobEquipmentType.OTHER) {
                                                        form.setFieldValue(`equipment_experience[${i}].type_other`, t(`JobEquipmentType.OTHER`))
                                                    } else {
                                                        form.setFieldValue(`equipment_experience[${i}].type_other`, (``))
                                                    }
                                                }}
                                            />
                                        </div>
                                        <div className="col-md-5 mt-2">
                                            <Col className="p-0">
                                                <strong>{t("YEARS")}</strong>
                                            </Col>
                                            <BaseInput
                                                readOnly={Boolean(props?.entity?.is_hired)}
                                                name={`equipment_experience[${i}].years`}
                                                placeholder="ENTER_YEARS_OF_EXPERIENCE"
                                                type="int"
                                                min="1"
                                                formik={form}
                                            />
                                        </div>
                                        <div className="pl-sm-1 pt-lg-2 col-lg-1 col-md-12">
                                            <Col className="mt-4"></Col>
                                            <a
                                                href="#"
                                                onClick={() =>
                                                    form.setValues({
                                                        ...form.values,
                                                        equipment_experience:
                                                            form.values?.equipment_experience?.filter(
                                                                (v, idx) => i != idx
                                                            ),
                                                    })
                                                }
                                            >
                                                <DashCircle color="red" />
                                            </a>
                                        </div>
                                        {entity.type == JobEquipmentType.OTHER && (
                                            <Col md="11">
                                                <BaseInput
                                                    readOnly={Boolean(props?.entity?.is_hired)}
                                                    className="my-2"
                                                    name={`equipment_experience[${i}].type_other`}
                                                    placeholder="TYPE"
                                                    formik={form}
                                                />
                                            </Col>
                                        )}
                                        <div className="12">
                                            <hr />
                                        </div>
                                    </Row>
                                ))}
                            </>
                        )}
                        {!props?.hideActions && (
                            <div style={{ display: "flex", justifyContent: "right" }}>
                                <Button disabled={form.isSubmitting || isSubmitting} type="submit" className="theme-secondary-btn">
                                    {t("UPDATE")}
                                </Button>
                            </div>
                        )}
                    </Section>
                    </div>
                </Col>
            </Row>
        </Form>
    );
}
