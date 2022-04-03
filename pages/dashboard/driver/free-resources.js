import style from '../../../public/dashboard/styles/css/Driver/free-resources.module.css';
import FullLayout from "../../../components/dashboard/layouts/FullLayout";
import useRedirect from '../../../hooks/useRedirect';
import { Container, Row, Col } from 'react-bootstrap';
import Link from 'next/link';
import fb from "../../../public/dashboard/assets/images/socialicon/fb.png";
import insta from "../../../public/dashboard/assets/images/socialicon/insta.png";
import linkedin from "../../../public/dashboard/assets/images/socialicon/linkedin.png";
import Image from "next/image";

import { useTranslation } from 'react-i18next';


export default function FreeResources() {

    const { t } = useTranslation();

    const { authDriver } = useRedirect();

    authDriver()

    return (
        <>
            < div className='row'>
                <h1>{t("free_resources")}</h1>
            </div>
            <Container fluid>
                <Row className='mt-5'>
                    <Col className='col-lg-4 col-md-4  col-12 my-lg-0 my-4'>
                        <h2> <Link href="/resources"><a className={style.link_style}>{t("vendor_discounts")}</a></Link> </h2>
                    </Col>
                    <Col className='col-lg-4  col-md-4 col-12  my-lg-0 my-4'>
                        <h2> <Link href="https://ctrecruiting.com/pay-calculator"><a className={style.link_style}>{t("salary_comparison_tool")}</a></Link> </h2>
                    </Col>
                    <Col className='col-lg-4  col-md-4 col-12  my-lg-0 my-4'>
                        <h2> <Link href="/dashboard/driver/my-docs"><a className={style.link_style}>{t("access_your_mvr")}</a></Link> </h2>
                        <br />
                        <span className={style.description}>{t("access_your_mvr_paragraph")}</span>
                    </Col>
                </Row>
                <Row className={style.mt_90}>
                    <Col className='col-lg-4  col-md-4 col-12  my-lg-0 my-4'>
                        <h2> <Link href="#"><a className={style.link_style}>{t("refer_a_friend_program")}</a></Link> </h2>
                    </Col>
                    <Col className='col-lg-4  col-md-4 col-12  my-lg-0 my-4'>
                        <h2> <Link href="#"><a className={style.link_style}>{t("enter_sweepstakes")}</a></Link> </h2>
                    </Col>
                    <Col className='col-lg-4  col-md-4 col-12  my-lg-0 my-4'>
                        <h2> <Link href="https://drivergrowth.com/"><a className={style.link_style}>{t("become_your_own_boss")}</a></Link> </h2>
                    </Col>
                </Row>
                <Row className={style.mt_90}>
                    <Col className='col-lg-4  col-md-4 col-12  my-lg-0 my-4'>
                        <h2> <Link href="#"><a className={style.link_style}>{t("connect_with_our_community")}</a></Link> </h2>
                        <br />
                        <span className={style.description}>{t("join_our_driverfly_community")}</span>
                    </Col>
                    <Col className='col-lg-4  col-md-4 col-12  my-lg-0 my-4'>
                        <h2> <Link href="#"><a className={style.link_style}>{t("follow_us")}</a></Link> </h2>
                        <div className='mt-3'>
                            <br />
                            <span className={style.description}>{t("follow_us_paragraph")}</span>
                            <br />
                            <br />
                            <Link href="https://www.facebook.com/DriverFlyJobs/">
                                <a target="_blank">
                                   <div className={style.social_icon}> <Image src={fb} alt="fb" /> </div>
                                   facebook.com/DriverFlyJobs
                                </a>
                            </Link>
                            <br />
                            <Link href="https://www.instagram.com/driver_hiring" >
                                <a target="_blank">
                                   <div className={style.social_icon}> <Image src={insta} alt="ig" /> </div>
                                   @driver_hiring
                                </a>
                            </Link>
                            <br />
                            <Link href="https://www.linkedin.com/company/driverfly/">
                                <a target="_blank">
                                   <div className={style.social_icon}> <Image src={linkedin} alt="linkedin" />  </div>
                                   linkedin.com/company/driverfly
                                </a>
                            </Link>
                        </div>
                    </Col>
                    <Col className='col-lg-4  col-md-4 col-12  my-lg-0 my-4'>
                        <h2> <Link href=""><a className={style.link_style}>{t("sign_up_for_newsletter")}</a></Link> </h2>
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
