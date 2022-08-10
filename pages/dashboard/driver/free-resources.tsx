import style from '../../../public/dashboard/styles/css/Driver/free-resources.module.css';
import FullLayout from "../../../components/dashboard/layouts/FullLayout";
import { Container, Row, Col } from 'react-bootstrap';
import Link from 'next/link';
import { Facebook, Instagram, Linkedin, Pinterest, Plus, Twitter } from 'react-bootstrap-icons';

import Image from "next/image";

import { useTranslation } from '../../../hooks/useTranslation';
import { SocialLinks } from '../../../components/social/social-links';
import Card from 'react-bootstrap/Card';


export default function FreeResources() {

    const { t } = useTranslation();

    return (
        <>
            <Container fluid>
                <Row >
                    <h1>{t("FREE_RESOURCES")}</h1>
                </Row>
                <Row className='mt-5'>
                    <Col className='col-lg-4 col-md-4  col-12 my-lg-0 my-4'>
                        <Card className='border-0 shadow-sm'>
                            <Card.Body>
                                <Card.Title>
                                    <Link href="/third-party-resources">
                                        <a target="_blank" className={style.link_style}>
                                            {t("vendor_discounts")}
                                        </a>
                                    </Link>
                                </Card.Title>
                                <Card.Text>
                                    {t("vendor_discounts_paragraph")}
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col className='col-lg-4  col-md-4 col-12  my-lg-0 my-4'>
                        <Card className='border-0 shadow-sm'>
                            <Card.Body>
                                <Card.Title>
                                    <Link href="https://ctrecruiting.com/pay-calculator">
                                        <a target="_blank" className={style.link_style}>
                                            {t("salary_comparison_tool")}
                                        </a>
                                    </Link>
                                </Card.Title>
                                <Card.Text>
                                    {t("salary_comparison_tool_paragraph")}
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col className='col-lg-4  col-md-4 col-12  my-lg-0 my-4'>
                        <Card className='border-0 shadow-sm'>
                            <Card.Body>
                                <Card.Title>
                                    <Link href="/dashboard/driver/settings/applicant">
                                        <a target="_blank" className={style.link_style}>
                                            {t("access_your_mvr")}
                                        </a>
                                    </Link>
                                </Card.Title>
                                <Card.Text>
                                    {t("access_your_mvr_paragraph")}
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
                <Row className={style.mt_90}>
                    <Col className='col-lg-4  col-md-4 col-12  my-lg-0 my-4'>
                        <Card className='border-0 shadow-sm'>
                            <Card.Body>
                                <Card.Title>
                                    <Link href="#">
                                        <a target="_blank" className={style.link_style}>
                                            {t("refer_a_friend_program")}
                                        </a>
                                    </Link>
                                </Card.Title>
                                <Card.Text>
                                    {t("refer_a_friend_paragraph")}
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col className='col-lg-4  col-md-4 col-12  my-lg-0 my-4'>
                        <Card className='border-0 shadow-sm'>
                            <Card.Body>
                                <Card.Title>
                                    <Link href="#">
                                        <a target="_blank" className={style.link_style}>
                                            {t("enter_sweepstakes")}
                                        </a>
                                    </Link>
                                </Card.Title>
                                <Card.Text>
                                    {t("enter_sweepstakes_paragraph")}
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col className='col-lg-4  col-md-4 col-12  my-lg-0 my-4'>
                        <Card className='border-0 shadow-sm'>
                            <Card.Body>
                                <Card.Title>
                                    <Link href="https://drivergrowth.com/">
                                        <a target="_blank" className={style.link_style}>
                                            {t("become_your_own_boss")}
                                        </a>
                                    </Link>
                                </Card.Title>
                                <Card.Text>
                                    {t("become_your_own_boss_paragraph")}
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
                <Row className={style.mt_90}>
                    <Col className='col-lg-4  col-md-4 col-12  my-lg-0 my-4'>
                        <Card className='border-0 shadow-sm'>
                            <Card.Body>
                                <Card.Title>
                                    <Link href="#">
                                        <a target="_blank" className={style.link_style}>
                                            {t("connect_with_our_community")}
                                        </a>
                                    </Link>
                                </Card.Title>
                                <Card.Text>
                                    {t("join_our_driverfly_community")}
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col className='col-lg-4  col-md-4 col-12  my-lg-0 my-4'>
                        <Card className='border-0 shadow-sm'>
                            <Card.Body>
                                <Card.Title>
                                    <Link href="#">
                                        <a target="_blank" className={style.link_style}>
                                            {t("FOLLOW_US")}
                                        </a>
                                    </Link>
                                </Card.Title>
                                <Card.Text>
                                    {t("follow_us_paragraph")}
                                    <br />
                                    <br />
                                    <SocialLinks
                                        showText
                                        iconSize={25}
                                        breakComponent={<br />}
                                    />
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col className='col-lg-4  col-md-4 col-12  my-lg-0 my-4'>
                        <Card className='border-0 shadow-sm'>
                            <Card.Body>
                                <Card.Title>
                                    <Link href="/#newsletter-section">
                                        <a target="_blank" className={style.link_style}>
                                            {t("sign_up_for_newsletter")}
                                        </a>
                                    </Link>
                                </Card.Title>
                                <Card.Text>
                                    {t("sign_up_for_newsletter_paragraph")}
                                </Card.Text>
                            </Card.Body>
                        </Card>
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
