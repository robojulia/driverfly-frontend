import Link from 'next/link';
import Layout from "../../components/layouts";
import Pric from '../../public/css/Pricing.module.css'
export default function Pricing() {
return (
<>
<div className="top-links-sec">
   <div className="container">
        <div className="top-links-inner d-flex align-items-center justify-content-between">
            <h2>Pricing</h2>
            <ul className="d-flex">
                <li><a href="index.html" className="nav-link text-dark px-0">Home <i className="fa fa-caret-right px-2" aria-hidden="true"></i></a></li>
                <li><a href="#" className="nav-link text-dark px-0">Pricing</a></li>
            </ul>
        </div>
    </div>
</div>
   <div className="container mb-5 p-lg-2 p-0">
        <p className="text-center mt-5 text-secondary">Are you a driver? <a className={Pric.link} href="#">Sign up</a> and apply to jobs for free</p>
        <h2 className='text-center mt-5'>Motor Carrier Company Packages</h2>
    </div>
        <div className='container p-0'>
        <div className={Pric.pricesec}>
            <div class="form-check form-switch">
            <input class="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckChecked"  />
            </div>
            <div className='row show'>
                <div className='col'>
                <div className={Pric.basic}>
                   <h2 className='my-3'>Basic Subscription</h2>
                   <p className='mb-3'> 1 complementary listing</p>
                   <p className='mb-3'>Job distribution to major job boards</p>
                   <p className='mb-3'>Track and contact applicants</p>
                   <div className='pric-footer my-5'>
                        <p className='mb-3'>You could…</p>
                        <p className='mb-3'>Save 50 hours of recruiting per hire</p>
                        <p className='mb-3'>Get tens of views per job*</p>
                    </div>
                    <button type="button" className='btn  w-100 p-3'>Get Started</button>
                 </div>
                 </div>
                <div className='col'>
                    <div className={Pric.premium}>
                        <h2 className='my-3'>Premium Subscription</h2>
                        <p className='mb-3'> 3 complementary listing</p>
                        <p className='mb-3'>Job distribution to major job boards</p>
                        <p className='mb-3'>Track and contact applicants</p>
                        <p className='mb-3'>Promotion on social media platforms</p>
                        <p className='mb-3'>Digital driver application</p>
                        <div className='pric-footer my-5'>
                            <p className='mb-3'>You could…</p>
                            <p className='mb-3'>Save 25 hours of recruiting per hire</p>
                            <p className='mb-3'>Get hundreds of views per job*</p>
                        </div>
                        <button type="button" className='btn bg-white w-100 p-3'>Get Started</button>
                    </div>
                 </div>
                 <div className='col'>
                   <h2 className='my-3'>Premium Subscription</h2>
                   <p className='mb-3'> 3 complementary listing</p>
                   <p className='mb-3'>Job distribution to major job boards</p>
                   <p className='mb-3'>Track and contact applicants</p>
                   <p className='mb-3'>Promotion on social media platforms</p>
                   <p className='mb-3'>Digital driver application</p>
                   <div className='pric-footer my-5'>
                        <p className='mb-3'>You could…</p>
                        <p className='mb-3'>Save 50 hours of recruiting per hire</p>
                        <p className='mb-3'>Get tens of views per job*</p>
                    </div>
                    <button type="button" className='btn bg-white'>Get Started</button>
                 </div>
            </div>
        </div>
    </div>    
        <div className="container">
            <p className='my-4'>* Resultant estimated benefits are as follows:</p>
            <div className="row">
                <div className="col-lg-4 col-sm-4 col-12">
                    <p className={Pric.pkg}>Package</p>
                    <p className='my-2 text-secondary'>Basic</p>
                    <p className='my-2 text-secondary'>Standard</p>
                    <p className='my-2 text-secondary'>Premium</p>
                    <p className='my-2 text-secondary'>Enterprise</p>
                </div>
                <div className="col-lg-4  col-sm-4 col-12">
                    <p className={Pric.Averagebg}>Average Resultant Cost Per Hire</p>
                    <p className='my-2 text-secondary text-lg-center'>$1800</p>
                    <p className='my-2 text-secondary text-lg-center'>$1650</p>
                    <p className='my-2 text-secondary text-lg-center'>$1300</p>
                    <p className='my-2 text-secondary text-lg-center'>$1050</p>
                </div>
                <div className="col-lg-4  col-sm-4 col-12l">
                    <p className={Pric.Averagebg}>Average Monthly Hires</p>
                    <p className='my-2 text-secondary text-lg-center'>1.5</p>
                    <p className='my-2 text-secondary text-lg-center'>6</p>
                    <p className='my-2 text-secondary text-lg-center'>26</p>
                    <p className='my-2 text-secondary text-lg-center'> 105</p>
                </div>
            </div>
            <div className={Pric.offer}>
                <h3 className="text-center my-5 text-secondary">Interested in a package? <a className={Pric.contactlink} href="#">Contact us for a quote!</a></h3>
                <h1 className={Pric.whatweoffer}>What We Offer</h1>
            </div>
            <div className="row">
                <div className="col-lg-6   col-12">
                    <h1 className=" mb-4">Personalized Digital Driver Applications</h1>
                    <p className='lead'>We want you to be the best your company can be. As such, you can reach 100% more drivers with our digital driver applications customized to your company branding that come with your premium or platinum package.</p>
                    <h1 className='mt-5 mb-4'>Increased Reach</h1>
                    <p className='lead mt-2 '>Receive access to offers from recruiters all across the United States and minimize your time to hire!</p>
                </div>
                <div className="col-lg-6">
                    <img src="../img/company.webp" />
                </div>
            </div>
        </div>
        <div class="container my-5">
            <div className={Pric.services}>
                <h2 className="text-white">More Reasons to Use DriverFly</h2>
                <div class="row p-3 ">
                    <div class="col-sm my-5">
                        <h3 className=' my-3'>Spending less time searching.</h3>
                        <p className='text-white'> We know you’ve got a business to run. Don’t spend all your time searching the depths of the internet when you can find you next hire here! Access hundreds of qualifying candidates today.</p>
                    </div>
                    <div class="col-sm my-5">
                       <h3 className=' my-3'>Attract the best candidates.</h3>
                        <p className='text-white'> To reach more qualified drivers, you need a top-notch profile. We provide you with easy-to-use tools to help you personalize your profile and make it stand out.</p>
                    </div>
                    <div class="col-sm my-5">
                       <h3 className=' my-3'>Find drivers near you.</h3>
                        <p className='text-white'> Use our detailed map and easily find candidates based near you that match your job requirements. You can instantly ask them to apply to your job opening. For platinum subscribers, anytime your job description matches a driver’s search, they’ll be emailed about your position.</p>
                    </div>
                    
                </div>
            </div>
        </div>
</>
)
}
Pricing.getLayout = function getLayout(page){
return (
<Layout>
   {page}
</Layout>
)
}