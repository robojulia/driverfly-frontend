import { useFormik } from 'formik';
import React, { useEffect } from 'react'
import { Button, Col, Row, Form } from 'react-bootstrap'
import { useTranslation } from '../../../../hooks/use-translation'
import * as yup from "yup";
import BaseInput from '../../base-input';
import { PageProps } from '../../../../types/jotform/page-props.type';

export interface ViolationsLast3YearsProps extends PageProps {
    // onNextClick: (any) => void;
    // onBackClick: () => void;
    applicant: any;
}

export function ViolationsLast3Years(props: ViolationsLast3YearsProps) {
    useEffect(() => {
        if (props.applicant && !form.dirty) form.setValues(props.applicant);
    }, [props.applicant]);
    const { t } = useTranslation();
    const form = useFormik({
        initialValues: {
            violations_last_3_years: null,
            date_of_violation_1: null,
            location_1: null,
            charge_1: null,
            penalty_1: null,
            date_of_violation_2: null,
            location_2: null,
            charge_2: null,
            penalty_2: null,
            date_of_violation_3: null,
            location_3: null,
            charge_3: null,
            penalty_3: null

        },
        validationSchema: yup.object({
            // applied_before
            // from_date: yup.date().required(),
            // to_date: yup.date().required()
        }),
        onSubmit: (values) => {
            props.onNextClick(values);
        },
        onReset: (values) => {
            props.onBackClick();
        }
    })
    return (
        <Form onSubmit={form.handleSubmit}
            onReset={form.handleReset}>
            <h6>
                Tell us about any violations in the last 3 years.
            </h6>
            <Row>
                <Col>
                    <BaseInput
                        className="col-6 mt-3"
                        name="violations_last_3_years"
                        label="How many moving violations have you had in the past 3 years?"
                        formik={form}
                    />
                </Col>
            </Row>
            <Row>
                <Col>
                    <BaseInput
                        className='col-12 mt-3'
                        name='date_of_violation_1'
                        label="Date of Violation"
                        type="date"
                        formik={form}
                    />
                </Col>
                <Col>
                    <BaseInput
                        className='col-12 mt-3'
                        name='location_1'
                        label="Location"
                        formik={form}
                    />
                </Col>
                <Col>
                    <BaseInput
                        className='col-12 mt-3'
                        name='charge_1'
                        label="Charge"
                        formik={form}
                    />
                </Col>
                <Col>
                    <BaseInput
                        className='col-12 mt-3'
                        name='penalty_1'
                        label="Penalty"
                        formik={form}
                    />
                </Col>
            </Row>
            <Row>
                <Col>
                    <BaseInput
                        className='col-12 mt-3'
                        name='date_of_violation_2'
                        label="Date of Violation"
                        type="date"
                        formik={form}
                    />
                </Col>
                <Col>
                    <BaseInput
                        className='col-12 mt-3'
                        name='location_2'
                        label="Location"
                        formik={form}
                    />
                </Col>
                <Col>
                    <BaseInput
                        className='col-12 mt-3'
                        name='charge_2'
                        label="Charge"
                        formik={form}
                    />
                </Col>
                <Col>
                    <BaseInput
                        className='col-12 mt-3'
                        name='penalty_2'
                        label="Penalty"
                        formik={form}
                    />
                </Col>
            </Row>

            <Row>
                <Col>
                    <BaseInput
                        className='col-12 mt-3'
                        name='date_of_violation_3'
                        label="Date of Violation"
                        type="date"
                        formik={form}
                    />
                </Col>
                <Col>
                    <BaseInput
                        className='col-12 mt-3'
                        name='location_3'
                        label="Location"
                        formik={form}
                    />
                </Col>
                <Col>
                    <BaseInput
                        className='col-12 mt-3'
                        name='charge_3'
                        label="Charge"
                        formik={form}
                    />
                </Col>
                <Col>
                    <BaseInput
                        className='col-12 mt-3'
                        name='penalty_3'
                        label="Penalty"
                        formik={form}
                    />
                </Col>
            </Row>

            <Row className="mt-5">
                <Col>
                    <Button
                        className="float-right"
                        type="reset">
                        {t("BACK")}
                    </Button>
                </Col>
                <Col>
                    <Button
                        className="float-left"
                        type="submit">
                        {t("NEXT")}
                    </Button>
                </Col>
            </Row>

        </Form>
    )
}