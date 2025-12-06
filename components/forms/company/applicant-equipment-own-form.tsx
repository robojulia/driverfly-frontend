import { useFormik } from "formik";
import { useEffect, useRef } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import {
    DashCircle,
    PlusCircle
} from "react-bootstrap-icons";
import { toast } from "react-toastify";

import { ApplicantType } from "../../../enums/applicants/applicant-type.enum";
import { JobEquipmentType } from "../../../enums/jobs/job-equipment-type.enum";
import { useTranslation } from "../../../hooks/use-translation";
import { ApplicantEquipmentEntity } from "../../../models/applicant/applicant-equipment.entity";
import { ApplicantEntity } from "../../../models/applicant/applicant.entity";
import ApplicantApi from "../../../pages/api/applicant";
import { globalAjaxExceptionHandler } from "../../../utils/ajax";
import { focusOnErrorField } from "../../../utils/form-error";
import { useEffectAsync } from "../../../utils/react";
import { formFailed, formSuccess } from "../../../utils/toast";
import ViewCard from "../../view-details/view-card";
import BaseInput from "../base-input";
import BaseSelect from "../base-select";
import { BaseFormProps } from "./base-form-props";

export interface ApplicantEquipmentOwnFormProps extends BaseFormProps<ApplicantEntity> {
    isSubmitting: boolean;
    setIsSubmitting(value: boolean): void;
}

