import FullLayout from "../../../../components/dashboard/layouts/full-layout";
import { Col, Row, Card, CardBody, Table } from "reactstrap";
import { useAuth } from "../../../../hooks/use-auth";
import { useState } from "react";
import JobList from "../../../../public/dashboard/styles/css/job-list.module.css";
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
import { buildAddress } from "../../../../utils/common";
import OverlyPopover from "../../../../components/popover/overly-popover";
import { JobDeliveryType } from "../../../../enums/jobs/job-delivery-type.enum";
import useStorage from "../../../../hooks/use-storage";
import { ApplicantEntity } from "../../../../models/applicant/applicant.entity";
import { useEffectAsync } from "../../../../utils/react";
import { ApplicantJobEntity } from "../../../../models/applicant/applicant-job.entity";

export default function Index() {
  const { t } = useTranslation();
  const applicantApi = new ApplicantApi();
  const { user } = useAuth();

  const [applications, setApplications] = useState<ApplicantJobEntity[]>([]);

  useEffectAsync(async () => {
    if (!user) return;
    const aJobs = await applicantApi.me.jobs();

    setApplications(aJobs);
  }, [user]);

  const columnSettingKey = getDataTableColumnKey(
    "driver",
    user,
    "applications"
  );

  return (
    <div className={JobList.joblisting}>
      <Row className={JobList.link}>
        <Col sm="6" lg="8">
          <h2 className="mt-3">{t("MY_APPLICATIONS")}</h2>
        </Col>
      </Row>
      <Row className="mt-5">
        <Col lg="12 ">
          <ViewDataTable<ApplicantJobEntity>
            columnSettingKey={columnSettingKey}
            columns={[
              {
                name: "ID",
                selector: (applicant) => applicant.job.id,
              },
              {
                name: "job_title",
                cell: (applicant) => (
                  <Link
                    href={`/jobs/${applicant.job.id}/${applicant.job.slug}`}
                  >
                    <a>
                      <OverlyPopover
                        skipTranslate={true}
                        header={t("job_title")}
                        str={applicant.job.title}
                      />
                    </a>
                  </Link>
                ),
                selector: (applicant) => applicant.job.title,
                hidable: false,
              },
              {
                name: "company",
                selector: (applicant) => applicant.company.name,
              },
              {
                name: "location",
                cell: (applicant) => (
                  <OverlyPopover
                    skipTranslate={true}
                    header={t("location")}
                    str={buildAddress(applicant.job.location || {})}
                  />
                ),
                selector: (applicant) =>
                  buildAddress(applicant.job.location || {}),
              },
              {
                name: "drivers_needed",
                selector: (applicant) => applicant.job.drivers_needed,
              },
              {
                name: "est_pay_per_week",
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
                selector: (applicant) =>
                  `${
                    applicant.job.min_weekly_pay
                      ? applicant.job.min_weekly_pay
                      : 0
                  } - ${
                    applicant.job.max_weekly_pay
                      ? applicant.job.max_weekly_pay
                      : 0
                  }`,
              },
              {
                name: "LICENSE_TYPE",
                cell: (applicant) => (
                  <ShowEnumFromString
                    popover_header={t("LICENSE_TYPE")}
                    labelPrefix="DriverLicenseType"
                    popover={true}
                    value={applicant.job.cdl_class}
                    enumArray={DriverLicenseType}
                  />
                ),
                selector: (applicant) =>
                  t(`DriverLicenseType.${applicant.job.cdl_class}`),
              },
              {
                name: "APPLICATION_STATUS",
                cell: (applicant) => (
                  <ShowEnumFromString
                    popover_header={t("APPLICATION_STATUS")}
                    labelPrefix="ApplicantStatus"
                    popover={true}
                    value={applicant.status}
                    enumArray={ApplicantStatus}
                  />
                ),
                selector: (applicant) =>
                  t(`ApplicantStatus.${applicant.status}`),
              },
              {
                name: "DATE_APPLIED",
                cell: (applicant) => (
                  <OverlyPopover
                    skipTranslate={true}
                    header={t("DATE_APPLIED")}
                    str={new Date(applicant.created_at).toDateString()}
                  />
                ),
                selector: (applicant) =>
                  new Date(applicant.created_at).toDateString(),
              },
              {
                name: "expiration_date",
                cell: (applicant) =>
                  applicant.job.expiry_date ? (
                    <OverlyPopover
                      skipTranslate={true}
                      header={t("expiration_date")}
                      str={new Date(applicant.job.expiry_date).toDateString()}
                    />
                  ) : null,
                selector: (applicant) =>
                  applicant.job.expiry_date
                    ? new Date(applicant.job.expiry_date).toDateString()
                    : "",
              },
              {
                name: "SCHEDULE",
                cell: (applicant) => (
                  <OverlyPopover
                    labelPrefix="JobSchedule"
                    skipTranslate={false}
                    header={t("SCHEDULE")}
                    str={applicant.job.schedule}
                  />
                ),
                selector: (applicant) =>
                  t(`JobSchedule.${applicant.job.schedule}`),
              },
              {
                name: "EMPLOYMENT_TYPE",
                cell: (applicant) => (
                  <OverlyPopover
                    labelPrefix="JobEmploymentType"
                    skipTranslate={false}
                    header={t("EMPLOYMENT_TYPE")}
                    str={applicant.job.employment_type}
                  />
                ),
                selector: (applicant) =>
                  t(`JobEmploymentType.${applicant.job.employment_type}`),
              },
              {
                name: "DELIVERY_TYPE",
                cell: (applicant) => (
                  <ShowEnumFromString
                    popover_header={t("DELIVERY_TYPE")}
                    labelPrefix="JobDeliveryType"
                    popover={true}
                    value={applicant.job.delivery_type}
                    enumArray={JobDeliveryType}
                  />
                ),
                selector: (applicant) =>
                  t(`JobDeliveryType.${applicant.job.delivery_type}`),
              },
              {
                name: "TEAM_DRIVERS",
                cell: (applicant) => (
                  <OverlyPopover
                    labelPrefix="JobTeamDriver"
                    skipTranslate={false}
                    header={t("TEAM_DRIVERS")}
                    str={applicant.job.team_drivers}
                  />
                ),
                selector: (applicant) =>
                  t(`JobTeamDriver.${applicant.job.team_drivers}`),
              },
            ]}
            items={applications}
          />
        </Col>
      </Row>
    </div>
  );
}

Index.getLayout = function getLayout(page) {
  return <FullLayout>{page}</FullLayout>;
};
