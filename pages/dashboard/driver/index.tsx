import FullLayout from "../../../components/dashboard/layouts/full-layout";
import { Col, Row } from "react-bootstrap";
import style from '../../../public/dashboard/styles/css/driver/dashboard.module.css';
import { useState } from "react";
import Link from 'next/link';

import PageLayout from "../../../components/layouts/page/page-layout";
import { useTranslation } from "../../../hooks/use-translation";
import { ApplicantStatus } from "../../../enums/applicants/applicant-status.enum";
import ApplicantApi from "../../api/applicant";
import { useEffectAsync } from "../../../utils/react";
import { ApplicantEntity } from "../../../models/applicant/applicant.entity";
import SuggestedJobs from "../../../components/dashboard/driver/suggested-jobs";

const STATS_PROTO = {
    "APPLIED": 0,
    "SHORTLISTED": 0,
    "HIRED": 0,
    "REJECTED": 0,
};

export default function Dashboard() {

    const { t } = useTranslation();

    const applicantApi = new ApplicantApi();

    const [stats, setStats] = useState(STATS_PROTO)

    const [driver, setDriver] = useState<ApplicantEntity>({});

    const getDashboardData = async () => {
        const aJobs = await applicantApi.me.jobs();
        const newStats = Object.assign({}, STATS_PROTO);
        aJobs.forEach(j => {
            switch (j.status) {
                case ApplicantStatus.NEW_SOURCED:
                case ApplicantStatus.NEW_REFERRED:
                case ApplicantStatus.NEW_APPLIED_SHORT_FORM:
                case ApplicantStatus.NEW_APPLIED_FULL_APP:
                case ApplicantStatus.ACTIVE_UNRESPONSIVE:
                case ApplicantStatus.ACTIVE_CONTACTED_INTERESTED:
                case ApplicantStatus.IN_PROCESS_NEED_TO_CALLBACK:
                case ApplicantStatus.IN_PROCESS_CONTACTED_CONSIDER_FOR_POSITIONS:
                case ApplicantStatus.IN_PROCESS_CONTACTED_HOT_LEAD:
                case ApplicantStatus.IN_PROCESS_INTERVIEWED:
                case ApplicantStatus.IN_PROCESS_PASSED_INSURANCE:
                case ApplicantStatus.IN_PROCESS_PASSED_BACKGROUND_CHECK:
                case ApplicantStatus.IN_PROCESS_PASSED_DRUG_TEST:
                case ApplicantStatus.IN_PROCESS_OFFERED_JOB:
                    newStats.APPLIED++;
                    break;
                case ApplicantStatus.INACTIVE_CONTACTED_NOT_QUALIFIED:
                    newStats.REJECTED++;
                    break;
                case ApplicantStatus.IN_PROCESS_OFFERED_JOB:
                case ApplicantStatus.IN_PROCESS_OFFER_ACCEPTED:
                case ApplicantStatus.IN_PROCESS_DRIVER_ONBOARDED:
                case ApplicantStatus.IN_PROCESS_DRIVER_PLACED_IN_TRUCK:
                case ApplicantStatus.IN_PROCESS_DRIVER_COMPLETED_TRAINING:
                case ApplicantStatus.COMPLETED_EMPLOYED:
                case ApplicantStatus.COMPLETED_TRANSFERED_TO_ROLE:
                case ApplicantStatus.COMPLETED_PROMOTED_TO_ROLE:
                    newStats.HIRED++;
                    break;
            }
        });
        setStats(newStats);
    }

    useEffectAsync(async () => {
        await getDashboardData()
        const driver = await applicantApi.me.get();
        setDriver(driver);
    }, []);

    return (
        <PageLayout
            title="DASHBOARD"
        >
            <Row className='justify-content-center text-center d-flex'>
                <div className={` py-5 cards__bg w-23 text-white  ${style.job_info_container}`} >
                    <h2 className="text-white font-weight-bolder">
                        {stats.APPLIED}
                    </h2>
                    <h3 className="font-weight-bolder text-white">{t("ApplicantStatus.APPLIED")}</h3>
                </div>
                <div className={` py-5 bg_green cards__bg w-23   ${style.job_info_container}`}>
                    <h2 className="font-weight-bolder text-white">
                        {stats.SHORTLISTED}
                    </h2>
                    <h3 className="font-weight-bolder text-white">{t("ApplicantStatus.SHORTLISTED")}</h3>
                </div>
                <div className={` py-5 cards__bg w-23  text-white  ${style.job_info_container}`} >
                    <h2 className="font-weight-bolder text-white ">
                        {stats.HIRED}
                    </h2>
                    <h3 className="font-weight-bolder text-white">{t("ApplicantStatus.HIRED")}</h3>
                </div>
                <div className={` py-5 cards__bg w-23   ${style.job_info_container}`}>
                    <h2 className="text-white font-weight-bolder">
                        {stats.REJECTED}
                    </h2>
                    <h3 className="text-white">{t("ApplicantStatus.REJECTED")}</h3>
                </div>
            </Row>
            <Row className="mt-4">
                <div className="col-lg-3 col-md-4 col-4 col-sm-4">
                    <b>{t("CDL_CLASS")}</b>
                    <p className="mt-3"> {driver.license_type || 'N/A'}</p>
                </div>
                <div className=" col-lg-3 col-md-4 col-4 col-sm-4 ">
                    <b>{t("years_cdl_experience")}</b>
                    <p className="mt-3">{driver.years_cdl_experience || 0}</p>

                </div>
                <div className="col-lg-3 col-md-4 col-4 col-sm-4 ">
                    <b>{t("driver_license_number")}</b>
                    <p className="mt-3"> {driver.license_number || "N/A"} </p>
                </div>
                <div className="col-lg-3 col-md-12 col-12 col-sm-12">
                    <p></p>
                    <Link href="/dashboard/driver/settings/applicant">
                        <button className={`text-white p-2 m-0 ${style.btn_blue}`}>{t("update_status")}</button>
                    </Link>
                    <Link href="/dashboard/driver/jobs">
                        <button className={`text-white p-2 m-2 ${style.btn_blue}`}>{t("find_new_job")}</button>
                    </Link>
                </div>

            </Row>
            <Row>
                <SuggestedJobs />
            </Row>

        </PageLayout>
    )
};

Dashboard.getLayout = function getLayout(page) {
    return (
        <FullLayout>
            {page}
        </FullLayout>
    )
}
