import { useFormik } from "formik";
import React, { useContext, useEffect } from "react";
import { Button, Col, Row, Form } from "react-bootstrap";
import { useTranslation } from "../../../../hooks/use-translation";
import BaseCheck from "../../base-check";
import BaseInput from "../../base-input";
import styles from "../../../../styles/jotform.module.css";
import { AccidentLastFiveYearsDto } from "../../../../models/jot-form/long-form/accident-last-5-years.dto";
import { PageProps } from "../../../../types/jotform/page-props.type";
import jotformContext from "../../../../context/jotform-context";
import { DashCircle, PlusCircle } from "react-bootstrap-icons";
import { AccidentHistoryEntity } from "../../../../models/jot-form/long-form/accident-last-5-years/index.dto";
import { ApplicantExtras } from "../../../../enums/applicants/applicant-extras.enum";
import { ApplicantExtrasEntity } from "../../../../models/applicant/applicant-extras.entity";

export interface AccidentsLast5YearsProps extends PageProps { }

export function AccidentsLast5Years({
    onNextClick,
    onBackClick,
}: AccidentsLast5YearsProps) {
    const {
        state: {
            applicant,
            applicantExtras,
            steps
        },
        method: {
            setApplicant,
            updateApplicantExtras,
            setSteps
        }
    } = useContext(jotformContext);

    // useEffect(() => {
    //   const { email, phone, zip_code, options } = applicant;
    //   form.setValues({
    //     email: email || null,
    //     phone: phone || null,
    //     zip_code: zip_code || null,
    //     options: options || null,
    //   });
    // }, [applicant]);
    const { t } = useTranslation();
    const form = useFormik({
        initialValues: new AccidentLastFiveYearsDto(),
        validationSchema: AccidentLastFiveYearsDto.yupSchema(),
        onSubmit: (values) => {
            setSteps(steps + 1)
        },
        onReset: (values) => {
            setSteps(steps - 1)
        },
    });

    useEffect(() => {
        console.log("form.values", form.values);
        console.log("form.errors", form.errors);

    }, [form.values, form.errors])

    useEffect(() => {
        const apx = applicantExtras?.find(v => (v.type === ApplicantExtras.ACCIDENT_DETAILS))
        form.setValues({
            ...form.values,
            ACCIDENT_DETAILS: !!apx?.type ?
                apx : new ApplicantExtrasEntity(ApplicantExtras.ACCIDENT_DETAILS)
        })
    }, [applicantExtras]);

    return (
        <Form onSubmit={form.handleSubmit} onReset={form.handleReset}>
            <h6>{t("MORE_ABOUT_ACCIDENTS")}</h6>
            <Row>
                <Col>
                    <BaseInput
                        className="col-6 mt-3"
                        name="accidents_within_last_5_years"
                        label="accidents_last_5_years"
                        placeholder="PLACEHOLDER_FOR_DIGITS"
                        formik={form}
                    />
                </Col>
                <div className="mt-4 float-left d-flex justify-left pl-4">
                    <Button
                        size="sm"
                        onClick={() =>
                            form.setValues({
                                ...form.values,
                                ACCIDENT_DETAILS: {
                                    ...(form.values.ACCIDENT_DETAILS || []),
                                    value: [
                                        ...(form.values.ACCIDENT_DETAILS?.value || []),
                                        new AccidentHistoryEntity()
                                    ]
                                }
                            })
                        }
                    >
                        <PlusCircle /> {t("TITLE_ADD_ACCIDENT_DETAILS")}
                    </Button>
                </div>
            </Row>

            {form.values.ACCIDENT_DETAILS?.value?.length > 0 && (
                <>
                    {form.values.ACCIDENT_DETAILS.value.map((entity, i) => (
                        <Row key={i}>
                            <div className="col-md-12 mt-2">
                                <Row>
                                    <Col>
                                        <BaseInput
                                            className="col-12 mt-3"
                                            name={`ACCIDENT_DETAILS.value[${i}].date_of_accident`}
                                            label="DATE"
                                            type="date"
                                            formik={form}
                                        />
                                    </Col>
                                    <Col>
                                        <BaseInput
                                            className="col-12 mt-3"
                                            name={`ACCIDENT_DETAILS.value[${i}].nature_of_accident`}
                                            label="LABEL_ACCIDENT_NATURE"
                                            formik={form}
                                        />
                                    </Col>
                                    <Col>
                                        <BaseInput
                                            className="col-12 mt-3"
                                            name={`ACCIDENT_DETAILS.value[${i}].location_of_accident`}
                                            label="LABEL_ACCIDENT_LOCATION"
                                            formik={form}
                                        />
                                    </Col>
                                    <Col>
                                        <BaseInput
                                            className="col-12 mt-3"
                                            name={`ACCIDENT_DETAILS.value[${i}].number_of_fatalaties`}
                                            label="LABEL_ACCIDENT_FATALITIES"
                                            formik={form}
                                        />
                                    </Col>
                                    <Col>
                                        <BaseInput
                                            className="col-12 mt-3"
                                            name={`ACCIDENT_DETAILS.value[${i}].number_of_accident`}
                                            label="LABEL_ACCIDENT_INJURED"
                                            formik={form}
                                        />
                                    </Col>
                                    <Col className={styles.align__text_left}>
                                        <BaseCheck
                                            className="col-12 mt-3"
                                            name={`ACCIDENT_DETAILS.value[${i}].dot_recordable`}
                                            label="LABEL_ACCIDENT_DOT"
                                            formik={form}
                                        />

                                        <BaseCheck
                                            className="col-12 mt-3"
                                            name={`ACCIDENT_DETAILS.value[${i}].at_fault`}
                                            label="LABEL_ACCIDENT_FAULT"
                                            formik={form}
                                        />
                                    </Col>
                                    <Col>
                                        <a
                                            href="#"
                                            onClick={() =>
                                                form.setValues({
                                                    ...form.values,
                                                    ACCIDENT_DETAILS: {
                                                        ...(form.values.ACCIDENT_DETAILS || []),
                                                        value: form.values.ACCIDENT_DETAILS?.value?.filter((v, idx) => i != idx)
                                                    }
                                                })
                                            }
                                        >
                                            <DashCircle color="red" />
                                        </a>
                                    </Col>
                                </Row>
                            </div>
                        </Row>
                    ))
                    }
                </>
            )}
            <Row className="mt-5">
                <Col>
                    <Button className="float-right" type="reset">
                        {t("BACK")}
                    </Button>
                </Col>
                <Col>
                    <Button className="float-left" type="submit">
                        {t("NEXT")}
                    </Button>
                </Col>
            </Row>
        </Form >
    );
}
