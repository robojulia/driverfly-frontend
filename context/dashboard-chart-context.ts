import { createContext } from "react";
import { ApplicantEntity } from "../models/applicant";
import { EmployeeEntity } from "../models/employee/employee.entity";
import { JobEntity } from "../models/job/job.entity";

type DashboardChartContext = {
    state: {
        data: ApplicantEntity[],
        employee: EmployeeEntity[],
        jobs: JobEntity[]
    }
}

const DashboardChartContext = createContext<DashboardChartContext>({
    state: {
        data: [],
        employee: [],
        jobs: []
    },
});

export default DashboardChartContext;