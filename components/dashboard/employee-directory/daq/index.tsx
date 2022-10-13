import { useRouter } from "next/router";
import { useState } from "react";
import { Button, Col, Row } from "react-bootstrap";
import { useAuth } from "../../../../hooks/useAuth";
import { JobEntity } from "../../../../models/job/job.entity";
import JobApi from "../../../../pages/api/job";
import ViewDataTable,{ getDataTableColumnKey } from "../../../viewDetails/viewDataTable";
import { useEffectAsync } from "../../../../utils/react";
import { useTranslation } from "../../../../hooks/useTranslation";

const DaqTab = () => {
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
                    <h5>Roger Atkins</h5>
                </Col>
                <Col  className="text-right p-0">
                    <button type="button" className="theme-primary-btn mr-3 py-2">{t("ORDER_DAC")}</button>
                </Col>
            </Row>
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
                            selector: j => "1",
                        },
        
                        {
                            id: "period_of_service",
                            name: "period_of_service",
                            selector: j => "3",
                        },
                        {
                            id: "equipment_operated",
                            name: "equipment_operated",
                            selector: j => "test@gmail.com"
                        },
                        {
                            id: "loads_hauled",
                            name: "loads_hauled",
                            selector: j => "Employed"
                        },
                        {
                            id: "driver_status_&_experience",
                            name: "driver_status_&_experience",
                            selector: j => "OTR Driver"
                        },
                        
                        {
                            id: "reason_for_leaving",
                            name: "reason_for_leaving",
                            selector: j => "$0.55 cpm",
                        },
                        {
                            id: "rehire_eligibility",
                            name: "rehire_eligibility",
                            selector: j => "Atlanta"
                        },
                        {
                            id: "number_of_accidents",
                            name: "number_of_accidents",
                            selector: j => "Manual Upload"
                        },
                        {
                            id: "accident_details",
                            name: "accident_details",
                            selector: j => "A09099"
                        },
                        {
                            id: "drug_&_alcohol_histories",
                            name: "drug_&_alcohol_histories",
                            selector: j => "A09099"
                        },
                        {
                            id: "pre-employ_ment_test_results",
                            name: "pre-employ_ment_test_results",
                            selector: j => "A09099"
                        },
                        {
                            id: "truck_driving_School_performance_records",
                            name: "truck_driving_School_performance_records",
                            selector: j => "A09099"
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

export default DaqTab;