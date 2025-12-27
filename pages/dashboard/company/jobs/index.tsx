import React, { useEffect, useRef, useCallback, useMemo } from 'react';
import FullLayout from '../../../../components/dashboard/layouts/layout/full-layout';

import { Files, PenFill, Plus, Recycle, CheckCircleFill, ClockFill, Code, TrashFill } from 'react-bootstrap-icons';

import PageLayout from '../../../../components/layouts/page/page-layout';

import { useRouter } from 'next/router';
import ShowEnumFromString from '../../../../components/enum-filters/show-enum-from-string';
import { JobDeliveryType } from '../../../../enums/jobs/job-delivery-type.enum';
import { useTranslation } from '../../../../hooks/use-translation';
import { JobEntity } from '../../../../models/job/job.entity';
import JobApi from '../../../api/job';

import { FormControlLabel, Switch } from '@mui/material';
import moment from 'moment';
import Link from 'next/link';
import { Button, ButtonGroup, Col, FormGroup, Row } from 'react-bootstrap';
import { toast } from 'react-toastify';
import BaseInput from '../../../../components/forms/base-input';
import BaseSelect from '../../../../components/forms/base-select';
import CustomPagination from '../../../../components/pagination/custom-pagination';
import OverlyPopover from '../../../../components/popover/overly-popover';
import ViewModal from '../../../../components/view-details/view-modal';
import { ExpiryStatus } from '../../../../enums/jobs/expiry-status.enum';
import { useAuth } from '../../../../hooks/use-auth';
import { Pagination, PagingMeta } from '../../../../types/pagination.type';
import { buildAddress } from '../../../../utils/common';
import { isExpired } from '../../../../utils/date';
import { useEffectAsync } from '../../../../utils/react';
import DataViewToggle from '../../../../components/shared/DataViewToggle';
import { GenericTable, TableColumn } from '../../../../components/common/GenericTable';
import { getDataTableColumnKey } from '../../../../utils/table-migration';
import { EmbedJobsModal } from '../../../../components/jobs/EmbedJobsModal';
import { ConfirmationModal } from '../../../../components/shared/confirmation-modal';

enum ViewModeType {
  ACTIVE = 'ACTIVE',
  EXPIRED = 'EXPIRED',
}

const pagingsMetaInitialValues = (): PagingMeta => ({
  currentPage: 1,
  totalItems: 0,
  itemsPerPage: 20,
  totalPages: 0,
  itemCount: 0,
});

