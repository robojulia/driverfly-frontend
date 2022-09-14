import FullLayout from "../../../../components/dashboard/layouts/Layout/FullLayout";
import {useState } from "react";
import React from "react";
import {Plus } from 'react-bootstrap-icons';
import PageLayout from "../../../../components/layouts/page/PageLayout";
import JobApi from "../../../api/job";
import { JobEntity } from "../../../../models/job/job.entity";
import { useTranslation } from "../../../../hooks/useTranslation";
import Router, { useRouter } from "next/router";
import { buildAddress } from "../../../../utils/common";
import ViewDataTable, { getDataTableColumnKey } from "../../../../components/viewDetails/viewDataTable";
import OverlyPopover from "../../../../components/popover/overly-popover";
import { useAuth } from "../../../../hooks/useAuth";
import { useEffectAsync } from "../../../../utils/react";
import Link from "next/link";
import { Button } from "react-bootstrap";

export default function StoredFiles() {

    const { user, hasPermission } = useAuth();

    const columnSettingKey = getDataTableColumnKey("company", user, "jobs");

    const { t } = useTranslation();
    const router = useRouter()
    const [jobs, setJobs] = useState<JobEntity[]>([])
    const api = new JobApi();

    useEffectAsync(async () => {
        console.log("refresh fired");
        // const api = new JobApi();

        const v = await api.list();

        setJobs(v);
    }, [user], () => {
        console.log("unloading page...")
    });

    /**
     * 
     * @param {React.MouseEvent} e 
     */
    const onAddClick = (e) => {
        e.preventDefault();

        router.push(`${router.pathname}`);
    }
    const can = {
        editJob: hasPermission("CanUpdateJob"),
        deleteJob: hasPermission("CanDeleteJob"),
    };

    return (
        <PageLayout
            title="STORED_FILES"
            actions={
                <Button variant="primary" onClick={onAddClick}>
                    <Plus /> {t("UPLOAD_NEW_FILE")}
                </Button>
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
                        id: "file_name",
                        name: "file_name",
                        cell: (j) => (<Link href={`${router.asPath}/${j.id}`} ><a>{j.title}</a></Link>),
                        selector: job => job.title,
                        hidable: false
                    },
                    {
                        id: "category",
                        name: "CATEGORY",
                        cell: job => (<OverlyPopover skipTranslate={true} header={t('location')} str={buildAddress(job.location || {})} />),
                        selector: job => buildAddress(job.location || {})
                    },
                    {
                        id: "upload_date",
                        name: "upload_date",
                        selector: j => j.expiry_date ? new Date(j.expiry_date).toDateString() : null,
                    },
                ]}
                actions={j => ([

                    {
                        label: "SEND",
                        hide: !can.editJob
                    },
                    {

                        label: "DOWNLOAD",
                        hide: !can.deleteJob
                    },
                ])}
                items={jobs}
            />
        </PageLayout>
    )

};

StoredFiles.getLayout = function getLayout(page) {
    return (
        <FullLayout>
            {page}
        </FullLayout>
    )
}
