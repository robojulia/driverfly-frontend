import { useFormik } from "formik";
import { useEffect, useState, useRef } from "react";
import { Button, Col, Form, Row, Table } from "react-bootstrap";
import {
    DashCircle,
    PlusCircle
} from "react-bootstrap-icons";
import { toast } from "react-toastify";

import { ApplicantType } from "../../../enums/applicants/applicant-type.enum";
import { useTranslation } from "../../../hooks/use-translation";
import { ApplicantAccidentEntity } from "../../../models/applicant/applicant-accidentr.entity";
import { ApplicantMovingViolationEntity } from "../../../models/applicant/applicant-moving-violation.entity";
import { ApplicantEntity } from "../../../models/applicant/applicant.entity";
import { ApplicantExtras } from "../../../enums/applicants/applicant-extras.enum";
import { ApplicantExtrasEntity } from "../../../models/applicant";
import ApplicantApi from "../../../pages/api/applicant";
import { globalAjaxExceptionHandler } from "../../../utils/ajax";
import { focusOnErrorField } from "../../../utils/form-error";
import { useEffectAsync } from "../../../utils/react";
import { formFailed, formSuccess } from "../../../utils/toast";
import Section from "../../view-details/section";
import ViewCard from "../../view-details/view-card";
import BaseCheck from "../base-check";
import BaseInput from "../base-input";
import BaseTextArea from "../base-text-area";
import { BaseFormProps } from "./base-form-props";
import { JobCapability } from "./job-capability";

export interface ApplicantSafetyBackgroundFormProps extends BaseFormProps<ApplicantEntity> {
    isSubmitting: boolean;
    setIsSubmitting(value: boolean): void;
    hideActions?: boolean;
}

