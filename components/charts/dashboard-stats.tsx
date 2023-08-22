import moment from "moment";
import { useContext, useMemo } from "react";
import { Card, Col, Row } from "react-bootstrap";
import DashboardChartContext from "../../context/dashboard-chart-context";
import { useTranslation } from "../../hooks/use-translation";
export const DashboardStast = () => {
	const { state } = useContext(DashboardChartContext);
	const { t } = useTranslation();

	const fetchData = () => {
		const applicants = state?.data || [];
		const employee = state?.employee || [];
		const jobs = state?.jobs || [];

		const today = new Date();
		const currentWeek = moment().isoWeek();

		const stats = applicants?.reduce(
			(acc, a) => {
				if (moment(a?.created_at).isoWeek() === currentWeek) {
					console.log("askdkjsadl", a)
					acc.NEW_LEADS++;
				}
				acc.TOTAL_LEADS++;
				return acc;
			},
			{
				NEW_LEADS: 0,
				TOTAL_LEADS: 0,
				TOTAL_ACTIVE_EMPLOYEE: employee?.length,
				EMPLOYEE_BIRTHDAYS: 0,
				ACTIVE_JOB_POSTS: jobs?.length,
				CONVERSION_RATE: "0%",
			}
		);

		employee.forEach((a) => {
			const birthdate = new Date(a.birthdate);
			if (
				birthdate.getMonth() === today.getMonth() &&
				birthdate.getDate() >= today.getDate() &&
				birthdate.getDate() <= today.getDate() + (7 - today.getDay())
			) {
				stats.EMPLOYEE_BIRTHDAYS++;
			}
		});

		const conversionRate =
			(employee?.length / applicants?.length) * 100;
		stats.CONVERSION_RATE = conversionRate.toFixed(2) + "%";

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
