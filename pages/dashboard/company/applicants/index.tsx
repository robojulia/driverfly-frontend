import { FormControlLabel, FormGroup, Switch } from '@mui/material';
import { useFormik } from 'formik';
import Link from 'next/link';
import { NextRouter, useRouter } from 'next/router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Accordion, Button, ButtonGroup, Col, Row, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { EyeFill, PencilFill, PersonFill, TrashFill, Download } from 'react-bootstrap-icons';
import { toast } from 'react-toastify';
import FullLayout from '../../../../components/dashboard/layouts/layout/full-layout';
import ShowEnumFromString from '../../../../components/enum-filters/show-enum-from-string';
import BaseCheckList from '../../../../components/forms/base-check-list';
import BaseSelect from '../../../../components/forms/base-select';
import BaseTextArea from '../../../../components/forms/base-text-area';
import ApplicantFilterForm from '../../../../components/forms/company/filter-form';
import ShowFormattedDate from '../../../../components/jobs/show-formatted-date';
import PageLayout from '../../../../components/layouts/page/page-layout';
import OverlyPopover from '../../../../components/popover/overly-popover';
import ViewDataTable from '../../../../components/view-details/view-data-table';
import ViewModal from '../../../../components/view-details/view-modal';
import {
  ApplicantReasonCodeFired,
  ApplicantReasonCodeNotInterested,
  ApplicantReasonCodeNotQualified,
  ApplicantReasonCodeQuit,
} from '../../../../enums/applicants/applicant-reason-codes.enum';
import { ApplicantStatus } from '../../../../enums/applicants/applicant-status.enum';
import { DriverEndorsement } from '../../../../enums/users/driver-endorsement.enum';
import { VehicleTransmissionType } from '../../../../enums/vehicles/vehicle-transmission-type.enum';
import { useAuth } from '../../../../hooks/use-auth';
import { TranslateInterface, useTranslation } from '../../../../hooks/use-translation';
import { ApplicantJobEntity } from '../../../../models/applicant/applicant-job.entity';
import { ApplicantEntity } from '../../../../models/applicant/applicant.entity';
import { SearchApplicantDto } from '../../../../models/applicant/search-applicant.dto';
import { JobEntity } from '../../../../models/job/job.entity';
import { globalAjaxExceptionHandler } from '../../../../utils/ajax';
import { buildAddress } from '../../../../utils/common';
import * as numbers from '../../../../utils/number';
import { useEffectAsync } from '../../../../utils/react';
import ApplicantApi from '../../../api/applicant';
import joinArrayElements from '../../../../utils/join-in-order.utils';
import CustomPagination from '../../../../components/pagination/custom-pagination';
import { Pagination, PagingMeta } from '../../../../types/pagination.type';
import { DriverLicenseType } from '../../../../enums/users/driver-license-type.enum';
import { ApplicantCSVExporter } from '../../../../utils/applicant-csv-exporter';

interface ConsolodatedApplicant extends ApplicantEntity {
  jobs?: ConsolodatedApplicantJob[];
}
interface ConsolodatedApplicantJob extends ApplicantJobEntity {
  // todo: extend with qualifications
  meets_basic_qualifications?: boolean;
  qualification_fail_reason?: string[];
}

const pagingsMetaInitialValues = (): PagingMeta => ({
  currentPage: 1,
  totalItems: 0,
  itemsPerPage: 20,
  totalPages: 0,
  itemCount: 0,
});