export function ApplicantSafetyBackgroundForm(props: ApplicantSafetyBackgroundFormProps) {
    let { className, entity, setEntity, isSubmitting, setIsSubmitting } = props;
    const { t } = useTranslation();

    const applicantApi = new ApplicantApi();
    const [hasCriminalHistory, setHasCriminalHistory] = useState<boolean>();
    const [initialized, setInitialized] = useState(false);
    const [canPerformJob, setCanPerformJob] = useState<boolean>(true);
    const [jobLimitationIndex, setJobLimitationIndex] = useState<number>(-1);

    const form = useFormik({
        initialValues: new ApplicantEntity(),
        enableReinitialize: false,
        validationSchema: ApplicantEntity.yupSchemaForApplicantSafetyBackgroundForm(),
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
                if (
                    !globalAjaxExceptionHandler(e, { formik: form, t: t, toast: toast })
                )
                    formFailed(t, entity?.id ? "update" : "create", "APPLICANT");
            }
        },
    });

    useEffectAsync(async () => {
        //Only initialize form once to prevent overwriting user changes
        if (initialized && entity?.id) return;

        if (!!entity?.id) {
            setHasCriminalHistory(!!entity.criminal_history)

            // Initialize job capability extras if not present
            let extras: ApplicantExtrasEntity[] = entity?.extras || [];
            const jobCapabilityExtra = extras?.find((v) => v.type == ApplicantExtras.REASON_FOR_UNABLE_TO_PERFORM_JOB);
            if (!jobCapabilityExtra) {
                extras = [...extras];
            }

            form.resetForm({
                values: {
                    ...entity,
                    extras,
                }
            });
            setInitialized(true);
        } else {
            await form.resetForm({
                values: {
                    ...new ApplicantEntity(),
                    type: ApplicantType.COMPANY
                }
            });
        }

    }, [entity?.id, initialized]);

    // Keep a ref to always have the latest form instance
    const formRef = useRef(form);
    formRef.current = form;

    // Register getter function that returns CURRENT form values when called
    useEffect(() => {
        if (typeof window !== 'undefined') {
            // Register validation function
            (window as any).__applicantFormValidation = (window as any).__applicantFormValidation || {};
            (window as any).__applicantFormValidation['safety'] = () => {
                // Return current validation errors from formik
                return formRef.current.errors;
            };

            // Register dirty state function
            (window as any).__applicantFormDirty = (window as any).__applicantFormDirty || {};
            (window as any).__applicantFormDirty['safety'] = () => {
                return formRef.current.dirty;
            };

            // Register reset dirty function
            (window as any).__applicantFormResetDirty = (window as any).__applicantFormResetDirty || {};
            (window as any).__applicantFormResetDirty['safety'] = () => {
                formRef.current.resetForm({ values: formRef.current.values });
            };

            (window as any).__applicantFormRegistry = (window as any).__applicantFormRegistry || {};
            (window as any).__applicantFormRegistry['safety'] = () => {
                console.log('SafetyForm getter called');
                // Return ONLY safety-related fields including job capability extras
                return {
                    can_pass_drug_test: formRef.current.values.can_pass_drug_test,
                    has_past_dui: formRef.current.values.has_past_dui,
                    criminal_history: formRef.current.values.criminal_history,
                    accident_history: formRef.current.values.accident_history,
                    moving_violation_history: formRef.current.values.moving_violation_history,
                    vehicles: formRef.current.values.vehicles,
                    extras: formRef.current.values.extras?.filter((e: any) =>
                        e.type === ApplicantExtras.REASON_FOR_UNABLE_TO_PERFORM_JOB
                    ) || [],
                };
            };
        }

        // Cleanup function to prevent memory leaks
        return () => {
            if (typeof window !== 'undefined') {
                delete (window as any).__applicantFormValidation?.['safety'];
                delete (window as any).__applicantFormDirty?.['safety'];
                delete (window as any).__applicantFormResetDirty?.['safety'];
                delete (window as any).__applicantFormRegistry?.['safety'];
            }
        };
    }, []);

    useEffect(() => focusOnErrorField(form), [form.submitCount])

    useEffect(() => {
        //console.log("Applicant safety Form values", form.values)
        //console.log("Applicant safety Form errors", form.errors)
    }, [form.errors, form.values])

    // Handler for job capability change
    const handleCanPerformJobChange = (canPerform: boolean) => {
        setCanPerformJob(canPerform);
        const extrasArray = [...(form.values?.extras || [])];
        const currentExtraIndex = form.values?.extras?.findIndex((v) => v.type === ApplicantExtras.REASON_FOR_UNABLE_TO_PERFORM_JOB);

        if (canPerform) {
            if (currentExtraIndex !== -1) {
                const filteredExtras = extrasArray.filter((_, index) => index !== currentExtraIndex);
                form.setFieldValue("extras", filteredExtras);
                setJobLimitationIndex(-1);
            }
        } else {
            if (currentExtraIndex !== -1) {
                setJobLimitationIndex(currentExtraIndex);
            } else {
                const newExtra = new ApplicantExtrasEntity(ApplicantExtras.REASON_FOR_UNABLE_TO_PERFORM_JOB);
                extrasArray.push(newExtra);
                form.setFieldValue("extras", extrasArray);
                setJobLimitationIndex(extrasArray.length - 1);
            }
        }
    };

    // Initialize job capability state from extras
    useEffect(() => {
        const extraIndex = form.values?.extras?.findIndex((v) => v.type === ApplicantExtras.REASON_FOR_UNABLE_TO_PERFORM_JOB);
        setJobLimitationIndex(extraIndex !== undefined ? extraIndex : -1);
        // Only set to false if there's an actual limitation value (not just the extra exists)
        const hasLimitation = extraIndex !== -1 && form.values?.extras?.[extraIndex]?.value;
        // Default to true (can perform job) unless there's a specific limitation
        setCanPerformJob(!hasLimitation);
    }, [form.values?.extras])

    return (
        <Form
            onSubmit={form.handleSubmit}
            className={className}
            data-applicant-edit-form
        >
            <Row>
                <Col md="12" className="p-0 px-lg-2">
                    <div className="df-modern-section">
                    <Section title="SAFETY_BACKGROUND">
                        <Row>
                            <Col md="6">
                                <BaseCheck
                                    className="col-12 mt-2"
                                    disabled={Boolean(entity?.is_hired)}
                                    label="CAN_PASS_DRUG_TEST"
                                    name="can_pass_drug_test"
                                    formik={form}
                                />
                                <BaseCheck
                                    className="col-12 mt-2"
                                    disabled={Boolean(entity?.is_hired)}
                                    label="HAS_DUIS"
                                    name="has_past_dui"
                                    formik={form}
                                />
                                {form.values?.has_past_dui && (
                                    <Col xs="12" className="mt-2">
                                        <Section
                                            title="PAST_DUIS"
                                            actions={
                                                <Button
                                                    disabled={Boolean(entity?.is_hired)}
                                                    size="sm"
                                                    onClick={() =>
                                                        form.setValues({
                                                            ...form.values,
                                                            dui_years: [...(form.values?.dui_years || []), ""],
                                                        })
                                                    }
                                                >
                                                    <PlusCircle className="me-2" /> {t("ADD")}
                                                </Button>
                                            }
                                        >
                                            {form.values?.dui_years?.length > 0 && (
                                                <Table striped>
                                                    <thead>
                                                        <tr>
                                                            <th colSpan={2}>{t("YEAR")}</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {form.values?.dui_years?.map((entity, i) => (
                                                            <tr key={i}>
                                                                <td className="w-100">
                                                                    <BaseInput
                                                                        name={`dui_years[${i}]`}
                                                                        readOnly={Boolean(props?.entity?.is_hired)}
                                                                        placeholder="ENTER_PAST_DUIS"
                                                                        type="int"
                                                                        required
                                                                        min={1900}
                                                                        max="9999"
                                                                        // max={new Date().getFullYear()}
                                                                        onChange={({ target: { value } }) => {
                                                                            if (!/^\d{0,4}$/.test(value)) value = value.slice(0, 4);

                                                                            form.setFieldValue(`dui_years[${i}]`, value)
                                                                        }}
                                                                        formik={form}
                                                                    />
                                                                </td>
                                                                <td>
                                                                    <a
                                                                        href="#"
                                                                        onClick={() =>
                                                                            form.setValues({
                                                                                ...form.values,
                                                                                dui_years: form.values?.dui_years?.filter(
                                                                                    (v, idx) => i != idx
                                                                                ),
                                                                            })
                                                                        }
                                                                    >
                                                                        <DashCircle color="red" />
                                                                    </a>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </Table>
                                            )}
                                        </Section>
                                    </Col>
                                )}
                                <BaseCheck
                                    className="col-12 mt-2"
                                    disabled={Boolean(entity?.is_hired)}
                                    label="FELONY_MISDEMANOR_CONVICTIONS"
                                    checked={hasCriminalHistory}
                                    onChange={({ target: { value } }) => {
                                        setHasCriminalHistory(!!value);
                                        if (!value) {
                                            form.setFieldValue("criminal_history", null);
                                        }
                                    }}
                                />
                                {hasCriminalHistory &&
                                    <BaseTextArea
                                        className="col-12 mt-2"
                                        readOnly={Boolean(entity?.is_hired)}
                                        label="PAST_CONVICTION"
                                        name="criminal_history"
                                        formik={form}
                                    />
                                }

                                {/* Accident sectiion */}
                                <BaseInput
                                    className="col-12 mt-2"
                                    readOnly={Boolean(entity?.is_hired)}
                                    label="accidents_last_5_years"
                                    name="accident_count"
                                    type="int"
                                    min="0"
                                    formik={form}
                                    placeholder="ENTER_NO_OF_ACCIDENTS"
                                />
                                {form.values.accident_count > 0 && (
                                    <div className="col-12 mt-2">
                                        <Section
                                            title="ACCIDENT_DEAILS"
                                            actions={
                                                !props?.hideActions && !entity?.is_hired &&
                                                form?.values?.accident_count > 0 &&
                                                form?.values?.accident_count >
                                                (
                                                    form.values.accident_history || []
                                                )?.length && (
                                                    <Button
                                                        className="w-100 py-2"
                                                        size="sm"
                                                        onClick={() => {
                                                            form.setValues({
                                                                ...form.values,
                                                                accident_history: [
                                                                    ...(form.values?.accident_history || []), { ...new ApplicantAccidentEntity() }
                                                                ],
                                                            });
                                                        }}
                                                    >
                                                        <PlusCircle className="me-2" /> {t("ADD")}
                                                    </Button>
                                                )
                                            }
                                        >
                                            <BaseTextArea
                                                // className="col-12 mt-2"
                                                readOnly={Boolean(entity?.is_hired)}
                                                label="accident_details"
                                                name="accident_details"
                                                formik={form}
                                            />
                                            {form.values?.accident_history?.map((accident_details_ex, i) => (
                                                <Row className="pl-0 single-past-employer-items my-1" key={i}>
                                                    <div className="col-md-12 mt-2">
                                                        <Row className={""}>
                                                            <BaseInput
                                                                className="col-md-6 my-3"
                                                                name={`accident_history[${i}].date_of_accident`}
                                                                label="DATE"
                                                                type="date"
                                                                formik={form}
                                                                required
                                                                max={new Date().toISOString().split("T")[0]}
                                                            />
                                                            <BaseInput
                                                                className="col-md-6 my-3"
                                                                name={`accident_history[${i}].nature_of_accident`}
                                                                label="LABEL_ACCIDENT_NATURE"
                                                                formik={form}
                                                                required
                                                            />
                                                            <BaseInput
                                                                className="col-md-6 my-3"
                                                                name={`accident_history[${i}].location_of_accident`}
                                                                label="LABEL_ACCIDENT_LOCATION"
                                                                formik={form}
                                                                required
                                                            />
                                                            <BaseInput
                                                                className="col-md-6 my-3"
                                                                name={`accident_history[${i}].number_of_fatalaties`}
                                                                label="LABEL_ACCIDENT_FATALITIES"
                                                                formik={form}
                                                                required
                                                            />
                                                            <BaseInput
                                                                className="col-md-6 mt-2"
                                                                name={`accident_history[${i}].number_of_injured`}
                                                                label="LABEL_ACCIDENT_INJURED"
                                                                formik={form}
                                                                required
                                                            />
                                                            <BaseCheck
                                                                className="col-md-6 mt-5"
                                                                name={`accident_history[${i}].dot_recordable`}
                                                                label="LABEL_ACCIDENT_DOT"
                                                                formik={form}
                                                            />

                                                            <BaseCheck
                                                                className="col-md-12 mt-4"
                                                                name={`accident_history[${i}].at_fault`}
                                                                label="LABEL_ACCIDENT_FAULT"
                                                                formik={form}
                                                            />
                                                            <div className="text-center">
                                                                <a
                                                                    href="#"
                                                                    onClick={() =>
                                                                        form.setFieldValue(
                                                                            "accident_history", [...form.values?.accident_history?.filter((ex, indx) => indx !== i)]
                                                                        )
                                                                    }
                                                                >
                                                                    <DashCircle color="red" />
                                                                </a>
                                                            </div>
                                                            <div
                                                                className="Row"
                                                                style={{
                                                                    height: "1px",
                                                                    borderBottom: "solid 1px #8d8c8c",
                                                                    marginTop: "15px",
                                                                    width: "80%",
                                                                    marginLeft: "10%",
                                                                }}
                                                            ></div>
                                                        </Row>
                                                    </div>
                                                </Row>
                                            ))}
                                        </Section>
                                    </div>
                                )}

                                {/* Moving Violation sectiion */}
                                <BaseInput
                                    className="col my-3"
                                    readOnly={Boolean(entity?.is_hired)}
                                    label="voilations_in_last_3_years"
                                    name="moving_violations_count"
                                    type="number"
                                    step={1}
                                    min={0}
                                    placeholder="ENTER_NO_OF_VIOLATIONS"
                                    formik={form}
                                />
                                {form.values.moving_violations_count > 0 && (
                                    <div className="col-12 mt-2">
                                        <ViewCard
                                            title="VIOLATION_DETAILS"
                                            actions={
                                                !props?.hideActions && !entity?.is_hired &&
                                                form?.values?.moving_violations_count > 0 &&
                                                form?.values?.moving_violations_count >
                                                (
                                                    form.values.moving_violation_history || []
                                                )?.length && (
                                                    <Button
                                                        className="w-100 py-2"
                                                        size="sm"
                                                        onClick={() => {
                                                            form.setValues({
                                                                ...form.values,
                                                                moving_violation_history: [
                                                                    ...(form.values?.moving_violation_history || []), { ...new ApplicantMovingViolationEntity() }
                                                                ],
                                                            });
                                                        }}
                                                    >
                                                        <PlusCircle className="me-2" /> {t("ADD")}
                                                    </Button>
                                                )
                                            }
                                        >
                                            <BaseTextArea
                                                readOnly={Boolean(entity?.is_hired)}
                                                label="VIOLATION_DETAILS"
                                                name="moving_violations_details"
                                                formik={form}
                                            />
                                            {form.values?.moving_violation_history?.map((entity, i) => (
                                                <Row key={i} className="single-past-employer-items my-3 ">
                                                    <div className="col-md-12 mt-2">
                                                        <Row className={""}>
                                                            <BaseInput
                                                                className="col-md-6 mt-3"
                                                                name={`moving_violation_history[${i}].date_of_violation`}
                                                                label="VIOLATION_DATE"
                                                                type="date"
                                                                formik={form}
                                                                max={new Date().toISOString().split("T")[0]}
                                                                required
                                                            />
                                                            <BaseInput
                                                                className="col-md-6 mt-3"
                                                                name={`moving_violation_history[${i}].location`}
                                                                label="location"
                                                                formik={form}
                                                                required
                                                            />

                                                            <BaseInput
                                                                className="col-md-6 mt-3"
                                                                name={`moving_violation_history[${i}].charge`}
                                                                label="CHARGE"
                                                                formik={form}
                                                                required
                                                            />
                                                            <BaseInput
                                                                className="col-md-6 mt-3"
                                                                name={`moving_violation_history[${i}].penalty`}
                                                                label="PENALTY"
                                                                formik={form}
                                                                required
                                                            />
                                                            <div className="text-center">
                                                                <a
                                                                    href="#"
                                                                    onClick={() =>
                                                                        form.setFieldValue(
                                                                            "moving_violation_history", [...form.values?.moving_violation_history?.filter((ex, indx) => indx !== i)]
                                                                        )
                                                                    }
                                                                >
                                                                    <DashCircle color="red" />
                                                                </a>
                                                            </div>
                                                            <div
                                                                className="Row"
                                                                style={{
                                                                    height: "1px",
                                                                    borderBottom: "solid 1px #8d8c8c",
                                                                    marginTop: "15px",
                                                                    width: "80%",
                                                                    marginLeft: "10%",
                                                                }}
                                                            ></div>
                                                        </Row>
                                                    </div>
                                                </Row>
                                            ))}
                                        </ViewCard>
                                    </div>
                                )}

                                {/* All Violation sectiion */}
                                <BaseInput
                                    className="col my-3"
                                    readOnly={Boolean(entity?.is_hired)}
                                    label="ALL_VIOLATION_IN_LAST_3_YEARS"
                                    name="all_violations_count"
                                    type="number"
                                    step={1}
                                    min={0}
                                    placeholder="ENTER_NO_OF_VIOLATIONS"
                                    formik={form}
                                />
                                {form.values.all_violations_count > 0 && (
                                    <div className="col-12 mt-2">
                                        <Section title="VIOLATION_DETAILS">
                                            <BaseTextArea
                                                readOnly={Boolean(entity?.is_hired)}
                                                label="VIOLATION_DETAILS"
                                                name="all_violations_details"
                                                formik={form}
                                            />
                                        </Section>
                                    </div>
                                )}
                            </Col>
                            <Col md="6">
                                <Row>
                                    {/* Job Capability Component */}
                                    <JobCapability
                                        canPerformJob={canPerformJob}
                                        onCanPerformJobChange={handleCanPerformJobChange}
                                        reasonIndex={jobLimitationIndex}
                                        formik={form}
                                        disabled={Boolean(entity?.is_hired)}
                                    />
                                    <BaseCheck
                                        className="col-12 mt-2"
                                        disabled={Boolean(entity?.is_hired)}
                                        label="has_had_license_revoked"
                                        name="license_revoked"
                                        formik={form}
                                    />
                                    {form.values?.license_revoked && (
                                        <BaseTextArea
                                            className="col-12 mt-2"
                                            readOnly={Boolean(entity?.is_hired)}
                                            label="details"
                                            name="license_revoked_details"
                                            required
                                            formik={form}
                                        />
                                    )}
                                    <BaseCheck
                                        className="col-12 mt-2"
                                        disabled={Boolean(entity?.is_hired)}
                                        label="has_had_positive_drug_test"
                                        name="positive_drug_test"
                                        formik={form}
                                    />
                                    {form.values?.positive_drug_test && (
                                        <BaseTextArea
                                            className="col-12 mt-2"
                                            readOnly={Boolean(entity?.is_hired)}
                                            label="details"
                                            name="positive_drug_test_details"
                                            formik={form}
                                        />
                                    )}
                                </Row>
                            </Col>
                        </Row>
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
