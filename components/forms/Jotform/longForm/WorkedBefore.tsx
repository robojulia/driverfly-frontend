import { useFormik } from 'formik';
import React from 'react'
import { Button, Col, Row, Form } from 'react-bootstrap'
import { useTranslation } from '../../../../hooks/useTranslation'
import * as yup from "yup";
import BaseCheck from '../../BaseCheck';
import BaseInput from '../../BaseInput';

export interface WorkedBeforeProps {
    onNextClick: (any) => void;
    onBackClick: () => void;
}
export function WorkedBefore(props: WorkedBeforeProps) {
    const { t } = useTranslation();
    const form = useFormik({
        initialValues: {
            applied_before: false,
            worked_before: false,
            from_date: null,
            to_date: null

        },
        validationSchema: yup.object({
            worked_before:yup
            .boolean()
            .when("applied_before", {
                is: (v) => !!v,
                then:yup.boolean().required().nullable(),
                otherwise: yup.boolean().optional().nullable(),
            }),
            from_date:yup
            .date()
            .when("worked_before",{
                is: (v) => !!v,
                then: yup.date().required().nullable(),
                otherwise: yup.date().optional().nullable(),
            }),
            to_date:yup
            .date()
            .when("worked_before",{
                is: (v) => !!v,
                then: yup.date().required().nullable(),
                otherwise: yup.date().optional().nullable(),
            })
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
            <Row>
                <Col>
                    <BaseCheck
                        className="float-left col-6"
                        name="applied_before"
                        label="Have you applied to this company before?"
                        formik={form}
                    />
                </Col>
            </Row>
            {form.values.applied_before ? (
                <>
                    <Row>
                        <Col>
                            <BaseCheck
                                className="mt-3 col-6 float-left"
                                name="worked_before"
                                label="Have you worked with this company before?"
                                formik={form}
                            />
                        </Col>
                    </Row>
                    {form.values.worked_before ? (
                        <>
                            <Row>
                                <Col>
                                    <BaseInput
                                        className='col-6 mt-3'
                                        required
                                        type="date"
                                        name='from_date'
                                        placeholder="DATE"
                                        label="From"
                                        formik={ form }
                                    /> 
                                </Col>
                                <Col>
                                    <BaseInput
                                        className='col-6 mt-3'
                                        required
                                        type="date"
                                        name='to_date'
                                        placeholder="DATE"
                                        label="To"
                                        formik={ form }
                                    /> 
                                </Col>
                            </Row>
                        </>
                    ) : null}
                </>
            ) : null}
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