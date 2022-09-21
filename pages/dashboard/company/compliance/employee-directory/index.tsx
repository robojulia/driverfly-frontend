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
import { Button, Col, Row } from "react-bootstrap";
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
import ViewModal from "../../../../../components/viewDetails/viewModal";
import ViewApplicantDetail from "../../../../../components/applicants/view-applicant-details";
export default function EmployeeDirectory() {
    const [applicant, setApplicant] = useState<{}>()
    const [applicants, setApplicants] = useState<ReducedApplicantEntityType[]>([])

    const tabs = {
        Background: <ViewApplicantDetail applicant={applicant} />,
        DAQ: < DaqTab />,
        DQF: < DqfTab />,
        Vehicle: < VehicleInformationTab />


    };
    const { user, hasPermission } = useAuth();
    const columnSettingKey = getDataTableColumnKey("company", user, "employee-directory");

    const { t } = useTranslation();
    const router = useRouter()

    const api = new JobApi();
    const applicantApi = new ApplicantApi();

    const onEditClick = (id: number) => {
        router.push(`/dashboard/company/applicants/${id}/edit`);
    }


    useEffectAsync(async () => {

        const data = await applicantApi.list();
        const filteredApplicants: ApplicantEntity[] = filterHired(data)
        const reducedApplicants: ReducedApplicantEntityType[] = reduceSingleEntity(filteredApplicants)

        setApplicants(reducedApplicants)

    }, [user], () => {
        console.log("unloading page...")
    });
    const someFunction = () => {
        return 'yes'
    }

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
                            name: 'NAME',
                            cell: applicant => <span className="bg-priamry" onClick={() => setApplicant(applicant?.applicant)}>{applicant?.applicant?.first_name + ' ' + applicant?.applicant?.last_name}</span>,
                        },
                        {
                            id: "phone",
                            name: 'PHONE',
                            selector: applicant => applicant?.applicant?.phone,
                        },
                        {
                            id: "email",
                            name: 'EMAIL',
                            selector: applicant => applicant?.applicant?.email
                        },
                        {
                            id: "jobTitle",
                            name: 'job_title',
                            selector: applicant => applicant?.applicantJob?.job?.title
                        },
                        {
                            id: "dateHired",
                            name: 'DATE_HIRED',
                            selector: applicant => applicant?.applicant?.last_updated_at
                        },
                        {
                            id: "status",
                            name: 'STATUS',
                            selector: applicant => applicant?.applicantJob?.status
                        },
                        {
                            cell: (applicant) => (
                                <>
                                    <div className="data_table_custom_action_button">
                                        <div onClick={() => setApplicant(applicant?.applicant)} >
                                           <EyeFill className="view" />
                                        </div>
                                        <div onClick={(e) => onEditClick(applicant?.applicant?.id)}>
                                            < PenFill className="edit" /> 
                                        </div>
                                    </div>

                                </>
                            ),
                        },


                    ]}
                    items={applicants}
                />
                <ViewModal show={!!applicant} >
                    <TabbedLayout items={tabs} className="mt-5"></TabbedLayout>
                </ViewModal>

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
