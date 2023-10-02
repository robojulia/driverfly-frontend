import moment from "moment";
import { useContext, useMemo } from "react";
import DashboardChartContext from "../../../context/dashboard-chart-context";
import { useTranslation } from "../../../hooks/use-translation";
import { BarChart } from "../bar-chart";

export function TotalApplicantBarChart() {
	const { state } = useContext(DashboardChartContext);
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

	const labels: string[] = getWeeksWithInMonth().map((el) =>
		moment(el).format("DD-MM-YYYY")
	);

	const yearToShow: number = new Date().getFullYear();

	const isWeekData = ({
		created_at,
		week,
		weekEnd,
	}: {
		created_at: string | Date;
		week: string;
		weekEnd: string;
	}) => {
		return (
			moment(created_at).isSameOrAfter(week, "day") &&
			moment(created_at).isSameOrBefore(weekEnd, "day")
		);
	};

	const fetchData = () => {
		const weeks = getWeeksWithInMonth();
		const applicantData = [];
		const hiredData = [];

		weeks.forEach((week) => {
			const weekEnd = week.clone().endOf("week");
			let applicantCount = 0;
			let hiredCount = 0;

			state?.applicants?.forEach(applicant => {
				if (isWeekData({ created_at: applicant.created_at, week, weekEnd })) {
					applicantCount++;
				}
			})

			state?.employees?.forEach(employee => {
				if (isWeekData({ created_at: employee.hire_date, week, weekEnd })) {
					hiredCount++;
				}
			})

			applicantData.push(applicantCount);
			hiredData.push(hiredCount);
		});

		return [
			{
				label: t("Applicants"),
				backgroundColor: "rgba(29, 67, 84)",
				borderColor: "rgba(29, 67, 84)",
				data: applicantData,
				borderWidth: 1,
			},
			{
				label: t("Hired"),
				backgroundColor: "rgba(92, 200, 196)",
				borderColor: "rgba(92, 200, 196)",
				data: hiredData,
				borderWidth: 1,
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
		/>
	);
}
