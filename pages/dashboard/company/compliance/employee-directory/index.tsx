import { useFormik } from "formik";
import { toast } from "react-toastify";
import Link from "next/link";
import { Button, Col, FormGroup, Row } from "react-bootstrap";
import { FormControlLabel, Switch } from "@mui/material";
import { useEffect, useState } from "react";
import React from "react";
import { useRouter } from "next/router";
import { EyeFill, PenFill, TrashFill } from 'react-bootstrap-icons';
import 'react-tabs/style/react-tabs.css';
import FullLayout from "../../../../../components/dashboard/layouts/layout/full-layout";
import PageLayout from "../../../../../components/layouts/page/page-layout";
import { useTranslation } from "../../../../../hooks/use-translation";
import ViewDataTable, { getDataTableColumnKey } from "../../../../../components/view-details/view-data-table";
import { useAuth } from "../../../../../hooks/use-auth";
import { useEffectAsync } from "../../../../../utils/react";
import { TabbedLayout } from "../../../../../components/layouts/page/tabbed-layout";
import DAC from "../../../../../components/dashboard/employee-directory/dac";
import DQF from "../../../../../components/dashboard/employee-directory/dqf";
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
import BaseCheckList from "../../../../../components/forms/base-check-list";
import { ApplicantReasonCodeFired, ApplicantReasonCodeQuit } from "../../../../../enums/applicants/applicant-reason-codes.enum";
import { globalAjaxExceptionHandler } from "../../../../../utils/ajax";
import EntityForm from "../../../../../components/layouts/page/entity-form";
import BaseTextArea from "../../../../../components/forms/base-text-area";
import { Status } from "../../../../../enums/status.enum";
import BaseSelect from "../../../../../components/forms/base-select";
import AdditionalFiles from "../../../../../components/dashboard/employee-directory/additional-files";


