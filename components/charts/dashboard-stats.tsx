import moment from "moment";
import Image from "next/image";
import Link from "next/link";
import { useContext, useMemo } from "react";

import DashboardChartContext from "../../context/dashboard-chart-context";
import { EmployeeStatus } from "../../enums/applicants/employee-status.enum";
import { useTranslation } from "../../hooks/use-translation";
import { EmployeeEntity } from "../../models/employee/employee.entity";
import newApplicantIcon from "../../public/img/new_appicants_this_week.svg";
import totalEmployeesIcon from "../../public/img/total_employees.svg";
import totalHiresIcon from "../../public/img/total_hires_this_month.svg";
import { isBirthdayThisWeek } from "../../utils/date";

import styles from "./dashboard-stats.module.css";

type StatCard = {
  title: string;
  value: string | number;
  icon?: any;
  link: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
};

export const DashboardStats = () => {
  const { state } = useContext(DashboardChartContext);
  const { t } = useTranslation();

  const calculateStats = () => {
    const applicants = state?.applicants || [];
    const employees = state?.employees || [];
    const jobs = state?.jobs || [];
    const today = new Date();
    const currentWeek = moment().isoWeek();

    let newLeads = 0;
    let totalLeads = 0;
    let birthdaysThisWeek = 0;
    let birthdayEmployees: EmployeeEntity[] = [];

    // Calculate applicant stats
    applicants.forEach((a) => {
      if (!a.is_hired && a?.current_application_status?.startsWith("NEW_")) {
        totalLeads++;
        if (moment(a?.created_at).isoWeek() === currentWeek) {
          newLeads++;
        }
      }
    });

    // Calculate employee birthdays
    employees.forEach((employee) => {
      const birthdate = new Date(employee.birthdate);
      if (isBirthdayThisWeek(birthdate)) {
        birthdaysThisWeek++;
        birthdayEmployees.push(employee);
      }
    });

    // Calculate conversion rate
    const conversionRate = applicants.length
      ? (
          (applicants.filter((a) => Boolean(a?.is_hired))?.length /
            applicants.length) *
          100
        ).toFixed(1)
      : 0;

    const stats: StatCard[] = [
      {
        title: t("NEW_LEADS"),
        value: newLeads,
        icon: newApplicantIcon,
        link: "/dashboard/company/applicants",
        /*
        trend: {
          value: 0, // This should be calculated based on previous week
          isPositive: true,
        },
        */
      },
      {
        title: t("TOTAL_LEADS"),
        value: totalLeads,
        icon: totalHiresIcon,
        link: "/dashboard/company/applicants",
      },
      {
        title: t("TOTAL_ACTIVE_EMPLOYEES"),
        value: employees.filter((v) => v?.status === EmployeeStatus.ACTIVE)
          .length,
        icon: totalEmployeesIcon,
        link: "/dashboard/company/compliance/employee-directory",
      },
      {
        title: t("EMPLOYEE_BIRTHDAYS"),
        value: birthdaysThisWeek,
        link: "/dashboard/company/compliance/employee-directory",
        /*
        trend: birthdayEmployees.length
          ? {
              value: birthdayEmployees.length,
              isPositive: true,
            }
          : undefined,
        */
      },
      {
        title: t("ACTIVE_JOB_POSTS"),
        value: jobs.length,
        link: "/dashboard/company/jobs",
      },
      {
        title: t("CONVERSION_RATE"),
        value: `${conversionRate}%`,
        link: "/dashboard/company/applicants",
        /*
        trend: {
          value: Number(conversionRate),
          isPositive: Number(conversionRate) > 50,
        },
        */
      },
    ];

    return stats;
  };

  const stats = useMemo(() => calculateStats(), [state]);

  return (
    <div className={styles.dashboard_stats}>
      <div className={styles.stats_grid}>
        {stats.map((stat, index) => (
          <Link href={stat.link} key={index}>
            <div className={styles.stat_card}>
              <div className={styles.stat_card_content}>
                {stat.icon && (
                  <div className={styles.stat_icon}>
                    <Image
                      src={stat.icon}
                      alt={stat.title}
                      width={32}
                      height={32}
                    />
                  </div>
                )}
                <div className={styles.stat_info}>
                  <h3 className={styles.stat_title}>{stat.title}</h3>
                  <div className={styles.stat_value_container}>
                    <span className={styles.stat_value}>{stat.value}</span>
                    {stat.trend && (
                      <span
                        className={`${styles.stat_trend} ${
                          stat.trend.isPositive
                            ? styles.positive
                            : styles.negative
                        }`}
                      >
                        {stat.trend.isPositive ? "↑" : "↓"} {stat.trend.value}%
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
