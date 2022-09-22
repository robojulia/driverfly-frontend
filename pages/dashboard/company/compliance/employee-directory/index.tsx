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
import ApplicantApi from "../../../../api/applicant";
import { ApplicantEntity } from "../../../../../models/applicant/applicant.entity";
import { filterHired, reduceSingleEntity } from "../../../../../utils/filter-applicants";
import { ReducedApplicantEntityType } from "../../../../../types/applicant/reduced-applicant-entity.type";
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
    const [applicants, setApplicants] = useState<ReducedApplicantEntityType[]>([])

    const api = new JobApi();
    const applicantApi = new ApplicantApi();

    useEffectAsync(async () => {

        const data = await applicantApi.list();
        const filteredApplicants: ApplicantEntity[] = filterHired(data)
        const reducedApplicants: ReducedApplicantEntityType[] = reduceSingleEntity(filteredApplicants)

        setApplicants(reducedApplicants)

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
                                        <Link href="/dashboard/company/compliance/employee-directory/import">
                                            <a>{t("HERE")}</a>
                                        </Link>
                                    </u>
                                </p>
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
                <ViewDataTable<ReducedApplicantEntityType>
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
                            selector: applicant => applicant?.applicant?.id,
                        },
                        {
                            id: "name",
                            name: "name",
                            selector: applicant => applicant?.applicant?.first_name + ' ' + applicant?.applicant?.last_name,
                            hidable: false
                        },
                        {
                            id: "phone",
                            name: "PHONE",
                            selector: applicant => applicant?.applicant?.phone,
                        },
                        {
                            id: "email",
                            name: "email",
                            selector: applicant => applicant?.applicant?.email
                        },
                        {
                            id: "jobTitle",
                            name: "Job Title",
                            selector: applicant => applicant?.applicantJob?.job?.title
                        },
                        {
                            id: "dateHired",
                            name: "Date Hired",
                            selector: applicant => applicant?.applicant?.last_updated_at
                        },
                        {
                            id: "status",
                            name: "STATUS",
                            selector: applicant => applicant?.applicantJob?.status
                        },
                        {
                            cell: (applicant) => (
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
                    items={applicants}
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
