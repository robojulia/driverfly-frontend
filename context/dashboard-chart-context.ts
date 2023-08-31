import { createContext } from "react";
import { ApplicantEntity } from "../models/applicant";
import { EmployeeEntity } from "../models/employee/employee.entity";
import { JobEntity } from "../models/job/job.entity";

type DashboardChartContextType = {
    state: {
        applicants: ApplicantEntity[],
        employees: EmployeeEntity[],
        jobs: JobEntity[]
    }
}

const DashboardChartContext = createContext<DashboardChartContextType>({
    state: {
        applicants: [],
        employees: [],
        jobs: []
    },
});

export default DashboardChartContext;