export default function EmployeeDirectory() {

    const { user, hasPermission } = useAuth();
    const can = {
        viewUser: hasPermission("CanViewApplicant"),
        editUser: hasPermission("CanEditApplicant"),
        deleteUser: hasPermission("CanDeleteApplicant"),
    };

    const columnSettingKey = getDataTableColumnKey("company", user, "employee-directory");
    const { t } = useTranslation();
    const applicantApi = new ApplicantApi();
    const router = useRouter()

    const { setPreviousPath } = useLastPage();
    setPreviousPath(router.asPath)

    const [applicants, setApplicants] = useState<ReducedApplicantEntityType[]>([])
    const resetApplicants = () => setApplicants([])
    const filterApplicants = (id: number) => setApplicants(applicants.filter(v => v.applicant.id != id))

    enum ViewModeType { EMPLOYEE = "EMPLOYEE", PAST_EMPLOYEE = "PAST_EMPLOYEE" }
    const [viewMode, setViewMode] = useState<ViewModeType>(ViewModeType.EMPLOYEE)

    useEffect(() => {
        setViewMode(router.query.viewMode as ViewModeType ?? ViewModeType.EMPLOYEE)
    }, [router])

    useEffectAsync(async () => {
        viewMode == ViewModeType.EMPLOYEE ? fetchEmployee() : fetchPastEmployee()
    }, [user, viewMode]);

    const onViewModeChange = async ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
        value = viewMode == ViewModeType.EMPLOYEE ? ViewModeType.PAST_EMPLOYEE : ViewModeType.EMPLOYEE
        resetApplicants()
        router.query.viewMode = value;
        await router.push(router);
    }

    const fetchEmployee = async () => {
        const data = await applicantApi.list({
            status: [
                ApplicantStatus.COMPLETED_EMPLOYED,
                ApplicantStatus.COMPLETED_PROMOTED_TO_ROLE,
                ApplicantStatus.COMPLETED_TRANSFERED_TO_ROLE
            ]
        });
        // const filteredApplicants: ApplicantEntity[] = filterHired(data)
        const reducedApplicants: ReducedApplicantEntityType[] = reduceSingleEntity(data)
        setApplicants(reducedApplicants)
    }

    const fetchPastEmployee = async () => {
        const data = await applicantApi.list({
            status: [
                ApplicantStatus.INACTIVE_FIRED,
                ApplicantStatus.INACTIVE_QUIT
            ]
        });
        const reducedApplicants: ReducedApplicantEntityType[] = reduceSingleEntity(data)
        setApplicants(reducedApplicants)
    }

    const [modalAction, setModalAction] = useState<{
        entity: ReducedApplicantEntityType,
        type: "VIEW" | "DELETE" | "MOVE_TO_PAST_EMPLOYEE",
    }>(null)
    const resetModalAction = (): void => setModalAction(null)

    const tabs = {
        BACKGROUND: <Background {...modalAction?.entity} />,
        DQF: < DQF {...modalAction?.entity} canEdit={true} showHistory={true} />,
        DRIVER_ONBOARDING_CHECKLIST: < DAC {...modalAction?.entity} />,
        ADDITIONAL_FILES: < AdditionalFiles {...modalAction?.entity} />,

        // VEHICLES: < VehicleInformationTab />  //according to wireframe this tab (vehichled are pushed to phase 3)
    };

    const applicantJobForm = useFormik({
        initialValues: new ApplicantJobEntity(),
        validationSchema: ApplicantJobEntity.yupSchema(),
        onSubmit: async (values) => {
            try {
                await applicantApi.jobs.update(values.applicant?.id, values?.job?.id, values)
                applicantJobForm.resetForm();
                filterApplicants(values?.applicant?.id)
            } catch (e) {
                globalAjaxExceptionHandler(e, { formik: applicantJobForm, t: t, toast: toast });
            }
        },
    });
    useEffect(() => console.log(applicantJobForm.errors), [applicantJobForm.errors])

    const onViewClick = (entity: ReducedApplicantEntityType): void =>
        setModalAction({ entity, type: "VIEW" })

    const onEditClick = (entity: ReducedApplicantEntityType) =>
        router.push(`/dashboard/company/applicants/${entity?.applicant?.id}/edit`)

    const onTrashClick = async (entity: ReducedApplicantEntityType): Promise<void> => {
        setModalAction({ entity, type: "DELETE" })
    }

    const onDeleteClick = async (): Promise<void> => {
        try {
            const data = await applicantApi.remove(modalAction?.entity?.applicant?.id)

            if (data && data?.status == Status.DELETED) {
                filterApplicants(modalAction?.entity?.applicant?.id)
                toast(t("successfully_saved_information"))
            } else {
                toast(t("ERROR_MESSAGE_DEFAULT"))
            }
        } catch (error) {
            toast(t("ERROR_MESSAGE_DEFAULT"))
        }
        resetModalAction()
    }

    const onMoveToPastEmploeeClick = async (): Promise<void> => {
        setModalAction({ ...modalAction, type: "MOVE_TO_PAST_EMPLOYEE" })
        applicantJobForm.setValues(modalAction?.entity?.applicantJob);
        applicantJobForm.setFieldValue("reason_codes", []);
    }

    return (
        <PageLayout
            title={viewMode == ViewModeType.EMPLOYEE ? "EMPLOYEE_DIRECTORY" : "PAST_EMPLOYEE"}
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
                        <FormGroup style={{ float: "right" }}>
                            <FormControlLabel
                                control={<Switch
                                    value={viewMode === ViewModeType.EMPLOYEE ? ViewModeType.EMPLOYEE : ViewModeType.PAST_EMPLOYEE}
                                    checked={viewMode === ViewModeType.EMPLOYEE}
                                    onChange={onViewModeChange} />}
                                label={t("VIEW_BY_{name}", { name: t(viewMode !== ViewModeType.EMPLOYEE ? "EMPLOYEES" : "PAST_EMPLOYEE") })}
                            />
                        </FormGroup>
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
                            onClick={() => onViewClick(data)}
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
                        hide: (viewMode === ViewModeType.PAST_EMPLOYEE ? 1 : 0),
                        id: "dateHired",
                        name: 'DATE_HIRED',
                        selector: data => data?.applicantJob?.hired_at,
                        cell: data => <ShowFormattedDate
                            date={data?.applicantJob?.hired_at}
                            hideTime
                        />
                    },
                    {
                        hide: (viewMode !== ViewModeType.PAST_EMPLOYEE ? 1 : 0),
                        id: "dateTermination",
                        name: 'DATE_TERMINATION',
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
                            labelPrefix="ApplicantStatus"
                            value={data?.applicantJob?.status}
                            enumArray={ApplicantStatus} />
                        ),
                    },
                    {
                        hide: (viewMode !== ViewModeType.PAST_EMPLOYEE ? 1 : 0),
                        id: "reason_codes",
                        name: 'REASON_CODES',
                        // selector: data => data?.applicantJob?.reason_codes,
                        cell: data =>
                        (<ShowEnumFromString
                            popover
                            labelPrefix={data.applicantJob.status == ApplicantStatus.INACTIVE_QUIT ? "ApplicantReasonCodeQuit" : "ApplicantReasonCodeFired"}
                            enumArray={data.applicantJob.status == ApplicantStatus.INACTIVE_FIRED ? ApplicantReasonCodeQuit : ApplicantReasonCodeFired}
                            value={data?.applicantJob?.reason_codes}
                        />
                        ),
                    },
                ]}
                actions={data => (viewMode != ViewModeType.EMPLOYEE)
                    ? null
                    : ([
                        {
                            onClick: e => onViewClick(data),
                            icon: EyeFill,
                            // label: "VIEW",
                            hide: (!can.viewUser)
                        },
                        {
                            onClick: e => onEditClick(data),
                            icon: PenFill,
                            // label: "EDIT",
                            hide: (!can.editUser)
                        },
                        {
                            onClick: e => onTrashClick(data),
                            icon: TrashFill,
                            // label: "DELETE",
                            hide: (!can.deleteUser)
                        },
                    ])}

                items={applicants}
            />

            {/* TabbedLayout modal component with items passed as a prop `tabs` */}
            <ViewModal show={!!(modalAction?.type == "VIEW")} onCloseClick={resetModalAction} size='xl' >
                <TabbedLayout items={tabs} className="mt-5"></TabbedLayout>
            </ViewModal>

            {/* modal that displays a table for confirming trash action */}
            <ViewModal
                title="CONFIRMATION"
                show={modalAction?.type == "DELETE"}
                onCloseClick={resetModalAction}
                size='sm'
            >
                <Row className="mt-90 my-10">
                    <Col>
                        <button
                            onClick={() => onDeleteClick()}
                            type="button"
                            className="theme-danger-btn btn-block btn-theme w-50 p-3 m-auto"
                        > {t("DELETE")}</button>
                    </Col>
                    <Col>
                        <button
                            onClick={() => onMoveToPastEmploeeClick()}
                            type="button"
                            className="theme-primary-btn btn-block btn-theme w-50 p-3 m-auto"
                        > {t("MOVE_TO_PAST_EMPLOYEE")}</button>
                    </Col>
                </Row>
            </ViewModal>

            {/* modal that displays a table for moving applicant to past employee list */}
            <ViewModal
                title={t("MOVE_TO_PAST_EMPLOYEE")}
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
                    <Row className="py-3 px-5">
                        <Col>
                            <BaseSelect
                                label="STATUS"
                                formik={applicantJobForm}
                                name={`status`}
                                required
                                placeholder="STATUS"
                                labelPrefix="ApplicantStatus"
                                showOptions={[ApplicantStatus.INACTIVE_FIRED, ApplicantStatus.INACTIVE_QUIT]}
                                enumType={ApplicantStatus}

                            />
                        </Col>
                    </Row>
                    <Row className="py-3 px-5">
                        <Col md="12">
                            {({
                                [ApplicantStatus.INACTIVE_FIRED]: (<BaseCheckList
                                    className="col-12"
                                    label="REASON_CODES"
                                    name="reason_codes"
                                    required
                                    cols={2}
                                    formik={applicantJobForm}
                                    labelPrefix="ApplicantReasonCodeFired"
                                    enumType={ApplicantReasonCodeFired}
                                />),
                                [ApplicantStatus.INACTIVE_QUIT]: (<BaseCheckList
                                    className="col-12"
                                    label="REASON_CODES"
                                    name="reason_codes"
                                    required
                                    cols={2}
                                    formik={applicantJobForm}
                                    labelPrefix="ApplicantReasonCodeQuit"
                                    enumType={ApplicantReasonCodeQuit}
                                />),
                            }[applicantJobForm.values?.status] ?? <></>)}
                        </Col>
                        <Col>
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
