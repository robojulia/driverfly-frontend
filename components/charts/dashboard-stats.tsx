import moment from "moment";
import { useContext, useMemo } from "react";
import { Card, Col, Row } from "react-bootstrap";
import DashboardChartContext from "../../context/dashboard-chart-context";
import { useTranslation } from "../../hooks/use-translation";
export const DashboardStast = () => {
	const { state } = useContext(DashboardChartContext);
	console.log("skdklaskldsa", state.employee.length)
	const { t } = useTranslation();
	const getDays = (date) => {
		const createdAt = moment(date);
		const now = moment();
		var duration = moment.duration(now.diff(createdAt));
		return duration.asDays();
	};
	const fetchData = () => {

		var stats = {
			NEW_LEADS: 0,
			TOTAL_LEADS: 0,
			TOTAL_ACTIVE_EMPLOYEE: 0,
			EMPLOYEE_BIRTHDAYS: 0,
			ACTIVE_JOB_POSTS: 0,
			CONVERSION_RATE: "0%",
		};
		if (state.employee) {
			stats = {
				...stats,
				TOTAL_ACTIVE_EMPLOYEE: state.employee.length
			}
		}

		if (state?.jobs) {
			stats = {
				...stats,
				ACTIVE_JOB_POSTS: state?.jobs?.length
			}
		}

		state?.employee.forEach((a) => {
			const d = new Date(a.birthdate);
			let today = new Date();
			const weekdays = 7;
			let weekdaysleft = weekdays - today.getDay();
			weekdaysleft = today.getDate() + weekdaysleft;
			if (d.getMonth() === today.getMonth()) {
				if (d.getDate() >= today.getDate() && d.getDate() <= weekdaysleft) {
					stats = {
						...stats,
						EMPLOYEE_BIRTHDAYS: stats.EMPLOYEE_BIRTHDAYS + 1,
					};
				}
			}
		})

		stats = {
			...stats,
			TOTAL_LEADS: state.data.length + state.employee.length
		}

		stats = {
			...stats,
			NEW_LEADS: (state.data.filter(a => moment(a.created_at).isoWeek() === moment().isoWeek())).length
		}

		// const CONVERSION_RATE =
		// 	stats.TOTAL_LEADS != 0
		// 		? stats.TOTAL_ACTIVE_EMPLOYEE / stats.TOTAL_LEADS
		// 		: 0;
		// stats = {
		// 	...stats,
		// 	CONVERSION_RATE: `${(CONVERSION_RATE * 100).toFixed(2)}%`
		// };
		return stats;
	};

	const data = useMemo(() => {
		return fetchData()
	}, [state])

	return (
		<Card className="rounded-lg stats_card w-100 mt-3">
			<Card.Body>
				{Object.entries(data).map(([key, value]) => (
					<Row key={key} className="mb-2">
						<Col xs="3" className="justify-content-end text-end fw-bold ">
							{value} :
						</Col>
						<Col xs="9" className="justify-content-start ">
							<h6 className="fw-normal text-left">{t(key)}</h6>
						</Col>
					</Row>
				))}
			</Card.Body>
		</Card>
	);
};
