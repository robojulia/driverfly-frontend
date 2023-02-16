import FullLayout from "../../../components/dashboard/layouts/layout/full-layout";
import { Col, Row } from "reactstrap";
import PageLayout from "../../../components/layouts/page/page-layout";
import { ApplicantPieChart } from "../../../components/charts/company/applicant-pipeline-chart";
import { ApplicantsPerRecruiterChart } from "../../../components/charts/company/applicants-per-recruiter-chart";
import { TotalApplicantBarChart } from "../../../components/charts/company/total-applicants-bar-chart";

import { useAuth } from "../../../hooks/use-auth";
import { PieChart } from "../../../components/charts/pie-chart";
import { ChartWrapper } from "../../../components/charts/chart-wrapper";
import { Card } from "react-bootstrap";
import { DashboardStast } from "../../../components/charts/dashboard-stats";
import { SourceBreakdownChart } from "../../../components/charts/company/source-breakdown-chart";

export default function Dashboard() {
  const { hasPermission } = useAuth();

  return (
    <PageLayout title="COMPANY_PROFILE_DASHBOARD">
      <Row>
        {hasPermission("CanViewApplicant") && (
          <>
            <Row className="my_chart">
              <ChartWrapper
                title="APPLICATION_STATUS"
                subTitle={"Application_Status_Subtitle"}
                md="6"
                lg="4"
                
              >
                <ApplicantPieChart />
              </ChartWrapper>

              <ChartWrapper title="STATS" md="6" lg="4" >
                <DashboardStast />
              </ChartWrapper>

              <ChartWrapper title="LEAD_ASSIGNMENT" md="6" lg="4" >
                <ApplicantsPerRecruiterChart />
              </ChartWrapper>

              <ChartWrapper
                title="HISTORICAL_RANGE"
                md="6"
                className="p-0"
                titleClassName="text-left justify-content-start"
              >
                <TotalApplicantBarChart />
              </ChartWrapper>
              <ChartWrapper
                title="SOURCE_BREAKDOWN"
                md="6"
                className="p-0"
                titleClassName="text-center justify-content-center"
                subTitle={"Source_breakdown_Subtitle"}
              >
                <SourceBreakdownChart />
              </ChartWrapper>
            </Row>
          </>
        )}
      </Row>
    </PageLayout>
  );
}

Dashboard.getLayout = function getLayout(page) {
  return <FullLayout>{page}</FullLayout>;
};
