import { FormControlLabel, FormGroup, Switch } from "@mui/material";
import { useFormik } from "formik";
import Link from "next/link";
import { NextRouter, useRouter } from "next/router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Accordion, Button, ButtonGroup, Col, Row } from "react-bootstrap";
import { EyeFill, PencilFill } from "react-bootstrap-icons";
import { toast } from "react-toastify";
import FullLayout from "../../../../components/dashboard/layouts/layout/full-layout";
import ShowEnumFromString from "../../../../components/enum-filters/show-enum-from-string";
import BaseCheckList from "../../../../components/forms/base-check-list";
import BaseSelect from "../../../../components/forms/base-select";
import BaseTextArea from "../../../../components/forms/base-text-area";
import ApplicantFilterForm from "../../../../components/forms/company/filter-form";
import ShowFormattedDate from "../../../../components/jobs/show-formatted-date";
import PageLayout from "../../../../components/layouts/page/page-layout";
import OverlyPopover from "../../../../components/popover/overly-popover";
import ViewDataTable from "../../../../components/view-details/view-data-table";
import ViewModal from "../../../../components/view-details/view-modal";
import {
  ApplicantReasonCodeFired,
  ApplicantReasonCodeNotInterested,
  ApplicantReasonCodeNotQualified,
  ApplicantReasonCodeQuit,
} from "../../../../enums/applicants/applicant-reason-codes.enum";
import { ApplicantStatus } from "../../../../enums/applicants/applicant-status.enum";
import { JobEquipmentType } from "../../../../enums/jobs/job-equipment-type.enum";
import { JobGeography } from "../../../../enums/jobs/job-geography.enum";
import { DriverEndorsement } from "../../../../enums/users/driver-endorsement.enum";
import { VehicleTransmissionType } from "../../../../enums/vehicles/vehicle-transmission-type.enum";
import { useAuth } from "../../../../hooks/use-auth";
import {
  TranslateInterface,
  useTranslation,
} from "../../../../hooks/use-translation";
import { ApplicantJobEntity } from "../../../../models/applicant/applicant-job.entity";
import { ApplicantEntity } from "../../../../models/applicant/applicant.entity";
import { SearchApplicantDto } from "../../../../models/applicant/search-applicant.dto";
import { JobEntity } from "../../../../models/job/job.entity";
import { globalAjaxExceptionHandler } from "../../../../utils/ajax";
import { buildAddress } from "../../../../utils/common";
import * as numbers from "../../../../utils/number";
import { useEffectAsync } from "../../../../utils/react";
import ApplicantApi from "../../../api/applicant";
import joinArrayElements from "../../../../utils/join-in-order.utils";
import CustomPagination from "../../../../components/pagination/custom-pagination";
import { Pagination, PagingMeta } from "../../../../types/pagination.type";
import { DriverLicenseType } from "../../../../enums/users/driver-license-type.enum";
import JobApi from "../../../api/job";

const ViewMode = {
  job: "job",
  applicant: "applicant",
};
interface ConsolodatedApplicant extends ApplicantEntity {
  jobs?: ConsolodatedApplicantJob[];
}
interface ConsolodatedJob extends JobEntity {
  applicants?: ConsolodatedApplicantJob[];
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
  let { viewMode, jobId } = router.query;

  if (!ViewMode[`${viewMode}`]) viewMode = ViewMode.applicant;

  const [loading, setLoading] = useState<boolean>(true);
  const [applicants, setApplicants] = useState<ApplicantEntity[]>([]);
  const [filters, setFilters] = useState<SearchApplicantDto>();
  const [pagingMeta, setPagingMeta] = useState<PagingMeta>(
    pagingsMetaInitialValues
  );
  const [filtersChanged, setFiltersChanged] = useState<boolean>(false);

