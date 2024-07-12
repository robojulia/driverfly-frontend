import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import {
    ChevronUp,
    PlusCircle,
    XCircle
} from "react-bootstrap-icons";
import { toast } from "react-toastify";

import { ApplicantDocumentType } from "../../../enums/applicants/applicant-document-type.enum";
import { ApplicantExtras } from "../../../enums/applicants/applicant-extras.enum";
import { ApplicantType } from "../../../enums/applicants/applicant-type.enum";
import { useAuth } from "../../../hooks/use-auth";
import { useTranslation } from "../../../hooks/use-translation";
import { ApplicantExtrasEntity } from "../../../models/applicant";
import { ApplicantEmployerEntity } from "../../../models/applicant/applicant-employer.entity";
import { ApplicantEntity } from "../../../models/applicant/applicant.entity";
import { JobEntity } from "../../../models/job/job.entity";
import ApplicantApi from "../../../pages/api/applicant";
import JobApi from "../../../pages/api/job";
import { globalAjaxExceptionHandler } from "../../../utils/ajax";
import { focusOnErrorField } from "../../../utils/form-error";
import { useEffectAsync } from "../../../utils/react";
import { formFailed, formSuccess } from "../../../utils/toast";
import ViewCard from "../../view-details/view-card";
import BaseCheck from "../base-check";
import BaseInput from "../base-input";
import BaseInputPhone from "../base-input-phone";
import StateSelect from "../state-select";
import { BaseFormProps } from "./base-form-props";

export interface ApplicantFormProps extends BaseFormProps<ApplicantEntity> { }

