import moment from "moment";
import { useContext, useMemo } from "react";
import { Card, Col, Row } from "react-bootstrap";
import DashboardChartContext from "../../context/dashboard-chart-context";
import { useTranslation } from "../../hooks/use-translation";
import { EmployeeStatus } from "../../enums/applicants/employee-status.enum";
import newApplicantIcon from "../../public/img/new_appicants_this_week.svg";
import totalHiresIcon from "../../public/img/total_hires_this_month.svg";
import totalEmployeesIcon from "../../public/img/total_employees.svg";
import Image from "next/image";

export const DashboardStats = () => {
  const { state } = useContext(DashboardChartContext);
  const { t } = useTranslation();
  const statsIcon = [newApplicantIcon, totalHiresIcon, totalEmployeesIcon];

//   this is temporary check, it will bre removed after actual calculations
  const tempCheck = 30

  const fetchData = () => {
    const applicants = state?.applicants || [];
    const employees = state?.employees || [];
    const jobs = state?.jobs || [];
    const today = new Date();
    const currentWeek = moment().isoWeek();

    const stats: {
      NEW_LEADS?: number;
      TOTAL_LEADS?: number;
      TOTAL_ACTIVE_EMPLOYEE?: JSX.Element;
      EMPLOYEE_BIRTHDAYS?: number;
      ACTIVE_JOB_POSTS?: JSX.Element;
      CONVERSION_RATE?: string;
    } = applicants?.reduce(
      (acc, a) => {
        if (a?.current_application_status?.startsWith("NEW_")) {
          acc.TOTAL_LEADS++;
          if (moment(a?.created_at).isoWeek() === currentWeek) {
            acc.NEW_LEADS++;
          }
        }
        return acc;
      },
      {
        NEW_LEADS: 0,
        TOTAL_LEADS: 0,
        TOTAL_ACTIVE_EMPLOYEE: (
          <>
            {
              employees?.filter((v) => v?.status === EmployeeStatus.ACTIVE)
                ?.length
            }
          </>
          // <Link href={`/dashboard/company/jobs`}>
          // 	<a className="text-dark text-decoration-none">
          // 		{
          // 			employees?.filter((v) => v?.status === EmployeeStatus.ACTIVE)
          // 				?.length
          // 		}
          // 	</a>
          // </Link>
        ),
        EMPLOYEE_BIRTHDAYS: 0,
        ACTIVE_JOB_POSTS: (
          <>{jobs?.length}</>
          // <Link href={`/dashboard/company/jobs`}>
          // 	<a className="text-dark text-decoration-none">{jobs?.length}</a>
          // </Link>
        ),
        CONVERSION_RATE: "0%",
      }
    );

    employees?.forEach((a) => {
      const birthdate: Date = new Date(a.birthdate);
      let bday: Date = new Date(
        today.getFullYear(),
        birthdate.getMonth(),
        birthdate.getDate()
      );
      if (today.getTime() > bday.getTime())
        bday.setFullYear(bday.getFullYear() + 1);

      const diff: number = bday.getTime() - today.getTime();
      const days: number = Math.floor(diff / (1000 * 60 * 60 * 24));

      if (days <= 7) stats.EMPLOYEE_BIRTHDAYS++;
    });

    const conversionRate =
      (applicants?.filter((a) => Boolean(a?.is_hired))?.length /
        applicants?.length) *
      100;
    stats.CONVERSION_RATE = conversionRate
      ? Number(conversionRate?.toFixed(2)) + "%"
      : "-";

    return stats;
  };

  const data = useMemo(() => {
    return fetchData();
  }, [state]);

  return (
    // <Card className={`rounded-lg stats_card w-100 mt-3`}>
    // 	<Card.Body>
    // 		{Object.entries(data).map(([key, value]) => (
    // 			<Row key={key} className={`mb-2`}>
    // 				<Col xs="3" className={`justify-content-end text-end fw-bold `}>
    // 					{value} :
    // 				</Col>
    // 				<Col xs="9" className={`justify-content-start `}>
    // 					<h6 className={`fw-normal text-left">{t(key)}</h`}>
    // 				</Col>
    // 			</Row>
    // 		))}
    // 	</Card.Body>
    // </Card>
    <div
      className={`py-3 container-fluid`}
      // style={{
      // 	background: "linear-gradient(to bottom right, #1b4454ba, #2ec8c4)",
      // }}
    >
      <Row
        className=" my-2 py-2 company_dashobard"
        style={{ borderRadius: "30px", background: "#FFFFFF" }}
      >
        {Object?.entries(data)
          ?.slice(0, 3)
          ?.map(([key, value], index) => (
            <Col key={key} xl={4} lg={6} md={6} className="m-0 dashboard_items">
              {/* <div className={`card mb-4 mb-xl-0`}> */}
              <div className={`card-body`}>
                <Row className="d-flex align-items-center">
                  <Col lg={3}>
                    <Image src={statsIcon[index]} alt={statsIcon[index]} />
                  </Col>
                  <Col
                    lg={9}
                    className="d-flex flex-column align-items-start justify-content-start"
                  >
                    <h5 className={`card-title  text-muted mb-0`}>{t(key)}</h5>
                    <span className={`h2 font-weight-bold mb-0`}>{value}</span>
                    
					          <p className={`mt-0 mb-0 text-muted`}>
                      <span className={`${tempCheck > 60 ? 'text-success' : 'text-danger' }  mr-2 text-lg font-weight-bold`}>
                        <i className={` ${tempCheck > 60 ? 'fa fa-arrow-up' : 'fa fa-arrow-down' } mr-1`} aria-hidden="true"></i>
                        3.48%
                      </span>
                      <span className={`text-black`}>this month</span>
                    </p>
                  </Col>
				  
                  {/* <Col className={`col-auto`}>
										<div
											className={`icon icon-shape bg-danger text-white rounded-circle shadow`}
										>
											<i className={`fas fa-chart-bar`}></i>
										</div>
									</Col> */}
                </Row>
              </div>
              {/* </div> */}
            </Col>
          ))}
      </Row>

      <Row className=" my-2 ">
        {Object?.entries(data)
          ?.slice(3)
          ?.map(([key, value]) => (
            <Col key={key} xl={4} lg={6} md={6} className="my-2 dashboard_items">
              {/* <div className={`card mb-4 mb-xl-0`}> */}
              <div className={`card-body`}>
                <Row className="d-flex align-items-start ">
                  <Col lg={3}></Col>
                  <Col
                    lg={9}
                    className="d-flex flex-column align-items-start justify-content-start"
                  >
                    <h5 className={`card-title  text-muted mb-0`}>{t(key)}</h5>
                    <span className={`h2 font-weight-bold mb-0`}>{value}</span>

                    {/* <p className={`mt-3 mb-0 text-muted text-sm`}>
                  <span className={`text-success mr-2`}>
                    <i className={`fa fa-arrow-up`}></i> 3.48%
                  </span>
                  <span className={`text-nowrap`}>Since last month</span>
                </p> */}
                  </Col>
                  {/* <Col className={`col-auto`}>
										<div
											className={`icon icon-shape bg-danger text-white rounded-circle shadow`}
										>
											<i className={`fas fa-chart-bar`}></i>
										</div>
									</Col> */}
                </Row>
              </div>
              {/* </div> */}
            </Col>
          ))}
      </Row>
    </div>
  );
};