export default function Applicants() {
  const { t } = useTranslation();

  const router = useRouter();

  let { user, company, hasPermission } = useAuth();
  let { jobId } = router.query;

  const [loading, setLoading] = useState<boolean>(true);
  const [applicants, setApplicants] = useState<ApplicantEntity[]>([]);
  const [filters, setFilters] = useState<SearchApplicantDto>();
  const [includeEligibility, setIncludeEligibility] = useState<boolean>(true);
  const [pagingMeta, setPagingMeta] = useState<PagingMeta>(pagingsMetaInitialValues);
  const [filtersChanged, setFiltersChanged] = useState<boolean>(false);
  const [hasProvisionalApplicants, setHasProvisionalApplicants] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [applicantToDelete, setApplicantToDelete] = useState<number | null>(null);

  const fetchApplicant = async () => {
    setLoading(true);
    const api = new ApplicantApi();

    // Single API call - backend will handle "No CDL" logic
    const data = await api.list({
      jobId: jobId as any as number,
      without: ['applicant_dac', 'applicant_extras'],
      ...filters,
      includeEligibility: includeEligibility,
      is_paginated: true,
      page: filtersChanged ? 1 : pagingMeta?.currentPage,
      limit: pagingMeta?.itemsPerPage,
    });

    setApplicants((data as Pagination<ApplicantEntity>)?.items);
    setFiltersChanged(false);

    // Check if any applicants have provisional status
    const hasProvisional = (data as Pagination<ApplicantEntity>)?.items?.some(
      (applicant: any) => applicant.eligibility?.isProvisional
    );
    setHasProvisionalApplicants(hasProvisional || false);

    setPagingMeta({
      ...pagingMeta,
      currentPage: filtersChanged ? 1 : pagingMeta?.currentPage,
      totalItems: (data as Pagination<PagingMeta>)?.meta?.totalItems,
    });

    setTimeout(() => setLoading(false), 1000);
  };

  useEffectAsync(
    async () => await fetchApplicant(),
    [user, jobId, filters, includeEligibility, pagingMeta?.currentPage, pagingMeta?.itemsPerPage]
  );

  useEffect(() => setFiltersChanged(true), [filters]);

  useEffect(() => {
    setFilters(new SearchApplicantDto());
  }, []);

  const onViewClick = (id: number) => {
    router.push(`${router.pathname}/${id}`);
  };

  const onEditClick = (id: number) => {
    router.push(`${router.pathname}/${id}/edit`);
  };

  const onDeleteClick = (id: number) => {
    setApplicantToDelete(id);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!applicantToDelete) return;

    try {
      const api = new ApplicantApi();
      await api.remove(applicantToDelete);

      // Remove the applicant from the local state
      setApplicants(applicants.filter((a) => a.id !== applicantToDelete));

      toast.success(t('APPLICANT_DELETED_SUCCESSFULLY'));
      setShowDeleteModal(false);
      setApplicantToDelete(null);

      // Refresh the list to update pagination
      await fetchApplicant();
    } catch (e) {
      globalAjaxExceptionHandler(e, {
        t: t,
        defaultMessage: 'UNABLE_TO_DELETE',
        toast: toast,
      });
    }
  };

  const onChangeStatus = async (
    e: React.ChangeEvent<HTMLSelectElement>,
    applicant: ApplicantEntity,
    job: JobEntity
  ) => {
    const value: ApplicantStatus = e.target.options[e.target.selectedIndex]
      .value as ApplicantStatus;
    if (value) {
      switch (value) {
        case ApplicantStatus.INACTIVE_CONTACTED_NOT_QUALIFIED:
        case ApplicantStatus.INACTIVE_CONTACTED_UNINTERESTED:
        case ApplicantStatus.INACTIVE_QUIT:
        case ApplicantStatus.INACTIVE_FIRED:
        case ApplicantStatus.OTHER:
          applicantJobForm.setValues({
            job: job,
            applicant: applicant,
            status: value,
            status_other: null,
            reason_codes: [],
            reason_codes_other: null,
          });
          break;
        default:
          const api = new ApplicantApi();

          await api?.jobs?.update(applicant?.id, job?.id, { status: value });

          await router.reload();
          break;
      }
    }
  };

  const applicantJobForm = useFormik({
    initialValues: new ApplicantJobEntity(),
    validationSchema: ApplicantJobEntity.yupSchema(),
    onSubmit: async (e) => {
      try {
        const api = new ApplicantApi();

        await api?.jobs?.update(e?.applicant?.id, e?.job?.id, e);

        await router?.reload();

        applicantJobForm.resetForm();
      } catch (e) {
        globalAjaxExceptionHandler(e, {
          formik: applicantJobForm,
          t: t,
          toast: toast,
        });
      }
    },
  });

  const onStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value, name } = e.target;

    applicantJobForm.setValues({
      status: value as ApplicantStatus,
      status_other: null,
      reason_codes: [],
      reason_codes_other: null,
    });
  };

  const canCreate = hasPermission('CanCreateApplicant');

  const handleExportApplicants = () => {
    if (applicants && applicants.length > 0) {
      ApplicantCSVExporter.exportApplicantsToCSV(applicants);
      toast.success(t('APPLICANTS_EXPORTED_SUCCESSFULLY'));
    } else {
      toast.warning(t('NO_APPLICANTS_TO_EXPORT'));
    }
  };

  useEffect(() => {
    console.log('debug', user.company.id, company?.id, applicants.length);
  }, [applicants, user.company.id, company?.id]);
  return (
    <>
      <style>{`
        /* Filter button dropdown arrow - white color */
        .theme-filter-btn.accordion-button::after {
          filter: brightness(0) invert(1) !important;
        }

        /* Fix spacing gaps - remove extra margins from InputGroup and react-select */
        .input-group.flex-nowrap {
          margin-bottom: 0 !important;
          margin-top: 0 !important;
        }

        /* Remove any extra spacing from react-select wrapper */
        .basic-single {
          margin: 0 !important;
        }

        .basic-single [class*="control"] {
          margin: 0 !important;
        }

        /* Consistent font size and color for ALL filter form fields */
        input.form-control,
        select.form-select,
        .form-control,
        .form-select {
          font-size: 1rem !important;
          color: #000 !important;
          font-weight: normal !important;
        }

        input.form-control::placeholder,
        select.form-select::placeholder,
        .form-control::placeholder,
        .form-select::placeholder,
        input::placeholder,
        select::placeholder {
          font-size: 1rem !important;
          color: #000 !important;
          opacity: 1 !important;
          font-weight: normal !important;
        }

        /* Native select first option (acts as placeholder) */
        select.form-select option:first-child,
        select option:first-child {
          font-size: 1rem !important;
          color: #000 !important;
          font-weight: normal !important;
        }

        /* React-select - Force all elements to have consistent sizing */
        .basic-single,
        .basic-single * {
          font-size: 1rem !important;
          font-weight: normal !important;
        }

        /* React-select placeholder - highest priority */
        .basic-single [class*="placeholder"],
        .basic-single div[class*="placeholder"] {
          font-size: 1rem !important;
          color: #000 !important;
          opacity: 1 !important;
          font-weight: normal !important;
        }

        /* React-select values */
        .basic-single [class*="singleValue"],
        .basic-single [class*="multiValue"],
        .basic-single [class*="multiValueLabel"],
        .basic-single [class*="Input"],
        .basic-single input {
          font-size: 1rem !important;
          color: #000 !important;
          font-weight: normal !important;
        }

        /* React-select control */
        .basic-single [class*="control"],
        .basic-single [class*="ValueContainer"] {
          font-size: 1rem !important;
          font-weight: normal !important;
        }

        /* Ensure all select options and menu items have consistent font */
        .basic-single [class*="option"],
        .basic-single [class*="menu"] div,
        .basic-single [class*="menu"] {
          font-size: 1rem !important;
          font-weight: normal !important;
        }
      `}</style>
      <Accordion defaultActiveKey="0" flush>
        <PageLayout
          title="APPLICANTS"
          actions={
            <div
              style={{
                display: 'flex',
                justifyContent: 'end',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <Accordion.Button
                className="text-white theme-filter-btn"
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
                {t('FILTERS')}
              </Accordion.Button>
              <Button
                variant="outline-secondary"
                onClick={handleExportApplicants}
                disabled={!applicants || applicants.length === 0}
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
              {canCreate && (
                <>
                  <Button
                    variant="primary"
                    onClick={() => router.push('/dashboard/company/applicants/create')}
                    style={{
                      height: '38px',
                      padding: '0.375rem 0.75rem',
                      borderRadius: '0.25rem',
                      fontSize: '1rem',
                      display: 'inline-flex',
                      alignItems: 'center',
                    }}
                  >
                    + {t('ADD_AN_APPLICANT')}
                  </Button>
                  <Button
                    className="theme-general-btn"
                    onClick={() => router.push('/dashboard/company/applicants/import')}
                    style={{
                      height: '38px',
                      padding: '0.375rem 0.75rem',
                      borderRadius: '0.25rem',
                      fontSize: '1rem',
                      display: 'inline-flex',
                      alignItems: 'center',
                    }}
                  >
                    + {t('IMPORT_APPLICANTS')}
                  </Button>
                </>
              )}
            </div>
          }
        >
          {/* Tip Section */}
          <div
            className="mb-4 p-3"
            style={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e9ecef' }}
          >
            <small className="text-secondary">
              <strong>{t('TIP')}:</strong> {t('CLICK_ARROW_TO_EXPAND_JOBS')}
            </small>
          </div>

          {/* Provisional Status Warning Banner */}
          {includeEligibility && hasProvisionalApplicants && (
            <div
              className="mb-4 p-3"
              style={{
                backgroundColor: '#fff3cd',
                borderRadius: '8px',
                border: '1px solid #ffeaa7',
                borderLeft: '4px solid #fdcb6e',
              }}
            >
              <div className="d-flex align-items-start">
                <div className="me-3">
                  <svg
                    width="24"
                    height="24"
                    fill="#856404"
                    className="bi bi-exclamation-triangle"
                    viewBox="0 0 16 16"
                  >
                    <path d="M7.938 2.016A.13.13 0 0 1 8.002 2a.13.13 0 0 1 .063.016.146.146 0 0 1 .054.057l6.857 11.667c.036.06.035.124.002.183a.163.163 0 0 1-.054.06.116.116 0 0 1-.066.017H1.146a.115.115 0 0 1-.066-.017.163.163 0 0 1-.054-.06.176.176 0 0 1 .002-.183L7.884 2.073a.147.147 0 0 1 .054-.057zm1.044-.45a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566z" />
                    <path d="M7.002 12a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 5.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995z" />
                  </svg>
                </div>
                <div className="flex-grow-1">
                  <h6 className="mb-2" style={{ color: '#856404' }}>
                    <strong>Company Hiring Preferences Not Configured</strong>
                  </h6>
                  <p className="mb-2" style={{ color: '#856404', fontSize: '0.95rem' }}>
                    Eligibility cannot be determined for your applicants because your company has
                    not configured hiring preferences yet. Configure your preferences to see which
                    applicants meet your hiring criteria.
                  </p>
                  <Link href="/dashboard/company/company-preferences">
                    <a className="btn btn-warning btn-sm">
                      <strong>Configure Hiring Preferences</strong>
                    </a>
                  </Link>
                </div>
              </div>
            </div>
          )}

          <Row>
            <Col className="force-overflow p-0">
              <Accordion.Body>
                <ApplicantFilterForm onSearch={setFilters} />

                {/* Eligibility Filter Checkbox */}
                <div
                  className="mt-3 mb-3 p-3"
                  style={{
                    backgroundColor: '#f8f9fa',
                    borderRadius: '8px',
                    border: '1px solid #e9ecef',
                  }}
                >
                  <div className="d-flex align-items-start">
                    <div className="me-3">
                      <PersonFill size={20} className="text-primary-brand" />
                    </div>
                    <div className="flex-grow-1">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="includeEligibilityCheck"
                          checked={includeEligibility}
                          onChange={(e) => setIncludeEligibility(e.target.checked)}
                        />
                        <label className="form-check-label" htmlFor="includeEligibilityCheck">
                          <strong>Include Company Eligibility Check</strong>
                          <small className="d-block text-muted mt-1">
                            Show whether each applicant meets your company&apos;s hiring criteria
                            (CDL requirements, experience, accident history, etc.). Eligible
                            applicants will show a green &quot;YES&quot; badge and ineligible
                            applicants will show a red &quot;NO&quot; badge with details. If hiring
                            preferences are not configured, a warning will be shown instead of
                            eligibility badges.
                          </small>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </Accordion.Body>

              {loading ? (
                <div className="d-flex align-items-center mt-3 ml-1">
                  <div
                    className="spinner-border me-2"
                    role="status"
                    style={{ width: '1.5rem', height: '1.5rem' }}
                  >
                    <span className="sr-only">Loading...</span>
                  </div>
                  <span className="text-muted">
                    Loading applicants{includeEligibility ? ' and checking eligibility' : ''}...
                  </span>
                </div>
              ) : (
                <>
                  <ApplicantView
                    totalItems={pagingMeta?.totalItems}
                    setPagingMeta={setPagingMeta}
                    pagingMeta={pagingMeta}
                    router={router}
                    applicants={applicants}
                    onViewClick={onViewClick}
                    onEditClick={onEditClick}
                    onDeleteClick={onDeleteClick}
                    onChangeStatus={onChangeStatus}
                    includeEligibility={includeEligibility}
                    hasProvisionalApplicants={hasProvisionalApplicants}
                    t={t}
                  />
                </>
              )}
            </Col>
          </Row>
          <ViewModal
            show={!!applicantJobForm.values.status}
            onCloseClick={applicantJobForm.resetForm}
            closeText="CANCEL"
            title={'CHANGE_STATUS'}
            className="bg-secondary "
          >
            <form onSubmit={applicantJobForm.handleSubmit}>
              <Row className="py-3 px-5">
                <BaseSelect
                  className="col-12"
                  label="STATUS"
                  name="status"
                  required
                  formik={applicantJobForm}
                  labelPrefix="ApplicantStatus"
                  enumType={ApplicantStatus}
                  onChange={onStatusChange}
                />
                {applicantJobForm.values.status == ApplicantStatus.OTHER && (
                  <BaseTextArea
                    className="col-12"
                    placeholder="STATUS"
                    name="status_other"
                    required
                    maxLength={100}
                    formik={applicantJobForm}
                  />
                )}
                {applicantJobForm.values.status ==
                  ApplicantStatus.INACTIVE_CONTACTED_NOT_QUALIFIED && (
                  <BaseCheckList
                    className="col-12"
                    label="REASON_CODES"
                    name="reason_codes"
                    required
                    cols={2}
                    formik={applicantJobForm}
                    labelPrefix="ApplicantReasonCodeNotQualified"
                    enumType={ApplicantReasonCodeNotQualified}
                  />
                )}
                {applicantJobForm.values.status ==
                  ApplicantStatus.INACTIVE_CONTACTED_UNINTERESTED && (
                  <BaseCheckList
                    className="col-12"
                    label="REASON_CODES"
                    name="reason_codes"
                    required
                    cols={2}
                    formik={applicantJobForm}
                    labelPrefix="ApplicantReasonCodeNotInterested"
                    enumType={ApplicantReasonCodeNotInterested}
                  />
                )}
                {applicantJobForm.values.status == ApplicantStatus.INACTIVE_QUIT && (
                  <BaseCheckList
                    className="col-12"
                    label="REASON_CODES"
                    name="reason_codes"
                    required
                    cols={2}
                    formik={applicantJobForm}
                    labelPrefix="ApplicantReasonCodeQuit"
                    enumType={ApplicantReasonCodeQuit}
                  />
                )}
                {applicantJobForm.values.status == ApplicantStatus.INACTIVE_FIRED && (
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
                )}
                {applicantJobForm.values.reason_codes?.includes('OTHER') && (
                  <BaseTextArea
                    className="col-12"
                    placeholder="REASONS"
                    name="reason_codes_other"
                    required
                    maxLength={100}
                    formik={applicantJobForm}
                  />
                )}
              </Row>
              <Row className="py-3 px-5">
                <Button type="submit" variant="primary">
                  {t('SUBMIT')}
                </Button>
              </Row>
            </form>
          </ViewModal>
          <ViewModal
            show={showDeleteModal}
            onCloseClick={() => setShowDeleteModal(false)}
            closeText="CANCEL"
            title="DELETE_CONFIRMATION"
            footer={
              <ButtonGroup>
                <Button type="button" variant="info" onClick={() => setShowDeleteModal(false)}>
                  {t('DO_NOT_DELETE')}
                </Button>
                <Button type="button" variant="danger" onClick={handleDeleteConfirm}>
                  {t('DELETE')}
                </Button>
              </ButtonGroup>
            }
          >
            {t('ARE_YOU_SURE_YOU_WANT_TO_DELETE')}
          </ViewModal>
        </PageLayout>
      </Accordion>
    </>
  );
}

Applicants.getLayout = function getLayout(page) {
  return <FullLayout>{page}</FullLayout>;
};

function getApplicantName(applicant: ApplicantEntity) {
  const firstName = applicant?.first_name || '';
  const lastName = applicant?.last_name || '';

  if (!firstName && !lastName) {
    return 'No Name';
  }

  return `${firstName} ${lastName}`.trim();
}

function getApplicantStatus(applicantJob: ApplicantJobEntity, t: TranslateInterface) {
  switch (applicantJob?.status) {
    case ApplicantStatus.OTHER:
      return applicantJob?.status_other;
    case ApplicantStatus.INACTIVE_CONTACTED_NOT_QUALIFIED:
      return `${t(`ApplicantStatus.${applicantJob?.status}`)} (${applicantJob?.reason_codes
        ?.map((v) =>
          v == ApplicantReasonCodeNotQualified.OTHER
            ? applicantJob?.reason_codes_other
            : t(`ApplicantReasonCodeNotQualified.${v}`)
        )
        ?.join(', ')})`;
    case ApplicantStatus.INACTIVE_CONTACTED_UNINTERESTED:
      return `${t(`ApplicantStatus.${applicantJob?.status}`)} (${applicantJob?.reason_codes
        ?.map((v) =>
          v == ApplicantReasonCodeNotInterested.OTHER
            ? applicantJob?.reason_codes_other
            : t(`ApplicantReasonCodeNotInterested.${v}`)
        )
        ?.join(', ')})`;
    case ApplicantStatus.INACTIVE_QUIT:
      return `${t(`ApplicantStatus.${applicantJob?.status}`)} (${applicantJob?.reason_codes
        ?.map((v) =>
          v == ApplicantReasonCodeQuit.OTHER
            ? applicantJob?.reason_codes_other
            : t(`ApplicantReasonCodeQuit.${v}`)
        )
        ?.join(', ')})`;
    case ApplicantStatus.INACTIVE_FIRED:
      return `${t(`ApplicantStatus.${applicantJob?.status}`)} (${applicantJob?.reason_codes
        ?.map((v) =>
          v == ApplicantReasonCodeFired.OTHER
            ? applicantJob?.reason_codes_other
            : t(`ApplicantReasonCodeFired.${v}`)
        )
        ?.join(', ')})`;
    default:
      return t(`ApplicantStatus.${applicantJob?.status}`);
  }

  if (applicantJob.reason_codes?.length > 0 || applicantJob.reason_codes_other) {
    return t(`ApplicantStatus.${applicantJob.status}`);
  }
}

interface ViewProps {
  applicants: ApplicantEntity[];
  onChangeStatus: (
    e: React.ChangeEvent<HTMLSelectElement>,
    applicant: ApplicantEntity,
    job: JobEntity
  ) => Promise<void>;
  onViewClick: (applicantId: number) => void;
  onEditClick: (applicantId: number) => void;
  onDeleteClick: (applicantId: number) => void;
  router: NextRouter;
  t: TranslateInterface;
  pagingMeta?: PagingMeta;
  totalItems?: number;
  setPagingMeta?: React.Dispatch<React.SetStateAction<PagingMeta>>;
  includeEligibility?: boolean;
  hasProvisionalApplicants?: boolean;
}

function ApplicantView(props: ViewProps) {
  const {
    router,
    applicants,
    onChangeStatus,
    onViewClick,
    onEditClick,
    onDeleteClick,
    t,
    totalItems,
    setPagingMeta,
    pagingMeta,
    includeEligibility,
    hasProvisionalApplicants,
  } = props;
  const { hasPermission } = useAuth();
  const handlePageChange = (page: number, perPage: number) => {
    setPagingMeta((prevPagingMeta: PagingMeta) => ({
      ...prevPagingMeta,
      currentPage: page,
      itemsPerPage: perPage,
    }));
  };

  const items: ConsolodatedApplicant[] = applicants;
  return (
    <div className="applicant__table__sty ellipsis_remove">
      {/* Eligibility Legend - positioned to align with search bar */}
      {includeEligibility && !hasProvisionalApplicants && (
        <div className="mb-3 d-flex align-items-center gap-3 flex-wrap">
          <div className="d-flex align-items-center gap-1">
            <span className="badge bg-success">YES</span>
            <small className="text-muted">Meets hiring criteria</small>
          </div>
          <div className="d-flex align-items-center gap-1">
            <span className="badge bg-danger">NO</span>
            <small className="text-muted">Does not meet criteria</small>
          </div>
        </div>
      )}
      <ViewDataTable<ConsolodatedApplicant>
        columnSettingKey="applicant-table-column-preferences"
        hideSearch={false}
        customStyles={{
          headRow: {
            style: {
              opacity: '1',
              whiteSpace: 'unset',
              textOverflow: 'unset',
              overflow: 'hidden',
            },
          },
        }}
        columns={[
          {
            id: 'id',
            name: 'ID',
            selector: (applicant) => applicant.id,
          },
          {
            id: 'name',
            name: 'Name',
            wrap: true,
            minWidth: '250px',
            selector: (applicant) => getApplicantName(applicant),
            cell: (applicant) => (
              <div className="d-flex align-items-center justify-content-between w-100">
                <Link href={`${router.pathname}/${applicant.id}/edit`}>
                  <a>{getApplicantName(applicant)}</a>
                </Link>
                {includeEligibility &&
                  !hasProvisionalApplicants &&
                  (applicant as any).eligibility && (
                    <div className="ms-2">
                      {(applicant as any).eligibility.isEligible ? (
                        <OverlayTrigger
                          placement="top"
                          overlay={
                            <Tooltip id={`eligible-tooltip-${applicant.id}`}>
                              Meets company hiring criteria
                            </Tooltip>
                          }
                        >
                          <span className="badge bg-success" style={{ cursor: 'help' }}>
                            {t('YES')}
                          </span>
                        </OverlayTrigger>
                      ) : (
                        <OverlayTrigger
                          placement="top"
                          overlay={
                            <Tooltip id={`ineligible-tooltip-${applicant.id}`}>
                              <div>
                                <strong>Does not meet criteria:</strong>
                                <ul className="mb-0 mt-1 ps-3">
                                  {(applicant as any).eligibility.ineligibilityReasons.map(
                                    (reason: string, index: number) => (
                                      <li key={index} style={{ fontSize: '0.9em' }}>
                                        {reason === 'cdl_class' && 'CDL Class requirement'}
                                        {reason === 'years_cdl_experience' &&
                                          'Years of CDL experience'}
                                        {reason === 'maximum_accidents' && 'Accident history limit'}
                                        {reason === 'maximum_moving_violations' &&
                                          'Moving violations limit'}
                                        {reason === 'employment_type' &&
                                          'Employment type preference'}
                                        {reason === 'job_geography' && 'Location preference'}
                                        {![
                                          'cdl_class',
                                          'years_cdl_experience',
                                          'maximum_accidents',
                                          'maximum_moving_violations',
                                          'employment_type',
                                          'job_geography',
                                        ].includes(reason) && reason}
                                      </li>
                                    )
                                  )}
                                </ul>
                              </div>
                            </Tooltip>
                          }
                        >
                          <span className="badge bg-danger" style={{ cursor: 'help' }}>
                            {t('NO')}
                          </span>
                        </OverlayTrigger>
                      )}
                    </div>
                  )}
              </div>
            ),
            hidable: false,
          },
          {
            id: 'city',
            name: 'CITY',
            wrap: true,
            selector: (applicant) => applicant?.city,
          },
          {
            id: 'state',
            name: 'STATE',
            wrap: true,
            selector: (applicant) => applicant?.state,
          },

          {
            id: 'phone',
            name: 'PHONE',
            wrap: true,
            selector: (applicant) => applicant?.phone,
            cell: (applicant) => (
              <OverlyPopover str={applicant?.phone}>{applicant?.phone}</OverlyPopover>
            ),
          },
          {
            id: 'email',
            name: 'EMAIL',
            wrap: true,
            selector: (applicant) => applicant.email,
            cell: (applicant) => (
              <OverlyPopover str={applicant.email}>{applicant.email}</OverlyPopover>
            ),
          },
          {
            id: 'license_type',
            name: `CDL_TYPE`,
            wrap: true,
            selector: (applicant) =>
              applicant?.license_type === DriverLicenseType.NO_CDL ||
              applicant?.license_type === null
                ? t('DriverLicenseType.NONE')
                : t(`DriverLicenseType.${applicant.license_type}`) || t('DriverLicenseType.NONE'),
          },
          {
            id: 'years_cdl_experience',
            name: 'years_cdl_experience',
            wrap: true,
            selector: (applicant) => applicant?.years_cdl_experience ?? 0,
            cell: (applicant) => {
              const years = applicant?.years_cdl_experience;
              if (years === null || years === undefined) {
                return t('ZERO');
              }
              return years.toFixed(1);
            },
          },
          {
            id: 'transmission_type',
            name: 'TRANSMISSION_EXPERIENCE',
            wrap: true,
            selector: (applicant) =>
              applicant.transmission_type
                ? joinArrayElements(
                    applicant?.transmission_type,
                    'OTHER',
                    'VehicleTransmissionType',
                    t
                  )
                : t('NONE'),
          },
          {
            id: 'date_added',
            name: 'DATE_ADDED',
            wrap: true,
            selector: (applicant) => applicant.created_at,
            cell: (applicant) => <ShowFormattedDate date={applicant.created_at} />,
            hidable: false,
            hide: 0,
          },
          {
            id: 'source',
            name: 'LEAD_TYPE',
            wrap: true,
            hide: 1,
            cell: (applicant) =>
              applicant.type ? (
                <OverlyPopover str={t(`ApplicantType.${applicant.type}`)}>
                  {t(`ApplicantType.${applicant.type}`)}
                </OverlyPopover>
              ) : (
                ''
              ),
          },
          {
            id: 'AUTOMATED_RECRUITING_LEAD',
            name: 'AUTOMATED_RECRUITING_LEAD',
            wrap: true,
            hide: 1,
            selector: (applicant) =>
              Boolean(applicant?.is_automated_recruiting_lead)
                ? t('BooleanType.YES')
                : t('BooleanType.NO'),
          },
          {
            id: 'status',
            name: 'STATUS',
            wrap: true,
            hide: 1,
            selector: (applicant) =>
              applicant.current_application_status
                ? t(`ApplicantStatus.${applicant.current_application_status}`)
                : null,
            cell: (applicant) => (
              <ShowEnumFromString
                popover_header={t('ApplicantStatus')}
                labelPrefix={
                  applicant.current_application_status?.length > 0 ? 'ApplicantStatus' : ''
                }
                popover={true}
                value={applicant.current_application_status}
                enumArray={ApplicantStatus}
              />
            ),
          },
          {
            id: 'assigned_to',
            name: 'ASSIGNED_TO',
            wrap: true,
            hide: 1,
            selector: (applicant) => applicant.assignedUser?.name || t('NONE'),
          },

          {
            id: 'endorsement',
            name: 'ENDORSEMENTS',
            wrap: true,
            hide: 1,
            selector: (applicant) =>
              applicant.endorsements
                ? joinArrayElements(applicant?.endorsements, 'OTHER', 'DriverEndorsement', t)
                : t('NONE'),
          },
          {
            id: 'license_restrictions',
            name: 'License_Restrictions',
            wrap: true,
            hide: 1,
            selector: (applicant) =>
              applicant.license_restrictions
                ? joinArrayElements(applicant?.license_restrictions, 'OTHER', undefined, t)
                : t('NONE'),
          },
          {
            id: 'is_owner_operator',
            name: `${t('OWNER_OPERATOR')} / ${t('COMPANY_DRIVER')}`,
            wrap: true,
            hide: 1,
            selector: (applicant) =>
              applicant.is_owner_operator ? t('OWNER_OPERATOR') : t('COMPANY_DRIVER') || t('NONE'),
          },
          {
            id: 'preferred_location',
            name: `PREFERRED_LOCATION`,
            wrap: true,
            hide: 1,
            selector: (applicant) =>
              applicant.preferred_location
                ? joinArrayElements(applicant?.preferred_location, 'OTHER', undefined, t)
                : t('NONE'),
          },
        ]}
        items={items}
        actions={(row) => [
          {
            icon: PencilFill,
            label: 'EDIT',
            onClick: (e) => onEditClick(row.id),
            hide: !hasPermission('CanUpdateApplicant'),
          },
          {
            icon: TrashFill,
            label: 'DELETE',
            onClick: (e) => onDeleteClick(row.id),
            hide: !hasPermission('CanDeleteApplicant'),
          },
        ]}
        expandableRowsComponent={({ data }) => (
          <div
            className="p-3"
            style={{ backgroundColor: '#f8f9fa', borderLeft: '4px solid #006078' }}
          >
            <div className="mb-3">
              <h6 className="text-primary-brand mb-2">
                <strong>{getApplicantName(data)}</strong> {t('JOB_APPLICATIONS')}
              </h6>
              <p className="text-muted small mb-3">{t('SHOWING_ALL_JOBS_APPLIED_TO')}</p>
            </div>
            <ViewDataTable<ConsolodatedApplicantJob>
              noDataComponent={
                <div className="text-center py-3 text-muted">
                  <small>{t('NO_APPLIED_JOBS_FOUND')}</small>
                </div>
              }
              columns={[
                {
                  name: 'ID',
                  selector: (aJob) => aJob.job.id,
                  hidable: false,
                },

                {
                  name: 'JOB',
                  selector: (aJob) => aJob.job.title,
                  cell: (aJob) => (
                    <Link href={`/dashboard/company/jobs/${aJob.job.id}`}>
                      <a className="text-primary text-decoration-underline">{aJob.job.title}</a>
                    </Link>
                  ),
                  hidable: false,
                },
                {
                  id: 'location',
                  name: 'LOCATION',
                  selector: (aJob) => buildAddress(aJob.job.location),
                },
                {
                  name: 'DATE_APPLIED',
                  selector: (aJob) => new Date(aJob.created_at).toDateString(),
                  hidable: false,
                },
                {
                  name: 'STATUS',
                  cell: (aJob) => (
                    <OverlyPopover skipTranslate slice_at={40} str={getApplicantStatus(aJob, t)} />
                  ),
                  selector: (aJob) => getApplicantStatus(aJob, t), //t(`ApplicantStatus.${aJob.status}`),
                  hidable: false,
                },
                {
                  name: 'MEETS_BASIC_QUALIFICATIONS',
                  cell: (aJob) => (
                    <div className="d-flex align-items-center">
                      <span
                        className={`badge ${
                          aJob.meets_basic_qualifications ? 'bg-success' : 'bg-danger'
                        } me-2`}
                      >
                        {t(aJob.meets_basic_qualifications ? 'YES' : 'NO')}
                      </span>
                      <Button
                        size="sm"
                        variant="outline-primary"
                        title={t('VIEW_DETAILED_ANALYSIS')}
                        onClick={() =>
                          router.push(
                            `/dashboard/company/jobs/${aJob.job.id}/applicants/${data.id}/eligibility`
                          )
                        }
                      >
                        {t('CHECK_ELIGIBILITY')}
                      </Button>
                    </div>
                  ),
                  selector: (aJob) => t(aJob.meets_basic_qualifications ? 'YES' : 'NO'),
                  hidable: false,
                  width: '250px',
                },

                {
                  cell: (aJob) => {
                    const hideStatus = Boolean(
                      data?.jobs?.find(
                        (j) => j?.id != aJob?.id && j?.status?.startsWith('COMPLETED_')
                      )
                    )
                      ? [
                          ApplicantStatus.COMPLETED_EMPLOYED,
                          ApplicantStatus.COMPLETED_PROMOTED_TO_ROLE,
                          ApplicantStatus.COMPLETED_TRANSFERED_TO_ROLE,
                        ]
                      : [];
                    return (
                      <BaseSelect
                        hideOptions={hideStatus}
                        name={data.id.toString()}
                        value=""
                        onChange={(e) => onChangeStatus(e, data, aJob.job)}
                        placeholder={'CHANGE_STATUS'}
                        labelPrefix="ApplicantStatus"
                        enumType={ApplicantStatus}
                      />
                    );
                  },
                },
              ]}
              hideSearch
              items={data.jobs}
            />
          </div>
        )}
      />
      <div style={{ marginRight: '7%' }}>
        <CustomPagination
          recordsPerPageOptions={[20, 50, 100]}
          onPageChange={handlePageChange}
          pagingMeta={pagingMeta}
          setPagingMeta={setPagingMeta}
        />
      </div>
    </div>
  );
}

