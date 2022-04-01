import Link from 'next/link';
import Layout from "../../components/layouts";
import Pric from '../../public/css/Pricing.module.css'
import MonthlyPricing from '../../components/pricing/monthly'
import YearlyPricing from '../../components/pricing/yearly'
import React,{useState} from 'react';
import Breadcrumbs from 'nextjs-breadcrumbs';
export default function Pricing() {

const [showMonthly, setShowMonthly] = useState(true);


function updateState(){

    setShowMonthly(!showMonthly);
    
}


return (
<>
<div className="top-links-sec">
   <div className="container p-0">
        <div className="top-links-inner d-flex align-items-center justify-content-between">
            <h2>Pricing</h2>
            < Breadcrumbs />
        </div>
    </div>
</div>
   <div className="container mb-5 p-lg-2 ">
        <p className="text-center mt-5 text-secondary">Are you a driver? <Link href="/signup"><a className={Pric.link} >Sign up</a></Link> and apply to jobs for free</p>
        <h2 className='text-center mt-5'>Motor Carrier Company Packages</h2>
    </div>
        <div className='container p-0'>
        <div className={Pric.pricesec}>
            <h4 className='font-weight-normal mb-4'>Packages</h4>
            <div className="form-check form-switch p-0">
                <span className='mr-5 align-sub'>Monthly</span>
                <span className='ml-5'>
                 <input className="form-check-input p-0" onClick={updateState} type="checkbox" role="switch" id="flexSwitchCheckChecked"  />
                 </span>
                <span> Yearly</span>
            </div>
            {
                showMonthly ? <MonthlyPricing />
                :
                <YearlyPricing />

            }
          
        </div>
    </div>  
    < div className=' estmate_pric__sec'>
        <div className="container p-lg-0">
            <p className='my-4'>* Resultant estimated benefits are as follows:</p>
            <div className="row">
                <div className="col-lg-4 col-md-4 col-12">
                    <p className={Pric.pkg}>Package</p>
                    <p className='my-2 text-secondary text-lg-left text-center'>Basic</p>
                    <p className='my-2 text-secondary  text-lg-left text-center'>Standard</p>
                    <p className='my-2 text-secondary  text-lg-left text-center'>Premium</p>
                    <p className='my-2 text-secondary  text-lg-left text-center'>Enterprise</p>
                </div>
                <div className="col-lg-4 col-md-4 col-12">
                    <p className={Pric.averagebg}>Average Resultant Cost Per Hire</p>
                    <p className='my-2 text-secondary text-center'>$1800</p>
                    <p className='my-2 text-secondary text-center'>$1650</p>
                    <p className='my-2 text-secondary text-center'>$1300</p>
                    <p className='my-2 text-secondary text-center'>$1050</p>
                </div>
                <div className="col-lg-4 col-md-4 col-12">
                    <p className={Pric.averagebg}>Average Monthly Hires</p>
                    <p className='my-2 text-secondary text-center'>1.5</p>
                    <p className='my-2 text-secondary text-center'>6</p>
                    <p className='my-2 text-secondary text-center'>26</p>
                    <p className='my-2 text-secondary text-center'> 105</p>
                </div>
            </div>
            <div className={Pric.offer}>
                <h3 className="text-center my-5 text-secondary">Interested in a package? 
                <Link href="/contact">
                <a className={Pric.contactlink} > Contact us for a quote!</a>
                </Link>
                 
                </h3>
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
        </div> 
        <div className="container my-5 p-0 ">
            <div className={Pric.services}>
                <h2 className="text-white text-center font-weight-normal">More Reasons to Use DriverFly</h2>
                <div className="row p-3 ">
                    <div className="col-sm ">
                        <h4 className=' my-3 font-weight-normal'>Spending less time searching.</h4>
                        <p className='text-white'> We know you’ve got a business to run. Don’t spend all your time searching the depths of the internet when you can find you next hire here! Access hundreds of qualifying candidates today.</p>
                    </div>
                    <div className="col-sm ">
                       <h4 className=' my-3 font-weight-normal'>Attract the best candidates.</h4>
                        <p className='text-white'> To reach more qualified drivers, you need a top-notch profile. We provide you with easy-to-use tools to help you personalize your profile and make it stand out.</p>
                    </div>
                    <div className="col-sm ">
                       <h4 className=' my-3 font-weight-normal'>Find drivers near you.</h4>
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