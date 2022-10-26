import { useFormik } from 'formik';
import React from 'react'
import { Button, Col, Row, Form } from 'react-bootstrap'
import { useTranslation } from '../../../../hooks/use-translation'
import * as yup from "yup";
import BaseTextArea from '../../base-text-area';
import BaseCheck from '../../base-check';
import styles from "../../../../styles/JotForm.module.css";
import { FelonyConvictionDto } from '../../../../models/jot-form/long-form/felony-conviction.dto';

export interface FelonyConvictionProps{
    onNextClick: (any) => void;
    onBackClick: () => void;
}

export function FelonyConviction(props: FelonyConvictionProps){
    const{ t } = useTranslation();
    const form = useFormik({
        initialValues: new FelonyConvictionDto(),
        validationSchema: FelonyConvictionDto.yupSchema(),
        onSubmit: (values) => {
            props.onNextClick(values);
        },
        onReset: (values) => {
            props.onBackClick();
        }
    })

    return(
        <Form onSubmit={ form.handleSubmit }
            onReset={ form.handleReset }>
             <Row className={ styles.paragraph__left }>
                <BaseCheck
                        className="float-left col-6"
                        name="felony_declaration"
                        label="Have you ever been convicted of a felony?"
                        formik={form}
                    />
            </Row>   
            {form.values.felony_declaration ? (
                <Row className={styles.align__text_left}>
                    <BaseTextArea
                        className='float-left mt-3'
                        name="explanations"
                        label="Please explain past suspensions/revocations/denials:"
                        formik={ form }
                    />
                </Row>
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
