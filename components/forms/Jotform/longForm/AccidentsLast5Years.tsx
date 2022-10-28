import { useFormik } from 'formik';
import React, { useEffect } from 'react'
import { Button, Col, Row, Form } from 'react-bootstrap'
import { useTranslation } from '../../../../hooks/use-translation'
import * as yup from "yup";
import BaseCheck from '../../base-check';
import BaseInput from '../../base-input';
import styles from "../../../../styles/Jotform.module.css";
import { AccidentLastFiveYearsDto } from '../../../../models/jot-form/long-form/accident-last-5-years.dto';


export interface AccidentsLast5YearsProps {
    onNextClick: (any) => void;
    onBackClick: () => void;
    applicant: any;
}
export function AccidentsLast5Years(props: AccidentsLast5YearsProps) {
    useEffect(() => {
        if (props.applicant && !form.dirty) form.setValues(props.applicant);
      }, [props.applicant]);
    const { t } = useTranslation();
    const form = useFormik({
        initialValues: AccidentLastFiveYearsDto,
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
                Tell us more about your accidents(even if not at fault)
            </h6>
            <Row>
                <Col>
                    <BaseInput
                    className="col-6 mt-3"
                    name="accidents_within_last_5_years"
                    label="accidents_last_5_years"
                    placeholder="Enter number"
                    formik={ form }
                    />
                </Col>
            </Row>
            <Row>
                <Col>
                    <BaseInput
                        className = 'col-12 mt-3'
                        name='date_of_accident_1'
                        label="Date of Accident"
                        type="date"
                        formik={ form }
                    />
                </Col>
                <Col>
                    <BaseInput
                        className='col-12 mt-3'
                        name='nature_of_accident_1'
                        label="Nature of Accident"
                        formik={ form }
                    />
                </Col>
                <Col>
                    <BaseInput
                        className= 'col-12 mt-3'
                        name='location_of_accident_1'
                        label="Location of Accident"
                        formik={ form }
                    />
                </Col>
                <Col>
                    <BaseInput
                        className= 'col-12 mt-3'
                        name='number_of_fatalities_1'
                        label="Number of Fatalities"
                        formik={ form }
                    />
                </Col>
                <Col>
                    <BaseInput
                        className= 'col-12 mt-3'
                        name='number_of_injured_1'
                        label="Number of Injured"
                        formik={ form }
                    />
                </Col>
                <Col className={styles.align__text_left}>
                    <BaseCheck
                        className= 'col-12 mt-3'
                        name='dot_recordable_1'
                        label="DOT Recordable?"
                        formik={ form }
                    />
                
                    <BaseCheck
                        className= 'col-12 mt-3'
                        name='at_fault_1'
                        label="At Fault?"
                        formik={ form }
                    />
                </Col>
            </Row>
            <Row>
                <Col>
                    <BaseInput
                        className = 'col-12 mt-3'
                        name='date_of_accident_2'
                        label="Date of Accident"
                        type="date"
                        formik={ form }
                    />
                </Col>
                <Col>
                    <BaseInput
                        className='col-12 mt-3'
                        name='nature_of_accident_2'
                        label="Nature of Accident"
                        formik={ form }
                    />
                </Col>
                <Col>
                    <BaseInput
                        className= 'col-12 mt-3'
                        name='location_of_accident_2'
                        label="Location of Accident"
                        formik={ form }
                    />
                </Col>
                <Col>
                    <BaseInput
                        className= 'col-12 mt-3'
                        name='number_of_fatalities_2'
                        label="Number of Fatalities"
                        formik={ form }
                    />
                </Col>
                <Col>
                    <BaseInput
                        className= 'col-12 mt-3'
                        name='number_of_injured_2'
                        label="Number of Injured"
                        formik={ form }
                    />
                </Col>
                <Col className={styles.align__text_left}>
                    <BaseCheck
                        className= 'col-12 mt-3'
                        name='dot_recordable_2'
                        label="DOT Recordable?"
                        formik={ form }
                    />
                
                    <BaseCheck
                        className= 'col-12 mt-3'
                        name='at_fault_2'
                        label="At Fault?"
                        formik={ form }
                    />
                </Col>
            </Row>
            <Row>
                <Col>
                    <BaseInput
                        className = 'col-12 mt-3'
                        name='date_of_accident_3'
                        label="Date of Accident"
                        type="date"
                        formik={ form }
                    />
                </Col>
                <Col>
                    <BaseInput
                        className='col-12 mt-3'
                        name='nature_of_accident_3'
                        label="Nature of Accident"
                        formik={ form }
                    />
                </Col>
                <Col>
                    <BaseInput
                        className= 'col-12 mt-3'
                        name='location_of_accident_3'
                        label="Location of Accident"
                        formik={ form }
                    />
                </Col>
                <Col>
                    <BaseInput
                        className= 'col-12 mt-3'
                        name='number_of_fatalities_3'
                        label="Number of Fatalities"
                        formik={ form }
                    />
                </Col>
                <Col>
                    <BaseInput
                        className= 'col-12 mt-3'
                        name='number_of_injured_3'
                        label="Number of Injured"
                        formik={ form }
                    />
                </Col>
                <Col className={styles.align__text_left}>
                    <BaseCheck
                        className= 'col-12 mt-3'
                        name='dot_recordable_3'
                        label="DOT Recordable?"
                        formik={ form }
                    />
                
                    <BaseCheck
                        className= 'col-12 mt-3'
                        name='at_fault_3'
                        label="At Fault?"
                        formik={ form }
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