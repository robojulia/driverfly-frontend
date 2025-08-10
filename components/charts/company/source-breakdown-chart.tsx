import { useContext, useMemo } from 'react';
import DashboardChartContext from '../../../context/dashboard-chart-context';
import { PieChart } from '../pie-chart';
import { ApplicantType } from '../../../enums/applicants/applicant-type.enum';

export function SourceBreakdownChart() {
  const { state } = useContext(DashboardChartContext);
  const fetchData = () => {
    let dha = 0;
    let user = 0;
    let company = 0;
    let jobApply = 0;
    state.applicants.forEach((a) => {
      if (!a?.is_hired) {
        ({
          [ApplicantType.DHA]: () => dha++,
          [ApplicantType.USER]: () => user++,
          [ApplicantType.COMPANY]: () => company++,
          [ApplicantType.DIRECT_JOB_APPLY]: () => jobApply++,
          [ApplicantType.AUTO_RECRUIT]: () => null,
        })[a.type]();
      }
    });
    return [dha, user, company, jobApply];
  };

  const data = useMemo(() => {
    return fetchData();
  }, [state]);

  const labels = ['DIGITAL_HIRING_APP', 'DRIVERFLY', 'UPLOADED', 'DIRECT_JOB_APPLY'].map(
    (v) => `SourceBreakdownChartLabel.${v}`
  );

  return (
    <PieChart
      title="APPLICANTS"
      labels={labels}
      data={data}
      emptyStateTitle="NO_APPLICANT_SOURCES"
      emptyStateMessage="APPLICANT_SOURCE_EMPTY_STATE_MESSAGE"
    />
  );
}
