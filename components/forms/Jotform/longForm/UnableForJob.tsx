import { useFormik } from 'formik';
import React, { useEffect } from 'react'
import { Button, Col, Row, Form } from 'react-bootstrap'
import { useTranslation } from '../../../../hooks/use-translation'
import * as yup from "yup";
import BaseTextArea from '../../base-text-area';
import BaseCheck from '../../base-check';
import styles from "../../../../styles/JotForm.module.css";


export interface UnableForJobProps{
    onNextClick: (any) => void;
    onBackClick: () => void;
    applicant: any;
}

export function UnableForJob(props: UnableForJobProps){
    useEffect(() => {
        if (props.applicant && !form.dirty) form.setValues(props.applicant);
      }, [props.applicant]);
    const{ t } = useTranslation();
    const form = useFormik({
        initialValues: {
            unable_declaration: false,
            explanations: null
        },
        validationSchema: yup.object({
            explanations: yup
            .string()
            .when("unable_declaration", {
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
                        name="unable_declaration"
                        label="Is there any reason you might be unable
                         to perform the functions of the job for which 
                         you have applied (as described in the job description)?"
                        formik={form}
                    />
            </Row>   
            {form.values.unable_declaration ? (
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
