import moment from "moment";
import { useContext, useMemo } from "react";
import { Card, Col, Row } from "react-bootstrap";
import DashboardChartContext from "../../context/dashboard-chart-context";
import { useTranslation } from "../../hooks/use-translation";
export const DashboardStast = () => {
  const {state} = useContext(DashboardChartContext);
 
  const { t } = useTranslation();
  const getDays = (date) => {
    const createdAt = moment(date);
    const now = moment();
    var duration = moment.duration(now.diff(createdAt));
    return duration.asDays();
  };
  const fetchData =  () => {

    var stats = {
      NEW_LEADS: 0,
      TOTAL_LEADS: 0,
      TOTAL_ACTIVE_EMPLOYEE: 0,
      EMPLOYEE_BIRTHDAYS: 0,
      ACTIVE_JOB_POSTS: 0,
      CONVERSION_RATE: 0,
    };
    state?.data.forEach((a) => {
      
    if(a.jobs.length === 0){
      stats = {
        ...stats,
        TOTAL_LEADS: stats.TOTAL_LEADS + 1,
        NEW_LEADS: stats.NEW_LEADS + 1,
      };
      return;
    }
    stats = {
      ...stats,
      TOTAL_LEADS: stats.TOTAL_LEADS + a.jobs.length,
    };
      a.jobs?.map((b) => {
        if (b.created_at && getDays(b.created_at) <= 7) {
          stats = {
            ...stats,
            NEW_LEADS: stats.NEW_LEADS + 1,
          };
        }
        if (b.status === "COMPLETED_EMPLOYED") {
          stats = {
            ...stats,
            TOTAL_ACTIVE_EMPLOYEE: stats.TOTAL_ACTIVE_EMPLOYEE + 1,
          };
        }
        if (
          b.status.startsWith("ACTIVE_") &&
          (!b.job?.expiry_date ||
            moment(b.job?.expiry_date).isAfter(moment(), "day"))
        ) {
          stats = {
            ...stats,
            ACTIVE_JOB_POSTS: stats.ACTIVE_JOB_POSTS + 1,
          };
        }
      });
      const isHired = a.jobs.some((j)=> j.status === "COMPLETED_EMPLOYED");
      if (a.birthdate && getDays(a.birthdate) <= 7 && isHired) {
        stats = {
          ...stats,
          EMPLOYEE_BIRTHDAYS: stats.EMPLOYEE_BIRTHDAYS + 1,
        };
      }
    });
    const CONVERSION_RATE =
      stats.TOTAL_LEADS != 0
        ? stats.TOTAL_ACTIVE_EMPLOYEE / stats.TOTAL_LEADS
        : 0;
    stats = {
      ...stats,
      CONVERSION_RATE,
    };
    return stats;
  };



  const data = useMemo(()=>{
return fetchData()
  },[state])

  return (
    <Card className="rounded-lg h-100 stats_card mx-auto">
      <Card.Body>
        {Object.entries(data).map(([key,value]) => (
          <Row key={key}>
            <Col xs="3" className="justify-content-end text-end fw-bold ">
              {value}
            </Col>
            <Col xs="9" className="justify-content-start ">
              <h6 className="text-primary fw-normal text-left">{t(key)}</h6>
            </Col>
          </Row>
        ))}
      </Card.Body>
    </Card>
  );
};
