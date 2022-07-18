import Link from 'next/link';
import { PublicLayout } from "../components/layouts/PublicLayout";
import FilterResult from '../components/filter-results/filter-results'
import Owneroperator from '../public/css/Owneroperator.module.css'
import Breadcrumb from "../components/breadcrumbs/Breadcrumb";
import { useRouter } from 'next/router'

export default function Owneroperators() {

    const router = useRouter()

    const handleSubmit = (e) => {
        router.push({
            pathname: 'find-jobs',
            query: { "employment_type": 'OWNER_OPERATOR' },
        })
    }

    return (
        <>
            <div className="top-links-sec">
                <div className="container">
                    <div className="top-links-inner d-flex align-items-center justify-content-between">
                        <h2>Owner Operators</h2>
                        < Breadcrumb />
                    </div>
                </div>
            </div>
            <div className="filter-sec">
                <div className="container">
                    <div className={Owneroperator.owneroperators}>
                        <h2 className="text-center text-white lg-pt-5 pt-3">Owner Operators</h2>
                        <p className="mt-5 text-white">Are you looking to lease on to a Motor Carrier? We’ve got opportunities for you too!
                            Go to the job search and select owner operator for job type.
                        </p>
                        <div className={Owneroperator.btn__custom}>
                            <button className="form-control" className="bt btn-lg mt-5 text-center" onClick={handleSubmit}>Lease On To A Carrier</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )

}

Owneroperators.getLayout = function getLayout(page){
    return (
        <PublicLayout title="OWNER_OPERATOR">
            {page}
        </PublicLayout>
    )
}
