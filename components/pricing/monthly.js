import Link from 'next/link'
import Pric from '../../public/css/Pricing.module.css'
export default function MonthlyPricing() {
    return (
        <>
            <div className='row show'>
                <div className='col-lg-4 col-12'>
                    <div className={Pric.basic}>
                        <h4 className='my-4 text-center text-lg-left font-weight-normal'>Basic Subscription</h4>
                        <p className='mb-3'> 1 complementary listing</p>
                        <p className='mb-3'>Job distribution to major job boards</p>
                        <p className='mb-3'>Track and contact applicants</p>
                        <div className={Pric.pricfooter}>
                            <p className='mb-3'>You could…</p>
                            <p className='mb-3'>Save 50 hours of recruiting per hire</p>
                            <p className='mb-3'>Get tens of views per job*</p>
                        </div>
                        <Link href="/signup">
                            <button type="button" className='btn  w-100 p-3'>Get Started</button>
                        </Link>
                    </div>
                </div>
                <div className='col-lg-4 col-12'>
                    <div className={Pric.premium}>
                        <h4 className='my-4 text-white text-center text-lg-left font-weight-normal'>Premium Subscription</h4>
                        <p className='mb-3'> 3 complementary listing</p>
                        <p className='mb-3'>Job distribution to major job boards</p>
                        <p className='mb-3'>Track and contact applicants</p>
                        <p className='mb-3'>Promotion on social media platforms</p>
                        <p className='mb-3'>Digital driver application</p>
                        <div className={Pric.pricfooter}>
                            <p className='mb-3'>You could…</p>
                            <p className='mb-3'>Save 25 hours of recruiting per hire</p>
                            <p className='mb-3'>Get hundreds of views per job*</p>
                        </div>
                        <Link href="/signup">
                            <button type="button" className='btn bg-white w-100 p-3'>Get Started</button>
                        </Link>
                    </div>
                </div>
                <div className='col-lg-4 col-12'>
                    <div className={Pric.platinum}>
                        <h4 className='my-4 text-center text-lg-left font-weight-normal'>Platinum Subscription</h4>
                        <p className='mb-3'> 5 complementary listings</p>
                        <p className='mb-3'>Job distribution to major job boards</p>
                        <p className='mb-3'>Track and contact applicants</p>
                        <p className='mb-3'>Promotion on social media platforms</p>
                        <p className='mb-3'>Digital driver application</p>
                        <p>Spotlight on homepage for 48 hours</p>
                        <div className={Pric.pricfooter}>
                            <p className='mb-3'>You could…</p>
                            <p className='mb-3'>Save 50 hours of recruiting per hire</p>
                            <p className='mb-3'>Get thousands of views per job*</p>
                        </div>
                        <Link href="/signup">
                            <button type="button" className='btn  w-100 p-3'>Get Started</button>
                        </Link>
                        
                    </div>
                </div>
            </div>
        </>
    )
}