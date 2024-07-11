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
import { ApplicantExperienceEntity } from "../../../models/applicant/applicant-experience.entity";
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

export interface ApplicantFormProps extends BaseFormProps<ApplicantEntity> { }

export function ApplicantEquipmentExperienceForm(props: any) {
    let { className, entity, onSaveComplete, onSaveError } = props?.props;

    const { t } = useTranslation();

    const applicantApi = new ApplicantApi();

    const form = useFormik({
        initialValues: new ApplicantEntity(),
        validationSchema: ApplicantEntity.yupSchemaApplicantExperienceForm(),
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
                <Col md="6" className="p-2 mt-2">
                    <ViewCard
                        title="equipment_experience"
                        actions={
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
                                <PlusCircle /> {t("ADD")}
                            </Button>
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
                    </ViewCard>
                    <Button disabled={form.isSubmitting} type="submit" className="theme-secondary-btn">
                        {t("UPDATE")}
                    </Button>
                </Col>
                <Col md="6" className="p-2 mt-2">
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

                        </ViewCard>
                    )}

                </Col>

            </Row>
        </Form>
    );
}
