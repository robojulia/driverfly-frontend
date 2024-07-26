import { useFormik } from "formik";
import { useEffect } from "react";
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
import ViewCard from "../../view-details/view-card";
import BaseInput from "../base-input";
import BaseSelect from "../base-select";
import { BaseFormProps } from "./base-form-props";

export interface ApplicantEquipmentExperienceFormProps extends BaseFormProps<ApplicantEntity> {
    isSubmitting: boolean;
    setIsSubmitting(value: boolean): void;
}

export function ApplicantEquipmentExperienceForm(props: ApplicantEquipmentExperienceFormProps) {
    let { className, entity, setEntity, isSubmitting, setIsSubmitting } = props;

    const { t } = useTranslation();

    const applicantApi = new ApplicantApi();

    const form = useFormik({
        initialValues: new ApplicantEntity(),
        validationSchema: ApplicantEntity.yupSchemaApplicantExperienceForm(),
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
                <Col md="12" className="p-2 mt-2">
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
