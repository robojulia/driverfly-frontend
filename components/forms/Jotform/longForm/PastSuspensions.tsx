import { useFormik } from 'formik';
import React from 'react'
import { Button, Col, Row, Form } from 'react-bootstrap'
import { useTranslation } from '../../../../hooks/use-translation'
import * as yup from "yup";
import BaseTextArea from '../../base-text-area';
import BaseCheck from '../../base-check';
import styles from "../../../../styles/JotForm.module.css";

export interface PastSuspensionsProps{
    onNextClick: (values?: any) => void;
    onBackClick: () => void;
}

export function PastSuspensions(props: PastSuspensionsProps){
    const{ t } = useTranslation();
    const form = useFormik({
        initialValues: {
            license_suspension: false,
            explanations: null
        },
        validationSchema: yup.object({
            explanations: yup
            .string()
            .when("license_suspension", {
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
    });


    return(
        <Form onSubmit={ form.handleSubmit }
            onReset={ form.handleReset }>
             <Row className={ styles.paragraph__left }>
                <BaseCheck
                        className="float-left col-6"
                        name="license_suspension"
                        label="Have any of your license, permit or privileges to operate a CMV ever been suspended,
                         revoked, or denied for any reason?"
                        formik={form}
                    />
            </Row>   
            {form.values.license_suspension ? (
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
