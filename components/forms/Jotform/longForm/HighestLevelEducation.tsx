import React, { useState } from 'react'
import Form from 'react-bootstrap/Form'
import styles from "../../../../styles/Jotform.module.css"
import * as yup from 'yup'
import{Button,Col,Row} from "react-bootstrap"
import BaseInput from '../../BaseInput'
import BaseInputPhone from '../../BaseInputPhone'
import BaseSelect from '../../BaseSelect'
import { useFormik } from 'formik'
import { useTranslation } from '../../../../hooks/useTranslation'
import { Radio } from '@mui/material'

export interface HighestLevelEducationProps{
    onNextClick: (any) => void;
    onBackClick: () => void;
}


 
export function HighestLevelEducation(props: HighestLevelEducationProps){
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
            <Form
                onSubmit={form.handleSubmit}
                onReset={form.handleReset}>
            
            <Row>
                <BaseSelect
                    className='col-6'
                    required
                    options={["N/A","Some Schooling","GED","High School Diploma",
                "Bachelors","Masters"]}
                    name="options"
                    placeholder="Click to choose"
                    label='Highest Level of Education'
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
                    {t("NEXT")}
                    </Button>
                </Col>
            </Row>
            </Form>
        </>
    )
}
