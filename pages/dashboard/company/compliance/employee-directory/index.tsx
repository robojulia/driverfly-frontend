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
import ViewDataTable, { ViewTableColumn, getDataTableColumnKey } from "../../../../../components/view-details/view-data-table";
import { useAuth } from "../../../../../hooks/use-auth";
import { useEffectAsync } from "../../../../../utils/react";
import { TabbedLayout } from "../../../../../components/layouts/page/tabbed-layout";
import DAC from "../../../../../components/dashboard/employee-directory/dac";
import DQF from "../../../../../components/dashboard/employee-directory/dqf";
import ViewModal from "../../../../../components/view-details/view-modal";
import useLastPage from "../../../../../hooks/use-last-page";
import ShowEnumFromString from "../../../../../components/enum-filters/show-enum-from-string";
import OverlyPopover from "../../../../../components/popover/overly-popover";
import ShowFormattedDate from "../../../../../components/jobs/show-formatted-date";
import Background from "../../../../../components/dashboard/employee-directory/background";
import { globalAjaxExceptionHandler } from "../../../../../utils/ajax";
import EntityForm from "../../../../../components/layouts/page/entity-form";
import { Status } from "../../../../../enums/status.enum";
import BaseSelect from "../../../../../components/forms/base-select";
import AdditionalFiles from "../../../../../components/dashboard/employee-directory/additional-files";
import { EmployeeEntity } from "../../../../../models/employee/employee.entity";
import { ListActionOptions } from "../../../../../components/list-actions/list-actions";
import EmployeeApi from "../../../../api/employee";
import { EmployeeStatus } from "../../../../../enums/applicants/employee-status.enum";

