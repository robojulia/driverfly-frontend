import LogoutButton from '../../../components/buttons/Logout';
import FullLayout from "../../../components/dashboard/layouts/FullLayout";
import Router from 'next/router';
import { useState } from 'react'
import useRedirect from '../../../hooks/useRedirect';
import style from '../../../public/dashboard/styles/css/Driver/free-resources.module.css';

import { Container, Row, Col } from 'react-bootstrap';
import Link from 'next/link';


export default function FreeResources() {

    const { authDriver } = useRedirect();

    authDriver()

    return (
        <>
            < div className='row'>
                <h1>Free Resources</h1>
            </div>
            <Container fluid>
                <Row className='mt-3'>
                    <Col className='col-lg-4 col-12'>
                        <h2>Vendor Discounts</h2>
                        <h3 className='text-secondary mt-3'>(takes to table list of vendors<br></br> and discount offer codes)</h3>
                    </Col>
                    <Col className='col-lg-4 col-12'>
                        <h2>Salary Comparison Tool</h2>
                        <h3 className='text-secondary mt-3'>(redirects to jotform calculator <br></br> on ctrecruiting.com page<br></br> –Julia to give you embeddable code) </h3>
                    </Col>
                    <Col className='col-lg-4 col-12'>
                        <h2>Access Your MVR</h2>
                        <h3 className=' mt-3'>If any past employers have<br></br> pulled your MVR through our<br></br> system, it should be visible to<br></br> you in 
                        <Link href="#"><a> My Docs</a></Link> 
                        </h3>
                    </Col>
                </Row>
                <Row className='mt-5'>
                    <Col className='col-lg-4 col-12'>
                        <h2>Refer A Friend Program</h2>
                        <h3 className='text-secondary mt-3'>(takes to referral program like <br></br> on ctrecruiting.com – Julia to <br></br> provide code if needed)</h3>
                    </Col>
                    <Col className='col-lg-4 col-12'>
                        <h2>Enter Sweepstakes</h2>
                        <h3 className='text-secondary mt-3'>(redirects to spinner tool—to<br></br>be created at a later time) </h3>
                    </Col>
                    <Col className='col-lg-4 col-12'>
                        <h2>Become Your Own Boss</h2>
                        <h3 className='text-secondary mt-3'>(redirects to<br></br> drivergrowth.com)</h3>
                    </Col>
                </Row>
            </Container>
        </>
    )
};

FreeResources.getLayout = function getLayout(page) {
    return (
        <FullLayout>
            {page}
        </FullLayout>
    )
}
