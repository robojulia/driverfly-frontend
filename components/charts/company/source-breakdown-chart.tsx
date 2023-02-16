import { Col } from "react-bootstrap";
import { ApplicantApi } from "../../../pages/api/applicant";
import { PieChart } from "../pie-chart";
import DashboardChartContext from "../../../context/dashboard-chart-context";
import { useContext } from "react";

export function SourceBreakdownChart() {
  const {state} = useContext(DashboardChartContext);
  const fetchData = async () => {
  
    let dha = 0;
    let user = 0;
    let company = 0;
    state.data.forEach((a)=>{
      if(a.type === "DHA") dha++
      if(a.type === "USER") user ++
      company++;
    })
    return [dha,user,company];
  };

  const labels = ["DIGITAL_HIRING_APP", "DRIVERFLY", "UPLOADED"].map(
    (v) => `SourceBreakdownChartLabel.${v}`
  );

  return (
     <PieChart title="APPLICANTS" labels={labels} fetchData={fetchData}  deps={[state]} />
  );
}