export default function EmployeeDirectory() {

    const { user, hasPermission } = useAuth();
    const can = {
        viewUser: hasPermission("CanViewEmployee"),
        editUser: hasPermission("CanEditEmployee"),
        deleteUser: hasPermission("CanDeleteEmployee"),
    };

    const columnSettingKey = getDataTableColumnKey("company", user, "employee-directory");
    const { t } = useTranslation();
    const employeeApi = new EmployeeApi();
    const router = useRouter()

    const { setPreviousPath } = useLastPage();
    setPreviousPath(router.asPath)

    const [employees, setEmployees] = useState<EmployeeEntity[]>([])
    const resetEmployees = () => setEmployees([])
    const filterEmployees = (id: number) => setEmployees(employees.filter(v => v.id != id))

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
        resetEmployees()
        router.query.viewMode = value;
        await router.push(router);
    }

    const fetchEmployee = async (): Promise<void> => {
        const data = await employeeApi.list({ status: [EmployeeStatus.ACTIVE] })
        setEmployees(data)
    }

    const fetchPastEmployee = async (): Promise<void> => {
        const data = await employeeApi.list({ status: [EmployeeStatus.QUIT, EmployeeStatus.FIRED] })
        setEmployees(data)
    }

    const [modalAction, setModalAction] = useState<{
        entity: EmployeeEntity,
        type: "VIEW" | "DELETE" | "MOVE_TO_PAST_EMPLOYEE",
    }>(null)
    const resetModalAction = (): void => setModalAction(null)

    const tabs = {
        BACKGROUND: <Background employee={modalAction?.entity} />,
        DQF: < DQF employee={modalAction?.entity} canEdit={true} showHistory={true} />,
        // DRIVER_ONBOARDING_CHECKLIST: < DAC applicant={modalAction?.entity.applicant} />,
        // ADDITIONAL_FILES: < AdditionalFiles applicant={modalAction?.entity.applicant} />,

        // VEHICLES: < VehicleInformationTab />  //according to wireframe this tab (vehichled are pushed to phase 3)
    };

    const moveToPastForm = useFormik({
        initialValues: new EmployeeEntity(),
        validationSchema: EmployeeEntity.yupSchemaForMarking(),
        onSubmit: async (values) => {
            try {
                await employeeApi.mark(values?.id, values)
                moveToPastForm.resetForm();
                filterEmployees(values?.id)
                toast(t("successfully_saved_information"))
            } catch (e) {
                globalAjaxExceptionHandler(e, { formik: moveToPastForm, t: t, toast: toast });
            }
        },
    });
    useEffect(() => console.log(moveToPastForm.errors), [moveToPastForm.errors])
    useEffect(() => console.log("viewMode", viewMode), [viewMode])

    const onViewClick = async (entity: EmployeeEntity): Promise<void> => {
        const v = await employeeApi.getById(entity?.id)
        setModalAction({ entity: v, type: "VIEW" })
    }


    const onEditClick = (data) => router.push(`/dashboard/company/compliance/employee-directory/${data?.id}/edit`)
    const onTrashClick = async (entity: EmployeeEntity): Promise<void> =>
        setModalAction({ entity, type: "DELETE" });


    const onDeleteClick = async (): Promise<void> => {
        try {
            const data = await employeeApi.remove(modalAction?.entity?.id)

            if (data && data?.active_status == Status.DELETED) {
                filterEmployees(modalAction?.entity?.id)
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
        moveToPastForm.setFieldValue("id", modalAction?.entity?.id);
    }

    const tableColumns = (): ViewTableColumn<EmployeeEntity>[] => {
        const data: ViewTableColumn<EmployeeEntity>[] = [
            {
                id: "id",
                name: "ID",
                selector: data => data?.id,
            },
            {
                id: "name",
                name: 'NAME',
                cell: data => <span
                    role="button"
                    className="bg-priamry cursor-pointer enlarge-font"
                    onClick={() => onViewClick(data)}
                >{data?.first_name + ' ' + data?.last_name}</span>,
            },
            {
                id: "phone",
                name: 'PHONE',
                selector: data => data?.phone,
                cell: data => (<OverlyPopover
                    skipTranslate
                    slice_at={10}
                    str={data?.phone}
                />),
            },
            {
                id: "email",
                name: 'EMAIL',
                selector: data => data?.email,
                cell: data => (<OverlyPopover
                    skipTranslate
                    slice_at={40}
                    str={data?.email}
                />),
            },
            {
                id: "jobTitle",
                name: 'job_title',
                selector: data => data?.job?.title,
                cell: data => (<OverlyPopover
                    skipTranslate
                    slice_at={40}
                    str={data?.job?.title}
                />),
            },
            {
                id: "dateHired",
                name: 'DATE_HIRED',
                selector: data => data?.created_at,
                cell: data => <ShowFormattedDate
                    date={data?.created_at}
                />
            },
            {
                id: "status",
                name: 'STATUS',
                selector: data => data?.status,
                cell: data =>
                (<ShowEnumFromString
                    labelPrefix="EmployeeStatus"
                    value={data?.status}
                    enumArray={EmployeeStatus} />
                ),
            },
        ]
        if (viewMode == ViewModeType.PAST_EMPLOYEE) {
            // data.push({
            //     id: "end_of_employment",
            //     name: "END_OF_EMPLOYMENT",
            //     cell: (data) => (
            //         <ShowFormattedDate
            //             date={data?.end_of_employment}
            //         />
            //     ),
            // });
            // data.push({
            //     id: "reason_codes",
            //     name: "REASON_CODES",
            //     // selector: data => data?.applicantJob?.reason_codes,
            //     cell: (data) => (
            //         <ShowEnumFromString
            //             popover
            //             labelPrefix={
            //                 data.status == EmployeeStatus.INACTIVE_QUIT
            //                     ? "ApplicantReasonCodeQuit"
            //                     : "ApplicantReasonCodeFired"
            //             }
            //             enumArray={
            //                 data.status == EmployeeStatus.INACTIVE_FIRED
            //                     ? ApplicantReasonCodeQuit
            //                     : ApplicantReasonCodeFired
            //             }
            //             value={data?.reason_codes}
            //         />
            //     ),
            // });
        } else {
        }

        return data
    }

    const tableActions = (data: EmployeeEntity): ListActionOptions[] => ([
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
    ])

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
            <ViewDataTable<EmployeeEntity>
                columnSettingKey={columnSettingKey}
                customStyles={{
                    headRow: {
                        style: {
                            background: "linear-gradient(to bottom right, #2ec8c4, #1b4454ba)",
                            color: "white"
                        },
                    },
                }}
                columns={tableColumns()}
                actions={data => (viewMode != ViewModeType.EMPLOYEE) ? null : tableActions(data)}
                items={employees}
            />

            {/* TabbedLayout modal component with items passed as a prop `tabs` */}
            <ViewModal title="VIEW_DETAILS" show={!!(modalAction?.type == "VIEW")} onCloseClick={resetModalAction} size='xl' >
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

            {/* modal that displays a table for moving employee to past employee list */}
            <ViewModal
                title={t("MOVE_TO_PAST_EMPLOYEE")}
                show={!!moveToPastForm.values?.id}
                onCloseClick={moveToPastForm.resetForm}
                size='lg'
            >
                <EntityForm
                    onSubmit={moveToPastForm.handleSubmit}
                    id={moveToPastForm?.values?.id}
                    formik={moveToPastForm}
                    canSubmit={moveToPastForm.isValid}
                >
                    <Row className="py-3 px-5">
                        <Col>
                            <BaseSelect
                                label="STATUS"
                                formik={moveToPastForm}
                                name={`status`}
                                required
                                placeholder="STATUS"
                                labelPrefix="EmployeeStatus"
                                showOptions={[EmployeeStatus.FIRED, EmployeeStatus.QUIT]}
                                enumType={EmployeeStatus}
                            />
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
