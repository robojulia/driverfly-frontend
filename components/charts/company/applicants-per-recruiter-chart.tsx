import { ApplicantApi } from "../../../pages/api/applicant";
import { useTranslation } from "../../../hooks/use-translation";
import { useContext, useState } from "react";
import { PieChart } from "../pie-chart";
import DashboardChartContext from "../../../context/dashboard-chart-context";


export function ApplicantsPerRecruiterChart() {
    const { t } = useTranslation();
    const [recruiterLabels, setRecruiterLabels] = useState([]);
    const {state} = useContext(DashboardChartContext);
    const fetchData = async (): Promise<number[]> => {
        let unassigned = 0;

        // const api = new ApplicantApi();
        const applicants = [];

        const applicantsPerRecruiter = {};
        state.data.forEach((a) => {
            a.assignedUser ?
                applicantsPerRecruiter[a.assignedUser.name] = (applicantsPerRecruiter[a.assignedUser.name] || 0) + 1
                :
                unassigned++;
        });
      
        applicantsPerRecruiter[t("UNASSIGNED")] = unassigned;

        setRecruiterLabels(Object.keys(applicantsPerRecruiter));

        return Object.values(applicantsPerRecruiter);
    };

    return (
        <PieChart
            title="APPLICANTS_PER_RECRUITER"
            labels={recruiterLabels}
            fetchData={fetchData}
            deps={[state]}
        />
    );
}