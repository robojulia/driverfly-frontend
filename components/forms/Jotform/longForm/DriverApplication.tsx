import React from 'react';
import styles from "../../../../styles/JotForm.module.css";
import { Form, Button, Col, Row, Table } from "react-bootstrap";
import { useTranslation } from '../../../../hooks/useTranslation';
import { useFormik } from 'formik';
import BaseInput from '../../BaseInput';
import * as yup from 'yup';
import SignaturePad from "react-signature-canvas";
import SignatureCanvas from "react-signature-canvas";

export interface DriverApplicationProps {
    onNextClick: (any) => void;
}

export function DriverApplication(props: DriverApplicationProps){
    const{ t } = useTranslation();
    let padRef = React.useRef<SignatureCanvas>(null);
    const clear = () => {
        padRef.current?.clear();
      };
    const form = useFormik({
        initialValues: {
            first_name: null,
            last_name: null,
            date: null
        },
        validationSchema: yup.object({
            first_name: yup.string().matches(/^[A-Za-z ]*$/, 'Please enter valid name').required().nullable(),
            last_name: yup.string().matches(/^[A-Za-z ]*$/, 'Please enter valid name').required().nullable(),
            date: yup.date().required()
        }),
        onSubmit: (values) => {
            props.onNextClick(values);
        }
    })

    return(
        <>
            <Form onSubmit={form.handleSubmit}>
                <h6 className={ styles.carrierName}>
                    Nautilus Trucking
                </h6>
                <h6 className={styles.carrierName__smaller}>
                    Driver Application
                </h6>
                <p className={styles.paragraph}>
                Submitting this application certifies that this form was completed by me and all entries and information on it are true and complete to the best of my knowledge. I authorize Nautilus Trucking to make investigations and inquires of my driving history and past employment records. I hereby authorize Nautilus Trucking to check my MVR from DMV and PSP record for review as part of the hiring process.
                </p>
                
                
                <Row>
                    <BaseInput
                        className='col-6'
                        required
                        name='first_name'
                        placeholder="FIRST_NAME"
                        label="First Name"
                        formik={ form }
                    />
                </Row>
                <Row>    
                    <BaseInput
                        className='col-6'
                        required
                        name='last_name'
                        placeholder="LAST_NAME"
                        label="Last Name"
                        formik={ form }
                    />
                </Row>
                <Row>
                    <BaseInput
                        className='col-3 mt-3'
                        required
                        type="date"
                        name='date'
                        placeholder="DATE"
                        label="Date"
                        formik={ form }
                    /> 
                </Row>
                <Row>
                    <Col>
                    <h6>Signature</h6>
                    <SignaturePad className ref={padRef} canvasProps={{width: 600, height: 200, style: { border: "1px solid black" }, className: "sigCanvas"}} />
                    </Col>
                </Row>
                <Row>
                    <Col>
                    <button onClick={clear}>Clear</button>
                    </Col>
                </Row>
                <Row>
                    <Col className='mt-5'>
                        <Button
                            type = "submit"
                            onClick={() =>console.log("clicked the button")}>
                            {t("NEXT")}    
                            </Button>
                    </Col>
                </Row>
            </Form>
            
        
        </>
    )
    
}