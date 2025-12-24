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
    let autoRecruit = 0;
    state.applicants.forEach((a) => {
      // DRIV-144 - Count all applicants regardless of hired status
      ({
        [ApplicantType.DHA]: () => dha++,
        [ApplicantType.USER]: () => user++,
        [ApplicantType.COMPANY]: () => company++,
        [ApplicantType.DIRECT_JOB_APPLY]: () => jobApply++,
        [ApplicantType.AUTO_RECRUIT]: () => autoRecruit++,
      })[a.type]();
    });
    return [dha, user, company, jobApply, autoRecruit];
  };

  const data = useMemo(() => {
    return fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  const totalApplicants = useMemo(() => {
    // DRIV-144 - Count all applicants without filtering hired ones
    return state?.applicants?.length || 0;
  }, [state]);

  const labels = [
    'DIGITAL_HIRING_APP',
    'DRIVERFLY',
    'UPLOADED',
    'DIRECT_JOB_APPLY',
    'AUTO_RECRUIT',
  ].map((v) => `SourceBreakdownChartLabel.${v}`);

  return (
    <PieChart
      title="APPLICANTS"
      labels={labels}
      data={data}
      centerValue={totalApplicants}
      centerLabel="Total Applicants"
      emptyStateTitle="NO_APPLICANT_SOURCES"
      emptyStateMessage="APPLICANT_SOURCE_EMPTY_STATE_MESSAGE"
    />
  );
}
