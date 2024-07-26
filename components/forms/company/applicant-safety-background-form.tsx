import { useFormik } from "formik";
import { useEffect, useState } from "react";
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
import ApplicantApi from "../../../pages/api/applicant";
import { globalAjaxExceptionHandler } from "../../../utils/ajax";
import { focusOnErrorField } from "../../../utils/form-error";
import { useEffectAsync } from "../../../utils/react";
import { formFailed, formSuccess } from "../../../utils/toast";
import ViewCard from "../../view-details/view-card";
import BaseCheck from "../base-check";
import BaseInput from "../base-input";
import BaseTextArea from "../base-text-area";
import { BaseFormProps } from "./base-form-props";

export interface ApplicantSafetyBackgroundFormProps extends BaseFormProps<ApplicantEntity> {
    isSubmitting: boolean;
    setIsSubmitting(value: boolean): void;
}

export function ApplicantSafetyBackgroundForm(props: ApplicantSafetyBackgroundFormProps) {
    let { className, entity, setEntity, isSubmitting, setIsSubmitting } = props;
    const { t } = useTranslation();

    const applicantApi = new ApplicantApi();
    const [hasCriminalHistory, setHasCriminalHistory] = useState<boolean>();

    const form = useFormik({
        initialValues: new ApplicantEntity(),
        validationSchema: ApplicantEntity.yupSchemaForApplicantSafetyBackgroundForm(),
        onSubmit: async (values) => {
            setIsSubmitting(true)
            try {
                if (entity?.id) {
                    values = await applicantApi.update(entity.id, {
                        ...values,
                    });
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
            setHasCriminalHistory(!!entity.criminal_history)
            form.setValues(
                {
                    ...entity,
                });
        } else {
            await form.setValues(
                {
                    ...new ApplicantEntity(),
                    type: ApplicantType.COMPANY
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
                    <ViewCard title="SAFETY_BACKGROUND">
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
                                        <ViewCard
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
                                                    <PlusCircle /> {t("ADD")}
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
                                        </ViewCard>
                                    </Col>
                                )}
                                <BaseCheck
                                    className="col-12 mt-2"
                                    disabled={Boolean(entity?.is_hired)}
                                    label="criminal_history_last_3_years"
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
                                        label="DETAILS"
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
                                        <ViewCard
                                            title="ACCIDENT_DEAILS"
                                            actions={
                                                !entity?.is_hired &&
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
                                                        <PlusCircle /> {t("ADD")}
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
                                                            <Button
                                                                className="rounded-lg"
                                                                variant="outline-danger close_btn w-25 mx-auto my-2"
                                                                onClick={() =>
                                                                    form.setFieldValue(
                                                                        "accident_history", [...form.values?.accident_history?.filter((ex, indx) => indx !== i)]
                                                                    )
                                                                }
                                                            >
                                                                <DashCircle />
                                                            </Button>
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

                                {/* Violation sectiion */}
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
                                                !entity?.is_hired &&
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
                                                        <PlusCircle /> {t("ADD")}
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
                                                            <Button
                                                                className="rounded-lg"
                                                                variant="outline-danger close_btn w-25 mx-auto my-2"
                                                                onClick={() =>
                                                                    form.setFieldValue(
                                                                        "moving_violation_history", [...form.values?.moving_violation_history?.filter((ex, indx) => indx !== i)]
                                                                    )
                                                                }
                                                            >
                                                                <DashCircle />
                                                            </Button>
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
                            </Col>
                            <Col md="6">
                                <Row>
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
                                            name="`	`"
                                            formik={form}
                                        />
                                    )}
                                    <BaseCheck
                                        className="col-12 mt-2"
                                        disabled={Boolean(entity?.is_hired)}
                                        label="has_had_psp_violations"
                                        name="psp_violations"
                                        formik={form}
                                    />
                                    {form.values?.psp_violations && (
                                        <BaseTextArea
                                            className="col-12 mt-2"
                                            readOnly={Boolean(entity?.is_hired)}
                                            label="details"
                                            name="psp_violations_details"
                                            formik={form}
                                        />
                                    )}
                                    <BaseCheck
                                        className="col-12 mt-2"
                                        disabled={Boolean(entity?.is_hired)}
                                        label="has_had_tickets_last_5_years"
                                        name="tickets"
                                        formik={form}
                                    />
                                    {form.values?.tickets && (
                                        <BaseTextArea
                                            className="col-12 mt-2"
                                            readOnly={Boolean(entity?.is_hired)}
                                            label="details"
                                            name="tickets_details"
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
