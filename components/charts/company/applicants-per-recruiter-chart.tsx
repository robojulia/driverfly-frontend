import { useContext, useMemo, useState } from "react";
import DashboardChartContext from "../../../context/dashboard-chart-context";
import { useTranslation } from "../../../hooks/use-translation";
import { PieChart } from "../pie-chart";

export function ApplicantsPerRecruiterChart() {
  const { t } = useTranslation();
  const [recruiterLabels, setRecruiterLabels] = useState([]);
  const { state } = useContext(DashboardChartContext);
  const fetchData = (): number[] => {
    let unassigned = 0;

    const applicantsPerRecruiter = {};
    state?.applicants?.forEach((a) => {
      !!a?.assignedUser
        ? (applicantsPerRecruiter[a.assignedUser?.name] =
            (applicantsPerRecruiter[a.assignedUser?.name] || 0) + 1)
        : unassigned++;
    });

    applicantsPerRecruiter[t("UNASSIGNED")] = unassigned;

    setRecruiterLabels(Object.keys(applicantsPerRecruiter));

    return Object.values(applicantsPerRecruiter);
  };
  const data = useMemo(() => {
    return fetchData();
  }, [state]);
  return (
    <PieChart
      title="APPLICANTS_PER_RECRUITER"
      labels={recruiterLabels}
      data={data}
      emptyStateTitle="NO_LEAD_ASSIGNMENTS"
      emptyStateMessage="LEAD_ASSIGNMENT_EMPTY_STATE_MESSAGE"
    />
  );
}
