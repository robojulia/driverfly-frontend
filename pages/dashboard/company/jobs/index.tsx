import React, { useEffect } from 'react';
import FullLayout from '../../../../components/dashboard/layouts/layout/full-layout';

import { Files, PenFill, Plus, Recycle, CheckCircleFill, ClockFill } from 'react-bootstrap-icons';

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
import ViewDataTable, {
  getDataTableColumnKey,
  ViewTableColumn,
} from '../../../../components/view-details/view-data-table';
import ViewModal from '../../../../components/view-details/view-modal';
import { ExpiryStatus } from '../../../../enums/jobs/expiry-status.enum';
import { useAuth } from '../../../../hooks/use-auth';
import { Pagination, PagingMeta } from '../../../../types/pagination.type';
import { buildAddress } from '../../../../utils/common';
import { isExpired } from '../../../../utils/date';
import { useEffectAsync } from '../../../../utils/react';
import DataViewToggle from '../../../../components/shared/DataViewToggle';

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
  const [viewMode, setViewMode] = React.useState<ViewModeType>();
  const [showCloneModal, setShowCloneModal] = React.useState<boolean>(false);
  const [jobOptions, setJobOptions] = React.useState<JobEntity[]>([]);

  const { user, hasPermission } = useAuth();
  const { t } = useTranslation();
  const router = useRouter();
  const jobApi = new JobApi();

  const columnSettingKey = getDataTableColumnKey('company', user, 'jobs');
  const resetPagingMeta = () => setPagingMeta(pagingsMetaInitialValues);

  const fetchJobs = async (expiry_status: ExpiryStatus): Promise<void> => {
    setLoading(true);
    const data = await jobApi.list({
      is_paginated: true,
      limit: pagingMeta?.itemsPerPage,
      page: pagingMeta.currentPage,
      expiry_status,
    });
    setJobs((data as Pagination<JobEntity>)?.items);
    setPagingMeta({
      ...pagingMeta,
      currentPage: pagingMeta?.currentPage || 1,
      totalItems: (data as Pagination<PagingMeta>)?.meta?.totalItems,
    });
    setTimeout(() => setLoading(false), 1000);
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
      viewMode === ViewModeType.ACTIVE
        ? fetchJobs(ExpiryStatus.ACTIVE)
        : fetchJobs(ExpiryStatus.EXPIRED);
    }
  }, [user, viewMode, pagingMeta?.currentPage, pagingMeta?.itemsPerPage]);

  const onViewModeChange = async ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
    value = viewMode == ViewModeType.ACTIVE ? ViewModeType.EXPIRED : ViewModeType.ACTIVE;
    resetPagingMeta();
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

  // const onDeleteClick = async (id: number) => {
  //     await jobApi.remove(id);

  //     setJobs(activeJobs.filter(v => v.id != id));
  // }

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
          expiry_date: expiryDate,
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
    [expiryDate, reactivateJob]
  );

  const fetchJobOptions = async () => {
    const data: JobEntity[] = (await jobApi.list({
      is_paginated: false,
    })) as JobEntity[];
    setJobOptions(data);
  };

  useEffect(() => {
    fetchJobOptions();
  }, [jobs]);

  const onCloneClick = () => {
    setShowCloneModal(true);
  };

  const onCloseCloneModal = () => {
    setShowCloneModal(false);
  };

  const tableColumns = (): ViewTableColumn<JobEntity>[] => {
    const data: ViewTableColumn<JobEntity>[] = [
      {
        id: 'id',
        name: 'ID',
        selector: (j) => j.id,
      },
      {
        id: 'job_title',
        name: 'job_title',
        cell: (j) => (
          <Link href={`/dashboard/company/jobs/${j.id}`}>
            <a>{j.title}</a>
          </Link>
        ),
        selector: (job) => job.title,
        hidable: false,
      },
      {
        id: 'location',
        name: 'location',
        cell: (job) => (
          <OverlyPopover
            skipTranslate={true}
            header={t('location')}
            str={buildAddress(job.location || {})}
          />
        ),
        selector: (job) => buildAddress(job.location || {}),
      },
      {
        id: 'drivers_needed',
        name: 'drivers_needed',
        selector: (j) => j.drivers_needed,
      },
      {
        id: 'applicantsCount',
        name: 'APPLICANTS',
        cell: (j) => (
          <Link href={`/dashboard/company/jobs/${j.id}`}>
            <a className="btn btn-link">
              <span className="badge badge-pill badge-primary">{j.applicantsCount}</span>
            </a>
          </Link>
        ),
        selector: (j) => j.applicantsCount,
      },
      {
        id: 'created_at',
        name: 'CREATED_AT',
        cell: (job) => (job?.created_at ? moment(job?.created_at).format('DD MMM YYYY') : null),
      },
      {
        id: 'expiration_date',
        name: 'expiration_date',
        cell: (j) => (j.expiry_date ? moment(j.expiry_date).format('DD MMM YYYY') : null),
        selector: (j) => (j.expiry_date ? new Date(j.expiry_date).toDateString() : null),
      },
      {
        id: 'geography',
        name: 'GEOGRAPHY',
        selector: (j) => (j.geography ? t('JobGeography.' + j.geography) : null),
      },
      {
        id: 'schedule',
        name: 'SCHEDULE',
        cell: (job) => (
          <OverlyPopover
            labelPrefix="JobSchedule"
            skipTranslate={false}
            header={t('SCHEDULE')}
            str={job.schedule}
          />
        ),
        selector: (job) => t(`JobSchedule.${job.schedule}`),
      },
      {
        id: 'employment_type',
        name: 'EMPLOYMENT_TYPE',
        cell: (job) => (
          <OverlyPopover
            labelPrefix="JobEmploymentType"
            skipTranslate={false}
            header={t('EMPLOYMENT_TYPE')}
            str={job.employment_type}
          />
        ),
        selector: (job) => t(`JobEmploymentType.${job.employment_type}`),
      },
      {
        id: 'delivery_type',
        name: 'DELIVERY_TYPE',
        cell: (j) => (
          <ShowEnumFromString
            popover_header={t('DELIVERY_TYPE')}
            labelPrefix="JobDeliveryType"
            popover={true}
            value={j.delivery_type}
            enumArray={JobDeliveryType}
          />
        ),
        selector: (job) => t(`JobDeliveryType.${job.delivery_type}`),
      },
      {
        id: 'team_drivers',
        name: 'TEAM_DRIVERS',
        cell: (job) => (
          <OverlyPopover
            labelPrefix="JobTeamDriver"
            skipTranslate={false}
            header={t('TEAM_DRIVERS')}
            str={job.team_drivers}
          />
        ),
        selector: (job) => t(`JobTeamDriver.${job.team_drivers}`),
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
    ];

    if (job.expiry_date && new Date(job.expiry_date) < new Date()) {
      actions.push({
        onClick: (e) => onReactivateClick(job),
        icon: Recycle,
        label: 'REACTIVATE',
        hide: !can.editJob,
      });
    }

    // {
    //     onClick: e => onDeleteClick(j.id),
    //     icon: TrashFill,
    //     label: "DELETE",
    //     hide: !can.deleteJob
    // },

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
                  <Plus /> {t('CREATE')}
                </Button>
                <Button variant="" className="theme-general-btn" onClick={onCloneClick}>
                  <Files /> {t('CLONE')}
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
                  size="md"
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
          <ViewDataTable<JobEntity>
            columnSettingKey={columnSettingKey}
            columns={tableColumns()}
            actions={(job) => getActions(job)}
            items={jobs}
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
              disabled={isExpired(expiryDate) || !expiryDate}
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
    </PageLayout>
  );
}

JobListing.getLayout = function getLayout(page) {
  return <FullLayout>{page}</FullLayout>;
};
