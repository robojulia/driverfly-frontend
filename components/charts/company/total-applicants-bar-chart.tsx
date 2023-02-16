import { ApplicantApi } from "../../../pages/api/applicant";
import { BarChart } from "../bar-chart";
import { ApplicantEntity } from "../../../models/applicant/applicant.entity";
import moment from "moment";
import { useTranslation } from "../../../hooks/use-translation";

export function TotalApplicantBarChart() {
  const applicantApi = new ApplicantApi();
  const { t } = useTranslation();
  const getWeeksWithInMonth = () => {
    const startOfMonth = moment().startOf("month");
    const endOfMonth = moment().endOf("month");
    const weeks = [];
    let currentWeek = startOfMonth.clone().startOf("week");
    const endWeek = endOfMonth.clone().endOf("week");
    while (currentWeek.isSameOrBefore(endWeek)) {
      weeks.push(currentWeek.clone());
      currentWeek.add(1, "week");
    }
    return weeks;
  };
  const labels: string[] = getWeeksWithInMonth().map(el=> moment(el).format("DD-MM-YYYY"));

  const yearToShow: number = new Date().getFullYear();

  const fetchData = async () => {
    // const months = moment.months().map(v => ({ name: v.toUpperCase(), count: 0 ,hired:0 }))
    const applicants: ApplicantEntity[] = await applicantApi.list();
    const weeks = getWeeksWithInMonth();
    const applicantData = [];
      const hiredData = [];
   weeks.map((week) => {
      const weekEnd = week.clone().endOf("week");
      let count = 0;
      let hiredCount = 0;
      
      applicants.forEach((a) => {
        if (
          a.jobs.length == 0 &&
          moment(a.created_at).isSameOrAfter(week, "day") &&
          moment(a.created_at).isSameOrBefore(weekEnd, "day")
        ) {
          count++;
          return;
        }
        a.jobs.map((j) => {
          if (
            moment(j.created_at).isSameOrAfter(week, "day") &&
            moment(j.created_at).isSameOrBefore(weekEnd, "day")
          ) {
            count++;
          }
          if (j.status.startsWith("COMPLETED_")) {
            hiredCount++;
          }
        });
      });
      applicantData.push(count);
      hiredData.push(hiredCount);
    });
    console.log("data--->", applicants, applicantData,hiredData);    
    return [{
        label:t("Applicants"),
        backgroundColor: 'rgba(29, 67, 84)',
        borderColor: 'rgba(29, 67, 84)',
        data:applicantData,
        borderWidth: 1
    },{
        label: t("Hired"),
       backgroundColor: 'rgba(92, 200, 196)',
       borderColor: 'rgba(92, 200, 196)',
       data:hiredData,
        borderWidth: 1
    }];
  };

  return (
    <BarChart
      yearToShow={yearToShow}
      title="APPLICANTS"
      labels={labels}
      fetchData={fetchData}
    />
  );
}
