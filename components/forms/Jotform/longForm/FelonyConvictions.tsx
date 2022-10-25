import { useFormik } from 'formik';
import React from 'react'
import { Button, Col, Row, Form } from 'react-bootstrap'
import { useTranslation } from '../../../../hooks/useTranslation'
import * as yup from "yup";
import BaseTextArea from '../../BaseTextArea';
import BaseCheck from '../../BaseCheck';
import styles from "../../../../styles/JotForm.module.css";

export interface FelonyConvictionProps{
    onNextClick: (any) => void;
    onBackClick: () => void;
}

export function FelonyConviction(props: FelonyConvictionProps){
    const{ t } = useTranslation();
    const form = useFormik({
        initialValues: {
            felony_declaration: false,
            explanations: null
        },
        validationSchema: yup.object({
            explanations: yup
            .string()
            .when("felony_declaration", {
                is: (v) => !!v,
                then: yup.string().required().nullable(),
                otherwise: yup.string().optional().nullable()
            })
        }),
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
