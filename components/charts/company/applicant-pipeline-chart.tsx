import { ApplicantApi } from "../../../pages/api/applicant";
import { PieChart } from "../pie-chart";

export function ApplicantPieChart() {
  const fetchData = async () => {
    const api = new ApplicantApi();

    let leads = 0;
    let inProcess = 0;
    let hired = 0;

    const applicants = await api.list();

    applicants.forEach((v) => {
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
     <PieChart title="APPLICANTS" labels={labels} fetchData={fetchData} />
  );
}
