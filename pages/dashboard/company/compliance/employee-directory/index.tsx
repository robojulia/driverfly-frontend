import { FormControlLabel, Switch } from '@mui/material';
import { useFormik } from 'formik';
import { useRouter } from 'next/router';
import React, { useEffect, useState, useRef } from 'react';
import { Button, Col, FormGroup, Row } from 'react-bootstrap';
import { EyeFill, PenFill, TrashFill, PersonFill, PersonX, Bell, GearFill, Download } from 'react-bootstrap-icons';
import { Accordion, Tabs, Tab } from 'react-bootstrap';
import { toast } from 'react-toastify';
import EmployeeFilterForm, { EmployeeFilterDto } from '../../../../../components/forms/company/employee-filter-form';
import FullLayout from '../../../../../components/dashboard/layouts/layout/full-layout';
import ShowEnumFromString from '../../../../../components/enum-filters/show-enum-from-string';
import BaseCheckList from '../../../../../components/forms/base-check-list';
import BaseInput from '../../../../../components/forms/base-input';
import BaseSelect from '../../../../../components/forms/base-select';
import BaseTextArea from '../../../../../components/forms/base-text-area';
import ShowFormattedDate from '../../../../../components/jobs/show-formatted-date';
import EntityForm from '../../../../../components/layouts/page/entity-form';
import PageLayout from '../../../../../components/layouts/page/page-layout';
import { ListActionOptions } from '../../../../../components/list-actions/list-actions';
import CustomPagination from '../../../../../components/pagination/custom-pagination';
import OverlyPopover from '../../../../../components/popover/overly-popover';
import { GenericTable, TableColumn } from '../../../../../components/common/GenericTable';
import { getDataTableColumnKey } from '../../../../../utils/table-migration';
import ViewModal from '../../../../../components/view-details/view-modal';
import { EmployeeStatus } from '../../../../../enums/applicants/employee-status.enum';
import {
  EmployeeReasonCodeFired,
  EmployeeReasonCodeQuit,
} from '../../../../../enums/employee/employee-reason-codes.enum';
import { useAuth } from '../../../../../hooks/use-auth';
import useLastPage from '../../../../../hooks/use-last-page';
import { useTranslation } from '../../../../../hooks/use-translation';
import { EmployeeEntity } from '../../../../../models/employee/employee.entity';
import { Pagination, PagingMeta } from '../../../../../types/pagination.type';
import { globalAjaxExceptionHandler } from '../../../../../utils/ajax';
import { useEffectAsync } from '../../../../../utils/react';
import EmployeeApi from '../../../../api/employee';
import DataViewToggle from '../../../../../components/shared/DataViewToggle';
import Notifications from '../../../../../components/dashboard/employee-directory/notifications';
import { EmployeeCSVExporter } from '../../../../../utils/employee-csv-exporter';

enum ViewModeType {
  EMPLOYEE = 'EMPLOYEE',
  PAST_EMPLOYEE = 'PAST_EMPLOYEE',
}

const pagingsMetaInitialValues = (): PagingMeta => ({
  currentPage: 1,
  totalItems: 0,
  itemsPerPage: 20,
  totalPages: 0,
  itemCount: 0,
});

