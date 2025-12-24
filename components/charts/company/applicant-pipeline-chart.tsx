import { useContext, useMemo } from 'react';
import DashboardChartContext from '../../../context/dashboard-chart-context';
import { PieChart } from '../pie-chart';

export function ApplicantPieChart() {
  const { state } = useContext(DashboardChartContext);
  const fetchData = () => {
    let leads = 0;
    let inProcess = 0;
    let hired = 0;
    state?.applicants?.forEach((v) => {
      if (v) {
        if (v.current_application_status?.startsWith('NEW_')) {
          leads++;
        }
        if (v.current_application_status?.startsWith('IN_PROCESS_')) {
          inProcess++;
        }
      }
    });
    hired = state?.employees?.length;
    return [leads, inProcess, hired];
  };

  const data = useMemo(() => {
    return fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  const inProgressCount = useMemo(() => {
    return (
      state?.applicants?.filter((v) => v?.current_application_status?.startsWith('IN_PROCESS_'))
        ?.length || 0
    );
  }, [state]);

  const labels: string[] = ['LEADS', 'IN_PROCESS', 'HIRED'].map(
    (v) => `ApplicantPipelineChartLabel.${v}`
  );

  return (
    <PieChart
      title="APPLICANTS"
      labels={labels}
      data={data}
      centerValue={inProgressCount}
      centerLabel={
        <div>
          Applications in <br /> process
        </div>
      }
      emptyStateTitle="NO_APPLICATION_STATUS"
      emptyStateMessage="APPLICATION_STATUS_EMPTY_STATE_MESSAGE"
    />
  );
}
