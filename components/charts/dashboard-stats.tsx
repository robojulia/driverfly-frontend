import React, { useState } from "react";
import { Card, Row, Col } from "react-bootstrap";
import ApplicantApi from "../../pages/api/applicant";
import { useEffectAsync } from "../../utils/react";
import moment from "moment";
import { useTranslation } from "../../hooks/use-translation";
export const DashboardStast = () => {
  const [data,setData] = useState({});
  const DATA = [
    {
      value: 6,
      text: "Active Job Posts",
    },
    {
      value: 28,
      text: "New Leads this week",
    },
    {
      value: 8,
      text: "New Hires this week",
    },
    {
      value: "23%",
      text: "Conversion rate (lead to hire)",
    },
    {
      value: "30,9000",
      text: "Total leads",
    },
    {
      value: 10,
      text: "Total Active Employee",
    },
    {
      value: 3,
      text: "Employee birthday this week",
    },
  ];
  const { t } = useTranslation();
  const getDays = (date) => {
    const createdAt = moment(date);
    const now = moment();
    var duration = moment.duration(now.diff(createdAt));
    return duration.asDays();
  };
  const fetchData = async (): Promise<Record<string, number>> => {
    const api = new ApplicantApi();
    const applicants = await api.list();

    var stats = {
      NEW_LEADS: 0,
      TOTAL_LEADS: 0,
      TOTAL_ACTIVE_EMPLOYEE: 0,
      EMPLOYEE_BIRTHDAYS: 0,
      ACTIVE_JOB_POSTS: 0,
      CONVERSION_RATE: 0,
    };
    applicants.forEach((a) => {
      
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
    console.log("jobs------>",stats);
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
    console.log("jobs------> all",stats)
    return stats;
  };

  const refreshData = async () => {
    setData({});
    const data = await fetchData();
    setData(data);
  };

  useEffectAsync(refreshData, []);

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
