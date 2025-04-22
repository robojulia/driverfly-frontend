import { FormControlLabel, Switch } from "@mui/material";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Button, Col, FormGroup, Row } from "react-bootstrap";
import { EyeFill, PenFill, TrashFill } from 'react-bootstrap-icons';
import 'react-tabs/style/react-tabs.css';
import { toast } from "react-toastify";
import AdditionalFiles from "../../../../../components/dashboard/employee-directory/additional-files";
import Background from "../../../../../components/dashboard/employee-directory/background";
import DQF from "../../../../../components/dashboard/employee-directory/dqf";
import FullLayout from "../../../../../components/dashboard/layouts/layout/full-layout";
import ShowEnumFromString from "../../../../../components/enum-filters/show-enum-from-string";
import BaseCheckList from "../../../../../components/forms/base-check-list";
import BaseInput from "../../../../../components/forms/base-input";
import BaseSelect from "../../../../../components/forms/base-select";
import BaseTextArea from "../../../../../components/forms/base-text-area";
import ShowFormattedDate from "../../../../../components/jobs/show-formatted-date";
import EntityForm from "../../../../../components/layouts/page/entity-form";
import PageLayout from "../../../../../components/layouts/page/page-layout";
import { TabbedLayout } from "../../../../../components/layouts/page/tabbed-layout";
import { ListActionOptions } from "../../../../../components/list-actions/list-actions";
import CustomPagination from "../../../../../components/pagination/custom-pagination";
import OverlyPopover from "../../../../../components/popover/overly-popover";
import ViewDataTable, { ViewTableColumn, getDataTableColumnKey } from "../../../../../components/view-details/view-data-table";
import ViewModal from "../../../../../components/view-details/view-modal";
import { EmployeeStatus } from "../../../../../enums/applicants/employee-status.enum";
import { EmployeeReasonCodeFired, EmployeeReasonCodeQuit } from "../../../../../enums/employee/employee-reason-codes.enum";
import { useAuth } from "../../../../../hooks/use-auth";
import useLastPage from "../../../../../hooks/use-last-page";
import { useTranslation } from "../../../../../hooks/use-translation";
import { EmployeeEntity } from "../../../../../models/employee/employee.entity";
import { Pagination, PagingMeta } from "../../../../../types/pagination.type";
import { globalAjaxExceptionHandler } from "../../../../../utils/ajax";
import { useEffectAsync } from "../../../../../utils/react";
import EmployeeApi from "../../../../api/employee";

enum ViewModeType { EMPLOYEE = "EMPLOYEE", PAST_EMPLOYEE = "PAST_EMPLOYEE" }

const pagingsMetaInitialValues = (): PagingMeta => ({
    currentPage: 1,
    totalItems: 0,
    itemsPerPage: 20,
    totalPages: 0,
    itemCount: 0
})

