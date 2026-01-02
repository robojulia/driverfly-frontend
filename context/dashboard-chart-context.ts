import { createContext } from "react";
import { ApplicantEntity } from "../models/applicant";
import { EmployeeEntity } from "../models/employee/employee.entity";
import { JobEntity } from "../models/job/job.entity";
import { HistoricalRangeFilters } from "../components/charts/company/historical-range-filters";

type DashboardChartContextType = {
    state: {
        applicants: ApplicantEntity[],
        employees: EmployeeEntity[],
        jobs: JobEntity[]
    },
    historicalFilters?: HistoricalRangeFilters
}

const DashboardChartContext = createContext<DashboardChartContextType>({
    state: {
        applicants: [],
        employees: [],
        jobs: []
    },
    historicalFilters: {
        ownerOperator: 'all',
        recruiterIds: [],
        states: [],
        sourceTypes: [],
        statuses: [],
        referralSourceIds: [],
        timePeriod: 'month',
    }
});

export default DashboardChartContext;