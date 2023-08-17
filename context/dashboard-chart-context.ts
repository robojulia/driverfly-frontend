import { createContext } from "react";
import { ApplicantEntity } from "../models/applicant";
import { EmployeeEntity } from "../models/employee/employee.entity";

type DashboardChartContext = {
    state: {
        data: ApplicantEntity[],
        employee: EmployeeEntity[]
    }
}

const DashboardChartContext = createContext<DashboardChartContext>({
    state: {
        data: [],
        employee: []
    },
});

export default DashboardChartContext;