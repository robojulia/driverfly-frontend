import Head from 'next/head';
import Link from 'next/link';
import Layout from "../components/layouts";
import ReCAPTCHA from "react-google-recaptcha";
import Breadcrumb from "../components/breadcrumbs/Breadcrumb";
import { ArrowLeft, ArrowRight, Newspaper, PersonBadgeFill, QuestionCircle } from 'react-bootstrap-icons';



export default function Contact() {
    function onChange(value) {
        console.log("Captcha value:", value);
      }
    return (
        <>
            <Head>
                <title>Contact - DriverFly</title>
            </Head>



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
                            <form action="" method="post">
                                <h3>We want to hear form you!</h3>
                                <div className="form-group">
                                    <div className="row">
                                        <div className="col"><input type="text" className="form-control shadow-sm p-4" name="your_name" placeholder="Your Name" required="required" /></div>
                                        <div className="col"> <input type="email" className="form-control shadow-sm p-4" name="email" placeholder="Email Address" required="required" /></div>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <input type="text" className="form-control shadow-sm p-4" name="subject" placeholder="Subject" required="required" />
                                </div>
                                <div className="form-group">
                                    <textarea name="message" id="message" cols="20" rows="6" className="form-control shadow-sm " placeholder="Message"></textarea>
                                </div>
                                <ReCAPTCHA
                                    sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
                                    onChange={onChange}
                                />
                                <div className="form-group">
                                    <button type="submit" className="btn btn-danger float-right py-3 px-5 mb-4">Submit <ArrowRight /> </button>
                                </div>
                            </form>
                        </div>
                    </div>
                    <div className="row mt-5 pt-4 contact-icon">
                        <div className="col-md-4">
                            <div className="contact-icon-inner">
                                < PersonBadgeFill />

                            </div>
                            <h3 className="title text-center  my-4"><Link href="/signup"><a className='text-black'>Want to join us?</a></Link></h3>
                        </div>
                        <div className="col-md-4">
                            <div className="contact-icon-inner">
                              <Newspaper />



                            </div>
                            <h3 className="title text-center  my-4"><Link href="/blog"><a className='text-black'>Read our latest news</a></Link></h3>

                        </div>
                        <div className="col-md-4">
                            <div className="contact-icon-inner">
                              <QuestionCircle />
                            </div>
                            <h3 className="title text-center  my-4"><Link href="/faq"><a className='text-black'>Have questions?</a></Link></h3>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
Contact.getLayout = function getLayout(page) {
    return (
        <Layout>
            {page}
        </Layout>
    )
}
