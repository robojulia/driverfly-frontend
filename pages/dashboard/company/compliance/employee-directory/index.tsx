import FullLayout from "../../../../../components/dashboard/layouts/layout/full-layout";
import { useState } from "react";
import React from "react";
import { EyeFill, PenFill, Trash2Fill, Trash3Fill, TrashFill } from 'react-bootstrap-icons';
import PageLayout from "../../../../../components/layouts/page/page-layout";
import { useTranslation } from "../../../../../hooks/use-translation";
import { useRouter } from "next/router";
import ViewDataTable, { getDataTableColumnKey } from "../../../../../components/view-details/view-data-table";
import { useAuth } from "../../../../../hooks/use-auth";
import { useEffectAsync } from "../../../../../utils/react";
import Link from "next/link";
import { Button, Col, Row } from "react-bootstrap";
import 'react-tabs/style/react-tabs.css';
import { TabbedLayout } from "../../../../../components/layouts/page/tabbed-layout";
import DAC from "../../../../../components/dashboard/employee-directory/dac";
import DqfTab from "../../../../../components/dashboard/employee-directory/dqf";
import ApplicantApi from "../../../../api/applicant";
import {
    ApplicantEntity,
    ApplicantJobEntity
} from "../../../../../models/applicant";
import {
    filterHired,
    reduceSingleEntity
} from "../../../../../utils/filter-applicants";
import { ReducedApplicantEntityType } from "../../../../../types/applicant/reduced-applicant-entity.type";
import ViewModal from "../../../../../components/view-details/view-modal";
import useLastPage from "../../../../../hooks/use-last-page";
import ShowEnumFromString from "../../../../../components/enum-filters/show-enum-from-string";
import { ApplicantStatus } from "../../../../../enums/applicants/applicant-status.enum";
import OverlyPopover from "../../../../../components/popover/overly-popover";
import ShowFormattedDate from "../../../../../components/jobs/show-formatted-date";
import Background from "../../../../../components/dashboard/employee-directory/background";
import AdditionalFiles from "../../../../../components/dashboard/employee-directory/additional-files";
import BaseCheckList from "../../../../../components/forms/base-check-list";
import { ApplicantReasonCodeFired } from "../../../../../enums/applicants/applicant-reason-codes.enum";
import { useFormik } from "formik";
import { globalAjaxExceptionHandler } from "../../../../../utils/ajax";
import EntityForm from "../../../../../components/layouts/page/entity-form";
import BaseTextArea from "../../../../../components/forms/base-text-area";
import { toast } from "react-toastify";

