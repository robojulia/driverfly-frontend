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
                <Row className='mt-5'>
                    <Col className='col-lg-4 col-md-4  col-12 my-lg-0 my-4'>
                        <h2> <Link href="#"><a className={style.link_style}>Vendor Discounts</a></Link> </h2>
                        <h3 className='text-secondary mt-3'>(takes to table list of vendors<br></br> and discount offer codes)</h3>
                    </Col>
                    <Col className='col-lg-4  col-md-4 col-12  my-lg-0 my-4'>
                        <h2> <Link href="#"><a className={style.link_style}>Salary Comparison Tool</a></Link> </h2>
                        <h3 className='text-secondary mt-3'>(redirects to jotform calculator <br></br> on ctrecruiting.com page<br></br> –Julia to give you embeddable code) </h3>
                    </Col>
                    <Col className='col-lg-4  col-md-4 col-12  my-lg-0 my-4'>
                        <h2> <Link href="#"><a className={style.link_style}>Access Your MVR</a></Link> </h2>
                        <h3 className=' mt-3'>If any past employers have<br></br> pulled your MVR through our<br></br> system, it should be visible to <br></br> you in
                            <Link href="#"><a className={style.link}> My Docs</a></Link>
                        </h3>
                    </Col>
                </Row>
                <Row className={style.mt_90}>
                    <Col className='col-lg-4  col-md-4 col-12  my-lg-0 my-4'>
                        <h2> <Link href="#"><a className={style.link_style}>Refer A Friend Program</a></Link> </h2>
                        <h3 className='text-secondary mt-3'>(takes to referral program like <br></br> on ctrecruiting.com – Julia to <br></br> provide code if needed)</h3>
                    </Col>
                    <Col className='col-lg-4  col-md-4 col-12  my-lg-0 my-4'>
                        <h2> <Link href="#"><a className={style.link_style}>Enter Sweepstakes</a></Link> </h2>
                        <h3 className='text-secondary mt-3'>(redirects to spinner tool—to<br></br>be created at a later time) </h3>
                    </Col>
                    <Col className='col-lg-4  col-md-4 col-12  my-lg-0 my-4'>
                        <h2> <Link href="#"><a className={style.link_style}>Become Your Own Boss</a></Link> </h2>
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
