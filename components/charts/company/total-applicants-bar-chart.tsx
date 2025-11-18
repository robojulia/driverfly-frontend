import moment from "moment";
import { useContext, useMemo } from "react";
import DashboardChartContext from "../../../context/dashboard-chart-context";
import { useTranslation } from "../../../hooks/use-translation";
import { BarChart } from "../bar-chart";

export function TotalApplicantBarChart() {
  const { state } = useContext(DashboardChartContext);
  const { t } = useTranslation();
  const yearToShow: number = new Date().getFullYear();

  const getMonthsInYear = () => {
    const startOfYear = moment().startOf("year");
    const endOfYear = moment().endOf("year");
    const months = [];
    let currentMonth = startOfYear.clone().startOf("month");

    while (currentMonth.isSameOrBefore(endOfYear)) {
      months.push(currentMonth.clone());
      currentMonth.add(1, "month");
    }
    return months;
  };

  const labels: string[] = getMonthsInYear().map((month) =>
    month.format("MMMM")
  );

  const isMonthData = ({
    created_at,
    monthStart,
    monthEnd,
  }: {
    created_at: string | Date;
    monthStart: string;
    monthEnd: string;
  }) => {
    return (
      moment(created_at).isSameOrAfter(monthStart, "month") &&
      moment(created_at).isSameOrBefore(monthEnd, "month")
    );
  };

  const fetchData = () => {
    const months = getMonthsInYear();
    const applicantData = [];
    const hiredData = [];

    months.forEach((month) => {
      const monthStart = month.clone().startOf(`${month}`).format("YYYY-MM-DD");
      const monthEnd = month.clone().endOf(`${month}`).format("YYYY-MM-DD");

      let applicantCount = 0;
      let hiredCount = 0;

      state?.applicants?.forEach((applicant) => {
        if (
          isMonthData({
            created_at: applicant.created_at,
            monthStart,
            monthEnd,
          })
        ) {
          applicantCount++;
        }
      });

      state?.employees?.forEach((employee) => {
        if (
          isMonthData({ created_at: employee.hire_date, monthStart, monthEnd })
        ) {
          hiredCount++;
        }
      });

      applicantData.push(applicantCount);
      hiredData.push(hiredCount);
    });

    return [
      {
        label: t("Applicants"),
        backgroundColor: "#30c6c2",
        borderColor: "transparent",
        data: applicantData,
        borderWidth: 1,
        borderRadius: 10,
      },
      {
        label: t("EMPLOYEE"),
        backgroundColor: "#1d4355",
        borderColor: "transparent",
        data: hiredData,
        borderWidth: 1,
        borderRadius: 10,
      },
    ];
  };

  const data = useMemo(() => {
    return fetchData();
  }, [state]);

  return (
    <BarChart
      yearToShow={yearToShow}
      title="APPLICANTS"
      labels={labels}
      data={data}
      emptyStateTitle="NO_HISTORICAL_DATA"
      emptyStateMessage="HISTORICAL_DATA_EMPTY_STATE_MESSAGE"
    />
  );
}
