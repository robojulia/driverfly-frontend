import React from 'react'
import { PageProps } from '../../../../../types/jotform/page-props.type'
import styles from "../../../../../styles/jotform.module.css";
import { Col, Row } from 'react-bootstrap';


export interface ConsentAlcoholDrugProps extends PageProps { }

export default function ConsentAlcoholDrug() {
  return (
    <form>
        <Row>
            <Col>
                <h1 className={`${styles.paragraph} ${styles.text__bold}`}>Nautilus Trucking</h1>
            </Col>
        </Row>
        <Row>
            <Col>
                <h4 className={`${styles.paragraph} ${styles.text__bold}`}>GENERAL CONSENT FOR LIMITED QUERIES OF THE FMCSA DRUG AND ALCOHOL CLEARINGHOUSE</h4>
            </Col>
        </Row>
        <Row>
            <Col>
                <p className={`${styles.paragraph} ${styles.align__text_right} ${styles.text__bold}`}>Name:</p>            
            </Col>
            <Col>
                <p className={`${styles.paragraph} ${styles.align__text_left}`}>Test name</p>            
            </Col>
        </Row>
        <Row>
            <Col>
                <p className={`${styles.paragraph} ${styles.align__text_right} ${styles.text__bold}`}>Employer's Name:</p>            
            </Col>
            <Col>
                <p className={`${styles.paragraph} ${styles.align__text_left}`}>Nautilus Trucking</p>            
            </Col>
        </Row>
        <Row>
            <Col>
                <p className={`${styles.paragraph} ${styles.align__text_right} ${styles.text__bold}`}>CDL License Number:</p>            
            </Col>
            <Col>
                <p className={`${styles.paragraph} ${styles.align__text_left}`}>12133445</p>            
            </Col>
        </Row>
        <Row>
            <Col>
                <p className={`${styles.paragraph} ${styles.align__text_right} ${styles.text__bold}`}>Expiration Date:</p>            
            </Col>
            <Col>
                <p className={`${styles.paragraph} ${styles.align__text_left}`}>Friday, October 21, 2022</p>            
            </Col>
        </Row>
        <Row className='ml-4 mr-4'>
            <p className={`${styles.paragraph} ${styles.align__text_left}`}>I, Test name, hereby provide consent to Nautilus Trucking to conduct a limited query of the FMCSA Commercial Driver’s License Drug and Alcohol Clearinghouse (Clearinghouse) to determine whether drug or alcohol violation information about me exists in the Clearinghouse.</p>
        </Row>
        <Row className='ml-4 mr-4'>
            <p className={`${styles.paragraph} ${styles.align__text_left}`}>I understand that if the limited query conducted by Nautilus Trucking indicates that drug or alcohol violation information about me exists in the Clearinghouse, FMCSA will not disclose that information to Nautilus Trucking without first obtaining additional specific consent from me.</p>
        </Row>
        <Row className='ml-4 mr-4'>
            <p className={`${styles.paragraph} ${styles.align__text_left}`}>I further understand that if I refuse to provide consent for Nautilus Trucking to conduct a limited query of the Clearinghouse, Nautilus Trucking must prohibit me from performing safety-sensitive functions, including driving a commercial motor vehicle, as required by FMCSA’s drug and alcohol program regulations.</p>
        </Row>
        <Row>
            <p className={`${styles.paragraph} ${styles.text__bold}`}>Employee Signature</p>
        </Row>
        <Row>
            <p className={`${styles.paragraph}`}>Signature goes here</p>
        </Row>
        <Row>
            <Col><p className={`${styles.paragraph} ${styles.text__bold} ${styles.align__text_right}`}>Date of Consent:</p></Col>
            <Col><p className={`${styles.paragraph} ${styles.align__text_left}`}>Saturday, October 15, 2022</p></Col>    
        </Row>
        <Row className='ml-4 mr-4'>
            <p className={`${styles.paragraph} ${styles.align__text_left}`}>Instructions: Section 382.703(a) of the Title 49 CFR, states “No employer may query the Clearinghouse to determine whether a record exists for any particular driver without first obtaining that driver’s written or electronic consent.” The type of consent required depends on the type of query. For a limited query, a general consent is required. This will be obtained outside the Clearinghouse. Employers may obtain a multi-year general consent from the driver for limited queries. For a full query, the driver must provide specific consent to the employer prior to each full query. This consent must be provided electronically within the Clearinghouse.</p>
        </Row>

    </form>
  )
}
