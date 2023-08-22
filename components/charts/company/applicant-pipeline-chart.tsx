import { useContext, useMemo } from "react";
import DashboardChartContext from "../../../context/dashboard-chart-context";
import { PieChart } from "../pie-chart";
import { ApplicantStatus } from "../../../enums/applicants/applicant-status.enum";
import { Status } from "../../../enums/status.enum";
import { EmployeeStatus } from "../../../enums/applicants/employee-status.enum";

export function ApplicantPieChart() {
  const { state } = useContext(DashboardChartContext);
  const fetchData = () => {
    let leads = 0;
    let inProcess = 0;
    let hired = 0;
    state?.data.forEach((v) => {
      if (v) {
        if (v.current_application_status?.startsWith("NEW_")) {
          leads++
        }
        if (v.current_application_status?.startsWith("IN_PROCESS_")) {
          inProcess++
        }
      }
    });
    state?.employee?.forEach(e => {
      if (e) {
        if (e.status === EmployeeStatus.ACTIVE) hired++
      }
    })
    return [leads, inProcess, hired];
  };

  const data = useMemo(() => {
    return fetchData();
  }, [state]);

  const labels = ["LEADS", "IN_PROCESS", "HIRED"].map(
    (v) => `ApplicantPipelineChartLabel.${v}`
  );

  return (
    <PieChart
      title="APPLICANTS"
      labels={labels}
      data={data}
    />
  );
}
