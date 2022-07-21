import Head from 'next/head';
import Link from 'next/link';
import { PublicLayout } from "../components/layouts/PublicLayout";
import ReCAPTCHA from "react-google-recaptcha";
import Breadcrumb from "../components/breadcrumbs/Breadcrumb";
import { ArrowLeft, ArrowRight, Newspaper, PersonBadgeFill, QuestionCircle } from 'react-bootstrap-icons';
import { useTranslation } from "../hooks/useTranslation";

import BaseInput from "../components/forms/BaseInput";
import BaseTextArea from "../components/forms/BaseTextArea";
import { useFormik } from "formik";
import { ContactFormDto } from "../models/general/contact-form.dto";
import { Row, Col } from "reactstrap"
import { ToastContainer, toast } from 'react-toastify'

export default function Contact() {

    const { t } = useTranslation();

    const form = useFormik({
        initialValues: new ContactFormDto(),
        validationSchema: ContactFormDto.yupSchema(),
        onSubmit: async (dto) => {
            // const api = new AuthApi();

            // try {
            //     await api.signUp(dto);
            //     toast.success(t("SUCCESSFULLY_REGISTERED"));
            //     setTimeout(goToLogin, 3000);
            // }
            // catch (e) {
            //     globalAjaxExceptionHandler(e, { formik: form, toast: toast, t: t, defaultMessage: "UNABLE_TO_SIGNUP" });
            // }
            console.log("Call Successfuly")
        }
    });


    function onChange(value) {
        console.log("Captcha value:", value);
    }
    return (
        <>
            <div className="top-links-sec">
                <div className="container">
                    <div className="top-links-inner d-flex align-items-center justify-content-between">
                        <h2>Contact</h2>
                        < Breadcrumb />
                    </div>
                </div>
            </div>

            <div className="top-outer bg-white py-5"></div>
              <div className="contact-form">
                <div className="container">
                    <div className="row contact-inner bg-white">
                        <div className="col-sm-12 col-lg-5 pl-0">
                            <article>
                                <div className="contact-infomation">
                                    <h2>Contact Infomation</h2>
                                    <p>Have Questions? Please submit your query to us and we will come to you as soon as possible.</p>
                                    <ul className="address_list">
                                        <li><a href="#" className="nav-link px-0"> Los Angeles, CA</a></li>
                                        <li><a href="mailto:#" className="nav-link px-0">Email: info@driverfly.co</a></li>
                                        <li><a href="#" className="nav-link px-0"> Call: (614) 259-7225</a></li>
                                    </ul>
                                </div>
                            </article>
                        </div>
                        <div className="col-sm-12 col-lg-7 contact-outer">
                            <ToastContainer />
                            <h3>{t("We_want_to_hear_form_you")}</h3>
                            <div className="container p-0">
                                <Row>
                                    <Col>
                                        <ToastContainer />
                                        <form onSubmit={form.handleSubmit}>
                                            <Row>
                                                <BaseInput
                                                    className="col-6 mt-4"
                                                    required
                                                    name="name"
                                                    placeholder
                                                    formik={form}
                                                />
                                                <BaseInput
                                                    className="col-6 mt-4"
                                                    required
                                                    name="email"
                                                    placeholder
                                                    formik={form}
                                                />
                                                <BaseInput
                                                    className="col-12 mt-4"
                                                    name="subject"
                                                    placeholder
                                                    formik={form}
                                                />
                                                <BaseTextArea
                                                    className="col-12 my-4"
                                                    name="message"
                                                    placeholder
                                                    formik={form}
                                                />
                                            </Row>
                                            <ReCAPTCHA
                                                sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
                                                onChange={onChange}
                                            />
                                            <button disabled={form.isSubmitting}
                                                type="submit"
                                                className="btn contact-submit-btn float-right py-3 px-5 mb-4">
                                                {t("submit")}  <ArrowRight />
                                            </button>
                                        </form>
                                    </Col>
                                </Row>
                            </div>
                        </div>
                    </div>
                    <div className="row mt-5 pt-4 contact-icon">
                        <div className="col-md-4">
                            <div className="contact-icon-inner">
                                < PersonBadgeFill />
                            </div>
                            <h3 className="title text-center my-4"><Link href="/signup"><a className='text-black'>Want to join us?</a></Link></h3>
                        </div>
                        <div className="col-md-4">
                            <div className="contact-icon-inner">
                                <Newspaper />
                            </div>
                            <h3 className="title text-center my-4"><Link href="/blog"><a className='text-black'>Read our latest news</a></Link></h3>
                        </div>
                        <div className="col-md-4">
                            <div className="contact-icon-inner">
                                <QuestionCircle />
                            </div>
                            <h3 className="title text-center my-4"><Link href="/faq"><a className='text-black'>Have questions?</a></Link></h3>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
Contact.getLayout = function getLayout(page) {
    return (
        <PublicLayout title="contact">
            {page}
        </PublicLayout>
    )
}
