import React, { useState } from 'react'
import * as yup from 'yup'
import{Button,Col,Row} from "react-bootstrap"
import BaseSelect from '../../BaseSelect'
import { useFormik } from 'formik'
import { useTranslation } from '../../../../hooks/useTranslation';

export interface SixthPageProps{
    onNextClick: (any) => void;
    onBackClick: () => void;
}


 
export function SixthPage(props: SixthPageProps){
    const {t} = useTranslation();
    const form = useFormik({
        initialValues:{
            options: null,
        },
        validationSchema: yup.object({
            options: yup.string().required().nullable(),
        }),
        onSubmit: (values) =>{
            props.onNextClick(values);
        },
        onReset: (values) =>{
            props.onBackClick();
        }
    })
    return (
        <>
            <form
                onSubmit={form.handleSubmit}
                onReset={form.handleReset}>
            
            <Row>
                <BaseSelect
                    className='mt-3 mb-3'
                    options={["Referral","Friends","Job Board","Social Media"]}
                    name="options"
                    placeholder="Click to choose"
                    label='How did you hear about us'
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
                    <Button className="float-left"
                    type="submit">
                        {t("CONTINUE APPLICATION")}
                    </Button>
                </Col>
            </Row>
            </form>
        </>
    )
}
