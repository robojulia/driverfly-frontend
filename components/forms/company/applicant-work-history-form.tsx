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

import { ApplicantType } from "../../../enums/applicants/applicant-type.enum";
import { useTranslation } from "../../../hooks/use-translation";
import { ApplicantEmployerEntity } from "../../../models/applicant/applicant-employer.entity";
import { ApplicantEntity } from "../../../models/applicant/applicant.entity";
import ApplicantApi from "../../../pages/api/applicant";
import { globalAjaxExceptionHandler } from "../../../utils/ajax";
import { focusOnErrorField } from "../../../utils/form-error";
import { useEffectAsync } from "../../../utils/react";
import { formFailed, formSuccess } from "../../../utils/toast";
import OverlyPopover from "../../popover/overly-popover";
import ViewCard from "../../view-details/view-card";
import BaseCheck from "../base-check";
import BaseInput from "../base-input";
import BaseInputPhone from "../base-input-phone";
import StateSelect from "../state-select";
import { BaseFormProps } from "./base-form-props";

export interface ApplicantWorkHistoryFormProps extends BaseFormProps<ApplicantEntity> {
    isSubmitting: boolean;
    setIsSubmitting(value: boolean): void;
}

export function ApplicantWorkHistoryForm(props: ApplicantWorkHistoryFormProps) {
    let { className, entity, setEntity, isSubmitting, setIsSubmitting, onSaveComplete } = props;
    const { t } = useTranslation();


    const applicantApi = new ApplicantApi();

    const [curentCompanyCheck, setCurentCompanyCheck] = useState<ApplicantEmployerEntity>();
    const [sendVoeEmailsHistory, setSendVoeEmailsHistory] = useState<string[]>([])

    const form = useFormik({
        initialValues: new ApplicantEntity(),
        validationSchema: ApplicantEntity.yupSchemaForApplicantWorkHistory(),
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
                if (onSaveComplete) onSaveComplete(form?.values)
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



    const currentCompanyCheckBox = (employerId) => {
        return curentCompanyCheck?.is_current ? (Boolean(employerId?.id !== curentCompanyCheck?.id)) : false
    }

    const handleSendBackgroundRequest = async (i: number) => {
        try {
            const res = await applicantApi.sendVoeRequest({
                applicant: entity,
                employer: form.values.employers[i]
            })
            setEntity(res)
            setSendVoeEmailsHistory([...sendVoeEmailsHistory, form?.values?.employers[i]?.email])
            toast.success(t("SUCCESSFULLY_SENT_VOE"))
        } catch (e) {
            globalAjaxExceptionHandler(e, { formik: form, t: t, toast: toast })
        }
    }

    useEffect(() => {
        const currentCompanyExists = form.values?.employers?.find((e) => e.is_current);
        setCurentCompanyCheck(currentCompanyExists)
    }, [form.values])

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
                                                <div style={{ display: 'flex', flexDirection: 'row', alignItems: "center" }}>
                                                    <span >
                                                        <b>{e.name || t("NEW_EMPLOYER")}</b>
                                                    </span>
                                                    <Button
                                                        disabled={Boolean(entity?.is_hired)}
                                                        type="button"
                                                        size="sm"
                                                        style={{ marginLeft: "10px" }}
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
                                                </div>

                                            </AccordionSummary>
                                            <AccordionDetails>
                                                <Row>
                                                    <BaseInput
                                                        readOnly={Boolean(entity?.is_hired)}
                                                        className="col-12 mt-2"
                                                        name={`employers[${i}].name`}
                                                        label="COMPANY_NAME"
                                                        required
                                                        placeholder="ENTER_COMPANY_NAME"
                                                        formik={form}
                                                    />
                                                    <BaseInput
                                                        className="col-12 mt-2"
                                                        readOnly={Boolean(entity?.is_hired)}
                                                        name={`employers[${i}].title`}
                                                        label="TITLE"
                                                        placeholder="ENTER_JOB_TITLE"
                                                        formik={form}
                                                    />
                                                    <BaseInput
                                                        className="col-12 mt-2"
                                                        name={`employers[${i}].manager_name`}
                                                        label="MANAGER_OR_REPRESENTATIVE"
                                                        placeholder="ENTER_MANAGER"
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
                                                        ((curentCompanyCheck?.id != form.values?.employers[i]?.id) || !form.values?.employers[i]?.is_current) ? <BaseInput
                                                            className="col-6 mt-2"
                                                            readOnly={Boolean(entity?.is_hired)}
                                                            name={`employers[${i}].end_at`}
                                                            label="THROUGH"
                                                            type="date"
                                                            formik={form}
                                                        />
                                                            : (<div className="col-6 "></div>)
                                                    }
                                                    <BaseInput
                                                        className="col-md-6 mt-2"
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

                                                    <BaseInput
                                                        className="col-5 mt-2"
                                                        readOnly={Boolean(entity?.is_hired)}
                                                        name={`employers[${i}].city`}
                                                        label="CITY"
                                                        placeholder="ENTER_CITY"
                                                        formik={form}
                                                    />
                                                    <StateSelect
                                                        className="col-4 mt-2"
                                                        readOnly={Boolean(entity?.is_hired)}
                                                        name={`employers[${i}].state`}
                                                        label="STATE"
                                                        placeholder="SELECT_STATE"
                                                        formik={form}
                                                    />
                                                    <BaseInput
                                                        className="col-3 mt-2"
                                                        readOnly={Boolean(entity?.is_hired)}
                                                        name={`employers[${i}].zip_code`}
                                                        label="ZIP_CODE"
                                                        placeholder="ENTER_ZIP_CODE"
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
                                                    <div style={{ display: "flex", justifyContent: "right" }}>
                                                        {form?.isSubmitting || isSubmitting || form?.values?.employers[i]?.email === '' || form?.values?.employers[i]?.email === null || form?.values?.employers[i]?.email == entity?.employers[i]?.email || sendVoeEmailsHistory.join(",").includes(form?.values?.employers[i]?.email) || !form?.values?.employers[i]?.can_contact || !form?.values?.employers[i]?.is_subject_to_fmcsrs ?
                                                            (<>
                                                                {form?.values?.employers[i]?.email === '' || form?.values?.employers[i]?.email === null || !form?.values?.employers[i]?.can_contact || !form?.values?.employers[i]?.is_subject_to_fmcsrs ? (
                                                                    <>
                                                                        <OverlyPopover
                                                                            str={`${t("PLEASE")} ${form?.values?.employers[i]?.email === '' ? t("PROVIDE_EMAIL_ADDRESS") : ""} 
                                                                            ${!form?.values?.employers[i]?.can_contact ? form?.values?.employers[i]?.email === '' ? `, ${t("TOGGLE_ON_YOU_CONTACT")}` : t("TOGGLE_ON_YOU_CONTACT") : ""}
                                                                            ${!form?.values?.employers[i]?.is_subject_to_fmcsrs ? form?.values?.employers[i]?.email === '' || !form?.values?.employers[i]?.can_contact ? `, ${t("TOGGLE_ON_FMCSRs")}` : t("TOGGLE_ON_FMCSRs") : ""} ${t("FOR_PAST_EMPLOYER")}`}>
                                                                            <Button className="theme-secondary-btn"
                                                                                disabled={true} >
                                                                                {t("SEND_BACKGROUND_REQUEST")}
                                                                            </Button>
                                                                        </OverlyPopover>
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        {form?.values?.employers[i]?.email == entity?.employers[i]?.email ? (
                                                                            <OverlyPopover
                                                                                str={t("EMAIL_NOT_CHANGED")}>
                                                                                <Button className="theme-secondary-btn"
                                                                                    disabled={true} >
                                                                                    {t("SEND_BACKGROUND_REQUEST")}
                                                                                </Button>
                                                                            </OverlyPopover>
                                                                        ) : (
                                                                            <OverlyPopover
                                                                                str={t("REQUEST_ALREADY_MADE")}>
                                                                                <Button className="theme-secondary-btn"
                                                                                    disabled={true} >
                                                                                    {t("SEND_BACKGROUND_REQUEST")}
                                                                                </Button>
                                                                            </OverlyPopover>
                                                                        )}
                                                                    </>
                                                                )}
                                                            </>
                                                            ) :
                                                            (
                                                                <Button onClick={() => handleSendBackgroundRequest(i)} className="theme-secondary-btn">
                                                                    {t("SEND_BACKGROUND_REQUEST")}
                                                                </Button>
                                                            )}
                                                    </div>
                                                </Row>
                                            </AccordionDetails>
                                        </Accordion>
                                    );
                                })}
                            </>
                        )}

                        {!form.values?.employers?.length && <>{t("NONE")}</>}
                        <div style={{ display: "flex", justifyContent: "right" }}>
                            <Button disabled={form.isSubmitting || isSubmitting} style={{ marginTop: "3%" }} type="submit" className="theme-secondary-btn">
                                {t("UPDATE")}
                            </Button>
                        </div>
                    </ViewCard>
                </Col>
            </Row>
        </Form>
    );
}
