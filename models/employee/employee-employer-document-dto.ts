import { EmployeeEmployerEntity } from './employee-employer.entity';
import { DocumentEntity } from '../documents/document.entity';
import * as yup from "yup";

export class EmployeeEmployerDocumentDto {
    document?: DocumentEntity;
    employer?: EmployeeEmployerEntity;

    static yupSchema() {
        return yup.object({

            document: DocumentEntity.yupSchema()

        });
    }
}
