import { useContext, useMemo } from "react";
import DashboardChartContext from "../../../context/dashboard-chart-context";
import { PieChart } from "../pie-chart";

export function SourceBreakdownChart() {
  const { state } = useContext(DashboardChartContext);
  const fetchData = () => {
    let dha = 0;
    let user = 0;
    let company = 0;
    state.data.forEach((a) => {
      if (a.type === "DHA") dha++;
      if (a.type === "USER") user++;
      company++;
    });
    return [dha, user, company];
  };

  const data = useMemo(() => {
    return fetchData();
  }, [state]);
  
  const labels = ["DIGITAL_HIRING_APP", "DRIVERFLY", "UPLOADED"].map(
    (v) => `SourceBreakdownChartLabel.${v}`
  );

  return <PieChart title="APPLICANTS" labels={labels} data={data} />;
}
