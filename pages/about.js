import Head from "next/head";
import Layout from "../components/layouts";
import Breadcrumb from "../components/breadcrumbs/Breadcrumb";
import Slider from '../components/testominial-slider/Slider';
import { FileEarmarkZip, Funnel, CheckSquare, Bell, Trophy, HandIndexThumb} from 'react-bootstrap-icons';


export default function About()
{
    return (
        <>
            <Head>
                <title>About - DriverFly</title>
            </Head>

            <div className="top-links-sec">
                <div className="container p-0">
                    <div className="top-links-inner d-flex align-items-center justify-content-between">
                        <h2>About</h2>
                       < Breadcrumb/>
                    </div>
                </div>
            </div>


            <div className="about-sec">
                <div className="about-linear">
                <div className="container">
                    <div className="row">
                        <div className="col-sm-12 col-lg-4">
                            <img src="img/mockup-of-a-happy-customer-showing-off-his-t-shirt-inside-a-modern-office-26189-4.png" alt="" className="about-img img-fluid" />
                        </div>
                        <div className="col-sm-12 col-lg-8">
                            <div className="about-inner">
                                <h3>About DriverFly</h3>
                                <p>DriverFly was built as a digital platform to connect new and experienced CDL and non-CDL drivers with companies of all sizes and offerings.</p>
                                <p>Unlike traditional job boards, DriverFly caters to the DRIVER. Moreover, drivers undergo different challenges and require different information in deciding which motor carriers to go with. At DriverFly, We’ve built our system to make finding a job and connecting with motor carrier companies as easy as possible.</p>
                                <p>With jobs across the entire US, our system seeks to level the playing field by providing a reputable platform that allows all motor carriers, not just the mega carriers, to grow through successful driver relationships. Likewise, we serve as a place for drivers to have access to more jobs where they’ll be treated fairly and compensated more generously.</p>
                            </div>
                        </div>
                    </div>
                </div>
              </div>
            </div>

            <div className="how-it-work-sec about_work">
                <div className="container-fluid">
                     <h3>How It Works</h3>
                    <div className="row">
                        <div className="col-md-4">
                            <div className="card">
                                < FileEarmarkZip />
                                <div className="card-body px-0">
                                    <h5 className="card-title">Create An Account</h5>
                                    <p className="card-text">Take 5 minutes to quickly set up a profile and upload your CDL / Medical card if available.</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="card">

                                < Funnel />
                                <div className="card-body px-0">
                                    <h5 className="card-title">Filter & Search Driver Jobs</h5>
                                    <p className="card-text">Browse hundreds of jobs based on your specific criteria, including driver schedule & other parameters.</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="card">
                                < CheckSquare />
                                <div className="card-body px-0">
                                    <h5 className="card-title">Save & Apply</h5>
                                    <p className="card-text">Use the DriverFly platform to favorite jobs, forward to friends, and submit for application.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="who-we-serve-sec">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-8">
                            <h2>Who We Serve</h2>
                            <div className="row">
                                <div className="col">
                                    <div className="who-we-serve-inner">
                                        <h3>Prospective Drivers</h3>
                                        <p>Considering a new career as a truck driver? Learn all about how to get your CDL and what to expect in terms of finding work.</p>
                                        <button type="button" className="theme-general-btn">Learn More</button>
                                    </div>
                                    <div className="who-we-serve-inner">
                                        <h3>Owner Ops</h3>
                                        <p>Tired of juggling both running a company AND being a driver? If you’re an Owner Operator, you can use our platform to search companies to lease onto or connect with dispatching companies for load matching, dispatching and other back office support.</p>
                                    </div>
                                </div>
                                <div className="col">

                                    <div className="who-we-serve-inner">
                                        <h3>New Drivers</h3>
                                        <p>Just got your CDL and now looking for work? Our search engine allows you to filter to jobs based on years of CDL experience and other parameters. We also offer new drivers access to  our library of free resources found in the New Driver Corner.</p>
                                    </div>
                                    <div className="who-we-serve-inner">
                                        <h3>Growing Businesses
                                        </h3>
                                        <p>We believe the more educated your trucking company becomes, the more satisfied your drivers will be. As such, in addition to driver job matching we provide critical business related resources and guidance to growing trucking companies.</p>
                                    </div>
                                </div>
                                <div className="col">
                                    <div className="who-we-serve-inner">
                                        <h3>Experienced Drivers</h3>
                                        <p>We provide a variety of job opportunities and career guidance for both new and experienced drivers, alike.</p>
                                        <p>Not sure how to start? Get with our team to discuss your options today!</p>
                                    </div>
                                    <div className="who-we-serve-inner">
                                        <h3>Support Services
                                        </h3>
                                        <p>Got a business that supports truck drivers or motor carriers? Reach out to our team to discuss our partnership capabilities.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-sm-12 col-md-4 who-we-outer">
                            <img src="img/mockup-of-a-man-with-a-crewneck-t-shirt-leaning-on-a-truck-29466-1.png" alt="" className="who-we-img img-fluid" />
                            <div className="who-we-serve-inner mb-3">
                                <h3>Not sure where to start?</h3>
                                <p>With over 400+ clients across the US, our dedicated recruiting arm can answer any questions or support you in getting placed with a driver job that pays well and matches your needs and offerings.</p>
                                <button type="button" className="theme-general-btn">Contact Us</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="testimonial-sec about-testominial">
                <div className="container">
                    <h2 className="text-center">What Drivers Say About Us</h2>
                    < Slider />
                       <div className="row mt-5">
                           <div className="col-md-12">
                               <div className="partners">
                                   <h2>Partners</h2>
                                   <img src="img/wilds_logo_250.png" alt="" className="img-fluid" />
                                   <h3>Women in Logistics and Delivery Services (WILDS)</h3>
                                   <p>DriverFly is a proud member of WILDS, helping women find opportunities in the male-oriented trucking industry. Learn more about what WILDS does here.</p>
                               </div>
                           </div>
                       </div>
                </div>
            </div>
        </>
    )
}

About.getLayout = function getLayout(page) {
    return (
        <Layout>
            {page}
        </Layout>
    )
}