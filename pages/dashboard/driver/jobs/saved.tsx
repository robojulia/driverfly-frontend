import FullLayout from "../../../../components/dashboard/layouts/full-layout";
import { useAuth } from "../../../../hooks/use-auth";
import { useState } from "react";
import Link from "next/link";
import SavedJobApi from "../../../api/saved-job";
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
import { useEffectAsync } from "../../../../utils/react";
import PageLayout from "../../../../components/layouts/page/page-layout";
import { SavedJobEntity } from "../../../../models/saved-jobs/saved-job.entity";

export default function JobsSaved() {
  const { t } = useTranslation();

  const { user } = useAuth();

  const columnSettingKey = getDataTableColumnKey("driver", user, "jobs-saved");

  const [savedJobs, setSavedJobs] = useState<SavedJobEntity[]>([]);

  useEffectAsync(async () => {
    if (user) {
      const api = new SavedJobApi();
      const data = await api.list();
      setSavedJobs(data);
    } else {
      setSavedJobs([]);
    }
  }, [user]);

  return (
    <PageLayout title="SAVED_JOBS">
      <ViewDataTable<SavedJobEntity>
        columns={[
          {
            id: "id",
            name: "ID",
            selector: (v) => v.id,
          },
          {
            id: "title",
            name: "job_title",
            selector: (v) => v.job.title,
            cell: (v) => (
              <Link href={`/dashboard/driver/jobs/${v.job.id}`}>
                <a>
                  <OverlyPopover
                    skipTranslate={true}
                    header={t("job_title")}
                    str={v.job.title}
                  />
                </a>
              </Link>
            ),
            hidable: false,
          },
          {
            id: "company",
            name: "company",
            selector: (v) => v.job.company?.name,
          },
          {
            id: "location",
            name: "location",
            selector: (v) => buildAddress(v.job.location || {}),
            cell: (v) => (
              <OverlyPopover
                skipTranslate={true}
                header={t("location")}
                str={buildAddress(v.job.location || {})}
              />
            ),
          },
          {
            id: "drivers_needed",
            name: "drivers_needed",
            selector: (v) => v.job.drivers_needed,
          },
          {
            id: "est_pay_per_week",
            name: "est_pay_per_week",
            selector: (v) =>
              `${v.job.min_weekly_pay ? v.job.min_weekly_pay : 0} - ${
                v.job.max_weekly_pay ? v.job.max_weekly_pay : 0
              }`,
            cell: (v) => (
              <OverlyPopover
                skipTranslate={true}
                header={t("est_pay_per_week")}
                str={`${v.job.min_weekly_pay ? v.job.min_weekly_pay : 0} - ${
                  v.job.max_weekly_pay ? v.job.max_weekly_pay : 0
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
            cell: (v) => (
              <ShowEnumFromString
                popover_header={t("LICENSE_TYPE")}
                labelPrefix="DriverLicenseType"
                popover={true}
                value={v.job.cdl_class}
                enumArray={DriverLicenseType}
              />
            ),
          },
          {
            id: "date_saved",
            name: "DATE_SAVED",
            selector: (v) => new Date(v.created_at).toDateString(),
            cell: (v) =>
              v.created_at ? (
                <OverlyPopover
                  skipTranslate={true}
                  header={t("DATE_SAVED")}
                  str={new Date(v.created_at).toDateString()}
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
            cell: (v) =>
              v.job.expiry_date ? (
                <OverlyPopover
                  skipTranslate={true}
                  header={t("expiration_date")}
                  str={new Date(v.job.expiry_date).toDateString()}
                />
              ) : null,
          },
          {
            id: "schedule",
            name: "SCHEDULE",
            selector: (v) =>
              v.job.schedule ? t(`JobSchedule.${v.job.schedule}`) : null,
            cell: (v) => (
              <OverlyPopover
                labelPrefix="JobSchedule"
                skipTranslate={false}
                header={t("SCHEDULE")}
                str={v.job.schedule}
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
            cell: (v) => (
              <OverlyPopover
                labelPrefix="JobEmploymentType"
                skipTranslate={false}
                header={t("EMPLOYMENT_TYPE")}
                str={v.job.employment_type}
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
            cell: (v) => (
              <ShowEnumFromString
                popover_header={t("DELIVERY_TYPE")}
                labelPrefix="JobDeliveryType"
                popover={true}
                value={v.job.delivery_type}
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
            cell: (v) => (
              <OverlyPopover
                labelPrefix="JobTeamDriver"
                skipTranslate={false}
                str={v.job.team_drivers}
              />
            ),
          },
        ]}
        items={savedJobs}
        columnSettingKey={columnSettingKey}
      />
    </PageLayout>
  );
}

JobsSaved.getLayout = function getLayout(page) {
  return <FullLayout>{page}</FullLayout>;
};
