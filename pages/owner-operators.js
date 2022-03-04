import Link from 'next/link';
import Layout from "../components/layouts";
import FilterResult from '../components/filter-results/filter-results'
import Owneroperator from '../public/css/Owneroperator.module.css'
import Breadcrumbs from 'nextjs-breadcrumbs';


export default function Owneroperators() {
    return (
        <>
            <div className="top-links-sec">
                <div className="container">
                    <div className="top-links-inner d-flex align-items-center justify-content-between">
                        <h2>Owner Operators</h2>
                        < Breadcrumbs />
                    </div>
                </div>
            </div>
            <div className="filter-sec">
                <div className="container">
                    <div className="row">
                    <div className="col-lg-8 mr-lg-5  mr-0 p-0 ">
                    <div className={Owneroperator.owneroperators}>
                   <h2 className="text-center text-white lg-pt-5 pt-3">Owner Operators</h2>
                   <p className="mt-5 text-white">Are you looking to lease on to a Motor Carrier? We’ve got opportunities for you too!
                    Go to the job search and select owner operator for job type.</p>
                    <div className={Owneroperator.btn__custom}>
                        <button className="form-control"className="bt btn-lg mt-5 text-center">Lease On To A Carrier</button>
                    </div>
                   </div>
                    </div>
                        <div className="col-12 col-lg-3 lg-mt-0 mt-5">
                        < FilterResult />
                        </div>
                      
                    </div>
                </div>
            </div>
        </>
    )

}

Owneroperators.getLayout = function getLayout(page){
    return (
        <Layout>
            {page}
        </Layout>
    )
}