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

export default function Dashboard() {
  const { hasPermission } = useAuth();

  return (
    <PageLayout title="COMPANY_PROFILE_DASHBOARD">
      <Row>
        {hasPermission("CanViewApplicant") && (
          <>
            <Row className="my_chart">
              <ChartWrapper
                title="Application Status"
                subTitle={"Rage:(Total, past week, custom date range)"}
              >
                <ApplicantPieChart />
              </ChartWrapper>

              <ChartWrapper
                title="Stats"
              >
                <Card className="rounded-lg h-100 stats_card">
                  <Card.Body>
                    <Row>
                        <Col md="4" className="justify-content-end text-end fw-bold ">2</Col>
                        <Col md="8" className="justify-content-start text-primary fw-normal">
                            Active Job Posts</Col>
                    </Row>
                    <Row>
                        <Col md="4" className="justify-content-end text-end">245454</Col>
                        <Col md="8" className="justify-content-start">Total Leads</Col>
                    </Row>
                  </Card.Body>
                </Card>
         </ChartWrapper>

              <ChartWrapper title="Lead Assignment">
                <ApplicantsPerRecruiterChart />
              </ChartWrapper>

              <Col md="12" className="mt-5 p-0">
                <TotalApplicantBarChart />
              </Col>
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
