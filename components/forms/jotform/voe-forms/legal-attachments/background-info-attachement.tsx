import React from 'react'
import { Col, Row } from 'react-bootstrap'
import { PageProps } from '../../../../../types/jotform/page-props.type'
import { useTranslation } from '../../../../../hooks/use-translation'
import styles from "../../../../../styles/jotform.module.css";

export interface BackgroundInfoAttachmentProps extends PageProps { }

export function BackgroundInfoAttachment() {
    return (
        <form>
            <Row>
                <Col>
                    <h4 className={`${styles.paragraph} ${styles.text__bold}`}>Thursday, October 20, 2022</h4>
                </Col>
            </Row>
            <Row>
                <Col>
                    <h4 className={`${styles.paragraph} ${styles.text__bold} `}>Nautilus</h4>
                </Col>
            </Row>
            <Row className='mt-4 mb-4'>
                <Col>
                    <p className={`${styles.paragraph} ${styles.align__text_right} ${styles.text__bold}`}>Company Rep:</p>
                </Col>
                <Col>
                    <p className={`${styles.paragraph} ${styles.align__text_left}`}>Nautilus</p>
                </Col>
            </Row>
            <Row className="mb-4 mt-4">
                <h4 className={`${styles.paragraph} ${styles.text__bold}`}>Driver Application</h4>
                <p className={`${styles.paragraph} ${styles.align__text_left}`}>Submitting this application certifies that this form was completed by me and all entries and
                    information on it are true and complete to the best of my knowledge. I authorize Nautilus Trucking to make investigations and inquires of my driving history and past employment records. I hereby authorize Nautilus Trucking to check my MVR from DMV and PSP record for review as part of the hiring process.</p>
            </Row>
            <Row>
                    <Col className="col-3"><p className={`${styles.paragraph} ${styles.align__text_left} ${styles.text__bold}`}>Signature:</p></Col>
                
                <Col>
                    <p className={`${styles.paragraph} ${styles.align__text_right} ${styles.text__bold}`}>Name</p>
                </Col>
                <Col>
                    <p className={`${styles.paragraph} ${styles.align__text_left}`}>Test name</p>
                </Col>
            </Row>
            <Row>
                
                    <Col className='col-3'>
                        <p className={`${styles.paragraph} ${styles.align__text_left} ${styles.text__bold}`}>Date</p>
                    </Col>
                    <Col>
                        <p className={`${styles.paragraph} ${styles.align__text_left}`}>Saturday, October 15, 2022</p>
                    </Col>
            </Row>
            <Row className="mb-4 mt-4">
                <h3 className={`${styles.paragraph} ${styles.align__text_left} ${styles.text__bold}`}>Background Info</h3>
            </Row>
            <Row>
                <Col className='col-3'>
                   <p className={`${styles.paragraph} ${styles.align__text_left} ${styles.text__bold}`}>Email</p>
                </Col>
                <Col>
                    <p className={`${styles.paragraph} ${styles.align__text_left}`}>testemail@email.com</p>
                </Col>
            </Row>
            <Row>
                <Col className='col-3'>
                    <p className={`${styles.paragraph} ${styles.align__text_left} ${styles.text__bold}`}>Phone Number</p>
                </Col>
                <Col>
                    <p className={`${styles.paragraph} ${styles.align__text_left}`}>((928) 265-0000)</p>
                </Col>
            </Row>
            <Row>
                <Col className='col-3'>
                    <p className={`${styles.paragraph} ${styles.align__text_left} ${styles.text__bold}`}>Street Address</p>
                </Col>
                <Col>
                    <p className={`${styles.paragraph} ${styles.align__text_left}`}>adasds</p>
                </Col>
            </Row>
            <Row>
                <Col className='col-3'>
                    <p className={`${styles.paragraph} ${styles.align__text_left} ${styles.text__bold}`}>City</p>
                </Col>
                <Col>
                    <p className={`${styles.paragraph} ${styles.align__text_left}`}>asdasdad</p>
                </Col>
            </Row>
            <Row>
                <Col className='col-3'>
                    <p className={`${styles.paragraph} ${styles.align__text_left} ${styles.text__bold}`}>State / Province</p>
                </Col>
                <Col>
                    <p className={`${styles.paragraph} ${styles.align__text_left}`}>Alabama</p>
                </Col>
            </Row>
            <Row>
                <Col className='col-3'>
                    <p className={`${styles.paragraph} ${styles.align__text_left} ${styles.text__bold}`}>Postal / Zip Code</p>
                </Col>
                <Col>
                    <p className={`${styles.paragraph} ${styles.align__text_left}`}>122233</p>
                </Col>
            </Row>
            <Row>
                <Col className='col-3'>
                    <p className={`${styles.paragraph} ${styles.align__text_left} ${styles.text__bold}`}>Your Date of Birth</p>
                </Col>
                <Col>
                    <p className={`${styles.paragraph} ${styles.align__text_left}`}>Saturday, October 15, 1994</p>
                </Col>
            </Row>
            <Row>
                <Col className='col-3'>
                    <p className={`${styles.paragraph} ${styles.align__text_left} ${styles.text__bold}`}>Can you pass a drug test?</p>
                </Col>
                <Col>
                    <p className={`${styles.paragraph} ${styles.align__text_left}`}>Yes</p>
                </Col>
            </Row>
            <Row>
                <Col className='col-3'>
                    <p className={`${styles.paragraph} ${styles.align__text_left} ${styles.text__bold}`}>Are you legally authorized to work in the US?</p>
                </Col>
                <Col>
                    <p className={`${styles.paragraph} ${styles.align__text_left}`}>Yes</p>
                </Col>
            </Row>
            <Row>
                <Col className="float-right col-3">
                    <p className={`${styles.paragraph} ${styles.align__text_left} ${styles.text__bold}`}>Highest Level of Education</p>
                </Col>
                <Col className="float-left">
                    <p className={`${styles.paragraph} ${styles.align__text_left}`}>Some schooling</p>
                </Col>
            </Row>
            <Row className='mt-5'>
                <h4 className={`${styles.paragraph} ${styles.align__text_left} ${styles.text__bold}`}>Driving Experience</h4>
            </Row>
            <Row>
                <Col className="float-right col-3">
                    <p className={`${styles.paragraph} ${styles.align__text_left} ${styles.text__bold}`}>CDL License Number</p>
                </Col>
                <Col className="float-left">
                    <p className={`${styles.paragraph} ${styles.align__text_left}`}>12133445</p>
                </Col>
            </Row>
            <Row>
                <Col className="float-right col-3">
                    <p className={`${styles.paragraph} ${styles.align__text_left} ${styles.text__bold}`}>State of Issuance</p>
                </Col>
                <Col className="float-left">
                    <p className={`${styles.paragraph} ${styles.align__text_left}`}>Alabama</p>
                </Col>
            </Row>
            <Row>
                <Col className="col-3">
                    <p className={`${styles.paragraph} ${styles.align__text_left} ${styles.text__bold}`}>Expiration Date</p>
                </Col>
                <Col className="float-left">
                    <p className={`${styles.paragraph} ${styles.align__text_left}`}>Friday, October 21, 2022</p>
                </Col>
            </Row>
            <Row className='col-6 mt-4'>
                <h4 className={`${styles.paragraph} ${styles.align__text_left} ${styles.text__bold}`}>Equipment Experience (optional)</h4>
                <h4 className={`${styles.paragraph} ${styles.align__text_left}`}>Fill in as many of the following as relevant.</h4>
            </Row>
            <Row className='col-6 mt-3'>
                <h4 className={`${styles.paragraph} ${styles.align__text_left} ${styles.text__bold}`}>Drivers License Photo</h4>
            </Row>
            <Row className='col-6 mt-3'>
                <h4 className={`${styles.paragraph} ${styles.align__text_left} ${styles.text__bold}`}>Medical Card Upload</h4>
            </Row>
            <Row className='col-6 mt-3'>
                <p className={`${styles.paragraph} ${styles.align__text_left} ${styles.text__bold}`}>_______________________________________</p>
                <p className={`${styles.paragraph} ${styles.align__text_left} ${styles.text__bold}`}>_______________________________________</p>
            </Row>
            <Row className='col-6 mt-3'>
                <h4 className={`${styles.paragraph} ${styles.align__text_left} ${styles.text__bold}`}>Employment History</h4>
            </Row>
            <Row className='col-6 mt-3'>
                <h4 className={`${styles.paragraph} ${styles.align__text_left} ${styles.text__bold}`}>Current Employer</h4>
            </Row>
            <Row>
                <p></p>
            </Row>
            <Row className='col-6 mt-3'>
                <h4 className={`${styles.paragraph} ${styles.align__text_left} ${styles.text__bold}`}>Previous Employers</h4>
            </Row>
            <Row>
                <p>________________________________________________________________________</p>
            </Row>
            <Row className="mt-5">
                <h4 className={`${styles.paragraph} ${styles.align__text_left} ${styles.text__bold}`}>Driver Preferences</h4>
            </Row>
            <Row>
                
                <Col className="col-3">
                    <p className={`${styles.paragraph} ${styles.align__text_left} ${styles.text__bold}`}>Routes you're open to (select ALL that best apply):</p>
                </Col>
                <Col className="col-3">
                    <p className={`${styles.paragraph} ${styles.align__text_left}`}>Regional (home every night)</p>
                    <Row>
                        <p className={`${styles.paragraph} ${styles.align__text_left}`}>Regional (home every weekend)</p>
                    </Row>
                    <Row>
                        <p className={`${styles.paragraph} ${styles.align__text_left}`}>Regional (2+ weeks on the road)</p>
                    </Row>
                    <Row>
                        <p className={`${styles.paragraph} ${styles.align__text_left}`}>OTR (home every weekend)</p>
                    </Row>
                </Col>
            </Row>
            <Row>
                <Col className='col-3'>
                    <p className={`${styles.paragraph} ${styles.align__text_left} ${styles.text__bold}`}>Do you require W2 employment?</p>
                </Col>
                <Col>
                    <p className={`${styles.paragraph} ${styles.align__text_left}`}>Yes</p>
                </Col>
            </Row>
            <Row className="mt-5">
                <h4 className={`${styles.paragraph} ${styles.text__bold} ${styles.align__text_left}`}>Safety Background</h4>
            </Row>
            <Row>
                <Col className="col-3">
                    <p className={`${styles.paragraph} ${styles.align__text_left} ${styles.text__bold}`}>How many accidents have you had in the last 5 years (even if it was not
your fault)?</p>
                </Col>
                <Col>
                    <p className={`${styles.paragraph} ${styles.align__text_left}`}>0</p>
                </Col>
            </Row>
            <Row>
                <Col className="float-right col-3">
                    <p className={`${styles.paragraph} ${styles.align__text_left} ${styles.text__bold}`}>Have any of your license, permit or privilege to operate a CMV ever been suspended, revoked, or denied for any reason?</p>
                </Col>
                <Col className="float-left">
                    <p className={`${styles.paragraph} ${styles.align__text_left}`}>No</p>
                </Col>
            </Row>
            <Row>
                <Col className="float-right col-3">
                    <p className={`${styles.paragraph} ${styles.align__text_left} ${styles.text__bold}`}>Is there any reason you might be unable to perform the functions of the job for which you have applied (as described in the job description)?</p>
                </Col>
                <Col className="float-left">
                    <p className={`${styles.paragraph} ${styles.align__text_left}`}>No</p>
                </Col>
            </Row>
            <Row>
                <Col className="float-right col-3">
                    <p className={`${styles.paragraph} ${styles.align__text_left} ${styles.text__bold}`}>Have you ever been convicted of a felony?</p>
                </Col>
                <Col className="float-left">
                    <p className={`${styles.paragraph} ${styles.align__text_left}`}>No</p>
                </Col>
            </Row>
            <Row>
                <Col className="col-3">
                    <p className={`${styles.paragraph} ${styles.align__text_left} ${styles.text__bold}`}>Have you tested positive, or refused to test, on a pre-employment drug or alcohol test by an employer subject to DOT regulations?</p>
                </Col>
                <Col className="">
                    <p className={`${styles.paragraph} ${styles.align__text_left}`}>No</p>
                </Col>
            </Row>
            <Row>
                <Col className="col-3">
                    <p className={`${styles.paragraph} ${styles.align__text_left} ${styles.text__bold}`}>How did you hear about us?</p>
                </Col>
                <Col>
                    <p className={`${styles.paragraph} ${styles.align__text_left}`}>No</p>
                </Col>
            </Row>

        </form>
    )
}
