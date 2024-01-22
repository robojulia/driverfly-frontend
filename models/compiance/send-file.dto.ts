import * as yup from "yup";
import { ApplicantEntity } from "../applicant";
import { EmployeeEntity } from "../employee/employee.entity";

export class SendFileDto {
    documentId?: number;

    entities?: ApplicantEntity[] | EmployeeEntity[];
    static yupSchema() {
        return yup.object({
            documentId: yup.number().required().nullable(),
            entities: yup
                .array(
                    yup.object({
                        first_name: yup.string().required().nullable().trim(),
                        last_name: yup.string().required().nullable().trim(),
                        email: yup.string().email().required().nullable(),
                    })
                )
                .min(1)
                .nullable(),
        });
    }
}
