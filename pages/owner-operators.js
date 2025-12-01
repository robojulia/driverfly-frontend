import { useRouter } from 'next/router'
import Head from "next/head";
import { PublicLayout } from "../components/layouts/public-layout";
import Owneroperator from '../public/css/owner-operator.module.css'
import { useTranslation } from '../hooks/use-translation';

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
                <title>{t("OWNER_OPERATOR_META_TITLE")}  </title>
                <meta
                    name="description"
                    content={t("OWNER_OPERATOR_META_DESC")} key="desc"
                />
            </Head>
            <div className="filter-sec">
                <div className="container">
                    <div className={Owneroperator.owneroperators}>
                        <h2 className="text-center text-white lg-pt-5 pt-3">Owner-Operators</h2>
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
