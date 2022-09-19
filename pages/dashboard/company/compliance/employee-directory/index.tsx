import FullLayout from "../../../../../components/dashboard/layouts/Layout/FullLayout";
import { useState } from "react";
import React from "react";
import { EyeFill, PenFill, TrashFill } from 'react-bootstrap-icons';
import PageLayout from "../../../../../components/layouts/page/PageLayout";
import JobApi from "../../../../api/job";
import { JobEntity } from "../../../../../models/job/job.entity";
import { useTranslation } from "../../../../../hooks/useTranslation";
import Router, { useRouter } from "next/router";
import ViewDataTable, { getDataTableColumnKey } from "../../../../../components/viewDetails/viewDataTable";
import { useAuth } from "../../../../../hooks/useAuth";
import { useEffectAsync } from "../../../../../utils/react";
import Link from "next/link";
import { Col, Row } from "react-bootstrap";
import 'react-tabs/style/react-tabs.css';
import { TabbedLayout } from "../../../../../components/layouts/page/TabbedLayout";
import BackgroundTab from "../../../../../components/dashboard/employee-directory/background";
import DaqTab from "../../../../../components/dashboard/employee-directory/daq";
import DqfTab from "../../../../../components/dashboard/employee-directory/dqf";
import VehicleInformationTab from "../../../../../components/dashboard/employee-directory/vehicle-information";
export default function EmployeeDirectory() {
    const tabs = {
        Background: <BackgroundTab />,
        DAQ: < DaqTab />,
        DQF: < DqfTab />,
        Vehicle: < VehicleInformationTab />


    };
    const { user, hasPermission } = useAuth();
    const columnSettingKey = getDataTableColumnKey("company", user, "employee-directory");

    const { t } = useTranslation();
    const router = useRouter()
    const [jobs, setJobs] = useState<JobEntity[]>([])
    const api = new JobApi();

    useEffectAsync(async () => {
        console.log("refresh fired");
        const v = await api.list();

        setJobs(v);
    }, [user], () => {
        console.log("unloading page...")
    });

    return (
        <>
            <PageLayout
                title="EMPLOYEE_DIRECTORY"
                actions={
                    <>
                        <Row>
                            <Col>
                                <p className="mt-2 mb-2">
                                    {t("WANT_TO_ADD_TO_THIS_LIST")}
                                    <u className="ml-1">
                                        <Link href="#">
                                            <a>{t("HERE")}</a>
                                        </Link>
                                    </u>
                                </p>
                                <button type="button" className="theme-secondary-btn mr-4">{t('FILTER_RESULT')}</button>
                                <button type="button" className="btn theme-primary-btn">{t('MODIFY_FIELDS')}</button>
                                <u>
                                    <p className="mt-2">
                                        <Link href="#">
                                            <a>{t("VIEW_PAST_HIRES")}</a>
                                        </Link>
                                    </p>
                                </u>
                            </Col>
                        </Row>

                    </>
                }
            >
                <ViewDataTable<JobEntity>
                    columnSettingKey={columnSettingKey}
                    customStyles={{
                        headCells: {
                            style: {
                                background: "#5bb0b9",
                                color: "white"
                            },
                        },
                    }}
                    columns={[
                        {
                            id: "id",
                            name: "ID",
                            selector: j => j.id,
                        },
                        {
                            id: "name",
                            name: "name",
                            cell: (j) => (<Link href={`${router.asPath}/${j.id}`} ><a>{j.title}</a></Link>),
                            selector: job => job.title,
                            hidable: false
                        },
                        {
                            id: "employee_id",
                            name: "EMPLOYEE_ID",
                            selector: j => j.id,
                        },
                        {
                            id: "phone",
                            name: "PHONE",
                            selector: j => "03037976657",
                        },
                        {
                            id: "email",
                            name: "email",
                            selector: j => "test@gmail.com"
                        },
                        {
                            id: "status",
                            name: "STATUS",
                            selector: j => "Employed"
                        },
                        {
                            id: "current_position",
                            name: "current_position",
                            selector: j => "OTR Driver"
                        },
                        {
                            id: "pay_rate",
                            name: "pay_rate",
                            selector: j => "$0.55 cpm",
                        },
                        {
                            id: "terminal",
                            name: "TERMINAL",
                            selector: job => "Atlanta"
                        },
                        {
                            id: "source",
                            name: "source",
                            selector: j => "Manual Upload"
                        },
                        {
                            id: "equipment",
                            name: "equipment",
                            selector: job => "A09099"
                        },
                        {
                            cell: (j) => (
                                <>
                                    <div className="data_table_custom_action_button">
                                        <Link href="" >
                                            <a> <EyeFill className="view" /> </a>
                                        </Link>
                                        <Link href="" >
                                            <a> < PenFill className="edit" /> </a>
                                        </Link>
                                        <Link href="" >
                                            <a> < TrashFill className="delete" /> </a>
                                        </Link>
                                    </div>

                                </>
                            ),
                        },


                    ]}
                    items={jobs}
                />
                <TabbedLayout items={tabs} className="mt-5"></TabbedLayout>

            </PageLayout>

        </>

    )

};

EmployeeDirectory.getLayout = function getLayout(page) {
    return (
        <FullLayout>
            {page}
        </FullLayout>
    )
}
