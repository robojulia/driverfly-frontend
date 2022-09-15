import FullLayout from "../../../../components/dashboard/layouts/Layout/FullLayout";
import { useState } from "react";
import React from "react";
import { Plus } from 'react-bootstrap-icons';
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
import { Button, Row } from "react-bootstrap";
import ViewModal from "../../../../components/viewDetails/viewModal";
import FileInput from "../../../../components/forms/FileInput";
import BaseSelect from "../../../../components/forms/BaseSelect";
import { JobPayMethod } from "../../../../enums/jobs/job-pay-method.enum";

export default function StoredFiles() {

    const { user, hasPermission } = useAuth();
    const [showFileUploadModel, setShowFileUploadModel] = useState(false);
    const openFileUploadModel = () => setShowFileUploadModel(true)
    const closeFileUploadModel = () => setShowFileUploadModel(false)


    const columnSettingKey = getDataTableColumnKey("company", user, "jobs");

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
                title="STORED_FILES"
                actions={
                    <Button variant="primary" onClick={openFileUploadModel}>
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
                        {
                            cell: (j) => (
                                <>
                                    <button type="button" className="theme-secondary-btn mr-4 p-2">{t('SEND')}</button>
                                    <button type="button" className="btn theme-primary-btn">{t('DOWNLOAD')}</button>
                                </>

                            ),
                        },


                    ]}
                    items={jobs}
                />
                <ViewModal
                    show={showFileUploadModel}
                    onCloseClick={closeFileUploadModel}
                    closeText="CANCEL"
                    title="UPLOAD_NEW_FILE"
                    footer={<button type="submit" className="btn btn-primary w-100 p-lg-3 p-5" >{t('submit')}</button>}
                >
                    <Row>
                        <BaseSelect
                            className="col-12 my-3"
                            label="FILE_TYPE"
                            name="file_Type"
                            required
                            placeholder
                            labelPrefix="JobPayMethod"
                            enumType={JobPayMethod}
                        // formik={form}
                        />
                        <FileInput
                            className="col-12 my-3"
                            label={`photo`}
                            name={`photo`}
                            accept="image/*"
                            documentType={"PHOTO"}
                        // formik={form}
                        />
                    </Row>
                </ViewModal>
            </PageLayout>

        </>

    )

};

StoredFiles.getLayout = function getLayout(page) {
    return (
        <FullLayout>
            {page}
        </FullLayout>
    )
}