export default function EmployeeDirectory() {

    const { user, hasPermission } = useAuth();
    const { setPreviousPath } = useLastPage();
    const router = useRouter();
    const { t } = useTranslation();
    const employeeApi = new EmployeeApi();

    const [viewMode, setViewMode] = useState<ViewModeType>(ViewModeType.EMPLOYEE)
    const [loading, setLoading] = useState<boolean>(true);
    const [employees, setEmployees] = useState<EmployeeEntity[]>([])
    const [modalAction, setModalAction] = useState<{
        entity: EmployeeEntity,
        type: "VIEW" | "DELETE" | "MOVE_TO_PAST_EMPLOYEE",
    }>(null)
    const [pagingMeta, setPagingMeta] = useState<PagingMeta>(pagingsMetaInitialValues);

    const tabs = {
        BACKGROUND: <Background
            employee={modalAction?.entity}
        />,
        DQF: < DQF
            employee={modalAction?.entity}
            canEdit={(modalAction?.entity.status == EmployeeStatus.ACTIVE)}
            canEditSafetyPerformance
            showHistory={true}
        />,
        // DRIVER_ONBOARDING_CHECKLIST: < DAC applicant={modalAction?.entity.applicant} />,
        ADDITIONAL_FILES: < AdditionalFiles
            employee={modalAction?.entity}
            canEdit={(modalAction?.entity.status == EmployeeStatus.ACTIVE)}
        />,

        // VEHICLES: < VehicleInformationTab />  //according to wireframe this tab (vehichled are pushed to phase 3)
    };

    const can = {
        viewUser: hasPermission("CanViewEmployee"),
        editUser: hasPermission("CanEditEmployee"),
        deleteUser: hasPermission("CanDeleteEmployee"),
    };
    const columnSettingKey = getDataTableColumnKey("company", user, "employee-directory");
    const resetEmployees = () => setEmployees([])
    const resetPagingMeta = () => setPagingMeta(pagingsMetaInitialValues)
    const filterEmployees = (id: number) => setEmployees(employees.filter(v => v.id != id))
    const resetModalAction = (): void => setModalAction(null)

    useEffect(() => {
        setPreviousPath(router.asPath)
        setViewMode(router.query.viewMode as ViewModeType ?? ViewModeType.EMPLOYEE)
    }, [router])

    useEffectAsync(async () => {
        viewMode == ViewModeType.EMPLOYEE ? fetchEmployee() : fetchPastEmployee()
    }, [user, viewMode, pagingMeta?.currentPage, pagingMeta?.itemsPerPage]);

    const onViewModeChange = async ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
        value = viewMode == ViewModeType.EMPLOYEE ? ViewModeType.PAST_EMPLOYEE : ViewModeType.EMPLOYEE
        resetEmployees();
        resetPagingMeta();
        router.query.viewMode = value;
        await router.push(router);
    }

    const fetchEmployee = async (): Promise<void> => {
        setLoading(true);
        const data = await employeeApi.list({
            status: [EmployeeStatus.ACTIVE],
            is_paginated: true,
            limit: pagingMeta?.itemsPerPage,
            page: pagingMeta.currentPage,
        });
        setEmployees((data as Pagination<EmployeeEntity>)?.items);
        setPagingMeta({
            ...pagingMeta,
            currentPage: pagingMeta?.currentPage || 1,
            totalItems: (data as Pagination<PagingMeta>)?.meta?.totalItems
        });
        setTimeout(() => setLoading(false), 1000);
    }

    const fetchPastEmployee = async (): Promise<void> => {
        setLoading(true);
        const data = await employeeApi.list({
            status: [EmployeeStatus.QUIT, EmployeeStatus.FIRED],
            is_paginated: true,
            limit: pagingMeta?.itemsPerPage,
            page: pagingMeta.currentPage,
        });
        setEmployees((data as Pagination<EmployeeEntity>)?.items);
        setPagingMeta({
            ...pagingMeta,
            currentPage: pagingMeta?.currentPage || 1,
            totalItems: (data as Pagination<PagingMeta>)?.meta?.totalItems
        });
        setTimeout(() => setLoading(false), 1000);
    }

    const handlePageChange = (page: number, perPage: number) => {
        setPagingMeta((prevPagingMeta: PagingMeta) => ({
            ...prevPagingMeta,
            currentPage: page,
            itemsPerPage: perPage
        }));
    };

    const moveToPastForm = useFormik({
        initialValues: new EmployeeEntity(),
        validationSchema: EmployeeEntity.yupSchemaForMarking(),
        validateOnBlur: false,
        validateOnMount: false,
        onSubmit: async (values) => {
            try {
                await employeeApi.mark(values?.id, values)
                moveToPastForm.resetForm();
                filterEmployees(values?.id)
                toast(t("SUCCESSFULLY_MOVED_TO_PAST"))
            } catch (e) {
                globalAjaxExceptionHandler(e, { formik: moveToPastForm, t: t, toast: toast });
            }
        },
    });

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

            if (data && data?.status == EmployeeStatus.DELETED) {
                filterEmployees(modalAction?.entity?.id)
                toast.success(t("EMPLOYEE_DELETED_SUCCESSFULLY"))
            } else {
                toast.error(t("ERROR_MESSAGE_DEFAULT"))
            }
        } catch (error) {
            toast(t("ERROR_MESSAGE_DEFAULT"))
        }
        resetModalAction()
    }

    const onMoveToPastEmploeeClick = async (): Promise<void> => {
        setModalAction({ ...modalAction, type: "MOVE_TO_PAST_EMPLOYEE" })
        moveToPastForm.setFieldValue("id", modalAction?.entity?.id);
        moveToPastForm.setFieldValue("hire_date", modalAction?.entity?.hire_date);
    }

    const tableColumns = (): ViewTableColumn<EmployeeEntity>[] => {
        const data: ViewTableColumn<EmployeeEntity>[] = [
            {
                id: "id",
                width: "8%",
                name: "ID",
                selector: data => data?.id,
            },
            {
                id: "name",
                width: "15%",
                name: 'NAME',
                selector: data => `${data?.first_name} ${data?.last_name}`,
                cell: data => <span
                    role="button"
                    className="bg-priamry cursor-pointer"
                    onClick={() => onViewClick(data)}
                >{data?.first_name + ' ' + data?.last_name}</span>,
            },
            {
                id: "phone",
                name: 'PHONE',
                width: "15%",
                selector: data => data?.phone,
                cell: data => (<OverlyPopover
                    skipTranslate
                    // slice_at={10}
                    str={data?.phone}
                />),
            },
            {
                id: "email",
                name: 'EMAIL',
                width: "15%",
                selector: data => data?.email,
                cell: data => (<OverlyPopover
                    skipTranslate
                    slice_at={40}
                    str={data?.email}
                />),
            },
            {
                width: "15%",
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
                cell: data => <ShowFormattedDate
                    date={data?.hire_date}
                />
            },
            {
                id: "status",
                width: "8%",
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
            data.push({
                id: "end_of_employment",
                name: "END_OF_EMPLOYMENT",
                cell: (data) => (
                    <ShowFormattedDate
                        date={data?.termination_date}
                    />
                ),
            });
            data.push({
                id: "reason_codes",
                name: "REASON_CODES",
                cell: (data) =>
                    data?.reason_codes && (
                        <ShowEnumFromString
                            popover
                            labelPrefix={
                                data.status == EmployeeStatus.QUIT
                                    ? "EmployeeReasonCodeQuit"
                                    : "EmployeeReasonCodeFired"
                            }
                            enumArray={
                                data.status == EmployeeStatus.QUIT
                                    ? EmployeeReasonCodeQuit
                                    : EmployeeReasonCodeFired
                            }
                            value={data?.reason_codes}
                        />
                    ),
            });
            data.push({
                id: "reason_codes_other",
                name: "OTHER",
                cell: data => (<OverlyPopover
                    skipTranslate
                    slice_at={10}
                    str={data?.reason_codes_other}
                />),
            });
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
                        {viewMode == ViewModeType.EMPLOYEE
                            && (<p className="mt-2 mb-2">
                                <u className="ml-1">
                                    <Button variant="" className="theme-general-btn" onClick={() => router.push("/dashboard/company/compliance/employee-directory/import")}>
                                        + {t("IMPORT_EMPLOYEES")}
                                    </Button>
                                </u>
                            </p>)
                        }

                        <FormGroup style={{ float: "right", display: 'flex', alignItems: 'center' }}>
                            <span className="p-4">{t("VIEW_BY_{name}", { name: "PAST_EMPLOYEE" }, { translateProps: true })}</span>
                            <FormControlLabel
                                control={<Switch
                                    value={viewMode == ViewModeType.EMPLOYEE ? ViewModeType.EMPLOYEE : ViewModeType.PAST_EMPLOYEE}
                                    checked={viewMode == ViewModeType.EMPLOYEE}
                                    onChange={onViewModeChange} />}
                                label=''
                            />
                            <span className="">{t("VIEW_BY_{name}", { name: "EMPLOYEE" }, { translateProps: true })}</span>

                        </FormGroup>
                    </Col>
                </Row>
            }
        >
            {loading
                ? <div className="spinner-border mt-3 ml-1" role="status">
                    <span className="sr-only">Loading...</span>
                </div>
                :
                <>
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
                    <div style={{ marginRight: "7%" }}>
                        <CustomPagination
                            recordsPerPageOptions={[20, 50, 100]}
                            onPageChange={handlePageChange}
                            pagingMeta={pagingMeta}
                            setPagingMeta={setPagingMeta}
                        />
                    </div>
                </>
            }

            {/* TabbedLayout modal component with items passed as a prop `tabs` */}
            <ViewModal title="VIEW_DETAILS" show={!!(modalAction?.type == "VIEW")} onCloseClick={resetModalAction} size='xl' >
                <>
                    {
                        <h2>{modalAction?.entity?.first_name + " " + modalAction?.entity?.last_name}</h2>
                    }
                    <TabbedLayout items={tabs} className=""></TabbedLayout>
                </>
            </ViewModal>

            {/* modal that displays a table for confirming trash action */}
            <ViewModal
                title="CONFIRMATION"
                show={modalAction?.type == "DELETE"}
                onCloseClick={resetModalAction}
                size='sm'
            >
                <>
                    <Row >
                        <Col className="d-flex justify-content-center align-items-center">
                            <h4 className="mt-4">{t("ARE_YOU_SURE_TO_DELETE_OR_MOVE_TO_PAST_EMPLOYEE")}</h4>
                        </Col>
                    </Row>
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
                </>
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
                        <Col md="12">
                            <BaseInput
                                type="date"
                                label="TERMINATION_DATE"
                                formik={moveToPastForm}
                                name={`termination_date`}
                                required
                            />
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
                        <Col md="12" className="mt-2">
                            {
                                moveToPastForm.values.status == EmployeeStatus.QUIT &&
                                <BaseCheckList
                                    className="col-12"
                                    label="REASON_CODES"
                                    name="reason_codes"
                                    required
                                    cols={2}
                                    formik={moveToPastForm}
                                    labelPrefix="EmployeeReasonCodeQuit"
                                    enumType={EmployeeReasonCodeQuit}
                                />
                            }
                            {
                                moveToPastForm.values.status == EmployeeStatus.FIRED &&
                                <BaseCheckList
                                    className="col-12"
                                    label="REASON_CODES"
                                    name="reason_codes"
                                    required
                                    cols={2}
                                    formik={moveToPastForm}
                                    labelPrefix="EmployeeReasonCodeFired"
                                    enumType={EmployeeReasonCodeFired}
                                />
                            }
                            {
                                moveToPastForm.values.reason_codes?.includes("OTHER") &&
                                <BaseTextArea
                                    className="col-12"
                                    placeholder="REASONS"
                                    name="reason_codes_other"
                                    required
                                    maxLength={100}
                                    formik={moveToPastForm}
                                />
                            }

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