export default function EmployeeDirectory() {

    const { user } = useAuth();
    const columnSettingKey = getDataTableColumnKey("company", user, "employee-directory");

    const { t } = useTranslation();
    const applicantApi = new ApplicantApi();
    const router = useRouter()

    const { setPreviousPath } = useLastPage();
    setPreviousPath(router.asPath)

    const [applicants, setApplicants] = useState<ReducedApplicantEntityType[]>([])

    const [applicant, setApplicant] = useState<ReducedApplicantEntityType>()
    const resetApplicant = (): void => setApplicant(null)

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
        ADDITIONAL_FILES: < AdditionalFiles applicant={applicant} />,

        // VEHICLES: < VehicleInformationTab />  //according to wireframe this tab (vehichled are pushed to phase 3)
    };

    const applicantJobForm = useFormik({
        initialValues: new ApplicantJobEntity(),
        validationSchema: ApplicantJobEntity.yupSchema(),
        onSubmit: async (values) => {
            try {
                console.log("values", values);

                await applicantApi.jobs.update(values.applicant?.id, values?.job?.id, values)
                applicantJobForm.resetForm();
                setApplicants(applicants.filter(v => v.applicantJob.id != values.id))
            } catch (e) {
                globalAjaxExceptionHandler(e, { formik: applicantJobForm, t: t, toast: toast });
            }
        },
    });

    const [pastEmployees, setPastEmployees] = useState<ReducedApplicantEntityType[]>([])
    const resetPastEmployees = (): void => setPastEmployees([])

    const fetchPastEmployee = async () => {
        const data = await applicantApi.list({ status: ApplicantStatus.INACTIVE_FIRED });

        const reducedApplicants: ReducedApplicantEntityType[] = reduceSingleEntity(data)

        setPastEmployees(reducedApplicants)
    }

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
                        <p className="mt-2 mb-2">
                            <u className="ml-1">
                                <a
                                    onClick={fetchPastEmployee}
                                    className="here_link"
                                >{t("PAST_EMPLOYEE_LIST")}</a>
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
                        cell: data => <span
                            role="button"
                            className="bg-priamry cursor-pointer enlarge-font"
                            onClick={() => setApplicant(data)}
                        >{data?.applicant?.first_name + ' ' + data?.applicant?.last_name}</span>,
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
                        selector: data => data?.applicantJob?.hired_at,
                        cell: data => <ShowFormattedDate
                            date={data?.applicantJob?.hired_at}
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
                            <div className="data_table_custom_action_button">
                                <div onClick={(e) => setApplicant(data)}>
                                    <EyeFill className="view cursor-pointer enlarge-font" />
                                </div>
                                <div onClick={(e) => onEditClick(data?.applicant?.id)}>
                                    <PenFill className="edit cursor-pointer enlarge-font" />
                                </div>
                                <div onClick={() => {
                                    applicantJobForm.setValues(data?.applicantJob);
                                    applicantJobForm.setFieldValue("reason_codes", []);
                                    applicantJobForm.setFieldValue("status", ApplicantStatus.INACTIVE_FIRED);
                                }}>
                                    <a className="btn btn-link btn-sm">{t('MOVE_TO_PAST_EMPLOYEE')}</a>
                                </div>
                            </div>
                        ),
                    },
                ]}
                items={applicants}
            />

            <ViewModal show={!!applicant} onCloseClick={resetApplicant} size='xl' >
                <TabbedLayout items={tabs} className="mt-5"></TabbedLayout>
            </ViewModal>

            <ViewModal
                show={!!applicantJobForm.values?.id}
                onCloseClick={applicantJobForm.resetForm}
                size='lg'
            >
                <EntityForm
                    onSubmit={applicantJobForm.handleSubmit}
                    id={applicantJobForm?.values?.id}
                    formik={applicantJobForm}
                    canSubmit={applicantJobForm.isValid || applicantJobForm.values?.reason_codes?.length > 0}
                >
                    <Row className="py-3">
                        <Col md="6">
                            <BaseCheckList
                                className="col-12"
                                label="REASON_CODES"
                                name="reason_codes"
                                required
                                cols={2}
                                formik={applicantJobForm}
                                labelPrefix="ApplicantReasonCodeFired"
                                enumType={ApplicantReasonCodeFired}
                            />
                        </Col>
                        <Col md="6">
                            {applicantJobForm.values.reason_codes?.includes("OTHER") &&
                                <BaseTextArea
                                    className="col-12"
                                    placeholder="REASONS"
                                    name="reason_codes_other"
                                    required
                                    maxLength={100}
                                    formik={applicantJobForm}
                                />}
                        </Col>
                    </Row>
                </EntityForm>
            </ViewModal>

            <ViewModal
                show={Boolean(pastEmployees?.length)}
                onCloseClick={resetPastEmployees}
                closeText="CANCEL"
                title="APPLICANTS"
            >
                <ViewDataTable<ReducedApplicantEntityType>
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
                            selector: aJob => aJob?.applicant?.id,
                            hidable: false
                        },
                        {
                            name: "first_name",
                            selector: aJob => aJob?.applicant?.first_name,
                            hidable: false
                        },
                        {
                            name: "last_name",
                            selector: aJob => aJob?.applicant?.last_name,
                            hidable: false
                        },
                        {
                            name: "email",
                            selector: aJob => aJob?.applicant?.email,
                            hidable: false
                        },
                    ]}
                    items={pastEmployees}
                />
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