export default function EmployeeDirectory() {
  const { user, hasPermission, isCompanyAdmin } = useAuth();
  const { setPreviousPath } = useLastPage();
  const router = useRouter();
  const { t } = useTranslation();
  const employeeApi = new EmployeeApi();

  const [viewMode, setViewMode] = useState<ViewModeType>(ViewModeType.EMPLOYEE);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [employees, setEmployees] = useState<EmployeeEntity[]>([]);
  const [modalAction, setModalAction] = useState<{
    entity: EmployeeEntity;
    type: 'VIEW' | 'DELETE' | 'MOVE_TO_PAST_EMPLOYEE';
  }>(null);
  const [pagingMeta, setPagingMeta] = useState<PagingMeta>(pagingsMetaInitialValues);
  const [activeTab, setActiveTab] = useState<string>('directory');

  // Add search and sorting state
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [filters, setFilters] = useState<EmployeeFilterDto>();
  const [filtersChanged, setFiltersChanged] = useState<boolean>(false);

  // Track if this is the initial load
  const isInitialLoadRef = useRef(true);


  const can = {
    viewUser: hasPermission('CanViewEmployee'),
    editUser: hasPermission('CanEditEmployee'),
    deleteUser: hasPermission('CanDeleteEmployee'),
  };
  const columnSettingKey = getDataTableColumnKey('company', user, 'employee-directory');
  const resetEmployees = () => setEmployees([]);
  const resetPagingMeta = () => setPagingMeta(pagingsMetaInitialValues);
  const filterEmployees = (id: number) => setEmployees(employees.filter((v) => v.id != id));
  const resetModalAction = (): void => setModalAction(null);

  useEffect(() => {
    setPreviousPath(router.asPath);
    setViewMode((router.query.viewMode as ViewModeType) ?? ViewModeType.EMPLOYEE);

    // Handle tab query parameter for direct navigation to a specific tab
    if (router.query.tab === 'notifications') {
      setActiveTab('notifications');
    }

    // Handle hireDateFrom query parameter for filtering recent hires
    if (router.query.hireDateFrom) {
      setFilters((prevFilters) => ({
        ...prevFilters,
        hireDateFrom: router.query.hireDateFrom as string,
      }));
    }

    // Handle birthdayThisWeek query parameter for filtering employees with birthdays this week
    if (router.query.birthdayThisWeek === 'true') {
      setFilters((prevFilters) => ({
        ...prevFilters,
        birthdayThisWeek: true,
      }));
    }
  }, [router, setPreviousPath]);

  useEffectAsync(async () => {
    if (viewMode) {
      const isInitialLoad = isInitialLoadRef.current;
      isInitialLoadRef.current = false;

      viewMode == ViewModeType.EMPLOYEE
        ? fetchEmployee(isInitialLoad)
        : fetchPastEmployee(isInitialLoad);
    }
  }, [
    user,
    viewMode,
    pagingMeta?.currentPage,
    pagingMeta?.itemsPerPage,
    searchTerm,
    sortBy,
    sortDirection,
    filters,
  ]);

  useEffect(() => setFiltersChanged(true), [filters]);

  useEffect(() => {
    setFilters({});
  }, []);

  const onViewModeChange = async ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
    value = viewMode == ViewModeType.EMPLOYEE ? ViewModeType.PAST_EMPLOYEE : ViewModeType.EMPLOYEE;
    resetEmployees();
    resetPagingMeta();
    // Reset initial load flag when switching view modes
    isInitialLoadRef.current = true;
    router.query.viewMode = value;
    await router.push(router);
  };

  const fetchEmployee = async (isInitialLoad: boolean = false): Promise<void> => {
    // Only show full loading spinner on initial load
    if (isInitialLoad) {
      setLoading(true);
    } else {
      setRefreshing(true);
    }

    const data = await employeeApi.list({
      status: [EmployeeStatus.ACTIVE],
      is_paginated: true,
      limit: pagingMeta?.itemsPerPage,
      page: filtersChanged ? 1 : pagingMeta.currentPage,
      search: searchTerm || undefined,
      sortBy: sortBy || undefined,
      sortOrder: (sortDirection?.toUpperCase() as 'ASC' | 'DESC') || undefined,
      // Regular users only see employees hired through them
      ...(!isCompanyAdmin && { recruitedByUserId: user?.id }),
      ...filters,
    });
    setEmployees((data as Pagination<EmployeeEntity>)?.items);
    setFiltersChanged(false);
    setPagingMeta({
      ...pagingMeta,
      currentPage: filtersChanged ? 1 : pagingMeta?.currentPage || 1,
      totalItems: (data as Pagination<PagingMeta>)?.meta?.totalItems,
    });

    // Clear appropriate loading state
    if (isInitialLoad) {
      setTimeout(() => setLoading(false), 1000);
    } else {
      setRefreshing(false);
    }
  };

  const fetchPastEmployee = async (isInitialLoad: boolean = false): Promise<void> => {
    // Only show full loading spinner on initial load
    if (isInitialLoad) {
      setLoading(true);
    } else {
      setRefreshing(true);
    }

    const data = await employeeApi.list({
      status: [EmployeeStatus.QUIT, EmployeeStatus.FIRED],
      is_paginated: true,
      limit: pagingMeta?.itemsPerPage,
      page: filtersChanged ? 1 : pagingMeta.currentPage,
      search: searchTerm || undefined,
      sortBy: sortBy || undefined,
      sortOrder: (sortDirection?.toUpperCase() as 'ASC' | 'DESC') || undefined,
      // Regular users only see employees hired through them
      ...(!isCompanyAdmin && { recruitedByUserId: user?.id }),
      ...filters,
    });
    setEmployees((data as Pagination<EmployeeEntity>)?.items);
    setFiltersChanged(false);
    setPagingMeta({
      ...pagingMeta,
      currentPage: filtersChanged ? 1 : pagingMeta?.currentPage || 1,
      totalItems: (data as Pagination<PagingMeta>)?.meta?.totalItems,
    });

    // Clear appropriate loading state
    if (isInitialLoad) {
      setTimeout(() => setLoading(false), 1000);
    } else {
      setRefreshing(false);
    }
  };

  const handlePageChange = (page: number, perPage: number) => {
    setPagingMeta((prevPagingMeta: PagingMeta) => ({
      ...prevPagingMeta,
      currentPage: page,
      itemsPerPage: perPage,
    }));
  };

  // Handle sorting
  const handleSort = (column: string, direction: 'asc' | 'desc') => {
    setSortBy(column);
    setSortDirection(direction);
    // Reset to first page when sorting changes
    setPagingMeta((prevPagingMeta: PagingMeta) => ({
      ...prevPagingMeta,
      currentPage: 1,
    }));
  };

  // Handle search with debouncing
  const handleSearch = (searchTerm: string) => {
    setSearchTerm(searchTerm);
    // Reset to first page when search changes
    setPagingMeta((prevPagingMeta: PagingMeta) => ({
      ...prevPagingMeta,
      currentPage: 1,
    }));
    // Don't treat search as initial load
    isInitialLoadRef.current = false;
  };

  const moveToPastForm = useFormik({
    initialValues: new EmployeeEntity(),
    validationSchema: EmployeeEntity.yupSchemaForMarking(),
    validateOnBlur: false,
    validateOnMount: false,
    onSubmit: async (values) => {
      try {
        await employeeApi.mark(values?.id, values);
        moveToPastForm.resetForm();
        filterEmployees(values?.id);
        toast(t('SUCCESSFULLY_MOVED_TO_PAST'));
      } catch (e) {
        globalAjaxExceptionHandler(e, {
          formik: moveToPastForm,
          t: t,
          toast: toast,
        });
      }
    },
  });

  const onViewClick = async (entity: EmployeeEntity): Promise<void> => {
    router.push(`/dashboard/company/compliance/employee-directory/${entity?.id}`);
  };

  const onEditClick = (data) =>
    router.push(`/dashboard/company/compliance/employee-directory/${data?.id}/edit`);

  const handleExportEmployees = () => {
    if (employees && employees.length > 0) {
      const filename = viewMode === ViewModeType.EMPLOYEE
        ? `active-employees-export-${new Date().toISOString().split('T')[0]}.csv`
        : `past-employees-export-${new Date().toISOString().split('T')[0]}.csv`;
      EmployeeCSVExporter.exportEmployeesToCSV(employees, filename);
      toast.success(t('EMPLOYEES_EXPORTED_SUCCESSFULLY'));
    } else {
      toast.warning(t('NO_EMPLOYEES_TO_EXPORT'));
    }
  };

  const onTrashClick = async (entity: EmployeeEntity): Promise<void> =>
    setModalAction({ entity, type: 'DELETE' });

  const onDeleteClick = async (): Promise<void> => {
    try {
      const data = await employeeApi.remove(modalAction?.entity?.id);

      if (data && data?.status == EmployeeStatus.DELETED) {
        filterEmployees(modalAction?.entity?.id);
        toast.success(t('EMPLOYEE_DELETED_SUCCESSFULLY'));
      } else {
        toast.error(t('ERROR_MESSAGE_DEFAULT'));
      }
    } catch (error) {
      toast(t('ERROR_MESSAGE_DEFAULT'));
    }
    resetModalAction();
  };

  const onMoveToPastEmploeeClick = async (): Promise<void> => {
    setModalAction({ ...modalAction, type: 'MOVE_TO_PAST_EMPLOYEE' });
    moveToPastForm.setFieldValue('id', modalAction?.entity?.id);
    moveToPastForm.setFieldValue('hire_date', modalAction?.entity?.hire_date);
  };

  const tableColumns = (): TableColumn<EmployeeEntity>[] => {
    const data: TableColumn<EmployeeEntity>[] = [
      {
        key: 'id',
        label: 'ID',
        width: '8%',
        selector: (data) => data?.id,
        sortable: true,
        hidable: false,
      },
      {
        key: 'name',
        label: 'NAME',
        width: '15%',
        selector: (data) => `${data?.first_name} ${data?.last_name}`,
        sortable: true,
        hidable: false,
        render: (data) => (
          <span
            role="button"
            className="bg-priamry cursor-pointer"
            onClick={() => onViewClick(data)}
          >
            {data?.first_name + ' ' + data?.last_name}
          </span>
        ),
      },
      {
        key: 'city',
        label: 'CITY',
        selector: (data) => data?.city,
        sortable: true,
        hide: true,
        render: (data) => <OverlyPopover skipTranslate str={data?.city} />,
      },
      {
        key: 'state',
        label: 'STATE',
        selector: (data) => data?.state,
        sortable: true,
        hide: true,
        render: (data) => <OverlyPopover skipTranslate str={data?.state} />,
      },
      {
        key: 'phone',
        label: 'PHONE',
        width: '15%',
        selector: (data) => data?.phone,
        sortable: true,
        render: (data) => (
          <OverlyPopover
            skipTranslate
            // slice_at={10}
            str={data?.phone}
          />
        ),
      },
      {
        key: 'email',
        label: 'EMAIL',
        width: '15%',
        selector: (data) => data?.email,
        sortable: true,
        render: (data) => <OverlyPopover skipTranslate slice_at={40} str={data?.email} />,
      },
      {
        key: 'license_type',
        label: 'CDL_TYPE',
        selector: (data) =>
          data?.license_type === 'NO_CDL' || data?.license_type === null
            ? t('DriverLicenseType.NONE')
            : t(`DriverLicenseType.${data.license_type}`) || t('DriverLicenseType.NONE'),
        sortable: true,
        hide: true,
      },
      {
        key: 'years_cdl_experience',
        label: 'years_cdl_experience',
        selector: (data) => data?.years_cdl_experience || t('ZERO'),
        sortable: true,
        hide: true,
      },
      {
        key: 'transmission_type',
        label: 'TRANSMISSION_EXPERIENCE',
        selector: (data) =>
          data.transmission_type
            ? data?.transmission_type
                ?.map((v) =>
                  v == 'OTHER'
                    ? t('VehicleTransmissionType.OTHER')
                    : t(`VehicleTransmissionType.${v}`)
                )
                ?.join(', ')
            : t('NONE'),
        sortable: true,
        hide: true,
      },
      {
        key: 'endorsements',
        label: 'ENDORSEMENTS',
        selector: (data) =>
          data.endorsements
            ? data?.endorsements
                ?.map((v) => (v == 'OTHER' ? t('DriverEndorsement.OTHER') : t(`DriverEndorsement.${v}`)))
                ?.join(', ')
            : t('NONE'),
        sortable: true,
        hide: true,
      },
      {
        key: 'jobTitle',
        label: 'job_title',
        width: '15%',
        selector: (data) => data?.job?.title,
        sortable: true,
        render: (data) => <OverlyPopover skipTranslate slice_at={40} str={data?.job?.title} />,
      },
      {
        key: 'dateHired',
        label: 'DATE_HIRED',
        sortable: true,
        render: (data) => <ShowFormattedDate date={data?.hire_date} />,
      },
      {
        key: 'is_owner_operator',
        label: 'OWNER_OP_COMPANY_DRIVER',
        selector: (data) =>
          data.is_owner_operator === true
            ? t('OWNER_OPERATOR')
            : data.is_owner_operator === false
            ? t('COMPANY_DRIVER')
            : t('NONE'),
        sortable: true,
        hide: true,
        render: (data) =>
          data.is_owner_operator === true
            ? t('OWNER_OPERATOR')
            : data.is_owner_operator === false
            ? t('COMPANY_DRIVER')
            : t('NONE'),
      },
      {
        key: 'preferred_location',
        label: 'PREFERRED_LOCATION',
        selector: (data) =>
          data.preferred_location
            ? data?.preferred_location
                ?.map((v) => (v == 'OTHER' ? t('JobGeography.OTHER') : t(`JobGeography.${v}`)))
                ?.join(', ')
            : t('NONE'),
        sortable: true,
        hide: true,
      },
      {
        key: 'status',
        label: 'STATUS',
        width: '8%',
        selector: (data) => data?.status,
        sortable: true,
        hide: true,
        render: (data) => (
          <ShowEnumFromString
            labelPrefix="EmployeeStatus"
            value={data?.status}
            enumArray={EmployeeStatus}
          />
        ),
      },
    ];
    if (viewMode == ViewModeType.PAST_EMPLOYEE) {
      data.push({
        key: 'end_of_employment',
        label: 'END_OF_EMPLOYMENT',
        sortable: true,
        render: (data) => <ShowFormattedDate date={data?.termination_date} />,
      });
      data.push({
        key: 'reason_codes',
        label: 'REASON_CODES',
        sortable: true,
        render: (data) =>
          data?.reason_codes && (
            <ShowEnumFromString
              popover
              labelPrefix={
                data.status == EmployeeStatus.QUIT
                  ? 'EmployeeReasonCodeQuit'
                  : 'EmployeeReasonCodeFired'
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
        key: 'reason_codes_other',
        label: 'OTHER',
        sortable: true,
        render: (data) => (
          <OverlyPopover skipTranslate slice_at={10} str={data?.reason_codes_other} />
        ),
      });
    } else {
    }

    return data;
  };

  const tableActions = (data: EmployeeEntity): ListActionOptions[] => [
    {
      onClick: (e) => onViewClick(data),
      icon: EyeFill,
      label: 'VIEW',
      hide: !can.viewUser,
    },
    {
      onClick: (e) => onEditClick(data),
      icon: PenFill,
      label: 'EDIT',
      hide: !can.editUser,
    },
    {
      onClick: (e) => onTrashClick(data),
      icon: TrashFill,
      label: 'DELETE',
      hide: !can.deleteUser,
    },
  ];

  return (
    <>
      <style>{`
        .employee-main-tabs {
          background: #fff;
          border-bottom: 2px solid #dee2e6;
          margin: -1.5rem -1.5rem 0 -1.5rem;
          padding: 0 1.5rem;
        }
        .employee-main-tab {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 1rem 1.5rem;
          border: none;
          background: transparent;
          color: #6c757d;
          font-weight: 500;
          font-size: 0.95rem;
          cursor: pointer;
          border-bottom: 3px solid transparent;
          margin-bottom: -2px;
          transition: all 0.2s ease;
          position: relative;
        }
        .employee-main-tab:hover {
          color: #495057;
          background: #f8f9fa;
        }
        .employee-main-tab.active {
          color: rgb(0, 96, 120);
          border-bottom-color: rgb(0, 96, 120);
          background: transparent;
        }
        .employee-main-tab svg {
          opacity: 0.7;
        }
        .employee-main-tab.active svg {
          opacity: 1;
        }
      `}</style>

      <PageLayout
        title=""
        actions={<div style={{ height: '1px' }}></div>}
      >
        {/* Custom Tab Navigation */}
        <div className="employee-main-tabs">
          <button
            className={`employee-main-tab ${activeTab === 'directory' ? 'active' : ''}`}
            onClick={() => setActiveTab('directory')}
          >
            <PersonFill size={18} />
            {t('EMPLOYEE_DIRECTORY')}
          </button>
          <button
            className={`employee-main-tab ${activeTab === 'notifications' ? 'active' : ''}`}
            onClick={() => setActiveTab('notifications')}
          >
            <GearFill size={18} />
            {t('NOTIFICATION_SETTINGS')}
          </button>
        </div>
      {activeTab === 'directory' ? (
        <Accordion defaultActiveKey="0" flush>
          {/* Action Bar */}
          <div style={{
            padding: '1.5rem 0 1rem 0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {viewMode == ViewModeType.EMPLOYEE && (
                <Button
                  variant=""
                  className="theme-general-btn"
                  onClick={() =>
                    router.push('/dashboard/company/compliance/employee-directory/import')
                  }
                  style={{
                    height: '38px',
                    padding: '0.375rem 0.75rem',
                    borderRadius: '0.25rem',
                    fontSize: '1rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                  }}
                >
                  + {t('IMPORT_EMPLOYEES')}
                </Button>
              )}
              <Button
                variant="outline-secondary"
                onClick={handleExportEmployees}
                disabled={!employees || employees.length === 0}
                style={{
                  height: '38px',
                  padding: '0.375rem 0.75rem',
                  borderRadius: '0.25rem',
                  fontSize: '1rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                }}
              >
                <Download size={14} className="mr-1" />
                Export
              </Button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Accordion.Button
                className="text-black theme-filter-btn"
                style={{
                  width: 'auto',
                  fontSize: '1rem',
                  lineHeight: '1.5',
                  padding: '0.375rem 0.75rem',
                  borderRadius: '0.25rem',
                  height: '38px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                <div className="mr-2">{t('FILTERS')}</div>
              </Accordion.Button>
              <DataViewToggle
                primaryLabel={t('ACTIVE_EMPLOYEES')}
                secondaryLabel={t('PAST_EMPLOYEES')}
                activeView={viewMode}
                onViewChange={async (newView) => {
                  resetEmployees();
                  resetPagingMeta();
                  router.query.viewMode = newView;
                  await router.push(router);
                }}
                primaryValue={ViewModeType.EMPLOYEE}
                secondaryValue={ViewModeType.PAST_EMPLOYEE}
                primaryIcon={<PersonFill />}
                secondaryIcon={<PersonX />}
                showCounts={true}
                primaryCount={
                  viewMode === ViewModeType.EMPLOYEE ? pagingMeta?.totalItems || 0 : undefined
                }
                secondaryCount={
                  viewMode === ViewModeType.PAST_EMPLOYEE ? pagingMeta?.totalItems || 0 : undefined
                }
                variant="pills"
                size="lg"
              />
            </div>
          </div>
          <Row>
            <Col className="force-overflow p-0">
              <Accordion.Body>
                <EmployeeFilterForm onSearch={setFilters} />
              </Accordion.Body>

              {loading ? (
                <div className="spinner-border mt-3 ml-1" role="status">
                  <span className="sr-only">Loading...</span>
                </div>
              ) : (
                <>
                  <GenericTable<EmployeeEntity>
                    data={employees}
                    columns={tableColumns()}
                    actions={(data) => (viewMode != ViewModeType.EMPLOYEE ? undefined : tableActions(data))}
                    enableSearch={true}
                    enableColumnHiding={true}
                    columnSettingKey={columnSettingKey}
                    refreshing={refreshing}
                    emptyTitle="No Employees Found"
                    emptyText="No employees match the current criteria."
                    onSort={handleSort}
                    sortBy={sortBy}
                    sortDirection={sortDirection}
                    onSearch={handleSearch}
                  />
                  <div style={{ marginRight: '7%' }}>
                    <CustomPagination
                      recordsPerPageOptions={[20, 50, 100]}
                      onPageChange={handlePageChange}
                      pagingMeta={pagingMeta}
                      setPagingMeta={setPagingMeta}
                    />
                  </div>
                </>
              )}
            </Col>
          </Row>

          {/* modal that displays a table for confirming trash action */}
          <ViewModal
        title="CONFIRMATION"
        show={modalAction?.type == 'DELETE'}
        onCloseClick={resetModalAction}
        size="lg"
        centered={true}
        className="confirmation-modal"
      >
        <>
          <Row>
            <Col className="d-flex justify-content-center align-items-center">
              <h4 className="mt-4 mb-4 text-center">
                {t('ARE_YOU_SURE_TO_DELETE_OR_MOVE_TO_PAST_EMPLOYEE')}
              </h4>
            </Col>
          </Row>
          <Row className="mt-4">
            <Col md={6} className="mb-3">
              <button
                onClick={() => onDeleteClick()}
                type="button"
                className="theme-danger-btn btn-block btn-theme w-100 p-3"
                style={{ minHeight: '48px' }}
              >
                {t('DELETE')}
              </button>
            </Col>
            <Col md={6} className="mb-3">
              <button
                onClick={() => onMoveToPastEmploeeClick()}
                type="button"
                className="theme-primary-btn btn-block btn-theme w-100 p-3"
                style={{ minHeight: '48px' }}
              >
                {t('MOVE_TO_PAST_EMPLOYEE')}
              </button>
            </Col>
          </Row>
        </>
          </ViewModal>

          {/* modal that displays a table for moving employee to past employee list */}
          <ViewModal
        title={t('MOVE_TO_PAST_EMPLOYEE')}
        show={!!moveToPastForm.values?.id}
        onCloseClick={moveToPastForm.resetForm}
        size="lg"
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
              {moveToPastForm.values.status == EmployeeStatus.QUIT && (
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
              )}
              {moveToPastForm.values.status == EmployeeStatus.FIRED && (
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
              )}
              {moveToPastForm.values.reason_codes?.includes('OTHER') && (
                <BaseTextArea
                  className="col-12"
                  placeholder="REASONS"
                  name="reason_codes_other"
                  required
                  maxLength={100}
                  formik={moveToPastForm}
                />
              )}
            </Col>
          </Row>
        </EntityForm>
          </ViewModal>
        </Accordion>
      ) : (
        <div style={{ padding: '1.5rem 0' }}>
          <Notifications employee={null} canEdit={can.editUser} />
        </div>
      )}
      </PageLayout>
    </>
  );
}

EmployeeDirectory.getLayout = function getLayout(page) {
  return <FullLayout>{page}</FullLayout>;
};
