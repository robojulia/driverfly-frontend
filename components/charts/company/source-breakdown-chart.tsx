import { Col } from "react-bootstrap";
import { ApplicantApi } from "../../../pages/api/applicant";
import { PieChart } from "../pie-chart";

export function SourceBreakdownChart() {
 
  const fetchData = async () => {
    const api = new ApplicantApi();
    const applicants = await api.list();
    let dha = 0;
    let user = 0;
    let company = 0;
    applicants.forEach((a)=>{
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
     <PieChart title="APPLICANTS" labels={labels} fetchData={fetchData} />
  );
}
