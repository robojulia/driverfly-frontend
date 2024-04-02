import { EmployeeEntity } from "../../models/employee/employee.entity";
import { ProtectedFields } from "../applicant/protected-fields.type";


export type ViewEmployeeDetailProps = {

    employee: EmployeeEntity;
    protectedFields?: ProtectedFields;
    hideAssignTo?: boolean | (() => boolean);
    hideCurrentStatus?: boolean | (() => boolean);
    noTitle?:boolean;
}