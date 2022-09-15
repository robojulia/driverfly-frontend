import FullLayout from "../../../../../components/dashboard/layouts/Layout/FullLayout";
import { useState } from "react";
import React from "react";
import { EyeFill, PenFill, Plus, TrashFill } from 'react-bootstrap-icons';
import PageLayout from "../../../../../components/layouts/page/PageLayout";
import JobApi from "../../../../api/job";
import { JobEntity } from "../../../../../models/job/job.entity";
import { useTranslation } from "../../../../../hooks/useTranslation";
import Router, { useRouter } from "next/router";
import { buildAddress } from "../../../../../utils/common";
import ViewDataTable, { getDataTableColumnKey } from "../../../../../components/viewDetails/viewDataTable";
import OverlyPopover from "../../../../../components/popover/overly-popover";
import { useAuth } from "../../../../../hooks/useAuth";
import { useEffectAsync } from "../../../../../utils/react";
import Link from "next/link";
import { Button, Col, Row } from "react-bootstrap";

export default function EmployeeDirectory() {

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

    const can = {
        editJob: hasPermission("CanUpdateJob"),
        deleteJob: hasPermission("CanDeleteJob"),
    };

    return (
        <>
            <PageLayout
                title="EMPLOYEE_DIRECTORY"
                actions={<>
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

                </>}
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
                            selector: job => "test@gmail.com"
                        },
                        {
                            id: "status",
                            name: "STATUS",
                            selector: job => "Employed"
                        },
                        {
                            id: "current_position",
                            name: "current_position",
                            selector: job => "OTR Driver"
                        },
                        {
                            id: "date_employed",
                            name: "date_employed",
                            selector: j => j.expiry_date ? new Date(j.expiry_date).toDateString() : null,
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
                            selector: job => "Manual Upload"
                        },
                        {
                            id: "equipment",
                            name: "equipment",
                            selector: job => "A09099"
                        },

                    ]}
                    items={jobs}
                    actions={j => ([
                        {
                            icon: EyeFill,
                            label: "VIEW_DETAILS",
                        },
                        {
                            icon: PenFill,
                            label: "EDIT",
                        },
                        {
                            icon: TrashFill,
                            label: "DELETE",
                        },
                    ])}
                />
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
