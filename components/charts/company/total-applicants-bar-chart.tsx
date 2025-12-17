import moment from "moment";
import { useContext, useMemo, useCallback } from "react";
import DashboardChartContext from "../../../context/dashboard-chart-context";
import { useTranslation } from "../../../hooks/use-translation";
import { BarChart } from "../bar-chart";
import { ApplicantEntity } from "../../../models/applicant";
import { EmployeeEntity } from "../../../models/employee/employee.entity";

export function TotalApplicantBarChart() {
  const { state, historicalFilters } = useContext(DashboardChartContext);
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
          }) &&
          applicantMatchesFilter(applicant)
        ) {
          applicantCount++;
        }
      });

      state?.employees?.forEach((employee) => {
        if (
          isMonthData({ created_at: employee.hire_date, monthStart, monthEnd }) &&
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
  }, [state, applicantMatchesFilter, employeeMatchesFilter, t]);

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
