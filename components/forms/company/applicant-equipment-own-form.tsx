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
            // This form doesn't submit directly - it's submitted via the global save button
            // The global registry handler below provides the values when needed
            console.log('Equipment form values ready for global save:', values.equipment_owned);
        },
    });

    useEffectAsync(async () => {
        if (!!entity?.id) {
            form.resetForm({
                values: {
                    ...entity
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

            // Register dirty state function
            (window as any).__applicantFormDirty = (window as any).__applicantFormDirty || {};
            (window as any).__applicantFormDirty['equipment-owned'] = () => {
                return formRef.current.dirty;
            };

            // Register reset dirty function
            (window as any).__applicantFormResetDirty = (window as any).__applicantFormResetDirty || {};
            (window as any).__applicantFormResetDirty['equipment-owned'] = () => {
                formRef.current.resetForm({ values: formRef.current.values });
            };

            (window as any).__applicantFormRegistry = (window as any).__applicantFormRegistry || {};
            (window as any).__applicantFormRegistry['equipment-owned'] = () => {
                console.log('🔧 EquipmentOwnedForm getter called');
                console.log('  - is_owner_operator:', formRef.current.values.is_owner_operator);
                console.log('  - equipment_owned count:', formRef.current.values.equipment_owned?.length);
                console.log('  - equipment_owned data:', formRef.current.values.equipment_owned);

                // Only return equipment_owned if the applicant is an owner operator
                if (formRef.current.values.is_owner_operator) {
                    const data = {
                        equipment_owned: formRef.current.values.equipment_owned || [],
                    };
                    console.log('  - Returning equipment_owned:', data);
                    return data;
                }

                // If not owner operator, return empty equipment_owned
                console.log('  - Not owner operator, returning empty array');
                return {
                    equipment_owned: [],
                };
            };
        }

        // Cleanup function to prevent memory leaks
        return () => {
            if (typeof window !== 'undefined') {
                delete (window as any).__applicantFormValidation?.['equipment-owned'];
                delete (window as any).__applicantFormDirty?.['equipment-owned'];
                delete (window as any).__applicantFormResetDirty?.['equipment-owned'];
                delete (window as any).__applicantFormRegistry?.['equipment-owned'];
            }
        };
    }, []);

    return (
        <Form
            onSubmit={form.handleSubmit}
            className={className}
            data-form-id="equipment-owned"
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
                                        <Col md="2">
                                            <strong>{t("TYPE")}</strong>
                                            <span className="p-0 text-danger">*</span>
                                        </Col>
                                        <Col md="1">
                                            <strong>{t("QUANTITY")}</strong>
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
                                            <strong>{t("EQUIPMENT_IMAGE")}</strong>
                                        </Col>
                                    </Row>
                                    {form.values?.equipment_owned?.map((entity, i) => (
                                        <Row key={i}>
                                            <Col xs="12" className="d-sm-flex d-md-none">
                                                <Col>
                                                    <strong>{t("TYPE")}</strong>
                                                </Col>
                                            </Col>
                                            <Col xs="12" md="2">
                                                <BaseSelect
                                                    readOnly={Boolean(props?.entity?.is_hired)}
                                                    name={`equipment_owned[${i}].type`}
                                                    placeholder="TYPE"
                                                    labelPrefix="JobEquipmentType"
                                                    enumType={JobEquipmentType}
                                                    formik={form}
                                                />
                                            </Col>
                                            <Col xs="11" md="1">
                                                <BaseInput
                                                    readOnly={Boolean(props?.entity?.is_hired)}
                                                    name={`equipment_owned[${i}].quantity`}
                                                    placeholder="QUANTITY"
                                                    type="int"
                                                    min="1"
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
                                                <Form.Group>
                                                    {!entity.image_url && (
                                                        <Form.Control
                                                            type="file"
                                                            accept="image/*"
                                                            disabled={Boolean(props?.entity?.is_hired)}
                                                            onChange={async (e: React.ChangeEvent<HTMLInputElement>) => {
                                                                const file = e.target.files?.[0];
                                                                if (file) {
                                                                    // Validate file size (max 2MB)
                                                                    const maxSize = 2 * 1024 * 1024; // 2MB
                                                                    if (file.size > maxSize) {
                                                                        toast.error(t('FILE_MUST_BE_OF_{size}_{unit}', { size: 2, unit: 'MB' }));
                                                                        e.target.value = '';
                                                                        return;
                                                                    }

                                                                    // Read and compress image
                                                                    const reader = new FileReader();
                                                                    reader.onloadend = () => {
                                                                        const img = new Image();
                                                                        img.onload = () => {
                                                                            // Create canvas to resize image
                                                                            const canvas = document.createElement('canvas');
                                                                            const MAX_WIDTH = 800;
                                                                            const MAX_HEIGHT = 600;
                                                                            let width = img.width;
                                                                            let height = img.height;

                                                                            if (width > height) {
                                                                                if (width > MAX_WIDTH) {
                                                                                    height *= MAX_WIDTH / width;
                                                                                    width = MAX_WIDTH;
                                                                                }
                                                                            } else {
                                                                                if (height > MAX_HEIGHT) {
                                                                                    width *= MAX_HEIGHT / height;
                                                                                    height = MAX_HEIGHT;
                                                                                }
                                                                            }

                                                                            canvas.width = width;
                                                                            canvas.height = height;
                                                                            const ctx = canvas.getContext('2d');
                                                                            ctx?.drawImage(img, 0, 0, width, height);

                                                                            // Convert to base64 with compression
                                                                            const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
                                                                            form.setFieldValue(`equipment_owned[${i}].image_url`, compressedBase64);
                                                                        };
                                                                        img.src = reader.result as string;
                                                                    };
                                                                    reader.readAsDataURL(file);
                                                                }
                                                            }}
                                                        />
                                                    )}
                                                    {entity.image_url && (
                                                        <div className="d-flex gap-2">
                                                            <Button
                                                                variant="danger"
                                                                size="sm"
                                                                onClick={() => form.setFieldValue(`equipment_owned[${i}].image_url`, null)}
                                                            >
                                                                {t("REMOVE")} {t("IMAGE")}
                                                            </Button>
                                                        </div>
                                                    )}
                                                    <small className="text-muted">Upload equipment image - Max 2MB (Optional)</small>
                                                </Form.Group>
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
                        </ViewCard>
                    )}

                </Col>

            </Row>
        </Form>
    );
}
