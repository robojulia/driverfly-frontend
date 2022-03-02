import Link from 'next/link';
import Breadcrumbs from 'nextjs-breadcrumbs';
import Layout from "../components/layouts";

export default function FAQ() {
    return (
        <>


            <div className="top-links-sec">
                <div className="container">
                    <div className="top-links-inner d-flex align-items-center justify-content-between">
                        <h2>FAQ</h2>
                        < Breadcrumbs />
                    </div>
                </div>
            </div>

            <div className="faq-sec">
                <div className="container">
                    <div className="row">
                        <div className="col-sm-12 col-lg-6">
                            <div className="faq-inner pl-3">
                                <form action="#" method="#">
                                    <div className="input-group shadow-sm">
                                        <input type="text" placeholder="Search" name="s" className="form-control border-0  p-4 " />
                                        <span className="input-group-btn"> <button type="submit" className="btn btn-sm btn-search"><i className="fa fa-search" aria-hidden="true"></i></button> </span>
                                        <input type="hidden" name="post_type" value="post" className="post_type p-4" />
                                    </div>
                                </form>
                                <div className="faq_question_widget ">
                                    <h3 className="title">Recent Questions</h3>
                                    <div className="widget_list">
                                        <ul className="list_details">
                                            <li>
                                                <a href="">Is the career in trucking right for me?</a>
                                            </li>
                                            <li>
                                                <a href=""> Can I work part time/ or weekends only?</a>
                                            </li>
                                            <li>   <a href="">Should I get hired on as a 1099 or W2?</a></li>
                                            <li>
                                                <a href=""> How do I get a job in trucking?</a>
                                            </li>
                                            <li>  <a href="">Should I get endorsements?</a></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-12 col-lg-6">
                            <div className="faq-outer">
                                <h2 className="mt-0 pb-3 font-weight-normal">Frequently Asked Questions</h2>
                                <div className="accordion mt-4" id="accordionExample">
                                    <div className="card">
                                        <div className="card-header" id="headingOne">
                                            <h2 className="clearfix mb-0">
                                                <a className="btn btn-link font-weight-bold font-weight-bold" data-toggle="collapse" data-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne"> I can’t remember my user id and/or password, can you reset it?</a>
                                            </h2>
                                        </div>
                                        <div id="collapseOne" className="collapse show" aria-labelledby="headingOne" data-parent="#accordionExample">
                                            <div className="card-body">
                                                <p>If you’ve lost both your password and username, reach out to customer care at support@driverhiringusa.com and enter subject line “Lost Username”.</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card">
                                        <div className="card-header" id="headingTwo">
                                            <h2 className="mb-0">
                                                <a className="btn btn-link font-weight-bold collapsed" data-toggle="collapse" data-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo"> I am having trouble with the online process, is there an alternative method to apply?</a>
                                            </h2>
                                        </div>
                                        <div id="collapseTwo" className="collapse" aria-labelledby="headingTwo" data-parent="#accordionExample">
                                            <div className="card-body">
                                                <p>Yes, you can simply apply for a job without logging in by clicking the facebook icon below (if you have a facebook profile) or by clicking apply without registration.</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card">
                                        <div className="card-header" id="headingThree">
                                            <h2 className="mb-0">
                                                <a className="btn btn-link font-weight-bold collapsed" data-toggle="collapse" data-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree"> Do your services cost money for drivers?</a>
                                            </h2>
                                        </div>
                                        <div id="collapseThree" className="collapse" aria-labelledby="headingThree" data-parent="#accordionExample">
                                            <div className="card-body">
                                                <p>No. Our services are absolutely free for drivers looking to find jobs. Moreover, by registering in our system, you can become eligible to work with a dedicated recruiter who will work to get you the best pay and home time possible.</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card">
                                        <div className="card-header" id="headingFour">
                                            <h2 className="mb-0">
                                                <a className="btn btn-link font-weight-bold collapsed" data-toggle="collapse" data-target="#collapseFour" aria-expanded="false" aria-controls="collapseFour">What benefits does DriverFly offer?</a>
                                            </h2>
                                        </div>
                                        <div id="collapseFour" className="collapse" aria-labelledby="headingFour" data-parent="#accordionExample">
                                            <div className="card-body">
                                                <p>For CDL Drivers, it’s a tool that allows you to get placed fast and with a quality company who invests in their drivers. You can also sign up to receive job alerts and stay informed on the latest news and discounts we have across the US.</p>
                                                <p>For companies looking to hire, DriverFly offers a HUGE pool of drivers for you to reach with your job offerings as well as a streamlined approach to tracking and managing your drivers through the hiring funnel.</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card">
                                        <div className="card-header" id="headingFive">
                                            <h2 className="mb-0">
                                                <a className="btn btn-link font-weight-bold collapsed" data-toggle="collapse" data-target="#collapseFive" aria-expanded="false" aria-controls="collapseFive">How can I find out who is the hiring manager or lead recruiter on this posting?</a>
                                            </h2>
                                        </div>
                                        <div id="collapseFive" className="collapse" aria-labelledby="headingFive" data-parent="#accordionExample">
                                            <div className="card-body">
                                                <p>Email them 🙂 </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card">
                                        <div className="card-header" id="headingSix">
                                            <h2 className="mb-0">
                                                <a className="btn btn-link font-weight-bold collapsed" data-toggle="collapse" data-target="#collapseSix" aria-expanded="false" aria-controls="collapseSix">I have several accounts, can they be purged or deleted?</a>
                                            </h2>
                                        </div>
                                        <div id="collapseSix" className="collapse" aria-labelledby="headingSix" data-parent="#accordionExample">
                                            <div className="card-body">
                                                <p>Track your results on the local or global market , depending on your needs. You can track everything in the most popular search engines – Google, Bing, Yahoo and Yandex. Improve your search performance and increase traffic with our turn-key. </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card">
                                        <div className="card-header" id="headingSeven">
                                            <h2 className="mb-0">
                                                <a className="btn btn-link font-weight-bold collapsed" data-toggle="collapse" data-target="#collapseSeven" aria-expanded="false" aria-controls="collapseSeven">When can I expect to hear back from the hiring department?</a>
                                            </h2>
                                        </div>
                                        <div id="collapseSeven" className="collapse" aria-labelledby="headingSeven" data-parent="#accordionExample">
                                            <div className="card-body">
                                                <p>Expected response rates are around 8 hours on average. However, many of our candidates are known to reply within just a few hours from the time of application, depending on when the driver applies. </p>
                                            </div>
                                        </div>
                                    </div>


                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}
FAQ.getLayout = function getLayout(page) {
    return (
        <Layout>
            {page}
        </Layout>
    )
}