import React from 'react'
import { PageProps } from '../../../../../types/jotform/page-props.type'
import styles from "../../../../../styles/jotform.module.css";
import { Col, Row } from 'react-bootstrap';

export interface AuthBackgroundInvestigationProps extends PageProps { }

export default function AuthBackgroundInvestigation() {
  return (
    <form>
        <Row>
            <Col>
                <h1 className={`${styles.paragraph} ${styles.text__bold}`}>Nautilus Trucking</h1>
            </Col>
        </Row>
        <Row>
            <Col>
                <h4 className={`${styles.paragraph} ${styles.text__bold}`}>DISCLOSURE AND AUTHORIZATION REGARDING BACKGROUND INVESTIGATION FOR EMPLOYMENT PURPOSES</h4>
            </Col>
        </Row>
        <Row>
            <h4 className={`${styles.paragraph} ${styles.text__bold}`}>DISCLOSURE</h4>
        </Row>
        <Row className="ml-4 mr-4">
            <p className={`${styles.paragraph} ${styles.align__text_left} `}>Nautilus Trucking (the “Company”) may request from a consumer reporting agency and for employment-related purposes, a “consumer report(s)” (commonly known as “background reports”) containing background information about you in connection with your employment, or application for employment, or engagement for services (including independent contractor or volunteer assignments, as applicable).</p>
        </Row>
        <Row className="ml-4 mr-4">
            <p className={`${styles.paragraph} ${styles.align__text_left}`}>The background report(s) may contain information concerning your character, general reputation, personal characteristics, mode of living, or credit standing. The types of background information that may be obtained include, but are not limited to: criminal history; litigation history; motor vehicle record and accident history; social security number verification; address and alias history; credit history; verification of your education, employment and earnings history; professional licensing, credential and certification checks; drug/alcohol testing results and history; military service; and other information.</p>
        </Row>
        <Row className="ml-4 mr-4">
            <h4 className={`${styles.paragraph} ${styles.text__bold}`}>AUTHORIZATION</h4>
        </Row>
        <Row className="ml-4 mr-4">
            <p className={`${styles.paragraph} ${styles.align__text_left} `}>I hereby authorize Company to obtain the consumer reports described above about me.</p>
        </Row>
        <Row>
            <Col className='col-3 ml-4 mr-4'>
                <p className={`${styles.paragraph} ${styles.text__bold} ${styles.align__text_left}`}>Name:</p>
            </Col>
            <Col>
                <p className={`${styles.paragraph} ${styles.align__text_left}`}>Ansu Priyadarshi</p>
            </Col>
        </Row>
        <Row>
            <Col className='col-3 ml-4 mr-4'>
                <p className={`${styles.paragraph} ${styles.text__bold} ${styles.align__text_left}`}>Signature</p>
            </Col>
            <Col>
                <p className={`${styles.paragraph} ${styles.align__text_left}`}>Signature goes here</p>
            </Col>
        </Row>
        <Row>
            <Col className='col-3 ml-4 mr-4'>
                <p className={`${styles.paragraph} ${styles.text__bold} ${styles.align__text_left}`}>Date:</p>
            </Col>
            <Col>
                <p className={`${styles.paragraph} ${styles.align__text_left}`}>Saturday, October 15, 2022</p>
            </Col>
        </Row>

    </form>
  )
}
