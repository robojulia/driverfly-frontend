import FullLayout from "../../../../../components/dashboard/layouts/layout/full-layout";
import { useState } from "react";
import React from "react";
import { EyeFill, PenFill } from 'react-bootstrap-icons';
import PageLayout from "../../../../../components/layouts/page/page-layout";
import { useTranslation } from "../../../../../hooks/use-translation";
import { useRouter } from "next/router";
import ViewDataTable, { getDataTableColumnKey } from "../../../../../components/view-details/view-data-table";
import { useAuth } from "../../../../../hooks/use-auth";
import { useEffectAsync } from "../../../../../utils/react";
import Link from "next/link";
import { Col, Row } from "react-bootstrap";
import 'react-tabs/style/react-tabs.css';
import { TabbedLayout } from "../../../../../components/layouts/page/tabbed-layout";
import DAC from "../../../../../components/dashboard/employee-directory/dac";
import DqfTab from "../../../../../components/dashboard/employee-directory/dqf";
import ApplicantApi from "../../../../api/applicant";
import { ApplicantEntity } from "../../../../../models/applicant/applicant.entity";
import { filterHired, reduceSingleEntity } from "../../../../../utils/filter-applicants";
import { ReducedApplicantEntityType } from "../../../../../types/applicant/reduced-applicant-entity.type";
import ViewModal from "../../../../../components/view-details/view-modal";
import useLastPage from "../../../../../hooks/use-last-page";
import ShowEnumFromString from "../../../../../components/enum-filters/show-enum-from-string";
import { ApplicantStatus } from "../../../../../enums/applicants/applicant-status.enum";
import OverlyPopover from "../../../../../components/popover/overly-popover";
import ShowFormattedDate from "../../../../../components/jobs/show-formatted-date";
import Background from "../../../../../components/dashboard/employee-directory/background";

export default function EmployeeDirectory() {

    const { user } = useAuth();
    const columnSettingKey = getDataTableColumnKey("company", user, "employee-directory");

    const { t } = useTranslation();
    const applicantApi = new ApplicantApi();
    const router = useRouter()

    const { setPreviousPath } = useLastPage();
    setPreviousPath(router.asPath)

    const [applicant, setApplicant] = useState<ApplicantEntity>()
    const resetApplicant = (): void => setApplicant(null)

    const [applicants, setApplicants] = useState<ReducedApplicantEntityType[]>([])

    const onEditClick = (id: number) => router.push(`/dashboard/company/applicants/${id}/edit`)

    useEffectAsync(async () => {

        const data = await applicantApi.list();
        const filteredApplicants: ApplicantEntity[] = filterHired(data)
        const reducedApplicants: ReducedApplicantEntityType[] = reduceSingleEntity(filteredApplicants)

        setApplicants(reducedApplicants)

    }, [user], () => {
        console.log("unloading page...")
    });

    const tabs = {
        BACKGROUND: <Background applicant={applicant} />,
        DQF: < DqfTab applicant={applicant} />,
        DRIVER_ONBOARDING_CHECKLIST: < DAC applicant={applicant} />,

        // VEHICLES: < VehicleInformationTab />  //according to wireframe this tab (vehichled are pushed to phase 3)
    };

    return (
        <PageLayout
            title="EMPLOYEE_DIRECTORY"
            actions={
                <Row>
                    <Col>
                        <p className="mt-2 mb-2">
                            {t("WANT_TO_ADD_TO_THIS_LIST")}
                            <u className="ml-1">
                                <Link href="/dashboard/company/compliance/employee-directory/import">
                                    <a className="here_link">{t("HERE")}</a>
                                </Link>
                            </u>
                        </p>
                    </Col>
                </Row>
            }
        >
            <ViewDataTable<ReducedApplicantEntityType>
                columnSettingKey={columnSettingKey}
                customStyles={{
                    headRow: {
                        style: {
                            background: "linear-gradient(to bottom right, #2ec8c4, #1b4454ba)",
                            color: "white"
                        },
                    },
                }}
                columns={[
                    {
                        id: "id",
                        name: "ID",
                        selector: data => data?.applicant?.id,
                    },
                    {
                        id: "name",
                        name: 'NAME',
                        cell: data => <span role="button" className="bg-priamry cursor-pointer enlarge-font" onClick={() => setApplicant(data?.applicant)}>{data?.applicant?.first_name + ' ' + data?.applicant?.last_name}</span>,
                    },
                    {
                        id: "phone",
                        name: 'PHONE',
                        selector: data => data?.applicant?.phone,
                        cell: data => (<OverlyPopover
                            skipTranslate
                            slice_at={10}
                            str={data?.applicant?.phone}
                        />),
                    },
                    {
                        id: "email",
                        name: 'EMAIL',
                        selector: data => data?.applicant?.email,
                        cell: data => (<OverlyPopover
                            skipTranslate
                            slice_at={40}
                            str={data?.applicant?.email}
                        />),
                    },
                    {
                        id: "jobTitle",
                        name: 'job_title',
                        selector: data => data?.applicantJob?.job?.title,
                        cell: data => (<OverlyPopover
                            skipTranslate
                            slice_at={40}
                            str={data?.applicantJob?.job?.title}
                        />),
                    },
                    {
                        id: "dateHired",
                        name: 'DATE_HIRED',
                        selector: data => data?.applicant?.last_updated_at,
                        cell: data => <ShowFormattedDate
                            date={data?.applicant?.last_updated_at}
                            hideTime
                        />
                    },
                    {
                        id: "status",
                        name: 'STATUS',
                        selector: data => data?.applicantJob?.status,
                        cell: data =>
                        (<ShowEnumFromString
                            popover
                            labelPrefix="ApplicantStatus"
                            str={data?.applicantJob?.status}
                            enumArray={ApplicantStatus} />
                        ),
                    },
                    {
                        cell: (data) => (
                            <>
                                <div className="data_table_custom_action_button">
                                    <div onClick={(e) => setApplicant(data?.applicant)}>
                                        <EyeFill className="view cursor-pointer enlarge-font" />
                                    </div>
                                    <div onClick={(e) => onEditClick(data?.applicant?.id)}>
                                        <PenFill className="edit cursor-pointer enlarge-font" />
                                    </div>
                                </div>
                            </>
                        ),
                    },
                ]}
                items={applicants}
            />
            <ViewModal show={!!applicant} onCloseClick={resetApplicant} size='xl' >
                <TabbedLayout items={tabs} className="mt-5"></TabbedLayout>
            </ViewModal>

        </PageLayout>
    )

};

EmployeeDirectory.getLayout = function getLayout(page) {
    return (
        <FullLayout>
            {page}
        </FullLayout>
    )
}
