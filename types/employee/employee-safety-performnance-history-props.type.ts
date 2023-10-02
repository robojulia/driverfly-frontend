import { EmployeeEntity } from "../../models/employee/employee.entity";

export type EmployeeSafetyPerformanceHistoryProps = {
    employee: EmployeeEntity;
    buttonClass?: string;
    canEditSafetyPerformance?: boolean | (() => boolean);
    showHistory?: boolean | (() => boolean);
    showResendButton?: boolean | (() => boolean);
}
