import Link from 'next/link';
import Layout from "../components/layouts";
import BlogDetail from '../public/css/BlogDetail.module.css'
import SocilShare from '../components/share-link/ShareLink';
import JonInformation from '../components/job-information-sidebar/JobInformation';
import JobDescription from '../components/job-description/JobDescription';
import BlogSidebar from '../components/blog-sidebar/Blog-Sidebar';
import Breadcrumbs from 'nextjs-breadcrumbs';
import Tags from '../components/tags/Tags';

export default function Detail() {
    return (
        <>
            <div className="top-links-sec">
                <div className="container">
                    <div className="top-links-inner d-flex align-items-center justify-content-between">
                        <h2>Owner Operators</h2>
                       <Breadcrumbs />
                    </div>
                </div>
            </div>

            <div className={BlogDetail.job__deatails__sec}>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-8 ">
                            <img src="img/Freight1.jpg" className='w-100' />
                            <p className='mt-3'>Changes in Trucking</p>
                            <h2 className='font-weight-normal'> What Is This New ELDT Program You Speak Of?</h2>
                            <div className="top-info mb-3">
                                <a href="" className='text-secondary'><i className="fa fa-clock-o" aria-hidden="true"></i> January 26, 2022</a>
                                <span className="comments">  <i className="fa fa-comment ml-4"></i>  0 Comments</span>
                            </div>
                            <p >Starting February 7, 2022, the Entry-Level Driver Training (ELDT) regulations will be changed, now requiring all aspiring CDL drivers to receive training from providers listed on the FMSCA’s Training Provider Registry before they can take their CDL skills test. </p>
                            <h2 className='font-weight-normal my-4'>Are you affected?</h2>
                            <p >While there are some exceptions, such as military personnel, farmers, and firefighters, most entry-level drivers will have to meet this new training requirement in order to:</p>
                            <ul className={BlogDetail.bloglist}>
                                <li>get a Class A or B license for the first time OR</li>
                                <li>upgrade from a Class B to a Class A license OR</li>
                                <li>get a school bus, passenger, or hazardous materials endorsement for the first time.</li>
                            </ul>
                            <h2 className='font-weight-normal my-4'>Attention all aspiring drivers!</h2>
                            <p>However, if you received or will receive your CLP/CDL/endorsement before February 7th, you do not have to complete any extra training before starting your next trucking job. If you haven’t found a job yet though, don’t worry!
                                < Link href='/'><a > DriverFly</a></Link> can help match recent graduates with trucking jobs throughout the United States, all for free!</p>
                            <p>Besides drivers, training providers will also be affected. To be qualified as one, you must now meet all its eligibility requirements and then register to be listed on the Training Provider Registry. That means that if you’re a motor carrier not listed on the TPR, you’ll only be able to hire drivers who already have a CDL. If you’re having trouble finding drivers though, DriverFly can also be of help. Contact us to get your job listed on our job board and start getting qualified applicants now!</p>
                            <h2 className='font-weight-normal my-4'>Attention all aspiring drivers!</h2>
                            <p>If you have a CLP or will be getting one before the new regulations go into effect, make sure you get your CDL or endorsement before your permit expires. Anyone who gets a CLP after that date will have to go through the extra training.</p>
                            <p>If you don’t have a CLP yet, you might want to get one before February 7th to start working towards your CDL earlier. If you have to go through the extra training though, just visit FMCSA’s site at <Link href="" ><a>https://tpr.fmcsa.dot.gov </a></Link>to view the TPR and find a provider. </p>
                            <p>If you’re a motor carrier looking to be listed on the TPR, visit  <Link href="" ><a>https://tpr.fmcsa.dot.gov/Provider</a></Link> for more information on the requirements and registration process.</p>
                            <h2 className='font-weight-normal my-4'>Resources</h2>
                            <p>Of course, this is just an overview of the new ELDT regulations. For the official source of information, refer to <Link href=''><a>FMCSA’s site</a></Link> or the <Link href=''><a>Code of Federal Regulations.</a></Link></p>

                            < SocilShare />

                            <div className="comment mb-5">
                                <h3>Leave a Comment</h3>
                                <p>Your email address will not be published.</p>
                                <div className={BlogDetail.comment_form}>
                                    <div className="container">
                                        <div className="row p-5">
                                            <div className="col contact-outer">
                                                <form action="" method="post">
                                                    <div className="form-group">
                                                        <label>Name</label>
                                                        <div className="col p-0"><input type="text" className="form-control  p-4" name="your_name" required="required" /></div>
                                                    </div>
                                                    <div className="form-group ">
                                                        <label>Email</label>
                                                        <div className="col p-0"> <input type="email" className="form-control p-4" name="email" required="required" /></div>
                                                    </div>
                                                    <div className="form-check mb-3">
                                                        <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault" />
                                                        <label className="form-check-label" for="flexCheckDefault">
                                                            Save my name, email, and website in this browser for the next time I comment.
                                                        </label>
                                                    </div>
                                                    <div className="form-group">
                                                        <label>Comment</label>
                                                        <textarea name="message" id="message" cols="20" rows="6" className="form-control  p-4" ></textarea>
                                                    </div>
                                                    <div className="form-group">
                                                        <button type="submit" className="btn btn-danger py-3 px-5s">Submit Comment </button>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        < BlogSidebar />

                    </div>
                </div>
            </div>












        </>
    )
}

Detail.getLayout = function getLayout(page) {
    return (
        <Layout>
            {page}
        </Layout>
    )
}