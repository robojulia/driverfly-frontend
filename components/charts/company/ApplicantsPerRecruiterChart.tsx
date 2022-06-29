import { BarChart } from "../BarChart";
import { ApplicantApi } from "../../../pages/api/applicant";
import { useTranslation } from "../../../hooks/useTranslation";
import { useState } from "react";

export function ApplicantsPerRecruiterChart() {
    const { t } = useTranslation();
    const [recruiterLabels, setRecruiterLabels] = useState([]);

    const fetchData = async (): Promise<number[]> => {
        let unassigned = 0;

        const api = new ApplicantApi();    
        const applicants = await api.list();
        
        const applicantsPerRecruiter = {};
        applicants.forEach((a) => {
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
        <BarChart
            title="APPLICANTS_PER_RECRUITER"
            labels={recruiterLabels}
            fetchData={fetchData}
        />
    );
}