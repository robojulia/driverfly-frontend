import { useRouter } from "next/router";
import { useState } from "react";
import { Col, Row } from "react-bootstrap";
import { useAuth } from "../../../../hooks/useAuth";
import { JobEntity } from "../../../../models/job/job.entity";
import JobApi from "../../../../pages/api/job";
import ViewDataTable,{ getDataTableColumnKey } from "../../../viewDetails/viewDataTable";
import { useEffectAsync } from "../../../../utils/react";
import { useTranslation } from "../../../../hooks/useTranslation";
const DqfTab = () => {
    const { t } = useTranslation();
    const { user, hasPermission } = useAuth();
    const columnSettingKey = getDataTableColumnKey("company", user, "daq");
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
            <div className="employee_directory_tabs">
            <Row className="mt-3">
                <Col>
            <ViewDataTable
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
                            selector: job => job.title,
                            hidable: false
                        },
                        {
                            id: "latest_upload",
                            name: "latest_upload",
                            selector: j => j.expiry_date ? new Date(j.expiry_date).toDateString() : null,
                        },
                        {
                            cell: (j) => (
                                <>
                                    <button type="button" className="theme-secondary-btn mr-4 p-2">{t('UPDATE_RECORD')}</button>
                                    <button type="button" className="btn theme-primary-btn">{t('DOWNLOAD')}</button>
                                </>

                            ),
                        },


                    ]}
                    items={jobs}

                />
                </Col>
            </Row>
            </div>
        </>
    );
};

export default DqfTab;