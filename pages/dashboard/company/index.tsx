import { Row } from "reactstrap";
import { ApplicantPieChart } from "../../../components/charts/company/applicant-pipeline-chart";
import { ApplicantsPerRecruiterChart } from "../../../components/charts/company/applicants-per-recruiter-chart";
import { TotalApplicantBarChart } from "../../../components/charts/company/total-applicants-bar-chart";
import FullLayout from "../../../components/dashboard/layouts/layout/full-layout";
import PageLayout from "../../../components/layouts/page/page-layout";

import { useState } from "react";
import { ChartWrapper } from "../../../components/charts/chart-wrapper";
import { SourceBreakdownChart } from "../../../components/charts/company/source-breakdown-chart";
import { DashboardStast } from "../../../components/charts/dashboard-stats";
import DashboardChartContext from "../../../context/dashboard-chart-context";
import { useAuth } from "../../../hooks/use-auth";
import { ApplicantEntity } from "../../../models/applicant";
import { useEffectAsync } from "../../../utils/react";
import ApplicantApi from "../../api/applicant";
import EmployeeApi from "../../api/employee";
import { EmployeeEntity } from "../../../models/employee/employee.entity";
import { EmployeeStatus } from "../../../enums/applicants/employee-status.enum";

export default function Dashboard() {
  const { hasPermission, company } = useAuth();
  const [data, setData] = useState<ApplicantEntity[]>([]);
  const [employeeData, setEmployeeData] = useState<EmployeeEntity[]>([]);
  const api = new ApplicantApi();
  const employeeApi = new EmployeeApi()
  useEffectAsync(async () => {
    const v = await api.list();
    setData(v);
    const e = await employeeApi.list({ status: [EmployeeStatus.ACTIVE] })
    setEmployeeData(e)

  }, [company.id]);

  return (
    <PageLayout title="COMPANY_PROFILE_DASHBOARD">
      <Row>
        {hasPermission("CanViewApplicant") && (
          <DashboardChartContext.Provider
            value={{
              state: {
                data: data,
                employee: employeeData
              },
            }}
          >
            <Row className="my_chart">
              <ChartWrapper
                title="APPLICATION_STATUS"
                md="6"
                lg="4"
              >
                <ApplicantPieChart />
              </ChartWrapper>

              <ChartWrapper title="STATS" md="6" lg="4">
                <DashboardStast />
              </ChartWrapper>

              <ChartWrapper title="LEAD_ASSIGNMENT" md="6" lg="4">
                <ApplicantsPerRecruiterChart />
              </ChartWrapper>

              <ChartWrapper
                title="HISTORICAL_RANGE"
                md="6"
                className="p-0"
                titleClassName="text-left justify-content-start ml-4"
              >
                <TotalApplicantBarChart />
              </ChartWrapper>
              <ChartWrapper
                title="SOURCE_BREAKDOWN"
                md="6"
                className="p-0"
                titleClassName="text-center justify-content-center"
              >
                <SourceBreakdownChart />
              </ChartWrapper>
            </Row>
          </DashboardChartContext.Provider>
        )}
      </Row>
    </PageLayout>
  );
}

Dashboard.getLayout = function getLayout(page) {
  return <FullLayout>{page}</FullLayout>;
};
