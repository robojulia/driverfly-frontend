import { useFormik } from "formik";
import { useEffect } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import {
    DashCircle,
    PlusCircle
} from "react-bootstrap-icons";
import { toast } from "react-toastify";

import { ApplicantDocumentType } from "../../../enums/applicants/applicant-document-type.enum";
import { ApplicantExtras } from "../../../enums/applicants/applicant-extras.enum";
import { ApplicantType } from "../../../enums/applicants/applicant-type.enum";
import { JobEquipmentType } from "../../../enums/jobs/job-equipment-type.enum";
import { useTranslation } from "../../../hooks/use-translation";
import { ApplicantExtrasEntity } from "../../../models/applicant";
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

export interface ApplicantEquipmentOwnFormProps extends BaseFormProps<ApplicantEntity> { }

export function ApplicantEquipmentOwnForm(props: ApplicantEquipmentOwnFormProps) {
    let { className, entity, setApplicant } = props;

    const { t } = useTranslation();

    const applicantApi = new ApplicantApi();

    const form = useFormik({
        initialValues: new ApplicantEntity(),
        validationSchema: ApplicantEntity.yupSchemaApplicantEquipmentForm(),
        onSubmit: async (values) => {
            values.extras = values.extras?.filter(
                (v) => v.value != undefined || v.value != null
            );
            try {
                if (entity?.id) {
                    values = await applicantApi.update(entity.id, {
                        ...values
                    })
                } else {

                    values = await applicantApi.create(values);
                }

                formSuccess(t, entity?.id ? "update" : "create", "APPLICANT");
                setApplicant(values);
            } catch (e) {
                console.error("Unable to save applicant info", e);
                if (
                    !globalAjaxExceptionHandler(e, { formik: form, t: t, toast: toast })
                )
                    formFailed(t, entity?.id ? "update" : "create", "APPLICANT");
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
                                    <PlusCircle /> {t("ADD")}
                                </Button>
                            }
                        >
                            {form.values?.equipment_owned?.length > 0 && (
                                <>
                                    <Row className="d-sm-none d-md-flex">
                                        <Col>
                                            <strong>{t("TYPE")}</strong>
                                            <span className="p-0 text-danger">*</span>
                                        </Col>
                                        <Col>
                                            <strong>{t("QUANTITY")}</strong>
                                            <span className="p-0 text-danger">*</span>
                                        </Col>
                                    </Row>
                                    {form.values?.equipment_owned?.map((entity, i) => (
                                        <Row key={i}>
                                            <Col xs="12" className="d-sm-flex d-md-none">
                                                <Col>
                                                    <strong>{t("TYPE")}</strong>
                                                </Col>
                                                <Col>
                                                    <strong>{t("QUANTITY")}</strong>
                                                </Col>
                                            </Col>
                                            <Col xs="6">
                                                <BaseSelect
                                                    readOnly={Boolean(props?.entity?.is_hired)}
                                                    name={`equipment_owned[${i}].type`}
                                                    placeholder="TYPE"
                                                    labelPrefix="JobEquipmentType"
                                                    enumType={JobEquipmentType}
                                                    formik={form}
                                                />
                                            </Col>
                                            <Col xs="5">
                                                <BaseInput
                                                    readOnly={Boolean(props?.entity?.is_hired)}
                                                    name={`equipment_owned[${i}].quantity`}
                                                    placeholder="QUANTITY"
                                                    type="int"
                                                    min="1"
                                                    required
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
                                            <Col xs="12">
                                                <hr />
                                            </Col>
                                        </Row>
                                    ))}
                                </>
                            )}
                            <div style={{ display: "flex", justifyContent: "right" }}>
                                <Button disabled={form.isSubmitting} type="submit" className="theme-secondary-btn">
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
