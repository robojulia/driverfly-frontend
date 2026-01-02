import moment from "moment";
import { useContext, useMemo, useCallback } from "react";
import DashboardChartContext from "../../../context/dashboard-chart-context";
import { useTranslation } from "../../../hooks/use-translation";
import { BarChart } from "../bar-chart";
import { ApplicantEntity } from "../../../models/applicant";
import { EmployeeEntity } from "../../../models/employee/employee.entity";
import { TimePeriod } from "./historical-range-filters";

export function TotalApplicantBarChart() {
  const { state, historicalFilters } = useContext(DashboardChartContext);
  const { t } = useTranslation();
  const yearToShow: number = new Date().getFullYear();
  const timePeriod: TimePeriod = historicalFilters?.timePeriod || 'month';

  const periods = useMemo(() => {
    switch (timePeriod) {
      case 'day': {
        // Last 30 days
        const days = [];
        for (let i = 29; i >= 0; i--) {
          days.push(moment().subtract(i, 'days').startOf('day'));
        }
        return days;
      }
      case 'week': {
        // Last 12 weeks
        const weeks = [];
        for (let i = 11; i >= 0; i--) {
          weeks.push(moment().subtract(i, 'weeks').startOf('week'));
        }
        return weeks;
      }
      case 'month': {
        // Months in current year
        const startOfYear = moment().startOf("year");
        const endOfYear = moment().endOf("year");
        const months = [];
        let currentMonth = startOfYear.clone().startOf("month");

        while (currentMonth.isSameOrBefore(endOfYear)) {
          months.push(currentMonth.clone());
          currentMonth.add(1, "month");
        }
        return months;
      }
      case 'quarter': {
        // Last 8 quarters
        const quarters = [];
        for (let i = 7; i >= 0; i--) {
          quarters.push(moment().subtract(i, 'quarters').startOf('quarter'));
        }
        return quarters;
      }
      case 'year': {
        // Last 5 years
        const years = [];
        for (let i = 4; i >= 0; i--) {
          years.push(moment().subtract(i, 'years').startOf('year'));
        }
        return years;
      }
      default:
        return [];
    }
  }, [timePeriod]);

  const labels: string[] = useMemo(() => {
    switch (timePeriod) {
      case 'day':
        return periods.map((day) => day.format("MMM D"));
      case 'week':
        return periods.map((week) => week.format("MMM D"));
      case 'month':
        return periods.map((month) => month.format("MMMM"));
      case 'quarter':
        return periods.map((quarter) => `Q${quarter.quarter()} ${quarter.format("YYYY")}`);
      case 'year':
        return periods.map((year) => year.format("YYYY"));
      default:
        return [];
    }
  }, [periods, timePeriod]);

  const isPeriodData = ({
    created_at,
    periodStart,
    periodEnd,
  }: {
    created_at: string | Date;
    periodStart: moment.Moment;
    periodEnd: moment.Moment;
  }) => {
    if (!created_at) return false;
    const date = moment(created_at);
    if (!date.isValid()) return false;
    return (
      date.isSameOrAfter(periodStart) &&
      date.isSameOrBefore(periodEnd)
    );
  };

  const applicantMatchesFilter = useCallback((applicant: ApplicantEntity): boolean => {
    // If no filters are applied, include all applicants
    if (!historicalFilters) return true;

    const { ownerOperator, recruiterIds, states, sourceTypes, statuses } = historicalFilters;

    // Owner Operator filter
    if (ownerOperator !== 'all') {
      if (ownerOperator === 'owner' && !applicant.is_owner_operator) {
        return false;
      }
      if (ownerOperator === 'non-owner' && applicant.is_owner_operator) {
        return false;
      }
    }

    // Recruiter filter
    if (recruiterIds && recruiterIds.length > 0) {
      if (!applicant.assignedUser || !recruiterIds.includes(applicant.assignedUser.id)) {
        return false;
      }
    }

    // States filter
    if (states && states.length > 0) {
      if (!applicant.state || !states.includes(applicant.state)) {
        return false;
      }
    }

    // Source Type filter (using applicant.type which is the lead type)
    if (sourceTypes && sourceTypes.length > 0) {
      if (!applicant.type || !sourceTypes.includes(applicant.type)) {
        return false;
      }
    }

    // Status filter
    if (statuses && statuses.length > 0) {
      if (!applicant.current_application_status || !statuses.includes(applicant.current_application_status)) {
        return false;
      }
    }

    return true;
  }, [historicalFilters]);

  const employeeMatchesFilter = useCallback((employee: EmployeeEntity): boolean => {
    // If no filters are applied, include all employees
    if (!historicalFilters) return true;

    const { ownerOperator, recruiterIds, states, sourceTypes, statuses } = historicalFilters;

    // For employees, we need to check their applicant data if available
    const applicant = employee.applicant;

    // Owner Operator filter
    if (ownerOperator !== 'all') {
      const isOwnerOperator = applicant?.is_owner_operator || employee.is_owner_operator;
      if (ownerOperator === 'owner' && !isOwnerOperator) {
        return false;
      }
      if (ownerOperator === 'non-owner' && isOwnerOperator) {
        return false;
      }
    }

    // Recruiter filter - check if the original applicant was assigned to this recruiter
    if (recruiterIds && recruiterIds.length > 0) {
      if (!applicant?.assignedUser || !recruiterIds.includes(applicant.assignedUser.id)) {
        return false;
      }
    }

    // States filter
    if (states && states.length > 0) {
      const employeeState = applicant?.state || employee.state;
      if (!employeeState || !states.includes(employeeState)) {
        return false;
      }
    }

    // Source Type filter (using applicant.type which is the lead type)
    if (sourceTypes && sourceTypes.length > 0) {
      if (!applicant?.type || !sourceTypes.includes(applicant.type)) {
        return false;
      }
    }

    // Status filter - check the original applicant's status
    if (statuses && statuses.length > 0) {
      if (!applicant?.current_application_status || !statuses.includes(applicant.current_application_status)) {
        return false;
      }
    }

    return true;
  }, [historicalFilters]);

  const data = useMemo(() => {
    const applicantData = [];
    const hiredData = [];

    periods.forEach((period) => {
      let periodEnd: moment.Moment;

      switch (timePeriod) {
        case 'day':
          periodEnd = period.clone().endOf('day');
          break;
        case 'week':
          periodEnd = period.clone().endOf('week');
          break;
        case 'month':
          periodEnd = period.clone().endOf('month');
          break;
        case 'quarter':
          periodEnd = period.clone().endOf('quarter');
          break;
        case 'year':
          periodEnd = period.clone().endOf('year');
          break;
        default:
          periodEnd = period.clone();
      }

      let applicantCount = 0;
      let hiredCount = 0;

      state?.applicants?.forEach((applicant) => {
        if (
          isPeriodData({
            created_at: applicant.created_at,
            periodStart: period,
            periodEnd,
          }) &&
          applicantMatchesFilter(applicant)
        ) {
          applicantCount++;
        }
      });

      state?.employees?.forEach((employee) => {
        if (
          isPeriodData({
            created_at: employee.hire_date,
            periodStart: period,
            periodEnd
          }) &&
          employeeMatchesFilter(employee)
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
        backgroundColor: "#1d4355",
        borderColor: "transparent",
        data: applicantData,
        borderWidth: 1,
        borderRadius: 10,
      },
      {
        label: t("EMPLOYEE"),
        backgroundColor: "#2ec8c4",
        borderColor: "transparent",
        data: hiredData,
        borderWidth: 1,
        borderRadius: 10,
      },
    ];
  }, [state, applicantMatchesFilter, employeeMatchesFilter, t, periods]);

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