export function ApplicantEquipmentOwnForm(props: ApplicantEquipmentOwnFormProps) {
    let { className, entity, setEntity, isSubmitting, setIsSubmitting } = props;

    const { t } = useTranslation();

    const applicantApi = new ApplicantApi();

    const form = useFormik({
        initialValues: new ApplicantEntity(),
        validationSchema: ApplicantEntity.yupSchemaApplicantEquipmentForm(),
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
                setEntity(values);
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
        if (!!entity?.id) {
            form.setValues(
                {
                    ...entity
                });
        } else {
            await form.setValues(
                {
                    ...new ApplicantEntity(),
                    type: ApplicantType.COMPANY,
                });
        }
    }, [entity]);


    useEffect(() => focusOnErrorField(form), [form.submitCount]);

    // Keep a ref to always have the latest form instance
    const formRef = useRef(form);
    formRef.current = form;

    // Register getter function that returns CURRENT form values when called
    useEffect(() => {
        if (typeof window !== 'undefined') {
            // Register validation function
            (window as any).__applicantFormValidation = (window as any).__applicantFormValidation || {};
            (window as any).__applicantFormValidation['equipment-owned'] = () => {
                // Return current validation errors from formik
                return formRef.current.errors;
            };

            (window as any).__applicantFormRegistry = (window as any).__applicantFormRegistry || {};
            (window as any).__applicantFormRegistry['equipment-owned'] = () => {
                console.log('EquipmentOwnedForm getter called, equipment_owned count:', formRef.current.values.equipment_owned?.length);

                // Only return equipment_owned if the applicant is an owner operator
                if (formRef.current.values.is_owner_operator) {
                    return {
                        equipment_owned: formRef.current.values.equipment_owned || [],
                    };
                }

                // If not owner operator, return empty equipment_owned
                return {
                    equipment_owned: [],
                };
            };
        }

        // Cleanup function to prevent memory leaks
        return () => {
            if (typeof window !== 'undefined') {
                delete (window as any).__applicantFormValidation?.['equipment-owned'];
                delete (window as any).__applicantFormRegistry?.['equipment-owned'];
            }
        };
    }, []);

    return (
        <Form
            onSubmit={form.handleSubmit}
            className={className}
        >
            <Row>
                <Col md="12" className="p-2 mt-2">
                    {form.values?.is_owner_operator && (
                        <ViewCard
                            title="EQUIPMENT_OWNED"
                            actions={
                                <Button
                                    disabled={Boolean(entity?.is_hired)}
                                    size="sm"
                                    onClick={() =>
                                        form.setValues({
                                            ...form.values,
                                            equipment_owned: [
                                                ...form.values?.equipment_owned,
                                                new ApplicantEquipmentEntity(),
                                            ],
                                        })
                                    }
                                >
                                    <PlusCircle className="me-2" /> {t("ADD")}
                                </Button>
                            }
                        >
                            {form.values?.equipment_owned?.length > 0 && (
                                <>
                                    <Row className="d-sm-none d-md-flex">
                                        <Col md="3">
                                            <strong>{t("TYPE")}</strong>
                                            <span className="p-0 text-danger">*</span>
                                        </Col>
                                        <Col md="2">
                                            <strong>{t("MAKE")}</strong>
                                        </Col>
                                        <Col md="2">
                                            <strong>{t("MODEL")}</strong>
                                        </Col>
                                        <Col md="1">
                                            <strong>{t("YEAR")}</strong>
                                        </Col>
                                        <Col md="3">
                                            <strong>{t("EQUIPMENT_IMAGE_URL")}</strong>
                                        </Col>
                                    </Row>
                                    {form.values?.equipment_owned?.map((entity, i) => (
                                        <Row key={i}>
                                            <Col xs="12" className="d-sm-flex d-md-none">
                                                <Col>
                                                    <strong>{t("TYPE")}</strong>
                                                </Col>
                                            </Col>
                                            <Col xs="12" md="3">
                                                <BaseSelect
                                                    readOnly={Boolean(props?.entity?.is_hired)}
                                                    name={`equipment_owned[${i}].type`}
                                                    placeholder="TYPE"
                                                    labelPrefix="JobEquipmentType"
                                                    enumType={JobEquipmentType}
                                                    formik={form}
                                                />
                                            </Col>
                                            <Col xs="11" md="2">
                                                <BaseInput
                                                    readOnly={Boolean(props?.entity?.is_hired)}
                                                    name={`equipment_owned[${i}].make`}
                                                    placeholder="MAKE"
                                                    formik={form}
                                                />
                                            </Col>
                                            <Col xs="11" md="2">
                                                <BaseInput
                                                    readOnly={Boolean(props?.entity?.is_hired)}
                                                    name={`equipment_owned[${i}].model`}
                                                    placeholder="MODEL"
                                                    formik={form}
                                                />
                                            </Col>
                                            <Col xs="11" md="1">
                                                <BaseInput
                                                    readOnly={Boolean(props?.entity?.is_hired)}
                                                    name={`equipment_owned[${i}].year`}
                                                    placeholder="YEAR"
                                                    type="int"
                                                    min="1900"
                                                    max="2100"
                                                    formik={form}
                                                />
                                            </Col>
                                            <Col xs="11" md="3">
                                                <BaseInput
                                                    readOnly={Boolean(props?.entity?.is_hired)}
                                                    name={`equipment_owned[${i}].image_url`}
                                                    placeholder="EQUIPMENT_IMAGE_URL"
                                                    type="url"
                                                    formik={form}
                                                />
                                            </Col>
                                            <Col xs="1">
                                                <a
                                                    href="#"
                                                    onClick={() =>
                                                        form.setValues({
                                                            ...form.values,
                                                            equipment_owned:
                                                                form.values?.equipment_owned?.filter(
                                                                    (v, idx) => i != idx
                                                                ),
                                                        })
                                                    }
                                                >
                                                    <DashCircle color="red" />
                                                </a>
                                            </Col>
                                            {entity.type == JobEquipmentType.OTHER && (
                                                <Col xs="11" className="mt-3">
                                                    <BaseInput
                                                        readOnly={Boolean(props?.entity?.is_hired)}
                                                        name={`equipment_owned[${i}].type_other`}
                                                        placeholder="TYPE"
                                                        formik={form}
                                                        required
                                                    />
                                                </Col>
                                            )}
                                            {entity.image_url && (
                                                <Col xs="12" className="mt-2 mb-2">
                                                    <img
                                                        src={entity.image_url}
                                                        alt={t("EQUIPMENT_IMAGE")}
                                                        style={{ maxWidth: '200px', maxHeight: '200px', objectFit: 'contain' }}
                                                        onError={(e) => {
                                                            (e.target as HTMLImageElement).style.display = 'none';
                                                        }}
                                                    />
                                                </Col>
                                            )}
                                            <Col xs="12">
                                                <hr />
                                            </Col>
                                        </Row>
                                    ))}
                                </>
                            )}
                            <div style={{ display: "flex", justifyContent: "right" }}>
                                <Button disabled={form.isSubmitting || isSubmitting} type="submit" className="theme-secondary-btn">
                                    {t("UPDATE")}
                                </Button>
                            </div>
                        </ViewCard>
                    )}

                </Col>

            </Row>
        </Form>
    );
}
