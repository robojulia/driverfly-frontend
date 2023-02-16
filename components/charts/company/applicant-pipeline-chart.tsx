import { useContext } from "react";
import { ApplicantApi } from "../../../pages/api/applicant";
import { PieChart } from "../pie-chart";
import DashboardChartContext from "../../../context/dashboard-chart-context";

export function ApplicantPieChart() {
  const {state} = useContext(DashboardChartContext);
  const fetchData = async () => {

    let leads = 0;
    let inProcess = 0;
    let hired = 0;
    state?.data.forEach((v) => {
      v.jobs.forEach((j) => {
        if (!j.status) return;
        if (j.status.startsWith("NEW_")) leads++;
        else if (j.status.startsWith("IN_PROCESS_")) inProcess++;
        else if (j.status.startsWith("COMPLETED_")) hired++;
      });
    });
    return [leads, inProcess, hired];
  };

  const labels = ["LEADS", "IN_PROCESS", "HIRED"].map(
    (v) => `ApplicantPipelineChartLabel.${v}`
  );

  return (
     <PieChart title="APPLICANTS" labels={labels} fetchData={fetchData}  deps={[state]} />
  );
}