  const fetchApplicant = async () => {
    if (viewMode === ViewMode.applicant) {
      setLoading(true);
      const api = new ApplicantApi();
      const data = await api.list({
        jobId: jobId as any as number,
        without: ["applicant_dac", "applicant_extras"],
        ...filters,
        is_paginated: true,
        page: filtersChanged ? 1 : pagingMeta?.currentPage,
        limit: pagingMeta?.itemsPerPage,
      });
      setApplicants((data as Pagination<ApplicantEntity>)?.items);
      setFiltersChanged(false);
      setPagingMeta({
        ...pagingMeta,
        currentPage: filtersChanged ? 1 : pagingMeta?.currentPage,
        totalItems: (data as Pagination<PagingMeta>)?.meta?.totalItems,
      });
      setTimeout(() => setLoading(false), 1000);
    }
  };

  useEffectAsync(
    async () => await fetchApplicant(),
    [user, jobId, filters, pagingMeta?.currentPage, pagingMeta?.itemsPerPage]
  );

  React.useMemo(() => setFiltersChanged(true), [filters]);

  useEffect(() => {
    setFilters(new SearchApplicantDto());
  }, [viewMode]);

  const onViewClick = (id: number) => {
    router.push(`${router.pathname}/${id}`);
  };

  const onEditClick = (id: number) => {
    router.push(`${router.pathname}/${id}/edit`);
  };