export default function JobListing() {
  const [jobs, setJobs] = React.useState<JobEntity[]>([]);
  const [reactivateJob, setReactivateJob] = React.useState<JobEntity>();
  const [expiryDate, setExpiryDate] = React.useState<string | Date>();
  const [pagingMeta, setPagingMeta] = React.useState<PagingMeta>(pagingsMetaInitialValues);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [refreshing, setRefreshing] = React.useState<boolean>(false);
  const [viewMode, setViewMode] = React.useState<ViewModeType>();
  const [showCloneModal, setShowCloneModal] = React.useState<boolean>(false);
  const [showEmbedModal, setShowEmbedModal] = React.useState<boolean>(false);
  const [jobOptions, setJobOptions] = React.useState<JobEntity[]>([]);
  const [showDeleteModal, setShowDeleteModal] = React.useState<boolean>(false);
  const [jobToDelete, setJobToDelete] = React.useState<JobEntity | null>(null);
  const [isDeleting, setIsDeleting] = React.useState<boolean>(false);
  // Add sorting state
  const [sortBy, setSortBy] = React.useState<string>('');
  const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc'>('asc');

  // Track if this is the initial load
  const isInitialLoadRef = useRef(true);

  const { user, hasPermission } = useAuth();
  const { t } = useTranslation();
  const router = useRouter();
  const jobApi = useMemo(() => new JobApi(), []);

  const columnSettingKey = getDataTableColumnKey('company', user, 'jobs');
  const resetPagingMeta = () => setPagingMeta(pagingsMetaInitialValues);

  const fetchJobs = async (
    expiry_status: ExpiryStatus,
    isInitialLoad: boolean = false
  ): Promise<void> => {
    // Only show full loading spinner on initial load
    if (isInitialLoad) {
      setLoading(true);
    } else {
      setRefreshing(true);
    }

    const data = await jobApi.list({
      is_paginated: true,
      limit: pagingMeta?.itemsPerPage,
      page: pagingMeta.currentPage,
      expiry_status,
      companyId: user?.company?.id, // Add company filter to only show jobs from current company
      // Include sorting parameters for future API support
      sortBy: sortBy || undefined,
      sortOrder: (sortDirection?.toUpperCase() as 'ASC' | 'DESC') || undefined,
    });
    let jobsList = (data as Pagination<JobEntity>)?.items || [];

    // Client-side sorting until API supports it
    if (sortBy && jobsList.length > 0) {
      jobsList = [...jobsList].sort((a, b) => {
        let aValue: any;
        let bValue: any;

        // Get values based on sort column
        switch (sortBy) {
          case 'id':
            aValue = a.id;
            bValue = b.id;
            break;
          case 'company_id':
            aValue = a.company?.id || 0;
            bValue = b.company?.id || 0;
            break;
          case 'job_title':
            aValue = a.title?.toLowerCase() || '';
            bValue = b.title?.toLowerCase() || '';
            break;
          case 'location':
            aValue = buildAddress(a.location || {}).toLowerCase();
            bValue = buildAddress(b.location || {}).toLowerCase();
            break;
          case 'drivers_needed':
            aValue = a.drivers_needed || 0;
            bValue = b.drivers_needed || 0;
            break;
          case 'applicantsCount':
            aValue = a.applicantsCount || 0;
            bValue = b.applicantsCount || 0;
            break;
          case 'created_at':
            aValue = new Date(a.created_at || 0).getTime();
            bValue = new Date(b.created_at || 0).getTime();
            break;
          case 'expiration_date':
            aValue = a.expiry_date ? new Date(a.expiry_date).getTime() : 0;
            bValue = b.expiry_date ? new Date(b.expiry_date).getTime() : 0;
            break;
          case 'geography':
            aValue = a.geography || '';
            bValue = b.geography || '';
            break;
          case 'schedule':
            aValue = a.schedule || '';
            bValue = b.schedule || '';
            break;
          case 'employment_type':
            aValue = a.employment_type || '';
            bValue = b.employment_type || '';
            break;
          case 'delivery_type':
            aValue = a.delivery_type || '';
            bValue = b.delivery_type || '';
            break;
          case 'team_drivers':
            aValue = a.team_drivers || '';
            bValue = b.team_drivers || '';
            break;
          default:
            aValue = '';
            bValue = '';
        }

        // Handle different data types
        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
        } else {
          const comparison = String(aValue).localeCompare(String(bValue));
          return sortDirection === 'asc' ? comparison : -comparison;
        }
      });
    }

    setJobs(jobsList);
    setPagingMeta({
      ...pagingMeta,
      currentPage: pagingMeta?.currentPage || 1,
      totalItems: (data as Pagination<PagingMeta>)?.meta?.totalItems,
    });

    // Clear appropriate loading state
    if (isInitialLoad) {
      setTimeout(() => setLoading(false), 1000);
    } else {
      setRefreshing(false);
    }
  };

  useEffectAsync(
    async () => {
      console.log('refresh fired');
    },
    [user],
    () => {
      console.log('unloading page...');
    }
  );

  useEffect(() => {
    setViewMode((router.query.viewMode as ViewModeType) ?? ViewModeType.ACTIVE);
  }, [router]);

  useEffectAsync(async () => {
    if (viewMode) {
      // Only consider it initial load if we have no jobs yet and it's the first time
      const isInitialLoad = isInitialLoadRef.current && jobs.length === 0;
      if (isInitialLoadRef.current) {
        isInitialLoadRef.current = false;
      }

      viewMode === ViewModeType.ACTIVE
        ? fetchJobs(ExpiryStatus.ACTIVE, isInitialLoad)
        : fetchJobs(ExpiryStatus.EXPIRED, isInitialLoad);
    }
  }, [user, viewMode, pagingMeta?.currentPage, pagingMeta?.itemsPerPage, sortBy, sortDirection]);

  const onViewModeChange = async ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
    value = viewMode == ViewModeType.ACTIVE ? ViewModeType.EXPIRED : ViewModeType.ACTIVE;
    resetPagingMeta();
    // Reset initial load flag when switching view modes
    isInitialLoadRef.current = true;
    router.query.viewMode = value;
    await router.push(router);
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

  /**
   *
   * @param {React.MouseEvent} e
   */
  const onAddClick = (e) => {
    e.preventDefault();

    router.push(`${router.pathname}/create`);
  };

  const onEditClick = (id: number) => {
    router.push(`${router.pathname}/${id}/edit`);
  };

  const onDeleteClick = (job: JobEntity) => {
    setJobToDelete(job);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!jobToDelete) return;

    setIsDeleting(true);
    try {
      await jobApi.remove(jobToDelete.id);
      setJobs(jobs.filter((j) => j.id !== jobToDelete.id));
      toast.success('Job Successfully Deleted');
      setShowDeleteModal(false);
      setJobToDelete(null);
    } catch (error) {
      toast.error('Unable to Delete Job');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setJobToDelete(null);
  };

  const can = {
    editJob: hasPermission('CanUpdateJob'),
    deleteJob: hasPermission('CanDeleteJob'),
  };

  function onReactivateClick(job: JobEntity) {
    setReactivateJob(job);
    setExpiryDate(new Date(Date.now() + 86400000).toISOString().split('T')[0]);
  }

  const onCloseClick = () => {
    setReactivateJob(null);
    setExpiryDate('');
  };

  const onConfirmReactivateClick = React.useCallback(
    async (e: React.MouseEvent) => {
      try {
        const updatedJob = await jobApi.update(+reactivateJob.id, {
          ...reactivateJob,
          expiry_date: expiryDate || null,
        });
        setReactivateJob(null);
        setExpiryDate('');
        toast.success('JOB_REACTIVATED_SUCCESSFULLY');
        setJobs(jobs?.filter((j) => j.id != updatedJob.id));
      } catch (e) {
        toast.error('UNABLE_TO_SAVE_INFORMATION');
      } finally {
        onCloseClick();
      }
    },
    [expiryDate, reactivateJob, jobApi, jobs]
  );

  const fetchJobOptions = useCallback(async () => {
    const data: JobEntity[] = (await jobApi.list({
      is_paginated: false,
      companyId: user?.company?.id,
    })) as JobEntity[];
    setJobOptions(data);
  }, [jobApi, user?.company?.id]);

  useEffect(() => {
    fetchJobOptions();
  }, [jobs, fetchJobOptions]);

  const onCloneClick = (job: JobEntity) => {
    router.push(`${router.pathname}/create?clone=${job.id}`);
  };

  const onCloseCloneModal = () => {
    setShowCloneModal(false);
  };

  const onEmbedClick = () => {
    setShowEmbedModal(true);
  };

  const onCloseEmbedModal = () => {
    setShowEmbedModal(false);
  };

  const tableColumns = (): TableColumn<JobEntity>[] => {
    // Check if user is managing multiple companies
    const hasMultipleCompanies =
      user?.company?.children && user.company.children.length > 1;

    const data: TableColumn<JobEntity>[] = [
      {
        key: 'id',
        label: 'ID',
        selector: (j) => j.id,
        sortable: true,
      },
      {
        key: 'company_id',
        label: 'COMPANY_ID',
        selector: (j) => j.company?.id || 'N/A',
        sortable: true,
        hide: !hasMultipleCompanies, // Hide if not managing multiple companies
      },
      {
        key: 'job_title',
        label: 'job_title',
        render: (j) => (
          <Link href={`/dashboard/company/jobs/${j.id}`}>
            <a>{j.title}</a>
          </Link>
        ),
        selector: (job) => job.title,
        hidable: false,
        sortable: true,
      },
      {
        key: 'location',
        label: 'location',
        render: (job) => (
          <OverlyPopover
            skipTranslate={true}
            header={t('location')}
            str={buildAddress(job.location || {})}
          />
        ),
        selector: (job) => buildAddress(job.location || {}),
        sortable: true,
      },
      {
        key: 'drivers_needed',
        label: 'drivers_needed',
        selector: (j) => j.drivers_needed,
        sortable: true,
      },
      {
        key: 'applicantsCount',
        label: 'APPLICANTS',
        render: (j) => (
          <Link href={`/dashboard/company/jobs/${j.id}`}>
            <a className="btn btn-link">
              <span className="badge badge-pill badge-primary">{j.applicantsCount}</span>
            </a>
          </Link>
        ),
        selector: (j) => j.applicantsCount,
        sortable: true,
      },
      {
        key: 'created_at',
        label: 'CREATED_AT',
        render: (job) => (job?.created_at ? moment(job?.created_at).format('DD MMM YYYY') : null),
        sortable: true,
      },
      {
        key: 'expiration_date',
        label: 'expiration_date',
        render: (j) => (j.expiry_date ? moment(j.expiry_date).format('DD MMM YYYY') : null),
        selector: (j) => (j.expiry_date ? new Date(j.expiry_date).toDateString() : null),
        sortable: true,
      },
      {
        key: 'geography',
        label: 'GEOGRAPHY',
        render: (j) => (j.geography ? t('JobGeography.' + j.geography) : null),
        selector: (j) => (j.geography ? t('JobGeography.' + j.geography) : null),
        sortable: true,
      },
      {
        key: 'schedule',
        label: 'SCHEDULE',
        render: (job) => (
          <OverlyPopover
            labelPrefix="JobSchedule"
            skipTranslate={false}
            header={t('SCHEDULE')}
            str={job.schedule}
          />
        ),
        selector: (job) => t(`JobSchedule.${job.schedule}`),
        sortable: true,
      },
      {
        key: 'employment_type',
        label: 'EMPLOYMENT_TYPE',
        render: (job) => (
          <OverlyPopover
            labelPrefix="JobEmploymentType"
            skipTranslate={false}
            header={t('EMPLOYMENT_TYPE')}
            str={job.employment_type}
          />
        ),
        selector: (job) => t(`JobEmploymentType.${job.employment_type}`),
        sortable: true,
      },
      {
        key: 'delivery_type',
        label: 'DELIVERY_TYPE',
        render: (j) => (
          <ShowEnumFromString
            popover_header={t('DELIVERY_TYPE')}
            labelPrefix="JobDeliveryType"
            popover={true}
            value={j.delivery_type}
            enumArray={JobDeliveryType}
          />
        ),
        selector: (job) => t(`JobDeliveryType.${job.delivery_type}`),
        sortable: true,
      },
      {
        key: 'team_drivers',
        label: 'TEAM_DRIVERS',
        render: (job) => (
          <OverlyPopover
            labelPrefix="JobTeamDriver"
            skipTranslate={false}
            header={t('TEAM_DRIVERS')}
            str={job.team_drivers}
          />
        ),
        selector: (job) => t(`JobTeamDriver.${job.team_drivers}`),
        hide: true, // Hidden by default
        sortable: true,
      },
    ];
    if (viewMode == ViewModeType.EXPIRED) {
    } else {
    }

    return data;
  };

  const getActions = (job: JobEntity) => {
    const actions = [
      {
        onClick: (e) => onEditClick(job.id),
        icon: PenFill,
        label: 'EDIT',
        hide: !can.editJob,
      },
      {
        onClick: (e) => onCloneClick(job),
        icon: Files,
        label: 'CLONE',
        hide: false,
      },
    ];

    // Only show reactivate button if job has an expiry date AND is expired
    if (job.expiry_date && new Date(job.expiry_date) < new Date()) {
      actions.push({
        onClick: (e) => onReactivateClick(job),
        icon: Recycle,
        label: 'REACTIVATE',
        hide: !can.editJob,
      });
    }

    actions.push({
      onClick: (e) => onDeleteClick(job),
      icon: TrashFill,
      label: 'DELETE',
      hide: !can.deleteJob,
    });

    return actions;
  };

  return (
    <PageLayout
      title="JOBS"
      actions={
        <>
          <Row>
            <Col>
              <ButtonGroup size="sm">
                <Button variant="primary" onClick={onAddClick}>
                  <Plus className="me-2" /> {t('CREATE')}
                </Button>
                <Button variant="" className="theme-general-btn" onClick={onEmbedClick}>
                  <Code className="me-2" /> {t('EMBED')}
                </Button>
              </ButtonGroup>
            </Col>
          </Row>
          <Row>
            <Col>
              <div
                style={{
                  float: 'right',
                  display: 'flex',
                  alignItems: 'center',
                  marginTop: '10px',
                }}
              >
                <DataViewToggle
                  primaryLabel="ACTIVE_JOBS"
                  secondaryLabel="EXPIRED_JOBS"
                  activeView={viewMode || ViewModeType.ACTIVE}
                  onViewChange={async (newView) => {
                    resetPagingMeta();
                    router.query.viewMode = newView;
                    await router.push(router);
                  }}
                  primaryValue={ViewModeType.ACTIVE}
                  secondaryValue={ViewModeType.EXPIRED}
                  primaryIcon={<CheckCircleFill />}
                  secondaryIcon={<ClockFill />}
                  showCounts={true}
                  primaryCount={
                    viewMode === ViewModeType.ACTIVE ? pagingMeta?.totalItems || 0 : undefined
                  }
                  secondaryCount={
                    viewMode === ViewModeType.EXPIRED ? pagingMeta?.totalItems || 0 : undefined
                  }
                  variant="pills"
                  size="lg"
                />
              </div>
            </Col>
          </Row>
        </>
      }
    >
      {loading ? (
        <div className="spinner-border mt-3 ml-1" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      ) : (
        <>
          <GenericTable<JobEntity>
            data={jobs}
            columns={tableColumns()}
            actions={(job) => getActions(job)}
            enableSearch={true}
            enableColumnHiding={true}
            columnSettingKey={columnSettingKey}
            refreshing={refreshing}
            emptyTitle="No Jobs Found"
            emptyText="No jobs match the current criteria."
            onSort={handleSort}
            sortBy={sortBy}
            sortDirection={sortDirection}
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
      <ViewModal
        show={!!reactivateJob?.id}
        title="REACTIVATE_JOB"
        closeText="CANCEL"
        onCloseClick={onCloseClick}
        footer={
          <ButtonGroup>
            <Button
              disabled={isExpired(expiryDate)}
              type="button"
              variant="info"
              onClick={onConfirmReactivateClick}
            >
              {t('SAVE')}
            </Button>
          </ButtonGroup>
        }
      >
        <BaseInput
          className="col-12 p-0 px-lg-2"
          label="expiration_date"
          displayPlaceholder
          type="date"
          min={new Date(Date.now() + 86400000).toISOString().split('T')[0]}
          placeholder="Leave empty for no expiration"
          onChange={({ target: { value } }) => setExpiryDate(value)}
          value={expiryDate}
          error={isExpired(expiryDate) && 'EXPIRATION_DATE_MUST_BE_IN_FUTURE'}
        />
      </ViewModal>
      <ViewModal
        show={showCloneModal}
        title="SELECT_JOB_TO_CLONE"
        closeText="CANCEL"
        onCloseClick={onCloseCloneModal}
        size="lg"
      >
        <Row className="py-3 px-5">
          <Col>
            <BaseSelect
              autoFocus
              name={`jobId`}
              required
              placeholder={t('SELECT_{name}', { name: 'JOB' }, { translateProps: true })}
              options={jobOptions}
              labelKey="title"
              label="JOB"
              valueKey="id"
              onChange={({ target: { value } }) => {
                router.push(`${router.pathname}/create?clone=${value}`);
              }}
            />
          </Col>
        </Row>
      </ViewModal>
      <EmbedJobsModal show={showEmbedModal} onClose={onCloseEmbedModal} />
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Delete Job"
        message={
          <div style={{ fontSize: '15px', lineHeight: '1.6' }}>
            <p className="mb-3" style={{ fontSize: '16px' }}>
              Are you sure you want to delete this job?
            </p>
            <div className="mb-3 p-3" style={{ backgroundColor: '#f8f9fa', borderRadius: '6px' }}>
              <p className="mb-1" style={{ fontSize: '14px', color: '#6c757d' }}>
                Job Title
              </p>
              <p className="mb-0" style={{ fontSize: '16px', fontWeight: '600' }}>
                {jobToDelete?.title}
              </p>
            </div>
            <div className="mb-3 p-3" style={{ backgroundColor: '#fff3cd', borderLeft: '4px solid #ffc107', borderRadius: '4px' }}>
              <p className="mb-2" style={{ fontWeight: '600', color: '#856404' }}>
                ⚠️ Warning
              </p>
              <p className="mb-0" style={{ color: '#856404' }}>
                This action cannot be undone. The job listing and all associated data will be permanently removed.
              </p>
            </div>
            <div className="p-3" style={{ backgroundColor: '#d1ecf1', borderLeft: '4px solid #17a2b8', borderRadius: '4px' }}>
              <p className="mb-2" style={{ fontWeight: '600', color: '#0c5460' }}>
                💡 Alternative Option
              </p>
              <p className="mb-0" style={{ color: '#0c5460' }}>
                Consider marking this job as expired instead. This allows you to keep the job listing for historical purposes and view past candidates.
              </p>
            </div>
          </div>
        }
        confirmText="Delete Permanently"
        cancelText="Cancel"
        confirmButtonColor="danger"
        isLoading={isDeleting}
        loadingText="Deleting..."
        icon="danger"
        size="lg"
      />
    </PageLayout>
  );
}

JobListing.getLayout = function getLayout(page) {
  return <FullLayout>{page}</FullLayout>;
};
