import React, { useState } from 'react'
import Form from 'react-bootstrap/Form'
import styles from "../../../../styles/Jotform.module.css"
import * as yup from 'yup'
import { Button, Col, Row } from "react-bootstrap"
import BaseInput from '../../BaseInput'
import BaseInputPhone from '../../BaseInputPhone'
import BaseSelect from '../../BaseSelect'
import { useFormik } from 'formik'
import { useTranslation } from '../../../../hooks/useTranslation'


export interface ThirdPageProps {
    onNextClick: (any) => void;
    onBackClick: () => void;
}



export function ThirdPage(props: ThirdPageProps) {
    const { t } = useTranslation();
    // const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/
    const form = useFormik({
        initialValues: {
            email: null,
            phone: null,
            zip_code: null
        },
        validationSchema: yup.object({
            email: yup.string().email().required().nullable(),
            phone: yup.string().required().nullable(),
            zip_code: yup.string().required().nullable()
        }),
        onSubmit: (values) => {
            props.onNextClick(values);
        },
        onReset: (values) => {
            props.onBackClick();
        }
    })
    return (
        <>
            <Form className={styles.align__text_left}
                onSubmit={form.handleSubmit}
                onReset={form.handleReset}>
                <Row>
                    <BaseInput
                        className='col-6'
                        required
                        name='email'
                        label='E-mail'
                        placeholder='EMAIL'
                        formik={form}
                    />
                </Row>
                <Row className="mt-3">
                    <BaseInputPhone
                        className='col-6'
                        required
                        name='phone'
                        label='Phone Number'
                        placeholder='PHONE_NUMBER'
                        formik={form}
                    />
                </Row>
                <Row className="mt-3">
                    <BaseInput
                        className='col-6'
                        required
                        name='zip_code'
                        label='Zip Code'
                        placeholder='ZIP_CODE'
                        formik={form}
                    />
                </Row>
                <Row>
                    <BaseSelect
                        className='mt-3'
                        required
                        options={["Yes", "No"]}
                        name="options"
                        placeholder="Click to choose"
                        label='I authorize Nautilus Trucking and any applicable third parties associated with Nautilus Trucking the ability to send me SMS and email communications regarding job availabilities and other relevant resources.'
                        formik={form}
                    />
                </Row>
                <Row className="mt-3">
                    <Col>
                        <Button className="float-right"
                            type="reset">
                            {t("BACK")}
                        </Button>
                    </Col>

                    <Col>
                        <Button className="float-left theme-secondary-btn"
                            type="submit">
                            {t("NEXT")}
                        </Button>
                    </Col>
                </Row>
            </Form>
        </>
    )
}