  /**
   *
   * @param {React.ChangeEvent<HTMLInputElement} e
   */
  const onViewModeChange = async (e) => {
    const { value } = e.target;

    router.query.viewMode = value;

    setApplicants([]);

    await router.push(router);
    if (value === ViewMode.job) {
      toast.info(t("TOGGLE_ON_APPLICANTS"));
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

  const canCreate = hasPermission("CanCreateApplicant");

  useEffect(() => {
    console.log("debug", user.company.id, company?.id, applicants.length);
  }, [applicants]);
  return (
    <>
      <Accordion defaultActiveKey="0" flush>
        <PageLayout
          title="APPLICANTS"
          actions={
            <div
              style={{
                display: "flex",
                justifyContent: "end",
                alignItems: "center",
              }}
            >
              {viewMode === ViewMode.applicant && (
                <Accordion.Button
                  className="mr-3 text-black theme-filter-btn"
                  style={{
                    width: "auto",
                    fontSize: ".95rem",
                    lineHeight: "1.5",
                    padding: ".25rem 1.5rem",
                    borderRadius: ".2rem",
                  }}
                >
                  <div className="mr-2">{t("FILTERS")}</div>
                </Accordion.Button>
              )}
              {canCreate && (
                <ButtonGroup size="sm" style={{ float: "right" }}>
                  <Button
                    variant="primary"
                    onClick={() =>
                      router.push("/dashboard/company/applicants/create")
                    }
                  >
                    + {t("ADD_AN_APPLICANT")}
                  </Button>
                  <Button
                    variant=""
                    className="theme-general-btn"
                    onClick={() =>
                      router.push("/dashboard/company/applicants/import")
                    }
                  >
                    + {t("IMPORT_APPLICANTS")}
                  </Button>
                </ButtonGroup>
              )}
            </div>
          }
        >
          <div
            style={{
              display: "flex",
              alignItems: "end",
              justifyContent: "end",
            }}
          >
            <FormGroup style={{ float: "right" }}>
              <FormControlLabel
                control={
                  <Switch
                    value={
                      viewMode == ViewMode.applicant
                        ? ViewMode.job
                        : ViewMode.applicant
                    }
                    checked={viewMode == ViewMode.job}
                    onChange={onViewModeChange}
                  />
                }
                label={t("VIEW_BY_{name}", {
                  name: t(viewMode == ViewMode.applicant ? "JOB" : "JOB"),
                })}
              />
            </FormGroup>
          </div>

          <Row>
            <Col className="force-overflow p-0">
              {viewMode === ViewMode.applicant && (
                <Accordion.Body>
                  <ApplicantFilterForm onSearch={setFilters} />
                </Accordion.Body>
              )}

              {loading ? (
                <div className="spinner-border mt-3 ml-1" role="status">
                  <span className="sr-only">Loading...</span>
                </div>
              ) : (
                <>
                  {viewMode == ViewMode.applicant && (
                    <ApplicantView
                      totalItems={pagingMeta?.totalItems}
                      setPagingMeta={setPagingMeta}
                      pagingMeta={pagingMeta}
                      router={router}
                      applicants={applicants}
                      onViewClick={onViewClick}
                      onEditClick={onEditClick}
                      onChangeStatus={onChangeStatus}
                      t={t}
                    />
                  )}
                  {viewMode == ViewMode.job && (
                    <JobView
                      router={router}
                      applicants={applicants}
                      onViewClick={onViewClick}
                      onEditClick={onEditClick}
                      onChangeStatus={onChangeStatus}
                      t={t}
                    />
                  )}
                </>
              )}
            </Col>
          </Row>
          <ViewModal
            show={!!applicantJobForm.values.status}
            onCloseClick={applicantJobForm.resetForm}
            closeText="CANCEL"
            title={"CHANGE_STATUS"}
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
                {applicantJobForm.values.status ==
                  ApplicantStatus.INACTIVE_QUIT && (
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
                {applicantJobForm.values.status ==
                  ApplicantStatus.INACTIVE_FIRED && (
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
                {applicantJobForm.values.reason_codes?.includes("OTHER") && (
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
                  {t("SUBMIT")}
                </Button>
              </Row>
            </form>
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
  return `${applicant?.first_name} ${applicant?.last_name}`;
}

function getApplicantStatus(
  applicantJob: ApplicantJobEntity,
  t: TranslateInterface
) {
  switch (applicantJob?.status) {
    case ApplicantStatus.OTHER:
      return applicantJob?.status_other;
    case ApplicantStatus.INACTIVE_CONTACTED_NOT_QUALIFIED:
      return `${t(
        `ApplicantStatus.${applicantJob?.status}`
      )} (${applicantJob?.reason_codes
        ?.map((v) =>
          v == ApplicantReasonCodeNotQualified.OTHER
            ? applicantJob?.reason_codes_other
            : t(`ApplicantReasonCodeNotQualified.${v}`)
        )
        ?.join(", ")})`;
    case ApplicantStatus.INACTIVE_CONTACTED_UNINTERESTED:
      return `${t(
        `ApplicantStatus.${applicantJob?.status}`
      )} (${applicantJob?.reason_codes
        ?.map((v) =>
          v == ApplicantReasonCodeNotInterested.OTHER
            ? applicantJob?.reason_codes_other
            : t(`ApplicantReasonCodeNotInterested.${v}`)
        )
        ?.join(", ")})`;
    case ApplicantStatus.INACTIVE_QUIT:
      return `${t(
        `ApplicantStatus.${applicantJob?.status}`
      )} (${applicantJob?.reason_codes
        ?.map((v) =>
          v == ApplicantReasonCodeQuit.OTHER
            ? applicantJob?.reason_codes_other
            : t(`ApplicantReasonCodeQuit.${v}`)
        )
        ?.join(", ")})`;
    case ApplicantStatus.INACTIVE_FIRED:
      return `${t(
        `ApplicantStatus.${applicantJob?.status}`
      )} (${applicantJob?.reason_codes
        ?.map((v) =>
          v == ApplicantReasonCodeFired.OTHER
            ? applicantJob?.reason_codes_other
            : t(`ApplicantReasonCodeFired.${v}`)
        )
        ?.join(", ")})`;
    default:
      return t(`ApplicantStatus.${applicantJob?.status}`);
  }

  if (
    applicantJob.reason_codes?.length > 0 ||
    applicantJob.reason_codes_other
  ) {
    return t(`ApplicantStatus.${applicantJob.status}`);
  }
}

function evaluateJobRequirements(applicant: ApplicantEntity, job: JobEntity) {
  // calculate if applicant meets basic qualifications:
  const results = {
    meets_basic_qualifications: true,
    qualification_fail_reason: [],
  };

  if (applicant?.years_cdl_experience < job?.min_years_experience) {
    results.meets_basic_qualifications = false;
    results?.qualification_fail_reason?.push("YEARS_OF_CDL_EXPERIENCE_TOO_LOW");
  }

  if (applicant?.accident_count > 0) {
    if (job?.must_have_clean_mvr) {
      results.meets_basic_qualifications = false;
      results?.qualification_fail_reason?.push("DOES_NOT_HAVE_CLEAN_MVR");
    } else if (job?.mvr_requirements?.length) {
      // complicated check around max violations
      // since violation count isn't specific
      // we just want to pull the max number
      // and check against that
      const mvr = job?.mvr_requirements?.reduce((p, c) => {
        if (p?.max_count >= c?.max_count) return p;

        return c;
      });

      if (mvr && mvr?.max_count > applicant?.accident_count) {
        results.meets_basic_qualifications = false;
        results?.qualification_fail_reason?.push(
          "VIOLATION_COUNT_GREATER_THAN_MAX"
        );
      }
    }
  }

  if (!applicant?.can_pass_drug_test && job?.must_pass_drug_test) {
    results.meets_basic_qualifications = false;
    results?.qualification_fail_reason?.push("CANNOT_PASS_DRUG_TEST");
  }

  job?.required_skills?.forEach((skill) => {
    // cannot process OTHER type
    if (skill?.type != JobEquipmentType.OTHER) {
      const experience = applicant?.equipment_experience?.find(
        (v) => v?.type == skill?.type
      );

      if (!experience) {
        results.meets_basic_qualifications = false;
        results?.qualification_fail_reason?.push({
          key: "DOES_NOT_HAVE_{name}_EXPERIENCE",
          name: `JobEquipmentType.${skill?.type}`,
        });
      } else if (experience?.years < skill?.years) {
        results.meets_basic_qualifications = false;
        results?.qualification_fail_reason?.push({
          key: "YEARS_OF_{name}_EXPERIENCE_TOO_LOW",
          name: `JobEquipmentType.${skill?.type}`,
        });
      }
    }
  });

  return results;
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
  router: NextRouter;
  t: TranslateInterface;
  pagingMeta?: PagingMeta;
  totalItems?: number;
  setPagingMeta?: React.Dispatch<React.SetStateAction<PagingMeta>>;
}

function ApplicantView(props: ViewProps) {
  const {
    router,
    applicants,
    onChangeStatus,
    onViewClick,
    onEditClick,
    t,
    totalItems,
    setPagingMeta,
    pagingMeta,
  } = props;
  const { hasPermission } = useAuth();
  const handlePageChange = (page: number, perPage: number) => {
    setPagingMeta((prevPagingMeta: PagingMeta) => ({
      ...prevPagingMeta,
      currentPage: page,
      itemsPerPage: perPage,
    }));
  };

  const items: ConsolodatedApplicant[] = applicants?.map((applicant) => {
    return {
      ...applicant,
      jobs: applicant.jobs?.map((aJob) => {
        const requirements = evaluateJobRequirements(applicant, aJob.job);
        requirements.qualification_fail_reason =
          requirements.qualification_fail_reason.map((v) => {
            if (typeof v == "string") return t(v);

            return t(v.key, { name: v.name }, { translateProps: true });
          });

        return {
          ...aJob,
          ...requirements,
        };
      }),
    };
  });
  return (
    <div className="applicant__table__sty ellipsis_remove">
      <ViewDataTable<ConsolodatedApplicant>
        customStyles={{
          headRow: {
            style: {
              opacity: "1",
              whiteSpace: "unset",
              textOverflow: "unset",
              overflow: "hidden",
            },
          },
        }}
        columns={[
          {
            id: "id",
            name: "ID",
            selector: (applicant) => applicant.id,
          },
          {
            id: "name",
            name: "NAME",
            wrap: true,
            selector: (applicant) => getApplicantName(applicant),
            cell: (applicant) => (
              <Link href={`${router.pathname}/${applicant.id}/edit`}>
                <a>{getApplicantName(applicant)}</a>
              </Link>
            ),
            hidable: false,
          },
          {
            id: "city",
            name: "CITY",
            wrap: true,
            selector: (applicant) => applicant?.city,
          },
          {
            id: "state",
            name: "STATE",
            wrap: true,
            selector: (applicant) => applicant?.state,
          },

          {
            id: "phone",
            name: "PHONE",
            wrap: true,
            selector: (applicant) => applicant?.phone,
            cell: (applicant) => (
              <OverlyPopover str={applicant?.phone}>
                {applicant?.phone}
              </OverlyPopover>
            ),
          },
          {
            id: "email",
            name: "EMAIL",
            wrap: true,
            selector: (applicant) => applicant.email,
            cell: (applicant) => (
              <OverlyPopover str={applicant.email}>
                {applicant.email}
              </OverlyPopover>
            ),
          },
          {
            id: "license_type",
            name: `CDL_TYPE`,
            wrap: true,
            selector: (applicant) =>
              applicant?.license_type === DriverLicenseType.NO_CDL ||
              applicant?.license_type === null
                ? t("DriverLicenseType.NONE")
                : t(`DriverLicenseType.${applicant.license_type}`) ||
                  t("DriverLicenseType.NONE"),
          },
          {
            id: "years_cdl_experience",
            name: "years_cdl_experience",
            wrap: true,
            selector: (applicant) =>
              applicant?.years_cdl_experience || t("ZERO"),
          },
          {
            id: "transmission_type",
            name: "TRANSMISSION_EXPERIENCE",
            wrap: true,
            selector: (applicant) =>
              applicant.transmission_type
                ? joinArrayElements(
                    applicant?.transmission_type,
                    "OTHER",
                    "VehicleTransmissionType"
                  )
                : t("NONE"),
          },
          {
            id: "date_added",
            name: "DATE_ADDED",
            wrap: true,
            selector: (applicant) => applicant.created_at,
            cell: (applicant) => (
              <ShowFormattedDate date={applicant.created_at} />
            ),
            hidable: false,
          },
          {
            id: "source",
            name: "LEAD_TYPE",
            wrap: true,
            hide: 1,
            cell: (applicant) =>
              applicant.type ? (
                <OverlyPopover str={t(`ApplicantType.${applicant.type}`)}>
                  {t(`ApplicantType.${applicant.type}`)}
                </OverlyPopover>
              ) : (
                ""
              ),
          },
          {
            id: "AUTOMATED_RECRUITING_LEAD",
            name: "AUTOMATED_RECRUITING_LEAD",
            wrap: true,
            hide: 1,
            selector: (applicant) =>
              Boolean(applicant?.is_automated_recruiting_lead)
                ? t("BooleanType.YES")
                : t("BooleanType.NO"),
          },
          {
            id: "status",
            name: "STATUS",
            wrap: true,
            hide: 1,
            selector: (applicant) =>
              applicant.current_application_status
                ? t(`ApplicantStatus.${applicant.current_application_status}`)
                : null,
            cell: (applicant) => (
              <ShowEnumFromString
                popover_header={t("ApplicantStatus")}
                labelPrefix={
                  applicant.current_application_status?.length > 0
                    ? "ApplicantStatus"
                    : ""
                }
                popover={true}
                value={applicant.current_application_status}
                enumArray={ApplicantStatus}
              />
            ),
          },
          {
            id: "assigned_to",
            name: "ASSIGNED_TO",
            wrap: true,
            hide: 1,
            selector: (applicant) => applicant.assignedUser?.name || t("NONE"),
          },

          {
            id: "endorsement",
            name: "ENDORSEMENTS",
            wrap: true,
            hide: 1,
            selector: (applicant) =>
              applicant.endorsements
                ? joinArrayElements(
                    applicant?.endorsements,
                    "OTHER",
                    "DriverEndorsement"
                  )
                : t("NONE"),
          },
          {
            id: "license_restrictions",
            name: "License_Restrictions",
            wrap: true,
            hide: 1,
            selector: (applicant) =>
              applicant.license_restrictions
                ? joinArrayElements(
                    applicant?.license_restrictions,
                    "OTHER",
                    undefined
                  )
                : t("NONE"),
          },
          {
            id: "is_owner_operator",
            name: `${t("OWNER_OPERATOR")} / ${t("COMPANY_DRIVER")}`,
            wrap: true,
            hide: 1,
            selector: (applicant) =>
              applicant.is_owner_operator
                ? t("OWNER_OPERATOR")
                : t("COMPANY_DRIVER") || t("NONE"),
          },
          {
            id: "preferred_location",
            name: `PREFERRED_LOCATION`,
            wrap: true,
            hide: 1,
            selector: (applicant) =>
              applicant.preferred_location
                ? joinArrayElements(
                    applicant?.preferred_location,
                    "OTHER",
                    undefined
                  )
                : t("NONE"),
          },
        ]}
        hideSetting
        items={items}
        actions={(row) => [
          {
            icon: PencilFill,
            label: "EDIT",
            onClick: (e) => onEditClick(row.id),
            hide: !hasPermission("CanUpdateApplicant"),
          },
        ]}
        expandableRowsComponent={({ data }) => (
          <ViewDataTable<ConsolodatedApplicantJob>
            noDataComponent={<>{t("NO_APPLIED_JOBS_FOUND")}</>}
            columns={[
              {
                name: "ID",
                selector: (aJob) => aJob.job.id,
                hidable: false,
              },

              {
                name: "JOB",
                selector: (aJob) => aJob.job.title,
                hidable: false,
              },
              {
                id: "location",
                name: "LOCATION",
                selector: (aJob) => buildAddress(aJob.job.location),
              },
              {
                name: "DATE_APPLIED",
                selector: (aJob) => new Date(aJob.created_at).toDateString(),
                hidable: false,
              },
              {
                name: "STATUS",
                cell: (aJob) => (
                  <OverlyPopover
                    skipTranslate
                    slice_at={40}
                    str={getApplicantStatus(aJob, t)}
                  />
                ),
                selector: (aJob) => getApplicantStatus(aJob, t), //t(`ApplicantStatus.${aJob.status}`),
                hidable: false,
              },
              {
                name: "MEETS_BASIC_QUALIFICATIONS",
                selector: (aJob) =>
                  t(aJob.meets_basic_qualifications ? "YES" : "NO"),
                hidable: false,
              },
              {
                name: "REASONS_IF_NO",
                selector: (aJob) => aJob.qualification_fail_reason?.join(),
                hidable: false,
              },
              {
                cell: (aJob) => {
                  const hideStatus = Boolean(
                    data?.jobs?.find(
                      (j) =>
                        j?.id != aJob?.id && j?.status?.startsWith("COMPLETED_")
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
                      placeholder={"CHANGE_STATUS"}
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
        )}
      />
      <div style={{ marginRight: "7%" }}>
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

function JobView(props: ViewProps) {
  const { router, applicants, onChangeStatus, onViewClick, onEditClick, t } =
    props;

  const { company, hasPermission } = useAuth();

  const [jobs, setJobs] = useState<ConsolodatedJob[]>([]);

  const fetchJobs = async () => {
    const api = new JobApi();
    const data = await api.applicants({
      companyId: company?.id,
    });
    setJobs(data as JobEntity[]);
  };

  useEffectAsync(async () => await fetchJobs(), []);

  for (const [, job] of jobs?.entries()) {
    job?.applicants?.map((applicant) => {
      const requirements = evaluateJobRequirements(applicant?.applicant, job);
      requirements.qualification_fail_reason =
        requirements?.qualification_fail_reason?.map((v) => {
          if (typeof v == "string") return t(v);

          return t(v?.key, { name: v?.name }, { translateProps: true });
        });

      applicant["qualification_fail_reason"] =
        requirements?.qualification_fail_reason;
      applicant["meets_basic_qualifications"] =
        requirements?.meets_basic_qualifications;
    });
  }

  return (
    <ViewDataTable<ConsolodatedJob>
      columns={[
        {
          id: "Id",
          name: "ID",
          selector: (job) => job?.id,
          hidable: true,
        },
        {
          id: "job",
          name: "JOB",
          selector: (job) => job?.title,
          hidable: false,
          cell: (j) => (
            <Link href={`/dashboard/company/jobs/${j?.id}`}>
              <a>{j?.title}</a>
            </Link>
          ),
        },
        {
          id: "location",
          name: "LOCATION",
          selector: (job) => buildAddress(job?.location),
        },
        {
          id: "geography",
          name: "GEOGRAPHY",
          selector: (job) =>
            job?.geography ? t(`JobGeography.${job?.geography}`) : "",
        },
        {
          id: "type",
          name: "TYPE",
          selector: (job) =>
            job?.employment_type
              ? t(`JobEmploymentType.${job?.employment_type}`)
              : "",
        },
        {
          id: "weekly_range",
          name: "WEEKLY_RANGE",
          selector: (job) =>
            `${numbers?.toCurrency(
              job?.min_weekly_pay
            )} - ${numbers?.toCurrency(job?.max_weekly_pay)}`,
        },
      ]}
      items={jobs}
      expandableRowsComponent={({ data }) => (
        <ViewDataTable<ConsolodatedApplicantJob>
          columns={[
            {
              name: "ID",
              selector: (aJob) => aJob?.applicant?.id,
            },
            {
              name: "NAME",
              selector: (aJob) => getApplicantName(aJob?.applicant),
              cell: (aJob) => (
                <Link href={`${router?.pathname}/${aJob?.applicant?.id}/edit`}>
                  <a>{getApplicantName(aJob?.applicant)}</a>
                </Link>
              ),
              hidable: false,
            },
            {
              name: "CITY",
              selector: (aJob) => aJob?.applicant?.city,
            },
            {
              name: "STATE",
              selector: (aJob) => aJob?.applicant?.state,
            },
            {
              name: "DATE_APPLIED",
              selector: (aJob) => new Date(aJob?.created_at)?.toDateString(),
              hidable: false,
            },
            {
              name: "STATUS",
              cell: (aJob) => (
                <OverlyPopover
                  skipTranslate
                  slice_at={40}
                  str={getApplicantStatus(aJob, t)}
                />
              ),
              selector: (aJob) => getApplicantStatus(aJob, t),
              hidable: false,
            },
            {
              name: "MEETS_BASIC_QUALIFICATIONS",
              selector: (aJob) =>
                t(aJob?.meets_basic_qualifications ? "YES" : "NO"),
              hidable: false,
            },
            {
              name: "REASONS_IF_NO",
              selector: (aJob) => aJob?.qualification_fail_reason?.join(),
              hidable: false,
            },
            {
              id: "date_added",
              name: "DATE_ADDED",
              selector: (aJob) => aJob?.applicant?.created_at,
              cell: (aJob) => (
                <ShowFormattedDate date={aJob?.applicant?.created_at} />
              ),
              hidable: false,
            },
            {
              name: "ASSIGNED_TO",
              selector: (aJob) =>
                aJob?.applicant?.assignedUser?.name || t("NONE"),
              hidable: false,
            },
            {
              cell: (aJob) => {
                const hideStatus = Boolean(
                  applicants
                    ?.find((a) => a?.id == aJob?.applicant?.id)
                    ?.jobs?.find(
                      (j) =>
                        j?.id != aJob?.id && j?.status?.startsWith("COMPLETED_")
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
                    name={aJob?.applicant?.id?.toString()}
                    value=""
                    onChange={(e) => onChangeStatus(e, aJob?.applicant, data)}
                    placeholder={"CHANGE_STATUS"}
                    labelPrefix="ApplicantStatus"
                    enumType={ApplicantStatus}
                  />
                );
              },
            },
          ]}
          hideSearch
          actions={(row) => [
            {
              icon: EyeFill,
              label: "VIEW",
              onClick: (e) => onViewClick(row?.applicant?.id),
            },
            {
              icon: PencilFill,
              label: "EDIT",
              onClick: (e) => onEditClick(row?.applicant?.id),
              hide: !hasPermission("CanUpdateApplicant"),
            },
          ]}
          items={data.applicants}
        />
      )}
    />
  );
}
