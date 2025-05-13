import FullLayout from "../../../../components/dashboard/layouts/full-layout";
import { Col, Row } from "react-bootstrap";
import { useAuth } from "../../../../hooks/use-auth";
import { useState } from "react";
import JobList from "../../../public/dashboard/styles/css/JobList.module.css";
import Link from "next/link";
import ApplicantApi from "../../../api/applicant";
import { ApplicantStatus } from "../../../../enums/applicants/applicant-status.enum";
import { useTranslation } from "../../../../hooks/use-translation";
import { CurrencyDollar } from "react-bootstrap-icons";
import ShowEnumFromString from "../../../../components/enum-filters/show-enum-from-string";
import { DriverLicenseType } from "../../../../enums/users/driver-license-type.enum";
import ViewDataTable, {
  getDataTableColumnKey,
} from "../../../../components/view-details/view-data-table";
import OverlyPopover from "../../../../components/popover/overly-popover";
import { buildAddress } from "../../../../utils/common";
import { JobDeliveryType } from "../../../../enums/jobs/job-delivery-type.enum";
import { useEffectAsync } from "../../../../utils/react";
import PageLayout from "../../../../components/layouts/page/page-layout";
import { ApplicantJobEntity } from "../../../../models/applicant/applicant-job.entity";

export default function OfferedJobs() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const columnSettingKey = getDataTableColumnKey(
    "driver",
    user,
    "jobs-offered"
  );
  const [applicantJobs, setApplicantJobs] = useState<ApplicantJobEntity[]>([]);

  useEffectAsync(async () => {
    if (user) {
      const api = new ApplicantApi();
      const data = await api.me.jobs();
      setApplicantJobs(
        data.filter((v) => v.status == ApplicantStatus.IN_PROCESS_OFFERED_JOB)
      );
    }
  }, [user]);

  return (
    <PageLayout title="JOBS_OFFERED">
      <ViewDataTable<ApplicantJobEntity>
        columns={[
          {
            id: "id",
            name: "ID",
            selector: (applicant) => applicant.company?.id,
          },
          {
            id: "title",
            name: "job_title",
            selector: (v) => v.job.title,
            cell: (applicant) => (
              <Link href={`/dashboard/driver/jobs/${applicant.job.id}`}>
                <a>
                  <OverlyPopover
                    skipTranslate={true}
                    header={t("job_title")}
                    str={applicant.job.title}
                  />
                </a>
              </Link>
            ),
            hidable: false,
          },
          {
            id: "company",
            name: "company",
            selector: (applicant) => applicant.company?.name || null,
          },
          {
            id: "location",
            name: "location",
            selector: (v) => buildAddress(v.job.location || {}),
            cell: (applicant) => (
              <OverlyPopover
                skipTranslate={true}
                header={t("location")}
                str={buildAddress(applicant.job.location || {})}
              />
            ),
          },
          {
            id: "drivers_needed",
            name: "drivers_needed",
            selector: (applicant) => applicant.job.drivers_needed,
          },
          {
            id: "est_pay_per_week",
            name: "est_pay_per_week",
            selector: (v) =>
              `${v.job.min_weekly_pay ? v.job.min_weekly_pay : 0} - ${
                v.job.max_weekly_pay ? v.job.max_weekly_pay : 0
              }`,
            cell: (applicant) => (
              <OverlyPopover
                skipTranslate={true}
                header={t("est_pay_per_week")}
                str={`${
                  applicant.job.min_weekly_pay
                    ? applicant.job.min_weekly_pay
                    : 0
                } - ${
                  applicant.job.max_weekly_pay
                    ? applicant.job.max_weekly_pay
                    : 0
                } ${t("per_week")}`}
                icon={<CurrencyDollar className="mr-1" />}
              />
            ),
          },
          {
            id: "license_type",
            name: "LICENSE_TYPE",
            selector: (v) =>
              v.job.cdl_class
                ? t(`DriverLicenseType.${v.job.cdl_class}`)
                : null,
            cell: (applicant) => (
              <ShowEnumFromString
                popover_header={t("LICENSE_TYPE")}
                labelPrefix="DriverLicenseType"
                popover={true}
                value={applicant.job.cdl_class}
                enumArray={DriverLicenseType}
              />
            ),
          },
          {
            id: "hired_date",
            name: "DATE_HIRED",
            selector: (v) =>
              v.last_updated_at
                ? new Date(v.last_updated_at).toDateString()
                : null,
            cell: (applicant) =>
              applicant.last_updated_at ? (
                <OverlyPopover
                  skipTranslate={true}
                  header={t("DATE_HIRED")}
                  str={new Date(applicant.last_updated_at).toDateString()}
                />
              ) : null,
          },
          {
            id: "expiration_date",
            name: "expiration_date",
            selector: (v) =>
              v.job.expiry_date
                ? new Date(v.job.expiry_date).toDateString()
                : null,
            cell: (applicant) =>
              applicant.job.expiry_date ? (
                <OverlyPopover
                  skipTranslate={true}
                  header={t("expiration_date")}
                  str={new Date(applicant.job.expiry_date).toDateString()}
                />
              ) : null,
          },
          {
            id: "schedule",
            name: "SCHEDULE",
            selector: (v) =>
              v.job.schedule ? t(`JobSchedule.${v.job.schedule}`) : null,
            cell: (applicant) => (
              <OverlyPopover
                labelPrefix="JobSchedule"
                skipTranslate={false}
                header={t("SCHEDULE")}
                str={applicant.job.schedule}
              />
            ),
          },
          {
            id: "employment_type",
            name: "EMPLOYMENT_TYPE",
            selector: (v) =>
              v.job.employment_type
                ? t(`JobEmploymentType.${v.job.employment_type}`)
                : null,
            cell: (applicant) => (
              <OverlyPopover
                labelPrefix="JobEmploymentType"
                skipTranslate={false}
                header={t("EMPLOYMENT_TYPE")}
                str={applicant.job.employment_type}
              />
            ),
          },
          {
            id: "delivery_type",
            name: "DELIVERY_TYPE",
            selector: (v) =>
              v.job.delivery_type
                ? t(`JobDeliveryType.${v.job.delivery_type}`)
                : null,
            cell: (applicant) => (
              <ShowEnumFromString
                popover_header={t("DELIVERY_TYPE")}
                labelPrefix="JobDeliveryType"
                popover={true}
                value={applicant.job.delivery_type}
                enumArray={JobDeliveryType}
              />
            ),
          },
          {
            id: "team_drivers",
            name: "TEAM_DRIVERS",
            selector: (v) =>
              v.job.team_drivers
                ? t(`JobTeamDriver.${v.job.team_drivers}`)
                : null,
            cell: (applicant) => (
              <OverlyPopover
                labelPrefix="JobTeamDriver"
                skipTranslate={false}
                header={t("TEAM_DRIVERS")}
                str={applicant.job.team_drivers}
              />
            ),
          },
        ]}
        items={applicantJobs}
        columnSettingKey={columnSettingKey}
      />
    </PageLayout>
  );
}

OfferedJobs.getLayout = function getLayout(page) {
  return <FullLayout>{page}</FullLayout>;
};
