import { PublicLayout } from "../components/layouts/public-layout";
import Owneroperator from '../public/css/owner-operator.module.css'
import Breadcrumb from "../components/breadcrumbs/breadcrumb";
import { useRouter } from 'next/router'
import { useTranslation } from '../hooks/use-translation';
import Head from "next/head";

export default function Owneroperators() {

    const { t } = useTranslation();
    const router = useRouter()

    const handleSubmit = (e) => {
        router.push({
            pathname: 'find-jobs',
            query: { "employment_type": 'OWNER_OPERATOR' },
        })
    }

    return (
        <>
        <Head>
        <title>Owner Operators - Empowering Independent Truckers </title>
        <meta
          name="description"
          content="Explore how DriverFly empowers owner operators. Discover resources and opportunities tailored to independent trucking professionals."
          key="desc"
        />
      </Head>
            <div className="top-links-sec">
                <div className="container">
                    <div className="top-links-inner d-flex align-items-center justify-content-between">
                        <h2>{t("OWNER_OPERATORS")}</h2>
                        < Breadcrumb />
                    </div>
                </div>
            </div>
            <div className="filter-sec">
                <div className="container">
                    <div className={Owneroperator.owneroperators}>
                        <h2 className="text-center text-white lg-pt-5 pt-3">{t("OWNER_OPERATORS")}</h2>
                        <p className="mt-5 text-white">{t("ARE_YOU_LOOKING_TO_LEASE_ONTO_MOTOR_CARRIER_FOR_JOB_TYPE")}</p>
                        <div className={Owneroperator.btn__custom}>
                            <button className=" form-control bt btn-lg mt-5 text-center" onClick={handleSubmit}>{t("LEASE_ONTO_A_CARRIER")}</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )

}

Owneroperators.getLayout = function getLayout(page) {
    return (
        <PublicLayout title="OWNER_OPERATOR">
            {page}
        </PublicLayout>
    )
}