export function ApplicantWorkHistoryForm(props: any) {
    let { className, entity, onSaveComplete, onSaveError } = props?.props;
    let { user } = useAuth();
    const { t } = useTranslation();


    const applicantApi = new ApplicantApi();

    const [curentCompanyCheck, setCurentCompanyCheck] = useState<ApplicantEmployerEntity>();
    const [jobs, setJobs] = useState<JobEntity[]>([]);

    const form = useFormik({
        initialValues: new ApplicantEntity(),
        validationSchema: ApplicantEntity.yupSchemaForApplicantWorkHistory(),
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
        const api = new JobApi();
        const jobs = await api.list();
        setJobs(jobs);
    }, [user]);


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



    const currentCompanyCheckBox = (employerId) => {
        return curentCompanyCheck?.is_current ? (Boolean(employerId?.id !== curentCompanyCheck?.id)) : false
    }

    useEffect(() => {
        const currentCompanyExists = form.values?.employers?.find((e) => e.is_current);
        setCurentCompanyCheck(currentCompanyExists)
    }, [form.values])


    useEffect(() => {
        console.log("form.values history", form.values);
        console.log("form.errors", form.errors);
    }, [form.values, form.errors]);

    useEffect(() => focusOnErrorField(form), [form.submitCount])

    return (
        <Form
            onSubmit={form.handleSubmit}
            className={className}
        >
            <Row>
                <Col md="12" className="p-0 px-lg-2">
                    <ViewCard
                        title="WORK_HISTORY"
                        actions={
                            <Button
                                disabled={Boolean(entity?.is_hired)}
                                size="sm"
                                onClick={() =>
                                    form.setValues({
                                        ...form.values,
                                        employers: [
                                            new ApplicantEmployerEntity(),
                                            ...(form.values?.employers || []),
                                        ],
                                    })
                                }
                            >
                                <PlusCircle /> {t("ADD")}
                            </Button>
                        }
                    >
                        {form.values?.employers?.length > 0 && (
                            <>
                                {form.values?.employers?.map((e, i) => {
                                    const meta = form.getFieldMeta(`employers[${i}]`);
                                    const hasError = Object.keys(e || {}).some(
                                        (v) => form.getFieldMeta(`employers[${i}].${v}`).error
                                    );
                                    return (
                                        <Accordion
                                            key={i}
                                            defaultExpanded={i == 0 || !meta.touched || hasError}
                                            expanded={hasError || undefined}
                                        >
                                            <AccordionSummary expandIcon={<ChevronUp />}>
                                                <Button
                                                    disabled={Boolean(entity?.is_hired)}
                                                    type="button"
                                                    size="sm"
                                                    variant="danger"
                                                    onClick={(v) =>
                                                        form.setValues({
                                                            ...form.values,
                                                            employers: form.values?.employers?.filter(
                                                                (v, idx) => idx != i
                                                            ),
                                                        })
                                                    }
                                                >
                                                    <XCircle /> {t("REMOVE")}
                                                </Button>
                                                <span style={{ marginLeft: "10px" }}>
                                                    {e.name || t("NEW_EMPLOYER")}
                                                </span>
                                            </AccordionSummary>
                                            <AccordionDetails>
                                                <Row>
                                                    <BaseInput
                                                        readOnly={Boolean(entity?.is_hired)}
                                                        className="col-12 mt-2"
                                                        name={`employers[${i}].name`}
                                                        label="NAME"
                                                        required
                                                        placeholder="ENTER_COMPANY_NAME"
                                                        formik={form}
                                                    />
                                                    <BaseInput
                                                        className="col-12 mt-2"
                                                        readOnly={Boolean(entity?.is_hired)}
                                                        label="EMAIL"
                                                        type="email"
                                                        name={`employers[${i}].email`}
                                                        placeholder="ENTER_EMAIL"
                                                        formik={form}
                                                    />
                                                    <BaseInput
                                                        readOnly={Boolean(entity?.is_hired)}
                                                        className="col-6 mt-2"
                                                        name={`employers[${i}].start_at`}
                                                        label="DATES_EMPLOYED"
                                                        type="date"
                                                        max={new Date().toISOString().split("T")[0]}
                                                        formik={form}
                                                    />
                                                    {
                                                        ((curentCompanyCheck?.id != form.values?.employers[i]?.id) || !form.values?.employers[i]?.is_current) && <BaseInput
                                                            className="col-6 mt-2"
                                                            readOnly={Boolean(entity?.is_hired)}
                                                            required
                                                            name={`employers[${i}].end_at`}
                                                            label="THROUGH"
                                                            type="date"
                                                            formik={form}
                                                        />
                                                    }
                                                    <BaseInput
                                                        className="col-12 mt-2"
                                                        readOnly={Boolean(entity?.is_hired)}
                                                        name={`employers[${i}].title`}
                                                        label="TITLE"
                                                        placeholder="ENTER_JOB_TITLE"
                                                        formik={form}
                                                    />
                                                    <BaseInput
                                                        className="col-md-6 mt-2"
                                                        name={`employers[${i}].manager_name`}
                                                        required
                                                        label="MANAGER_OR_REPRESENTATIVE"
                                                        placeholder="ENTER_MANAGER"
                                                        formik={form}
                                                    />
                                                    <BaseInput
                                                        className="col-6 mt-2"
                                                        readOnly={Boolean(entity?.is_hired)}
                                                        name={`employers[${i}].city`}
                                                        label="CITY"
                                                        placeholder="ENTER_CITY"
                                                        formik={form}
                                                    />
                                                    <StateSelect
                                                        className="col-6 mt-2"
                                                        readOnly={Boolean(entity?.is_hired)}
                                                        name={`employers[${i}].state`}
                                                        label="STATE"
                                                        placeholder="SELECT_STATE"
                                                        formik={form}
                                                    />
                                                    <BaseInput
                                                        className="col-6 mt-2"
                                                        readOnly={Boolean(entity?.is_hired)}
                                                        name={`employers[${i}].zip_code`}
                                                        label="ZIP_CODE"
                                                        placeholder="ENTER_ZIP_CODE"
                                                        formik={form}
                                                    />
                                                    <BaseInput
                                                        className="col-md-6 mt-2"
                                                        required
                                                        name={`employers[${i}].address`}
                                                        placeholder="ENTER_ADDRESS_LINE1"
                                                        label="ADDRESS_LINE_1"
                                                        formik={form}
                                                    />
                                                    <BaseInput
                                                        className="col-md-6 mt-2"
                                                        name={`employers[${i}].address_2`}
                                                        placeholder="ENTER_ADDRESS_LINE2"
                                                        label="ADDRESS_LINE_2"
                                                        formik={form}
                                                    />
                                                    <BaseInputPhone
                                                        className="col-12 mt-2"
                                                        readOnly={Boolean(entity?.is_hired)}
                                                        name={`employers[${i}].phone`}
                                                        label="PHONE"
                                                        placeholder="ENTER_PHONE"
                                                        formik={form}
                                                    />
                                                    {
                                                        (!form.values.employers?.some(v => v.is_current) || form.values.employers?.indexOf(form.values.employers?.find(v => v.is_current)) == i) &&
                                                        <BaseCheck
                                                            className="col-12 mt-2"
                                                            disabled={currentCompanyCheckBox(form.values?.employers[i])}
                                                            name={`employers[${i}].is_current`}
                                                            label="CURRENT_COMPANY"
                                                            formik={form}
                                                        />
                                                    }
                                                    <BaseCheck
                                                        className="col-12 mt-2"
                                                        disabled={Boolean(entity?.is_hired)}
                                                        name={`employers[${i}].can_contact`}
                                                        label="MAY_CONTACT_COMPANY"
                                                        formik={form}
                                                    />
                                                    <BaseCheck
                                                        className="col-12 mt-2"
                                                        disabled={Boolean(entity?.is_hired)}
                                                        name={`employers[${i}].is_subject_to_fmcsrs`}
                                                        label="SUBJECT_TO_FMCSRS"
                                                        formik={form}
                                                    />
                                                    <BaseCheck
                                                        className="col-12 mt-2"
                                                        disabled={Boolean(entity?.is_hired)}
                                                        name={`employers[${i}].is_subject_to_drug_tests`}
                                                        label="JOB_DESIGNATED_AS_SATEFY_SENSITIVE"
                                                        formik={form}
                                                    />
                                                </Row>
                                            </AccordionDetails>
                                        </Accordion>
                                    );
                                })}
                            </>
                        )}

                        {!form.values?.employers?.length && <>{t("NONE")}</>}
                        <div style={{ display: "flex", justifyContent: "right" }}>
                            <Button disabled={form.isSubmitting} style={{ marginTop: "3%" }} type="submit" className="theme-secondary-btn">
                                {t("UPDATE")}
                            </Button>
                        </div>
                    </ViewCard>
                </Col>
            </Row>

        </Form>
    );
}
