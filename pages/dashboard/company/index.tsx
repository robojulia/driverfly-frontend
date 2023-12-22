import { useState } from "react";
import { Row } from "reactstrap";
import { Col } from "react-bootstrap";
import Link from "next/link";
import { ApplicantPieChart } from "../../../components/charts/company/applicant-pipeline-chart";
import { ApplicantsPerRecruiterChart } from "../../../components/charts/company/applicants-per-recruiter-chart";
import { TotalApplicantBarChart } from "../../../components/charts/company/total-applicants-bar-chart";
import FullLayout from "../../../components/dashboard/layouts/layout/full-layout";
import PageLayout from "../../../components/layouts/page/page-layout";
import {
  ChartWrapper,
  ChartInerWrapper,
} from "../../../components/charts/chart-wrapper";
import { SourceBreakdownChart } from "../../../components/charts/company/source-breakdown-chart";
import { DashboardStats } from "../../../components/charts/dashboard-stats";
import DashboardChartContext from "../../../context/dashboard-chart-context";
import { useAuth } from "../../../hooks/use-auth";
import { ApplicantEntity } from "../../../models/applicant";
import { useEffectAsync } from "../../../utils/react";
import ApplicantApi from "../../api/applicant";
import EmployeeApi from "../../api/employee";
import { EmployeeEntity } from "../../../models/employee/employee.entity";
import { EmployeeStatus } from "../../../enums/applicants/employee-status.enum";
import { JobEntity } from "../../../models/job/job.entity";
import JobApi from "../../api/job";
import { Status } from "../../../enums/status.enum";

export default function Dashboard() {
  const { hasPermission, company } = useAuth();
  const [applicants, setApplicants] = useState<ApplicantEntity[]>([]);
  const [employees, setEmployees] = useState<EmployeeEntity[]>([]);
  const [jobs, setJobs] = useState<JobEntity[]>([]);
  const applicantApi = new ApplicantApi();
  const employeeApi = new EmployeeApi();
  const jobApi = new JobApi();

  useEffectAsync(async () => {
    let todayDate = new Date();
    if (company?.id) {
      const a = await applicantApi.list({ withHired: true });
      setApplicants(a);
      const e = await employeeApi.list({ status: [EmployeeStatus.ACTIVE] });
      setEmployees(e);
      const j = (await jobApi.list())?.filter(
        (job) =>
          job?.status === Status.ACTIVE &&
          new Date(job?.expiry_date) >= todayDate
      );
      setJobs(j);
    }
  }, [company?.id]);

  return (
    <PageLayout title="">
      <Row>
        {hasPermission("CanViewApplicant") && (
          <DashboardChartContext.Provider
            value={{
              state: {
                applicants,
                employees,
                jobs,
              },
            }}
          >
            <div className="my_chart px-4">
              <ChartWrapper
                title="Hello Evano"
                sm="12"
                md="12"
                lg="12"
                className=""
              >
                <DashboardStats />
              </ChartWrapper>

              <div className="px-3 my-3 innerChart-parent ">
                <ChartInerWrapper
                  title="SOURCE_BREAKDOWN"
                  className="py-4 ChartWrapper innerChart "
                  subHeading="The methods or platforms your applicants
                  came in from."
                >
                  <SourceBreakdownChart />
                </ChartInerWrapper>

                <ChartInerWrapper
                  title="APPLICATION_STATUS"
                  className=" py-4 ChartWrapper innerChart "
                  subHeading="Where they’re at in the recruiting process."
                >
                  <ApplicantPieChart />
                </ChartInerWrapper>

                <ChartInerWrapper
                  title="LEAD_ASSIGNMENT"
                  className="py-4  ChartWrapper innerChart "
                  subHeading="Who’s handling what."
                >
                  <ApplicantsPerRecruiterChart />
                </ChartInerWrapper>
              </div>

              <Row className="my-2 px-2 mr-2">
                <Col lg={9} md={8} sm={12}>
                  <ChartWrapper
                    title="HISTORICAL_RANGE"
                    md="12"
                    lg="12"
                    sm="12"
                    className="py-4 ChartWrapper"
                    titleClassName="justify-content-start "
                  >
                    <TotalApplicantBarChart />
                  </ChartWrapper>
                </Col>
                <Col lg={3} md={4} sm={12}>
                  <div className="auto_recruiting ">
                    <h4 className="text-white font-weight-bold">
                      Sign Up For Auto Recruiting
                    </h4>
                    <div className="auto_rec_link">
                      <Link href={""} className="Link">
                        Get Drivers Now!
                      </Link>
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
          </DashboardChartContext.Provider>
        )}
      </Row>
    </PageLayout>
  );
}

Dashboard.getLayout = function getLayout(page) {
  return <FullLayout>{page}</FullLayout>;
};
