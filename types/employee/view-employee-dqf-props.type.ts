import { EmployeeEntity } from "../../models/employee/employee.entity";

export type ViewEmployeeDqfProps = {
    employee: EmployeeEntity;
    title?: string;
    showCompleted?: boolean | (() => boolean);
    showOnboarding?: boolean | (() => boolean);
    showHistory?: boolean | (() => boolean);
    canEdit?: boolean | (() => boolean);
    canEditSafetyPerformance?: boolean | (() => boolean);
    showResendButton?: boolean | (() => boolean);
}
