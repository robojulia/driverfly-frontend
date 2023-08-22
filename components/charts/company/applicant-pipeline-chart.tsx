import { useContext, useMemo } from "react";
import DashboardChartContext from "../../../context/dashboard-chart-context";
import { PieChart } from "../pie-chart";

export function ApplicantPieChart() {
  const { state } = useContext(DashboardChartContext);
  const fetchData = () => {
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
console.log("This is data getting from api : ",state)



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
