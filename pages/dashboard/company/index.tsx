import { useState } from "react";
import { Row } from "reactstrap";
import { ApplicantPieChart } from "../../../components/charts/company/applicant-pipeline-chart";
import { ApplicantsPerRecruiterChart } from "../../../components/charts/company/applicants-per-recruiter-chart";
import { TotalApplicantBarChart } from "../../../components/charts/company/total-applicants-bar-chart";
import FullLayout from "../../../components/dashboard/layouts/layout/full-layout";
import PageLayout from "../../../components/layouts/page/page-layout";
import { ChartWrapper } from "../../../components/charts/chart-wrapper";
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
					job?.status === Status.ACTIVE && new Date(job?.expiry_date) >= todayDate
			);
			setJobs(j);
		}
	}, [company?.id]);

	return (
		<PageLayout title="COMPANY_PROFILE_DASHBOARD">
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
						<Row className="my_chart">
							<ChartWrapper title="STATS" md="12" lg="12">
								<DashboardStats />
							</ChartWrapper>

							<ChartWrapper title="APPLICATION_STATUS" md="6" lg="6">
								<ApplicantPieChart />
							</ChartWrapper>

							<ChartWrapper
								title="SOURCE_BREAKDOWN"
								md="6"
								className="p-0"
								titleClassName="text-center justify-content-center"
							>
								<SourceBreakdownChart />
							</ChartWrapper>

							<ChartWrapper
								title="HISTORICAL_RANGE"
								md="6"
								className="p-0"
								titleClassName="text-left justify-content-start ml-4"
							>
								<TotalApplicantBarChart />
							</ChartWrapper>

							<ChartWrapper title="LEAD_ASSIGNMENT" md="6" lg="6">
								<ApplicantsPerRecruiterChart />
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
