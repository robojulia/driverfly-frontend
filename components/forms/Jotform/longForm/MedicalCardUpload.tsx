import React from 'react';
import Form from 'react-bootstrap/Form';
import styles from "../../../../styles/Jotform.module.css";
import BaseInput from '../../BaseInput';
import { Button,Col,Row } from "react-bootstrap";
import { useFormik } from 'formik';
import { useTranslation } from '../../../../hooks/useTranslation';

export interface MedicalCardUploadprops{
    onNextClick: (any) => void;
    onBackClick: () => void;
}

export function MedicalCardUpload(props: MedicalCardUploadprops){
    const { t } = useTranslation();
    const form = useFormik({
        initialValues:{
            photo: null
        },
        onSubmit: (values) =>{
            props.onNextClick(values);
        },
        onReset: (values) =>{
            props.onBackClick();
        }
    })

    return(
        <>
            <Form
                onSubmit={ form.handleSubmit }
                onReset={ form.handleReset }>
                <Row>
                    <h3 className='mb-4'>Medical Card Upload</h3>
                </Row>
                <Row>
                    <BaseInput
                        className='col-5 mt-1'
                        type="file"
                        name='photo'
                        placeholder='Photo'
                        label="Upload Your Medical Card"
                        formik={ form }
                    />
                </Row>
                <Row className="mt-4">
                    <Col>
                        <Button className="float-right"
                        type="reset">
                            {t("BACK")}
                        </Button>
                    </Col>

                    <Col>
                        <Button className='float-left'
                        type="submit">
                            {t("NEXT")}
                        </Button>
                    </Col>
                </Row>
            </Form>
        </>
    )
}