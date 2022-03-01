import Link from 'next/link';
import Layout from "../components/layouts";
import  BlogDetail from '../public/css/BlogDetail.module.css'
// import SocilShare from '../components/share-link/ShareLink';
// import JonInformation from '../components/job-information-sidebar/JobInformation';
// import JobDescription from '../components/job-description/JobDescription';

export default function Detail() {
    return (
        <>

            <div className="job-deatails-sec">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-8">
                            {/* < JobDescription />
                            < SocilShare />
                            < RelatedJobs /> */}
                            <img src="img/Freight1.jpg" className='w-100' />
                            <p className='mt-3'>Changes in Trucking</p>
                            <h2 className='font-weight-normal mb-3'> What Is This New ELDT Program You Speak Of?</h2>
                            <p className='text-secondary'>Starting February 7, 2022, the Entry-Level Driver Training (ELDT) regulations will be changed, now requiring all aspiring CDL drivers to receive training from providers listed on the FMSCA’s Training Provider Registry before they can take their CDL skills test. </p>
                            <h2 className='font-weight-normal mb-3'>Are you affected?</h2>
                            <p className='text-secondary'>While there are some exceptions, such as military personnel, farmers, and firefighters, most entry-level drivers will have to meet this new training requirement in order to:</p>
                            <ul className={BlogDetail.bloglist}>
                                <li>The Great Gatsby</li>
                                <li>The Grapes of Wrath</li>
                                <li>Ulysses</li>
                            </ul>
                        </div>
                        <div className="col-lg-4">
                            {/* < JonInformation /> */}
                        </div>
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