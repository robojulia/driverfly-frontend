import LogoutButton from '../../../components/buttons/Logout';
import style from '../../../public/dashboard/styles/css/Driver/free-resources.module.css';
import FullLayout from "../../../components/dashboard/layouts/FullLayout";
import Router from 'next/router';
import { useState } from 'react'
import useRedirect from '../../../hooks/useRedirect';
import { Container, Row, Col } from 'react-bootstrap';
import Link from 'next/link';
import fb from "../../../public/dashboard/assets/images/socialicon/fb.png";
import insta from "../../../public/dashboard/assets/images/socialicon/insta.png";
import linkedin from "../../../public/dashboard/assets/images/socialicon/linkedin.png";
import Image from "next/image";


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
                        <h2> <Link href="/resources"><a className={style.link_style}>Vendor Discounts</a></Link> </h2>
                    </Col>
                    <Col className='col-lg-4  col-md-4 col-12  my-lg-0 my-4'>
                        <h2> <Link href="https://ctrecruiting.com/"><a className={style.link_style}>Salary Comparison Tool</a></Link> </h2>
                    </Col>
                    <Col className='col-lg-4  col-md-4 col-12  my-lg-0 my-4'>
                        <h2> <Link href="/dashboard/driver/my-docs"><a className={style.link_style}>Access Your MVR</a></Link> </h2>
                        {/* <h3 className=' mt-3'>If any past employers have<br></br> pulled your MVR through our<br></br> system, it should be visible to <br></br> you in
                            <Link href="/dashboard/driver/my-docs"><a className={style.link}> My Docs</a></Link>
                        </h3> */}
                    </Col>
                </Row>
                <Row className={style.mt_90}>
                    <Col className='col-lg-4  col-md-4 col-12  my-lg-0 my-4'>
                        <h2> <Link href="#"><a className={style.link_style}>Refer A Friend Program</a></Link> </h2>
                    </Col>
                    <Col className='col-lg-4  col-md-4 col-12  my-lg-0 my-4'>
                        <h2> <Link href="#"><a className={style.link_style}>Enter Sweepstakes</a></Link> </h2>
                    </Col>
                    <Col className='col-lg-4  col-md-4 col-12  my-lg-0 my-4'>
                        <h2> <Link href="https://drivergrowth.com/"><a className={style.link_style}>Become Your Own Boss</a></Link> </h2>
                    </Col>
                </Row>
                <Row className={style.mt_90}>
                    <Col className='col-lg-4  col-md-4 col-12  my-lg-0 my-4'>
                        <h2> <Link href="#"><a className={style.link_style}>Connect With Our Community</a></Link> </h2>
                    </Col>
                    <Col className='col-lg-4  col-md-4 col-12  my-lg-0 my-4'>
                        <h2> <Link href="#"><a className={style.link_style}>Follow us</a></Link> </h2>
                        <div className='mt-3'>
                            <Link href="https://www.facebook.com/DriverFlyJobs/">
                                <a target="_blank">
                                   <div className={style.social_icon}> <Image src={fb} alt="fb" /> </div>
                                </a>
                            </Link>
                            <Link href="https://www.instagram.com/driver_hiring/?hl=en" >
                                <a target="_blank">
                                   <div className={style.social_icon}> <Image src={insta} alt="fb" /> 
                                   </div>
                                </a>
                            </Link>
                            <Link href="https://www.linkedin.com/company/driverfly/">
                                <a target="_blank">
                                   <div className={style.social_icon}> <Image src={linkedin} alt="fb" />  </div>
                                </a>
                            </Link>
                        </div>
                    </Col>
                    <Col className='col-lg-4  col-md-4 col-12  my-lg-0 my-4'>
                        <h2> <Link href=""><a className={style.link_style}>Sign up for our newsletter</a></Link> </h2>
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
